import os
from flask import Flask, send_from_directory
# Import using the correct module path with hyphen
import importlib.util
import sys

# Manually import the module with hyphen in the name
module_spec = importlib.util.spec_from_file_location(
    "camplaint_analyzer_app", 
    "sbackend/camplaint-analyzer/app.py"
)
complaint_analyzer = importlib.util.module_from_spec(module_spec)
sys.modules["complaint_analyzer"] = complaint_analyzer
module_spec.loader.exec_module(complaint_analyzer)

# Get the app from the imported module
api_app = complaint_analyzer.app

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
