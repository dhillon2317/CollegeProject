from flask import Blueprint, request, jsonify
from datetime import datetime
import json
import os

complaints_bp = Blueprint('complaints_bp', __name__)

DATA_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..\..\..\data\complaints.json'))

def read_complaints():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def write_complaints(complaints):
    with open(DATA_FILE, 'w') as f:
        json.dump(complaints, f, indent=4)

@complaints_bp.route('/complaints', methods=['POST'])
def create_complaint():
    """Create a new complaint."""
    try:
        data = request.get_json()
        required_fields = ['title', 'description', 'category', 'department', 'priority', 'contactInfo', 'userType']
        
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        complaints = read_complaints()
        
        new_complaint = {
            '_id': str(len(complaints) + 1),
            'title': data['title'],
            'description': data['description'],
            'category': data['category'],
            'department': data['department'],
            'priority': data['priority'],
            'contactInfo': data['contactInfo'],
            'userType': data['userType'],
            'status': data.get('status', 'Pending'),
            'createdAt': datetime.utcnow().isoformat(),
            'aiAnalyzed': data.get('aiAnalyzed', False)
        }
        
        complaints.append(new_complaint)
        write_complaints(complaints)
        
        return jsonify(new_complaint), 201
        
    except Exception as e:
        print(f"Error in create_complaint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@complaints_bp.route('/complaints', methods=['GET'])
def get_complaints():
    """Get all complaints."""
    try:
        complaints = read_complaints()
        return jsonify(complaints)
    except Exception as e:
        print(f"Error in get_complaints: {str(e)}")
        return jsonify({'error': str(e)}), 500

@complaints_bp.route('/complaints/<complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    """Get a single complaint by ID."""
    try:
        complaints = read_complaints()
        complaint = next((c for c in complaints if c['_id'] == complaint_id), None)
        
        if not complaint:
            return jsonify({'error': 'Complaint not found'}), 404
            
        return jsonify(complaint)
    except Exception as e:
        print(f"Error in get_complaint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@complaints_bp.route('/complaints/<complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    """Update a complaint status."""
    try:
        data = request.get_json()
        complaints = read_complaints()
        complaint_to_update = None
        for complaint in complaints:
            if complaint['_id'] == complaint_id:
                complaint_to_update = complaint
                break
        
        if not complaint_to_update:
            return jsonify({'error': 'Complaint not found'}), 404

        if 'status' in data:
            complaint_to_update['status'] = data['status']
        
        write_complaints(complaints)
        
        return jsonify({'message': 'Complaint updated successfully'})
    except Exception as e:
        print(f"Error in update_complaint: {str(e)}")
        return jsonify({'error': str(e)}), 500
