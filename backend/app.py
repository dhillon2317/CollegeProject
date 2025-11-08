from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
import secrets
from dotenv import load_dotenv
from datetime import datetime, timedelta
import jwt
from functools import wraps

# Initialize extensions
db = SQLAlchemy()

# Load environment variables
try:
    load_dotenv()
except Exception as e:
    print("Warning: Could not load .env file. Using default settings.")

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
    except Exception as e:
        app.logger.error(f"Error getting complaints: {str(e)}")
        return jsonify({"success": False, "error": "Failed to retrieve complaints"}), 500

@app.route('/api/complaints', methods=['POST'])
def create_complaint():
    """Create a new complaint."""
    try:
        data = request.get_json()
        if not data or 'title' not in data or 'description' not in data:
            return jsonify({"success": False, "error": "Title and description are required"}), 400
            
        complaint = save_complaint(data)
        return jsonify({"success": True, "data": complaint}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user."""
    try:
        data = request.get_json()
        response, status_code = register_user(data)
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Login user and return JWT token."""
    try:
        data = request.get_json()
        response, status_code = login_user(data)
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user's information."""
    try:
        return jsonify({
            "success": True,
            "user": {
                "id": str(current_user['_id']),
                "email": current_user['email'],
                "name": current_user.get('name', '')
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy"}), 200

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_ENV') == 'development')
