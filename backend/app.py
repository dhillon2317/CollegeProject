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
MODELS_DIR = 'models'
try:
    category_model = joblib.load(os.path.join(MODELS_DIR, 'category_model.pkl'))
    priority_model = joblib.load(os.path.join(MODELS_DIR, 'priority_model.pkl'))
    type_model = joblib.load(os.path.join(MODELS_DIR, 'type_model.pkl'))
    department_model = joblib.load(os.path.join(MODELS_DIR, 'department_model.pkl'))
    print("All 4 models loaded successfully.")
except FileNotFoundError:
    print("Error: Model files not found. Please run train.py first.")

@app.route('/analyze', methods=['POST'])
def analyze_complaint():
    try:
        data = request.get_json(force=True)
        complaint_text = data.get('complaint', '')

        if not complaint_text:
            return jsonify({'error': 'Complaint text cannot be empty'}), 400

        # Predictions from all models
        predicted_category = category_model.predict([complaint_text])[0]
        predicted_priority = priority_model.predict([complaint_text])[0]
        predicted_type = type_model.predict([complaint_text])[0]
        assigned_department = department_model.predict([complaint_text])[0]
        
        # Confidence score
        category_probas = category_model.predict_proba([complaint_text])
        confidence = round(category_probas.max() * 100, 2)

        response = {
            'complaintText': complaint_text,
            'category': predicted_category,
            'priority': predicted_priority,
            'type': predicted_type,
            'assignedDepartment': assigned_department,
            'aiConfidence': confidence
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
            'aiAnalyzed': data.get('aiAnalyzed', False)
        }
        
        result = complaints.insert_one(new_complaint)
        new_complaint['_id'] = str(result.inserted_id)
        
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