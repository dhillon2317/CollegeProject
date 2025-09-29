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
log "Starting application on port $APP_PORT"
log "Using $WORKERS workers with $TIMEOUT seconds timeout"
log "Environment variables:"
printenv | sort
log "========================================"

# Make sure the app is installed in development mode
if [ "$RAILWAY_ENVIRONMENT" = "production" ]; then
    log "Running in production mode"
    pip install -e .
fi

log "Current directory: $(pwd)"
log "Python version: $(python --version)"
log "Pip version: $(pip --version)"

# Install requirements if needed
if [ -f "requirements.txt" ]; then
    log "Installing requirements..."
    pip install -r requirements.txt
fi

# Install spaCy model if not already installed
if ! python -c "import en_core_web_sm" &> /dev/null; then
    log "Downloading spaCy model..."
    python -m spacy download en_core_web_sm
fi

log "Starting Gunicorn server..."
exec gunicorn \
    --bind :$APP_PORT \
    --workers $WORKERS \
    --timeout $TIMEOUT \
    --worker-class uvicorn.workers.UvicornWorker \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
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
