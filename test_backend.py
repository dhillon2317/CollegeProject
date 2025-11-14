"""
Quick test script to verify backend endpoints
Run this from project root: python test_backend.py
"""
import requests
import json

BASE_URL = "http://localhost:5001"

print("=" * 60)
print("Testing Backend Endpoints")
print("=" * 60)

# Test 1: Health Check
print("\n1. Testing /api/health...")
try:
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"   ✓ Status: {response.status_code}")
    print(f"   ✓ Response: {response.json()}")
except Exception as e:
    print(f"   ✗ ERROR: {e}")

# Test 2: CORS Headers
print("\n2. Testing CORS headers...")
try:
    response = requests.get(
        f"{BASE_URL}/api/health",
        headers={"Origin": "http://localhost:3000"}
    )
    cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower()}
    if cors_headers:
        print(f"   ✓ CORS headers present: {list(cors_headers.keys())}")
    else:
        print(f"   ✗ No CORS headers found!")
except Exception as e:
    print(f"   ✗ ERROR: {e}")

# Test 3: OPTIONS Preflight
print("\n3. Testing OPTIONS preflight for /api/auth/register...")
try:
    response = requests.options(
        f"{BASE_URL}/api/auth/register",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type"
        }
    )
    print(f"   ✓ Status: {response.status_code}")
    cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower()}
    if cors_headers:
        print(f"   ✓ CORS headers: {list(cors_headers.keys())}")
except Exception as e:
    print(f"   ✗ ERROR: {e}")

# Test 4: POST Registration
print("\n4. Testing POST /api/auth/register...")
try:
    test_data = {
        "email": f"testuser_{hash('test') % 10000}@example.com",
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
    print(f"   ✓ Status: {response.status_code}")
    result = response.json()
    if response.status_code == 201:
        print(f"   ✓ Registration successful!")
        print(f"   ✓ User ID: {result.get('user', {}).get('id', 'N/A')}")
    elif response.status_code == 400:
        print(f"   ⚠ User might already exist: {result.get('error', 'Unknown error')}")
    else:
        print(f"   ✗ Unexpected response: {result}")
except Exception as e:
    print(f"   ✗ ERROR: {e}")

print("\n" + "=" * 60)
print("Test Complete!")
print("=" * 60)
print("\nIf all tests passed, the backend is ready to receive frontend requests.")
print("If any test failed, check the backend logs and ensure it's running.")
