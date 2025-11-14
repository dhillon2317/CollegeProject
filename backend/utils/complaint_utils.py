import json
import os
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any
import uuid

# Get the absolute path to the data directory
DATA_DIR = Path(__file__).parent.parent / 'data'
os.makedirs(DATA_DIR, exist_ok=True)

COMPLAINTS_FILE = DATA_DIR / 'complaints.json'

def load_complaints() -> List[Dict[str, Any]]:
    """Load all complaints from the JSON file."""
    if not COMPLAINTS_FILE.exists():
        return []
    try:
        with open(COMPLAINTS_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_complaint(complaint_data: Dict[str, Any]) -> Dict[str, Any]:
    """Save a new complaint to the JSON file."""
    complaints = load_complaints()
    
    # Add metadata
    complaint_data['id'] = str(uuid.uuid4())
    complaint_data['createdAt'] = datetime.utcnow().isoformat()
    complaint_data['status'] = 'pending'
    
    # Add to the list
    complaints.append(complaint_data)
    
    # Save back to file
    with open(COMPLAINTS_FILE, 'w') as f:
        json.dump(complaints, f, indent=2)
    
    return complaint_data
