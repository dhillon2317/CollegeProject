from complaint_manager import complaint_manager

def get_complaints(domain=None):
    """
    Retrieve all complaints, optionally filtered by domain.
    
    Args:
        domain (str, optional): The domain to filter complaints by. 
                              If None, returns all complaints.
    
    Returns:
        list: List of complaint dictionaries
    """
    return complaint_manager.get_complaints(domain)

def save_complaint(complaint_data, domain='default'):
    """
    Save a new complaint to the appropriate domain file.
    
    Args:
        complaint_data (dict): The complaint data to save
        domain (str): The domain this complaint belongs to
        
    Returns:
        dict: The saved complaint with generated fields (id, timestamp, etc.)
    """
    return complaint_manager.save_complaint(complaint_data, domain)

def get_complaint_by_id(complaint_id):
    """
    Get a specific complaint by its ID.
    
    Args:
        complaint_id (str): The ID of the complaint to retrieve
        
    Returns:
        dict: The complaint data if found, None otherwise
    """
    return complaint_manager.get_complaint_by_id(complaint_id)
