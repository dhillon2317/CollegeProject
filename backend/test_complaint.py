# test_complaint.py
import requests
import json

url = "http://localhost:5001/api/complaints"
headers = {
    "Content-Type": "application/json"
}
data = {
    "title": "Test Complaint",
    "description": "This is a test complaint",
    "contactInfo": "test@example.com",
    "userType": "Student",
    "domain": "Academic"
}

try:
    response = requests.post(url, headers=headers, json=data)
    print("Status Code:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Error:", str(e))