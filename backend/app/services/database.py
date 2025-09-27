import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_db():
    """Establishes a connection to the MongoDB database."""
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    client = MongoClient(MONGODB_URI)
    return client['complaint_analyzer']
