from flask import Flask, jsonify
from flask_cors import CORS
from .routes.complaints import complaints_bp

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(complaints_bp, url_prefix='/api')
    
    @app.route('/health')
    def health_check():
        """Health check endpoint for Render service monitoring."""
        return jsonify({
            'status': 'healthy',
            'service': 'complaint-analyzer-api'
        }), 200
    
    return app
