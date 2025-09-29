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

# Ensure data directory exists
DATA_DIR = Path('data')
DATA_DIR.mkdir(exist_ok=True)
COMPLAINTS_FILE = DATA_DIR / 'complaints.json'

# Initialize empty complaints list if file doesn't exist
if not COMPLAINTS_FILE.exists():
    with open(COMPLAINTS_FILE, 'w') as f:
        json.dump([], f)

# --- Load All Models ---
MODELS_DIR = 'models'
try:
    category_model = joblib.load(os.path.join(MODELS_DIR, 'category_model.pkl'))
    priority_model = joblib.load(os.path.join(MODELS_DIR, 'priority_model.pkl'))
    type_model = joblib.load(os.path.join(MODELS_DIR, 'type_model.pkl'))
    department_model = joblib.load(os.path.join(MODELS_DIR, 'department_model.pkl')) # Naya model load karein
    print("All 4 models loaded successfully.")
except FileNotFoundError:
    print("Error: Model files not found. Please run train.py first.")
    exit()

# Rule-based department_map ki ab zaroorat nahi hai, humne use hata diya hai.

@app.route('/analyze', methods=['POST'])
def analyze_complaint():
    try:
        data = request.get_json(force=True)
        complaint_text = data.get('complaint', '')

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

def get_complaints_data():
    """Read complaints from JSON file"""
    try:
        with open(COMPLAINTS_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_complaints(complaints):
    """Save complaints to JSON file"""
    with open(COMPLAINTS_FILE, 'w') as f:
        json.dump(complaints, f, indent=2)

@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    """Get all complaints"""
    try:
        complaints = get_complaints_data()
        return jsonify(complaints)
    except Exception as e:
        print(f"Error in get_complaints: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    """Create a new complaint"""
    try:
        data = request.get_json()
        
        # Basic validation
        required_fields = ['title', 'description', 'category', 'department', 'priority', 'contactInfo', 'userType']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create new complaint with additional fields
        new_complaint = {
            'id': str(uuid.uuid4()),
            'title': data['title'],
            'description': data['description'],
            'category': data['category'],
            'department': data['department'],
            'priority': data['priority'],
            'contactInfo': data['contactInfo'],
            'userType': data['userType'],
            'status': data.get('status', 'Pending'),
            'createdAt': data.get('createdAt', datetime.utcnow().isoformat() + 'Z'),
            'aiAnalyzed': data.get('aiAnalyzed', False)
        }
        
        # Get existing complaints and add new one
        complaints = get_complaints_data()
        complaints.append(new_complaint)
        save_complaints(complaints)
        
        return jsonify(new_complaint), 201
        
    except Exception as e:
        print(f"Error in create_complaint: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
