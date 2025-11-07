from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from flask import current_app as app
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import secrets

# Try to load environment variables
try:
    load_dotenv()
except Exception as e:
    print("Warning: Could not load .env file. Using default settings.")

# MongoDB connection
try:
    mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    client = MongoClient(mongodb_uri)
    db = client[os.getenv('MONGO_DB_NAME', 'complaint_system')]
    users_collection = db['users']
    
    # Test the connection
    client.server_info()
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    print("Please make sure MongoDB is running and the connection string is correct.")
    print(f"Using connection string: {mongodb_uri}")
    # Re-raise the exception to stop the application
    raise

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # Bearer <token>
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = users_collection.find_one({'email': data['email']})
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

def register_user(data):
    if not data or 'email' not in data or 'password' not in data:
        return {'error': 'Email and password are required'}, 400
    
    if users_collection.find_one({'email': data['email']}):
        return {'error': 'User already exists'}, 400
    
    hashed_password = generate_password_hash(data['password'], method='sha256')
    user = {
        'email': data['email'],
        'password': hashed_password,
        'name': data.get('name', ''),
        'created_at': datetime.datetime.utcnow()
    }
    
    result = users_collection.insert_one(user)
    user['_id'] = str(result.inserted_id)
    user.pop('password')
    
    return {'message': 'User registered successfully', 'user': user}, 201

def login_user(data):
    if not data or 'email' not in data or 'password' not in data:
        return {'error': 'Email and password are required'}, 400
    
    user = users_collection.find_one({'email': data['email']})
    if not user or not check_password_hash(user['password'], data['password']):
        return {'error': 'Invalid credentials'}, 401
    
    # Generate JWT token
    token = jwt.encode({
        'email': user['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, app.config['SECRET_KEY'])
    
    user_data = {
        'id': str(user['_id']),
        'email': user['email'],
        'name': user.get('name', '')
    }
    
    return {
        'message': 'Login successful',
        'token': token,
        'user': user_data
    }, 200
