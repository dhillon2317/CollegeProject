from flask import Blueprint, request, jsonify
from bson import json_util, ObjectId
from datetime import datetime
from ..services.database import get_db

complaints_bp = Blueprint('complaints_bp', __name__)

@complaints_bp.route('/complaints', methods=['POST'])
def create_complaint():
    """Create a new complaint."""
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

@complaints_bp.route('/complaints', methods=['GET'])
def get_complaints():
    """Get all complaints."""
    try:
        db = get_db()
        complaints = []
        for complaint in db.complaints.find({}):
            complaint['_id'] = str(complaint['_id'])
            if 'createdAt' in complaint and isinstance(complaint['createdAt'], datetime):
                complaint['createdAt'] = complaint['createdAt'].isoformat()
            complaints.append(complaint)
        return jsonify(complaints)
    except Exception as e:
        print(f"Error in get_complaints: {str(e)}")
        return jsonify({'error': str(e)}), 500

@complaints_bp.route('/complaints/<complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    """Get a single complaint by ID."""
    try:
        db = get_db()
        complaint = db.complaints.find_one({'_id': ObjectId(complaint_id)})
        
        if not complaint:
            return jsonify({'error': 'Complaint not found'}), 404
            
        return json_util.dumps(complaint)
    except Exception as e:
        print(f"Error in get_complaint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@complaints_bp.route('/complaints/<complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    """Update a complaint status."""
    try:
        data = request.get_json()
        db = get_db()
        
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
