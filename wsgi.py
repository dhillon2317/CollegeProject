import os
import sys
from pathlib import Path

# Add the project root to the Python path
project_root = str(Path(__file__).resolve().parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Print debug information
print(f"Python path: {sys.path}")
print(f"Current working directory: {os.getcwd()}")

# Try to import the Flask app
try:
    from sbackend.camplaint_analyzer.app import app as application
    print("Successfully imported the Flask application")
except ImportError as e:
    print(f"Error importing Flask application: {e}")
    print("Current directory contents:", os.listdir('.'))
    if os.path.exists('sbackend'):
        print("sbackend contents:", os.listdir('sbackend'))
        if os.path.exists('sbackend/camplaint_analyzer'):
            print("camplaint_analyzer contents:", os.listdir('sbackend/camplaint_analyzer'))
    raise

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    print(f"Starting server on port {port}")
    application.run(host='0.0.0.0', port=port, debug=False)
