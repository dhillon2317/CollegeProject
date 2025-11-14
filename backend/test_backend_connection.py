"""
Test script to verify backend can receive requests from frontend
"""
import requests
import json

BASE_URL = "http://localhost:5001"

def test_health():
    """Test health endpoint"""
    print("Testing /api/health...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"  Status: {response.status_code}")
        print(f"  Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def test_register_options():
    """Test OPTIONS preflight request"""
    print("\nTesting OPTIONS /api/auth/register (CORS preflight)...")
    try:
        response = requests.options(
            f"{BASE_URL}/api/auth/register",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            }
        )
        print(f"  Status: {response.status_code}")
        print(f"  Headers:")
        for key, value in response.headers.items():
            if 'access-control' in key.lower():
                print(f"    {key}: {value}")
        return response.status_code == 200
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def test_register_post():
    """Test POST registration"""
    print("\nTesting POST /api/auth/register...")
    try:
        test_data = {
            "email": f"test_{hash('test')}@example.com",
            "password": "test123456",
            "name": "Test User",
            "role": "student"
        }
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json=test_data,
            headers={
                "Content-Type": "application/json",
                "Origin": "http://localhost:3000"
            }
        )
        print(f"  Status: {response.status_code}")
        print(f"  Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code in [201, 400]  # 400 if user already exists
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def test_cors_headers():
    """Test CORS headers"""
    print("\nTesting CORS headers...")
    try:
        response = requests.get(
            f"{BASE_URL}/api/health",
            headers={"Origin": "http://localhost:3000"}
        )
        print(f"  CORS Headers:")
        cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower()}
        if cors_headers:
            for key, value in cors_headers.items():
                print(f"    {key}: {value}")
        else:
            print("    No CORS headers found!")
        return len(cors_headers) > 0
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Backend Connection Test")
    print("=" * 60)
    
    results = []
    results.append(("Health Check", test_health()))
    results.append(("CORS Headers", test_cors_headers()))
    results.append(("OPTIONS Preflight", test_register_options()))
    results.append(("POST Registration", test_register_post()))
    
    print("\n" + "=" * 60)
    print("Test Results:")
    print("=" * 60)
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status} - {test_name}")
    
    all_passed = all(result for _, result in results)
    print("\n" + "=" * 60)
    if all_passed:
        print("All tests passed! Backend is ready to receive frontend requests.")
    else:
        print("Some tests failed. Check the errors above.")
    print("=" * 60)

