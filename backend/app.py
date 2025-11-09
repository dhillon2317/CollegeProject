<<<<<<< HEAD
=======
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
>>>>>>> d97d824c1163984761fcba9811b616b2b56f557e
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
<<<<<<< HEAD
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import numpy as np
from pymongo import MongoClient
from bson import ObjectId
=======
from datetime import datetime, timedelta
import jwt
from functools import wraps

# Initialize extensions
db = SQLAlchemy()
>>>>>>> d97d824c1163984761fcba9811b616b2b56f557e

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

# Define models before creating the app to avoid circular imports
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    user_type = db.Column(db.String(20), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    complaints = db.relationship('Complaint', backref='user', lazy=True)

<<<<<<< HEAD
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
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
        if not data or 'text' not in data:
            return jsonify({"success": False, "error": "Missing text field"}), 400

        text = data['text']
        if not text or not isinstance(text, str):
            return jsonify({"success": False, "error": "Invalid text format"}), 400

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
        
        return jsonify({"success": True, "data": analysis})
=======
class Complaint(db.Model):
    __tablename__ = 'complaints'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100))
    priority = db.Column(db.String(20), default='Medium')
    status = db.Column(db.String(20), default='Open')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create Flask app
def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', secrets.token_hex(32))
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///complaints.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

    # Initialize extensions with app
    db.init_app(app)

    # CORS configuration
    cors_allowed_origins = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
    CORS(app, resources={
        r"/api/*": {
            "origins": cors_allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Initialize database tables
    with app.app_context():
        db.create_all()
    
    return app

# Create the Flask application
app = create_app()

# JWT token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Add headers to all responses
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in cors_allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/api/complaints', methods=['GET'])
@token_required
def get_all_complaints(current_user):
    """Get all complaints for the current user."""
    try:
        if current_user.user_type == 'admin':
            complaints = Complaint.query.all()
        else:
            complaints = Complaint.query.filter_by(user_id=current_user.id).all()
            
        result = []
        for complaint in complaints:
            result.append({
                'id': complaint.id,
                'title': complaint.title,
                'description': complaint.description,
                'category': complaint.category,
                'priority': complaint.priority,
                'status': complaint.status,
                'created_at': complaint.created_at.isoformat(),
                'updated_at': complaint.updated_at.isoformat()
            })
            
        return jsonify({"success": True, "data": result})
>>>>>>> d97d824c1163984761fcba9811b616b2b56f557e
    except Exception as e:
        app.logger.error(f"Error getting complaints: {str(e)}")
        return jsonify({"success": False, "error": "Failed to retrieve complaints"}), 500

# MongoDB setup
try:
    client = MongoClient('mongodb://localhost:27017/')
    db = client['complaints_db']
    complaints_collection = db['complaints']
    print("Connected to MongoDB successfully")
except Exception as e:
    print(f"MongoDB connection error: {str(e)}")
    raise

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
        if not data.get('description'):
            return jsonify({"error": "Missing description"}), 400
            
        if not all([data.get('category'), data.get('priority'), data.get('department'), data.get('type')]):
            analysis = analyze_complaint().get_json()
            if analysis.get('success'):
                data.update(analysis['data'])
                
        data['createdAt'] = datetime.utcnow().isoformat()
        data['status'] = 'Pending'
        
        saved = save_complaint(data)
        return jsonify({"success": True, "data": saved}), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/complaints', methods=['GET'])
def get_complaints():
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

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy"}), 200

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
<<<<<<< HEAD
    app.run(port=5001, debug=True)
=======
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_ENV') == 'development')
>>>>>>> d97d824c1163984761fcba9811b616b2b56f557e
