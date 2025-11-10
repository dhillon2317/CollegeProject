import requests
import json

# Test the analyze endpoint
url = "http://localhost:5001/analyze"
data = {"text": "The wifi is not working in the library"}

print("Testing /analyze endpoint...")
print(f"URL: {url}")
print(f"Data: {data}")

try:
    response = requests.post(url, json=data)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

# Test the create complaint endpoint
print("\n" + "="*50)
print("\nTesting /api/complaints endpoint...")
url2 = "http://localhost:5001/api/complaints"
data2 = {
    "description": "The wifi is not working in the library",
    "name": "Test User",
    "email": "test@example.com"
}

try:
    response2 = requests.post(url2, json=data2)
    print(f"\nStatus Code: {response2.status_code}")
    print(f"Response: {json.dumps(response2.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")
