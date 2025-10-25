import json
import os
from datetime import datetime
from pathlib import Path

# Get the absolute path to the data directory
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data'))
os.makedirs(DATA_DIR, exist_ok=True)
COMPLAINTS_FILE = os.path.join(DATA_DIR, 'complaints.json')

# Initialize the complaints file if it doesn't exist
if not os.path.exists(COMPLAINTS_FILE):
    with open(COMPLAINTS_FILE, 'w') as f:
        json.dump([], f)

def get_complaints():
    """Retrieve all complaints from the JSON file."""
    try:
        with open(COMPLAINTS_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_complaint(complaint_data):
    """Save a new complaint to the JSON file."""
    complaints = get_complaints()
    
    # Add metadata
    complaint = {
        "id": len(complaints) + 1,
        "timestamp": datetime.now().isoformat(),
        **complaint_data
    }
    
    complaints.append(complaint)
    
    with open(COMPLAINTS_FILE, 'w') as f:
        json.dump(complaints, f, indent=2)
    
    return complaint
