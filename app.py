import os
import sys
from pathlib import Path
from flask import Flask, send_from_directory, jsonify

# Add the project root to Python path
project_root = str(Path(__file__).resolve().parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Import the Flask app from the complaint-analyzer module
from sbackend.camplaint_analyzer.app import app as api_app

# Create the main Flask app
app = Flask(__name__, static_folder='frontend/complain-analyzer-ai/dist')

# Copy all routes from api_app to the main app with /api prefix
for rule in api_app.url_map.iter_rules():
    # Skip static routes to avoid conflicts
    if not rule.endpoint.startswith('static'):
        # Get the view function from the api_app
        view_func = api_app.view_functions[rule.endpoint]
        # Create a new endpoint name to avoid conflicts
        endpoint = f"api_{rule.endpoint}"
        # Add the same route to the main app with /api prefix
        app.add_url_rule(
            f"/api{rule.rule}",  # Prefix with /api
            endpoint=endpoint,
            view_func=view_func,
            methods=rule.methods
        )

# Add a simple health check endpoint
@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"}), 200

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=10000, debug=False)
