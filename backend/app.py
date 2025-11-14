from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pymongo
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import uuid
from pathlib import Path
import json

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
client = pymongo.MongoClient(MONGODB_URI)
db = client.complaintsdb  # Database name
users_collection = db.users

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')

# Paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / 'data'
COMPLAINTS_FILE = DATA_DIR / 'complaints.json'

# Ensure data directory exists
DATA_DIR.mkdir(exist_ok=True)

# Initialize complaints file if it doesn't exist
if not COMPLAINTS_FILE.exists():
    with open(COMPLAINTS_FILE, 'w') as f:
        json.dump([], f, indent=2)

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy'})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    if users_collection.find_one({'email': data['email']}):
        return jsonify({'error': 'User already exists'}), 400

    hashed_password = generate_password_hash(data['password'])

    new_user = {
        'id': str(uuid.uuid4()),
        'email': data['email'],
        'password': hashed_password,
        'name': data.get('name', data['email'].split('@')[0]),
        'role': data.get('role', 'student'),
        'createdAt': datetime.utcnow().isoformat()
    }

    users_collection.insert_one(new_user)

    return jsonify({'message': 'User registered successfully', 'id': new_user['id']}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400

    user = users_collection.find_one({'email': data['email']})

    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = jwt.encode({
        'email': user['email'],
        'exp': datetime.utcnow() + timedelta(days=1)
    }, app.config['SECRET_KEY'], algorithm='HS256')

    return jsonify({'token': token}), 200


@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    data = request.get_json()
    if not data or not data.get('title') or not data.get('description') or not data.get('contactInfo'):
        return jsonify({'error': 'Title, description, and contactInfo are required'}), 400

    complaints = []
    try:
        with open(COMPLAINTS_FILE, 'r') as f:
            complaints = json.load(f)
    except FileNotFoundError:
        pass  # Handle case where file doesn't exist yet

    new_complaint = {
        'id': str(uuid.uuid4()),
        'title': data['title'],
        'description': data['description'],
        'contactInfo': data['contactInfo'],
        'category': data.get('category', ''),
        'department': data.get('department', ''),
        'priority': data.get('priority', 'Medium'),
        'userType': data.get('userType', 'Student'),
        'domain': data.get('domain', 'default'),
        'status': 'pending',
        'createdAt': datetime.utcnow().isoformat()
    }

    complaints.append(new_complaint)

    with open(COMPLAINTS_FILE, 'w') as f:
        json.dump(complaints, f, indent=2)

    return jsonify({'message': 'Complaint submitted successfully', 'id': new_complaint['id']}), 201

@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    try:
        with open(COMPLAINTS_FILE, 'r') as f:
            complaints = json.load(f)
        return jsonify({'success': True, 'data': complaints}), 200
    except FileNotFoundError:
        return jsonify({'success': False, 'data': []}), 200

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    try:
        with open(COMPLAINTS_FILE, 'r') as f:
            complaints = json.load(f)

        total_complaints = len(complaints)
        resolved_count = sum(1 for c in complaints if c['status'] == 'resolved')
        pending_count = sum(1 for c in complaints if c['status'] == 'pending')

        category_distribution = {}
        for c in complaints:
            category = c.get('category', 'Other')
            if category in category_distribution:
                category_distribution[category] += 1
            else:
                category_distribution[category] = 1

        analytics_data = {
            'total_complaints': total_complaints,
            'resolved_count': resolved_count,
            'pending_count': pending_count,
            'category_distribution': category_distribution
        }
        return jsonify(analytics_data), 200
    except FileNotFoundError:
        return jsonify({'error': 'Complaints file not found'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
