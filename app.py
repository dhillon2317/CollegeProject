import os
from flask import Flask, send_from_directory
from sbackend.camplaint_analyzer.app import app as api_app

app = Flask(__name__, static_folder='frontend/complain-analyzer-ai/dist')

# Mount the API app
app.register_blueprint(api_app, url_prefix='/api')

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
