from app import app
import os

if __name__ == '__main__':
    # Disable debug and reloader for Windows compatibility
    # You can manually restart the server when code changes
    app.run(
        host='0.0.0.0',
        port=5001,
        debug=False,  # Disable debug mode
        use_reloader=False,  # Disable auto-reloader
        threaded=True  # Enable threading for better performance
    )
