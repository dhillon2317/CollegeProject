from flask import Flask, request, jsonify, current_app as app
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
cors_allowed_origins = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5173,http://localhost:5000').split(',')
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": cors_allowed_origins,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "supports_credentials": True,
            "expose_headers": ["Content-Type", "Authorization"]
        }
    },
    supports_credentials=True
)

# add this DEV helper right after CORS(...) to echo the Origin and allow credentials
@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin:
        # echo origin (allows credentials). For production, validate origin first.
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization,X-Requested-With"
        response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', secrets.token_hex(32))  # 32 bytes for HS256
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 86400))  # 24 hours


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
    """
    Accepts complaint JSON, optionally runs AI analysis if missing classification fields,
    saves to DB via save_complaint, and returns created object.
    """
    # Debug: log request origin/headers to diagnose "Failed to fetch"
    try:
        app.logger.info("Incoming POST /api/complaints from %s", request.remote_addr)
        app.logger.info("Request Origin header: %s", request.headers.get("Origin"))
        app.logger.info("Request Content-Type: %s", request.headers.get("Content-Type"))
        # dump raw body for debugging (may be binary); safe for dev only
        raw = request.get_data(as_text=True)
        app.logger.info("Raw request body: %s", raw)
    except Exception:
        app.logger.exception("Failed to log incoming request")

    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON payload"}), 400

    if not data or not data.get("description"):
        return jsonify({"error": "Missing required field: description"}), 400

    # If AI fields are empty, attempt to analyze using existing analyzer if available.
    try:
        needs_analysis = (
            not data.get("category")
            or not data.get("priority")
            or not data.get("department")
            or not data.get("type")
        )
        if needs_analysis:
            try:
                # If an 'analyzer' object with analyze_complaint exists in this module / app, use it.
                analysis = analyzer.analyze_complaint(data["description"])
                if analysis:
                    data.setdefault("category", analysis.get("category") or "")
                    data.setdefault("priority", analysis.get("priority") or "")
                    # some analyzers use assignedDepartment key
                    data.setdefault("department", analysis.get("assignedDepartment") or analysis.get("department") or "")
                    data.setdefault("type", analysis.get("type") or analysis.get("userType") or "")
            except NameError:
                app.logger.debug("Analyzer object not found in this runtime; skipping auto analysis.")
            except Exception as ae:
                app.logger.exception("Auto-analysis failed: %s", ae)
    except Exception:
        # keep going even if analysis step fails
        app.logger.exception("Error while deciding to auto-analyze")

    # Basic metadata
    data.setdefault("status", "Pending")
    data.setdefault("createdAt", data.get("createdAt") or __import__("datetime").datetime.utcnow().isoformat())

    # Save to DB (uses your existing helper)
    try:
        saved = save_complaint(data)  # ensure save_complaint returns the saved document or id
    except Exception as e:
        app.logger.exception("DB save failed: %s", e)
        return jsonify({"error": "Failed to save complaint"}), 500

    return jsonify({"success": True, "data": saved}), 201

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
    app.run(host='0.0.0.0', port=5001, debug=True, use_reloader=False)
