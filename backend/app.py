from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from complaints import get_complaints, save_complaint

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
