from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import os
import json
import uuid
from datetime import datetime, timedelta
import random
from pathlib import Path

# Initialize models as None
category_model = None
priority_model = None
type_model = None
department_model = None

def load_models():
    """Load all the ML models"""
    global category_model, priority_model, type_model, department_model
    
    try:
        # Get the directory of the current script
        script_dir = Path(__file__).parent
        models_dir = script_dir / 'models'
        
        # Print debug information
        print(f"Current working directory: {os.getcwd()}")
        print(f"Script directory: {script_dir}")
        print(f"Models directory: {models_dir}")
        
        # Check if models directory exists
        if not models_dir.exists():
            print(f"Models directory not found at: {models_dir}")
            print(f"Current directory contents: {os.listdir(script_dir)}")
            return False
            
        # Check if model files exist
        model_files = {
            'category': models_dir / 'category_model.pkl',
            'priority': models_dir / 'priority_model.pkl',
            'type': models_dir / 'type_model.pkl',
            'department': models_dir / 'department_model.pkl'
        }
        
        # Verify all model files exist
        for name, path in model_files.items():
            if not path.exists():
                print(f"Model file not found: {path}")
                print(f"Available files in models directory: {os.listdir(models_dir)}")
                return False
        
        # Load all models
        print("Loading models...")
        category_model = joblib.load(model_files['category'])
        print("Loaded category model")
        priority_model = joblib.load(model_files['priority'])
        print("Loaded priority model")
        type_model = joblib.load(model_files['type'])
        print("Loaded type model")
        department_model = joblib.load(model_files['department'])
        print("Loaded department model")
        
        print("All models loaded successfully!")
        return True
    except Exception as e:
        print(f"Error loading models: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

# Load models when the application starts
models_loaded = load_models()
if not models_loaded:
    print("Failed to load one or more models. Please check the model files.")
    # Don't exit here, let the application start but it will fail the health check

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/health')
def health_check():
    """Health check endpoint for Render service monitoring."""
    try:
        # Check if all required models are loaded and callable
        models_loaded = all([
            'category_model' in globals() and callable(globals()['category_model'].predict),
            'priority_model' in globals() and callable(globals()['priority_model'].predict),
            'type_model' in globals() and callable(globals()['type_model'].predict),
            'department_model' in globals() and callable(globals()['department_model'].predict)
        ])
        
        if not models_loaded:
            return jsonify({
                'status': 'unhealthy',
                'service': 'complaint-analyzer-ml',
                'error': 'One or more models failed to load properly'
            }), 500
            
        return jsonify({
            'status': 'healthy',
            'service': 'complaint-analyzer-ml',
            'models_loaded': True
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'service': 'complaint-analyzer-ml',
            'error': f'Health check failed: {str(e)}'
        }), 500
    
    return jsonify({
        'status': 'healthy',
        'service': 'complaint-analyzer-ml',
        'models_loaded': models_loaded,
        'timestamp': datetime.now().isoformat()
    }), 200


# --- Directory Setup ---
MODELS_DIR = 'models'
DATA_DIR = Path('data')
COMPLAINTS_FILE = DATA_DIR / 'complaints.json'

# Create data directory if it doesn't exist
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize empty complaints file if it doesn't exist
if not COMPLAINTS_FILE.exists():
    with open(COMPLAINTS_FILE, 'w') as f:
        json.dump([], f)

def save_complaint(complaint_data):
    """Save a new complaint to the JSON file with AI analysis"""
    try:
        # Get AI analysis
        analysis = {
            'category': category_model.predict([complaint_data['description']])[0],
            'priority': priority_model.predict([complaint_data['description']])[0],
            'type': type_model.predict([complaint_data['description']])[0],
            'assignedDepartment': department_model.predict([complaint_data['description']])[0],
            'aiConfidence': round(category_model.predict_proba([complaint_data['description']]).max() * 100, 2)
        }
        
        # Create complaint object
        complaint = {
            'id': str(uuid.uuid4()),
            'status': 'pending',
            'createdAt': datetime.now().isoformat(),
            **complaint_data,
            'analysis': analysis
        }
        
        # Save to file
        with open(COMPLAINTS_FILE, 'r+') as f:
            complaints = json.load(f)
            complaints.append(complaint)
            f.seek(0)
            json.dump(complaints, f, indent=2)
            f.truncate()
            
        return complaint
        
    except Exception as e:
        print(f"Error saving complaint: {e}")
        raise

# Rule-based department_map ki ab zaroorat nahi hai, humne use hata diya hai.

@app.route('/analyze', methods=['POST'])
def analyze_complaint():
    try:
        data = request.get_json(force=True)
        complaint_text = data.get('text', '')

        if not complaint_text:
            return jsonify({'error': 'Complaint text cannot be empty'}), 400

        # --- Predictions from all models ---
        predicted_category = category_model.predict([complaint_text])[0]
        predicted_priority = priority_model.predict([complaint_text])[0]
        predicted_type = type_model.predict([complaint_text])[0]
        
        # Naye model se department predict karein (YAHAN CODE UPDATE HUA HAI)
        assigned_department = department_model.predict([complaint_text])[0]
        
        # Confidence score (example ke liye abhi sirf category ka use kar rahe hain)
        category_probas = category_model.predict_proba([complaint_text])
        confidence = round(category_probas.max() * 100, 2)

        # Frontend ko bhejne ke liye response taiyaar karein
        response = {
            'complaintText': complaint_text,
            'category': predicted_category,
            'priority': predicted_priority,
            'type': predicted_type,
            'assignedDepartment': assigned_department, # Model se aayi hui prediction
            'aiConfidence': confidence
        }
        
        return jsonify(response)

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred during analysis.'}), 500


@app.route('/api/complaints', methods=['GET', 'POST'])
def handle_complaints():
    if request.method == 'POST':
        try:
            data = request.get_json()
            complaint = save_complaint(data)
            return jsonify(complaint), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        # GET all complaints
        try:
            with open(COMPLAINTS_FILE, 'r') as f:
                complaints = json.load(f)
            return jsonify(complaints)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/api/complaints/<complaint_id>', methods=['GET', 'PATCH', 'DELETE'])
def handle_complaint(complaint_id):
    try:
        with open(COMPLAINTS_FILE, 'r') as f:
            complaints = json.load(f)
        
        complaint = next((c for c in complaints if c['id'] == complaint_id), None)
        if not complaint:
            return jsonify({'error': 'Complaint not found'}), 404
            
        if request.method == 'GET':
            return jsonify(complaint)
            
        elif request.method == 'PATCH':
            data = request.get_json()
            complaint.update(data)
            with open(COMPLAINTS_FILE, 'w') as f:
                json.dump(complaints, f, indent=2)
            return jsonify(complaint)
            
        elif request.method == 'DELETE':
            complaints = [c for c in complaints if c['id'] != complaint_id]
            with open(COMPLAINTS_FILE, 'w') as f:
                json.dump(complaints, f, indent=2)
            return '', 204
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
