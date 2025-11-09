import requests
import json

def test_complaint_submission():
    url = "http://localhost:5001/api/complaints"
    data = {
        "title": "Test Complaint",
        "description": "This is a test complaint to check the API",
        "category": "Test",
        "department": "Test",
        "priority": "Low",
        "contactInfo": "test@example.com",
        "userType": "Student",
        "status": "Pending",
        "aiAnalyzed": False
    }
    
    print("Sending test request to:", url)
    print("Request data:", json.dumps(data, indent=2))
    
    try:
        response = requests.post(url, json=data)
        print("\nResponse Status Code:", response.status_code)
        print("Response Headers:", dict(response.headers))
        print("Response Content:", response.text)
        
        if response.status_code == 201:
            print("\n✅ Success! The backend is working correctly.")
            print("Please check the backend console for any error messages during request processing.")
        else:
            print("\n❌ Error: The request was not successful.")
            
    except requests.exceptions.RequestException as e:
        print("\n❌ Error connecting to the server:", str(e))
        print("\nPossible causes:")
        print("1. Make sure the backend server is running")
        print("2. Check if the server is running on port 5001")
        print("3. Verify there are no firewall/antivirus blocking the connection")
        print("4. Check the backend console for any error messages")

if __name__ == "__main__":
    test_complaint_submission()
