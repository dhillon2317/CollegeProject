from flask import Flask
from flask_cors import CORS
from .routes.complaints import complaints_bp

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    CORS(app)
    
    # Register blueprints
    app.register_blueprint(complaints_bp, url_prefix='/api')
    
    return app
