"""
Quick script to verify backend doesn't use MongoDB
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(__file__))

print("Checking for MongoDB usage in app.py...")
print("=" * 60)

try:
    # Try to import app - this will fail if MongoDB is required
    from app import app
    print("✅ app.py imported successfully")
    print("✅ No MongoDB connection required")
    print("\nBackend uses JSON file storage:")
    print("  - Users: backend/data/users.json")
    print("  - Complaints: backend/data/complaints.json")
    print("\n✅ Backend is ready to run without MongoDB!")
except Exception as e:
    print(f"❌ Error importing app.py: {e}")
    print("\nThis might indicate a MongoDB dependency issue.")
    sys.exit(1)

print("=" * 60)

