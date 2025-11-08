import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

# Base data directory
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data'))
os.makedirs(DATA_DIR, exist_ok=True)

# Domain to filename mapping
DOMAIN_FILES = {
    'education': 'education_complaints.json',
    'healthcare': 'healthcare_complaints.json',
    'business': 'business_complaints.json',
    'default': 'other_complaints.json'
}

class ComplaintManager:
    def __init__(self, data_dir: str = DATA_DIR):
        """Initialize the complaint manager with the data directory."""
        self.data_dir = data_dir
        os.makedirs(self.data_dir, exist_ok=True)
        
        # Initialize all domain files if they don't exist
        for domain, filename in DOMAIN_FILES.items():
            filepath = os.path.join(self.data_dir, filename)
            if not os.path.exists(filepath):
                with open(filepath, 'w') as f:
                    json.dump([], f)
    
    def _get_domain_file(self, domain: str) -> str:
        """Get the file path for a given domain."""
        filename = DOMAIN_FILES.get(domain.lower(), DOMAIN_FILES['default'])
        return os.path.join(self.data_dir, filename)
    
    def get_complaints(self, domain: Optional[str] = None) -> List[Dict]:
        """Get all complaints, optionally filtered by domain."""
        if domain:
            filepath = self._get_domain_file(domain)
            try:
                with open(filepath, 'r') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                return []
        else:
            all_complaints = []
            for domain_file in DOMAIN_FILES.values():
                filepath = os.path.join(self.data_dir, domain_file)
                if os.path.exists(filepath):
                    try:
                        with open(filepath, 'r') as f:
                            domain_complaints = json.load(f)
                            all_complaints.extend(domain_complaints)
                    except (json.JSONDecodeError, FileNotFoundError):
                        continue
            return all_complaints
    
    def save_complaint(self, complaint_data: Dict, domain: str = 'default') -> Dict:
        """Save a new complaint to the appropriate domain file."""
        if 'domain' in complaint_data:
            domain = complaint_data['domain']
        
        filepath = self._get_domain_file(domain)
        
        # Load existing complaints
        try:
            with open(filepath, 'r') as f:
                complaints = json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            complaints = []
        
        # Add metadata
        complaint = {
            "id": f"{domain[:3].upper()}-{len(complaints) + 1:04d}",
            "domain": domain,
            "timestamp": datetime.now().isoformat(),
            **{k: v for k, v in complaint_data.items() if k != 'domain'}
        }
        
        # Save updated complaints
        complaints.append(complaint)
        with open(filepath, 'w') as f:
            json.dump(complaints, f, indent=2)
        
        return complaint
    
    def get_complaint_by_id(self, complaint_id: str) -> Optional[Dict]:
        """Get a specific complaint by its ID."""
        for domain in list(DOMAIN_FILES.keys()) + ['default']:
            complaints = self.get_complaints(domain)
            for complaint in complaints:
                if complaint.get('id') == complaint_id:
                    return complaint
        return None

# Create a global instance for easy import
complaint_manager = ComplaintManager()
