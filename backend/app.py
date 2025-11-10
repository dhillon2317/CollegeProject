from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from datetime import datetime
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import numpy as np
from pymongo import MongoClient
from bson import ObjectId

# Load models at startup
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
REQUIRED_MODELS = [
    'category_model.pkl',
    'priority_model.pkl',
    'type_model.pkl',
    'department_model.pkl'
]

# Ensure models directory exists
if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR, exist_ok=True)
    print(f"Created models directory at: {MODELS_DIR}")

# List and verify available models
print(f"Looking for models in: {MODELS_DIR}")
try:
    model_files = os.listdir(MODELS_DIR)
    print(f"Found files: {model_files}")
    
    # Check for missing models
    missing_models = [model for model in REQUIRED_MODELS if model not in model_files]
    if missing_models:
        print(f"Missing required model files: {missing_models}")
        print("Attempting to train new models...")
        
        # Load training data
        df = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', 'sbackend', 'camplaint-analyzer', 'complaints.csv'))
        
        # Train and save models
        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform(df['complaint_text'])
        
        for target in ['category', 'priority', 'department', 'type']:
            model = MultinomialNB()
            model.fit(X, df[target])
            joblib.dump(model, os.path.join(MODELS_DIR, f'{target}_model.pkl'))
            print(f"Trained and saved {target}_model.pkl")
            
        print("All models trained and saved successfully")
        model_files = os.listdir(MODELS_DIR)
        
except Exception as e:
    print(f"Error accessing or training models: {str(e)}")
    raise

# Load models
try:
    category_model = joblib.load(os.path.join(MODELS_DIR, 'category_model.pkl'))
    priority_model = joblib.load(os.path.join(MODELS_DIR, 'priority_model.pkl'))
    type_model = joblib.load(os.path.join(MODELS_DIR, 'type_model.pkl'))
    department_model = joblib.load(os.path.join(MODELS_DIR, 'department_model.pkl'))
    print("All models loaded successfully")
except Exception as e:
    print(f"Error loading models: {str(e)}")
    raise

# Save vectorizer globally
vectorizer = TfidfVectorizer()
df = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', 'sbackend', 'camplaint-analyzer', 'complaints.csv'))
vectorizer.fit(df['complaint_text'])

app = Flask(__name__)

# MongoDB setup
from urllib.parse import quote_plus

def get_database():
    try:
        import ssl
        
        # Use these hardcoded values temporarily for testing
        username = "dhillon2317"
        password = "dhillon1000"
        cluster = "cluster0.6ebj5lk.mongodb.net"
        
        # Properly encode the username and password
        encoded_username = quote_plus(username)
        encoded_password = quote_plus(password)
        
        # Construct the MongoDB URI with SSL options
        mongo_uri = f"mongodb+srv://{encoded_username}:{encoded_password}@{cluster}/?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"
        
        print(f"Connecting to MongoDB at: {cluster}")
        
        # Configure MongoDB client with SSL workaround for Python 3.14
        mongo_client = MongoClient(
            mongo_uri,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=10000,
            socketTimeoutMS=30000,
            tls=True,
            tlsAllowInvalidCertificates=True
        )
        
        # Test the connection
        mongo_client.server_info()
        
        mongo_db = mongo_client['complaints_db']
        complaints_collection = mongo_db['complaints']
        print("Connected to MongoDB successfully!")
        return complaints_collection
        
    except Exception as e:
        print(f"MongoDB connection error: {str(e)}")
        raise

# Initialize MongoDB connection
try:
    complaints_collection = get_database()
    print("MongoDB connected successfully!")
except Exception as e:
    print(f"WARNING: Failed to initialize MongoDB: {str(e)}")
    print("Application will start but database features will be limited")
    complaints_collection = None

CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "https://main.d1nokap2upnclw.amplifyapp.com"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

@app.route('/analyze', methods=['POST'])
def analyze_complaint():
    try:
        data = request.get_json()
        print(f"Received data for analysis: {data}")  # Debug print
        
        # Handle both direct text and description field
        text = data.get('text') or data.get('description')
        if not text or not isinstance(text, str):
            return jsonify({"success": False, "error": "Missing or invalid text"}), 400

        # Vectorize and predict
        text_vectorized = vectorizer.transform([text])
        
        category = category_model.predict(text_vectorized)[0]
        priority = priority_model.predict(text_vectorized)[0]
        department = department_model.predict(text_vectorized)[0]
        type_pred = type_model.predict(text_vectorized)[0]
        
        analysis = {
            "category": category,
            "priority": priority,
            "department": department,
            "type": type_pred
        }
        
        print(f"Analysis results: {analysis}")  # Debug print
        return jsonify({"success": True, "data": analysis})
    except Exception as e:
        print(f"Analysis error: {str(e)}")  # Debug print
        return jsonify({"success": False, "error": str(e)}), 500

def save_complaint(complaint_data):
    try:
        result = complaints_collection.insert_one(complaint_data)
        saved_complaint = complaints_collection.find_one({"_id": result.inserted_id})
        saved_complaint['_id'] = str(saved_complaint['_id'])
        return saved_complaint
    except Exception as e:
        raise Exception(f"Database error: {str(e)}")

@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    try:
        data = request.get_json()
        print("Received complaint data:", data)  # Debug print
        
        if not data or not data.get('description'):
            return jsonify({"success": False, "error": "Missing description"}), 400

        # Perform AI analysis directly
        try:
            text_vectorized = vectorizer.transform([data['description']])
            
            # Get predictions from all models
            analysis = {
                "category": category_model.predict(text_vectorized)[0],
                "priority": priority_model.predict(text_vectorized)[0],
                "department": department_model.predict(text_vectorized)[0],
                "type": type_model.predict(text_vectorized)[0]
            }
            
            # Update the complaint data with AI analysis
            data.update(analysis)
            print("AI Analysis results:", analysis)  # Debug print
            
        except Exception as e:
            print(f"Analysis error: {str(e)}")  # Debug print
            return jsonify({"success": False, "error": "Failed to analyze complaint"}), 500

        # Add metadata
        data['createdAt'] = datetime.utcnow().isoformat()
        data['status'] = 'Pending'
        
        # Save to MongoDB
        if complaints_collection is None:
            print("WARNING: MongoDB not available, returning analysis only")
            return jsonify({"success": True, "data": data, "warning": "Database unavailable, complaint not saved"}), 201
        
        try:
            saved = save_complaint(data)
            print("Saved complaint:", saved)  # Debug print
            return jsonify({"success": True, "data": saved}), 201
        except Exception as e:
            print(f"Database error: {str(e)}")  # Debug print
            return jsonify({"success": False, "error": "Failed to save complaint"}), 500
            
    except Exception as e:
        print(f"Create complaint error: {str(e)}")  # Debug print
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    if complaints_collection is None:
        # Return mock data for development when MongoDB is unavailable
        mock_complaints = [
            {
                "_id": "mock1",
                "name": "John Doe",
                "email": "john@example.com",
                "description": "The wifi connection keeps dropping in the library",
                "category": "Infrastructure",
                "priority": "High",
                "department": "IT Department",
                "type": "Technical",
                "status": "Pending",
                "createdAt": "2025-11-10T10:30:00.000Z"
            },
            {
                "_id": "mock2",
                "name": "Jane Smith",
                "email": "jane@example.com",
                "description": "Cafeteria food quality has decreased significantly",
                "category": "Food Services",
                "priority": "Medium",
                "department": "Administration",
                "type": "Service",
                "status": "In Progress",
                "createdAt": "2025-11-09T14:20:00.000Z"
            },
            {
                "_id": "mock3",
                "name": "Bob Johnson",
                "email": "bob@example.com",
                "description": "Classroom AC not working properly",
                "category": "Infrastructure",
                "priority": "High",
                "department": "Maintenance",
                "type": "Technical",
                "status": "Resolved",
                "createdAt": "2025-11-08T09:15:00.000Z"
            }
        ]
        return jsonify({
            "success": True,
            "data": mock_complaints,
            "warning": "Using mock data - MongoDB not connected"
        }), 200
    
    try:
        complaints = list(complaints_collection.find())
        for complaint in complaints:
            complaint['_id'] = str(complaint['_id'])
            
        return jsonify({
            "success": True,
            "data": complaints
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to fetch complaints: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)
