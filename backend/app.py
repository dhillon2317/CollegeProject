from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import secrets
from dotenv import load_dotenv
from complaints import get_complaints, save_complaint
from auth import register_user, login_user, token_required

# Load environment variables
try:
    load_dotenv()
except Exception as e:
    print("Warning: Could not load .env file. Using default settings.")

app = Flask(__name__)

# CORS configuration
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
        }
    }
)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', secrets.token_hex(32))  # 32 bytes for HS256
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 86400))  # 24 hours

# Add headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

@app.route('/api/complaints', methods=['GET'])
def get_all_complaints():
    """Get all complaints."""
    try:
        complaints = get_complaints()
        return jsonify({"success": True, "data": complaints})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
