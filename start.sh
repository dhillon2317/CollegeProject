#!/bin/bash
set -e

# Set environment
APP_PORT=${PORT:-8000}
WORKERS=${WORKERS:-2}
TIMEOUT=${TIMEOUT:-120}

# Create logs directory if it doesn't exist
mkdir -p /app/logs

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Redirect all output to a log file
exec > >(tee -a /app/logs/startup.log) 2>&1

log "========================================"
log "Starting application on port $APP_PORT as user $(whoami)"
log "Using $WORKERS workers with $TIMEOUT seconds timeout"
log "Environment variables:"
printenv | sort
log "========================================"

# Add user's local bin to PATH if it exists
if [ -d "$HOME/.local/bin" ]; then
    export PATH="$HOME/.local/bin:$PATH"
fi

# Check Python environment
log "\n=== Environment Information ==="
log "User: $(whoami)"
log "Home: $HOME"
log "Python: $(python --version 2>&1 || echo 'Not found')"
log "Pip: $(pip --version 2>&1 || echo 'Not found')"
log "Working directory: $(pwd)"
log "Directory contents:"
ls -la

# Install requirements if needed (as user)
if [ -f "requirements.txt" ] && [ "$SKIP_PIP_INSTALL" != "true" ]; then
    log "\n=== Installing requirements ==="
    pip install --user --no-warn-script-location -r requirements.txt || \
        log "Warning: Failed to install requirements"
fi

# Install spaCy model if not already installed
if ! python -c "import en_core_web_sm" &> /dev/null; then
    log "\n=== Installing spaCy model ==="
    python -m spacy download en_core_web_sm --user || \
        log "Warning: Failed to download spaCy model"
fi

# Ensure the app directory is in Python path
export PYTHONPATH="/app:${PYTHONPATH}"

# Create a simple health check endpoint
cat > /app/health.py << 'EOL'
from http.server import BaseHTTPRequestHandler, HTTPServer
import os

class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8080), HealthHandler)
    server.serve_forever()
EOL

# Start health check in background
python /app/health.py &

log "\n=== Starting Gunicorn server ==="
log "Command: gunicorn --bind :$APP_PORT --workers $WORKERS --timeout $TIMEOUT --worker-class uvicorn.workers.UvicornWorker --access-logfile - --error-logfile - --log-level info app:app"

exec gunicorn \
    --bind :$APP_PORT \
    --workers $WORKERS \
    --timeout $TIMEOUT \
    --worker-class uvicorn.workers.UvicornWorker \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    --chdir /app \
    app:app

# Check Python environment
log "\n=== Python Environment ==="
log "Python version: $(python --version 2>&1 || echo 'Python not found')"
log "Pip version: $(pip --version 2>&1 || echo 'Pip not found')"

# Check directory contents
log "\n=== Directory Structure ==="
log "Current directory: $(pwd)"
log "Contents:"
ls -la .

log "\n=== App directory contents ==="
ls -la /app/

# Check if wsgi.py exists
if [ ! -f /app/wsgi.py ]; then
    log "\nERROR: wsgi.py not found in /app directory"
    log "Current directory contents:"
    ls -la /app/
    exit 1
fi

# Check Python packages
log "\n=== Installed Packages ==="
pip list 2>&1 || log "Failed to list packages"

# Test Flask application
log "\n=== Testing Flask Application ==="
log "Running: python -c 'from app import app; print("App imported successfully")'"
python -c "from app import app; print('App imported successfully')" || {
    log "\nERROR: Failed to import Flask application"
    exit 1
}

# Start Gunicorn
log "\n=== Starting Gunicorn ==="
log "Command: gunicorn --bind 0.0.0.0:$APP_PORT --workers $WORKERS --worker-class uvicorn.workers.UvicornWorker --timeout $TIMEOUT --access-logfile - --error-logfile - --log-level debug --capture-output --enable-stdio-inheritance wsgi:app"

exec gunicorn \
    --bind "0.0.0.0:$APP_PORT" \
    --workers $WORKERS \
    --worker-class uvicorn.workers.UvicornWorker \
    --timeout $TIMEOUT \
    --access-logfile - \
    --error-logfile - \
    --log-level debug \
    --capture-output \
    --enable-stdio-inheritance \
    --preload \
    wsgi:app
