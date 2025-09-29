import os
import sys
import logging
from pathlib import Path
from flask import Flask, send_from_directory, jsonify, request

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Add the project root to Python path
project_root = str(Path(__file__).resolve().parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Create the main Flask app
app = Flask(__name__)

# Try to import the complaint analyzer module
try:
    from sbackend.camplaint_analyzer.app import app as api_app
    logger.info("Successfully imported complaint analyzer module")
    
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
    logger.info("Successfully registered API routes")
    
except ImportError as e:
    logger.error(f"Failed to import complaint analyzer module: {e}")
    # Create a mock endpoint if the module fails to load
    @app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
    def mock_api_endpoint(path):
        return jsonify({
            "status": "error",
            "message": "API module not available",
            "path": f"/api/{path}",
            "method": request.method
        }), 503

# Add a simple health check endpoint
@app.route('/health')
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "Complaint Analyzer API",
        "version": "1.0.0"
    }), 200

# Configure static files
static_folder = 'frontend/complain-analyzer-ai/dist'
if os.path.exists(static_folder):
    app.static_folder = static_folder
    logger.info(f"Serving static files from {os.path.abspath(static_folder)}")
    
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')
else:
    logger.warning(f"Static folder not found at {os.path.abspath(static_folder)}")
    
    @app.route('/')
    def index():
        return jsonify({
            "status": "running",
            "message": "Complaint Analyzer API is running",
            "frontend": "Static files not found"
        })

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 10000))
    logger.info(f"Starting server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
