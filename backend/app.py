import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import joblib
import pandas as pd
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
nltk.download('vader_lexicon')
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Global variables for models
category_model = None
priority_model = None
type_model = None
department_model = None
sia = None
models_loaded = False

def load_models():
    """Load all required ML models"""
    global category_model, priority_model, type_model, department_model, sia, models_loaded
    
    try:
        # Load sentiment analyzer
        nltk.download('vader_lexicon')
        sia = SentimentIntensityAnalyzer()
        
        # Load ML models - update these paths as needed
        model_dir = os.path.join(os.path.dirname(__file__), 'models')
        
        category_model = joblib.load(os.path.join(model_dir, 'category_model.pkl'))
        priority_model = joblib.load(os.path.join(model_dir, 'priority_model.pkl'))
        type_model = joblib.load(os.path.join(model_dir, 'type_model.pkl'))
        department_model = joblib.load(os.path.join(model_dir, 'department_model.pkl'))
        
        models_loaded = True
        logger.info("All models loaded successfully")
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        models_loaded = False

# Load models when the app starts
load_models()

# MongoDB connection
def get_db():
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    client = MongoClient(MONGODB_URI)
    return client['complaint_analyzer']

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({
        'status': 'ok',
        'models_loaded': models_loaded
    })

# Analyze complaint endpoint
@app.route('/api/analyze', methods=['POST'])
def analyze_complaint():
    try:
        data = request.get_json()
        complaint_text = data.get('complaint', '')
        
        if not complaint_text:
            return jsonify({'error': 'Complaint text is required'}), 400

        if not models_loaded:
            return jsonify({'error': 'AI models not loaded'}), 503

        # Make predictions
        predicted_category = str(category_model.predict([complaint_text])[0])
        predicted_priority = str(priority_model.predict([complaint_text])[0])
        predicted_type = str(type_model.predict([complaint_text])[0])
        assigned_department = str(department_model.predict([complaint_text])[0])
        
        # Sentiment analysis
        sentiment_score = sia.polarity_scores(complaint_text)['compound']
        sentiment = 'Positive' if sentiment_score >= 0.05 else 'Negative' if sentiment_score <= -0.05 else 'Neutral'

        # Determine if technical
        is_technical = predicted_type.lower() == 'technical'

        return jsonify({
            'category': predicted_category,
            'priority': predicted_priority,
            'type': predicted_type,
            'department': assigned_department,
            'sentiment': sentiment,
            'isTechnical': is_technical
        })

    except Exception as e:
        logger.error(f"Error in analyze_complaint: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Create a new complaint
@app.route('/api/complaints', methods=['POST'])
def create_complaint():
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
            'aiAnalyzed': data.get('aiAnalyzed', False),
            'sentiment': data.get('sentiment')
        }
        
        result = complaints.insert_one(new_complaint)
        new_complaint['_id'] = str(result.inserted_id)

        # --- Append to incremental CSV for future model training ---
        try:
            import csv
            BASE_DIR = Path(__file__).resolve().parent.parent  # project root
            inc_csv = BASE_DIR / 'sbackend' / 'camplaint-analyzer' / 'user_data.csv'
            inc_csv.parent.mkdir(parents=True, exist_ok=True)
            write_header = not inc_csv.exists()
            with inc_csv.open('a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                if write_header:
                    writer.writerow(['complaint_text', 'category', 'priority', 'department', 'type', 'sentiment'])
                writer.writerow([
                    new_complaint['description'],
                    new_complaint['category'],
                    new_complaint['priority'],
                    new_complaint['department'],
                    new_complaint['userType'],
                    new_complaint.get('sentiment', '')
                ])
        except Exception as log_e:
            print('Warning: could not append to incremental CSV:', log_e)
        
        return json_util.dumps(new_complaint), 201
        
    except Exception as e:
        print(f"Error in create_complaint: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Get all complaints
@app.route('/api/complaints', methods=['GET'])
def get_complaints():
    try:
        db = get_db()
        # Convert ObjectId to string for JSON serialization
        complaints = []
        for complaint in db.complaints.find({}):
            complaint['_id'] = str(complaint['_id'])
            # Convert datetime to string if it exists
            if 'createdAt' in complaint and isinstance(complaint['createdAt'], datetime):
                complaint['createdAt'] = complaint['createdAt'].isoformat()
            complaints.append(complaint)
        return jsonify(complaints)
    except Exception as e:
        print(f"Error in get_complaints: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Get a single complaint by ID
@app.route('/api/complaints/<complaint_id>', methods=['GET'])
def get_complaint(complaint_id):
    try:
        db = get_db()
        from bson.objectid import ObjectId
        complaint = db.complaints.find_one({'_id': ObjectId(complaint_id)})
        
        if not complaint:
            return jsonify({'error': 'Complaint not found'}), 404
            
        return json_util.dumps(complaint)
    except Exception as e:
        print(f"Error in get_complaint: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Update a complaint status
@app.route('/api/complaints/<complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    try:
        data = request.get_json()
        db = get_db()
        from bson.objectid import ObjectId
        
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

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)