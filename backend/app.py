from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import json
import uuid
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import json_util
from dotenv import load_dotenv
from nltk.sentiment import SentimentIntensityAnalyzer
from pathlib import Path

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
def get_db():
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    client = MongoClient(MONGODB_URI)
    return client['complaint_analyzer']

# --- Load All Models ---
# Determine the most likely location of the trained model artefacts.
# 1. <backend>/models (preferred)
# 2. <project_root>/sbackend/camplaint-analyzer/models (fallback – where train.py currently saves)
BASE_DIR = Path(__file__).resolve().parent
possible_model_dirs = [
    BASE_DIR / 'models',
    BASE_DIR.parent / 'sbackend' / 'camplaint-analyzer' / 'models'
]
MODELS_DIR = None
for p in possible_model_dirs:
    if p.exists():
        MODELS_DIR = p
        break
if MODELS_DIR is None:
    # Default to <backend>/models even if it does not exist yet.
    MODELS_DIR = BASE_DIR / 'models'

# Try loading all four models. If any are missing, set a flag so the /analyze
# endpoint can respond with a meaningful error instead of crashing.
models_loaded = False
# Sentiment analyzer (VADER)
try:
    sia = SentimentIntensityAnalyzer()
except LookupError:
    import nltk
    nltk.download('vader_lexicon')
    sia = SentimentIntensityAnalyzer()
try:
    category_model = joblib.load(MODELS_DIR / 'category_model.pkl')
    priority_model = joblib.load(MODELS_DIR / 'priority_model.pkl')
    type_model = joblib.load(MODELS_DIR / 'type_model.pkl')
    department_model = joblib.load(MODELS_DIR / 'department_model.pkl')
    models_loaded = True
    print(f"Models loaded successfully from '{MODELS_DIR}'.")
except FileNotFoundError:
    print("Error: One or more model files not found in", MODELS_DIR)
    print("Please run the training script to generate the necessary .pkl files.")

@app.route('/analyze', methods=['POST'])
def analyze_complaint():
    try:
        data = request.get_json(force=True)
        complaint_text = data.get('complaint', '')

        if not complaint_text:
            return jsonify({'error': 'Complaint text cannot be empty'}), 400

        if not models_loaded:
            return jsonify({'error': 'AI models are not available on the server. Please train the models and restart the backend.'}), 503

        # Predictions from all models
        predicted_category = str(category_model.predict([complaint_text])[0])
        predicted_priority = str(priority_model.predict([complaint_text])[0])
        predicted_type = str(type_model.predict([complaint_text])[0])
        assigned_department = str(department_model.predict([complaint_text])[0])
        
        # Debug print
        print(f"Raw type prediction: {predicted_type}")
        
        # Sentiment
        sent_score = sia.polarity_scores(complaint_text)['compound']
        if sent_score >= 0.05:
            sentiment = 'Positive'
        elif sent_score <= -0.05:
            sentiment = 'Negative'
        else:
            sentiment = 'Neutral'

        # Confidence score
        category_probas = category_model.predict_proba([complaint_text])
        confidence = round(category_probas.max() * 100, 2)

        # Ensure type is properly set to Technical or Non-Technical
        predicted_type = 'Technical' if predicted_type.lower() == 'technical' else 'Non-Technical'
        is_technical = predicted_type == 'Technical'
        print(f"Processed type: {predicted_type}, is_technical: {is_technical}")

        response = {
            'complaintText': complaint_text,
            'category': predicted_category,
            'priority': predicted_priority,
            'type': predicted_type,  # This should be 'Technical' or 'Non-Technical' from the model
            'assignedDepartment': assigned_department,
            'aiConfidence': confidence,
            'sentiment': sentiment,
            'isTechnical': is_technical
        }
        
        return jsonify(response)

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred during analysis.'}), 500

# Create a new complaint
@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    try:
        data = request.get_json()
        required_fields = ['title', 'description', 'category', 'department', 'priority', 'contactInfo', 'userType']
        
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        db = get_db()
        complaints = db.complaints
        
        new_complaint = {
            'title': data['title'],
            'description': data['description'],
            'category': data['category'],
            'department': data['department'],
            'priority': data['priority'],
            'contactInfo': data['contactInfo'],
            'userType': data['userType'],
            'status': data.get('status', 'Pending'),
            'createdAt': data.get('createdAt', datetime.utcnow()),
            'aiAnalyzed': data.get('aiAnalyzed', False),
            'sentiment': data.get('sentiment')
        }
        
        result = complaints.insert_one(new_complaint)
        new_complaint['_id'] = str(result.inserted_id)

        # --- Append to incremental CSV for future model training ---
        try:
            import csv
            BASE_DIR = Path(__file__).resolve().parent.parent  # project root
            inc_csv = BASE_DIR / 'sbackend' / 'camplaint-analyzer' / 'user_data.csv'
            inc_csv.parent.mkdir(parents=True, exist_ok=True)
            write_header = not inc_csv.exists()
            with inc_csv.open('a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                if write_header:
                    writer.writerow(['complaint_text', 'category', 'priority', 'department', 'type', 'sentiment'])
                writer.writerow([
                    new_complaint['description'],
                    new_complaint['category'],
                    new_complaint['priority'],
                    new_complaint['department'],
                    new_complaint['userType'],
                    new_complaint.get('sentiment', '')
                ])
        except Exception as log_e:
            print('Warning: could not append to incremental CSV:', log_e)
        
        return json_util.dumps(new_complaint), 201
        
    except Exception as e:
        print(f"Error in create_complaint: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Get all complaints
@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    try:
        db = get_db()
        # Convert ObjectId to string for JSON serialization
        complaints = []
        for complaint in db.complaints.find({}):
            complaint['_id'] = str(complaint['_id'])
            # Convert datetime to string if it exists
            if 'createdAt' in complaint and isinstance(complaint['createdAt'], datetime):
                complaint['createdAt'] = complaint['createdAt'].isoformat()
            complaints.append(complaint)
        return jsonify(complaints)
    except Exception as e:
        print(f"Error in get_complaints: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Get a single complaint by ID
@app.route('/api/complaints/<complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    try:
        db = get_db()
        from bson.objectid import ObjectId
        complaint = db.complaints.find_one({'_id': ObjectId(complaint_id)})
        
        if not complaint:
            return jsonify({'error': 'Complaint not found'}), 404
            
        return json_util.dumps(complaint)
    except Exception as e:
        print(f"Error in get_complaint: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Update a complaint status
@app.route('/api/complaints/<complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    try:
        data = request.get_json()
        db = get_db()
        from bson.objectid import ObjectId
        
        update_data = {}
        if 'status' in data:
            update_data['status'] = data['status']
        
        result = db.complaints.update_one(
            {'_id': ObjectId(complaint_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'error': 'Complaint not found'}), 404
            
        return jsonify({'message': 'Complaint updated successfully'})
    except Exception as e:
        print(f"Error in update_complaint: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)