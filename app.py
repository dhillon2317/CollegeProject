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
    # Use importlib to handle the hyphen in module name
    import importlib.util
    import sys
    
    # Add the sbackend directory to the path
    sbackend_path = os.path.join(project_root, 'sbackend')
    if sbackend_path not in sys.path:
        sys.path.insert(0, sbackend_path)
    
    # Import the module using importlib
    spec = importlib.util.spec_from_file_location(
        "camplaint_analyzer",
        os.path.join(project_root, 'sbackend', 'camplaint-analyzer', 'app.py')
    )
    complaint_analyzer = importlib.util.module_from_spec(spec)
    sys.modules["camplaint_analyzer"] = complaint_analyzer
    spec.loader.exec_module(complaint_analyzer)
    
    # Get the app from the imported module
    api_app = complaint_analyzer.app
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
    }), 200

# Configure static files
static_folder = os.path.join('frontend', 'complain-analyzer-ai', 'dist')
static_abs_path = os.path.abspath(static_folder)

if os.path.exists(static_abs_path):
    app.static_folder = static_abs_path
    logger.info(f"Serving static files from: {static_abs_path}")
    
    @app.route('/<path:path>')
    def serve(path):
        # Don't interfere with API routes
        if path.startswith('api/'):
            return jsonify({"error": "Not found"}), 404
            
        # Serve static files if they exist
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        # Otherwise serve index.html for SPA routing
        elif os.path.exists(os.path.join(app.static_folder, 'index.html')):
            return send_from_directory(app.static_folder, 'index.html')
        else:
            return jsonify({
                "error": "Frontend files not found",
                "status": "backend_running",
                "api_docs": "/api/docs"
            }), 404
else:
    logger.warning(f"Frontend static folder not found at: {static_abs_path}")
    
    @app.route('/')
    def index():
        return jsonify({
            "status": "backend_running",
            "message": "Backend is running but frontend files are not found",
            "api_docs": "/api/docs",
            "frontend_expected_path": static_abs_path
        })

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 10000))
    logger.info(f"Starting server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
