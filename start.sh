#!/bin/bash
set -e

# Set environment
APP_PORT=${PORT:-8000}
WORKERS=${WORKERS:-4}
TIMEOUT=${TIMEOUT:-120}

# Create logs directory if it doesn't exist
mkdir -p /app/logs

# Function to log messages
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Starting application on port $APP_PORT with $WORKERS workers"

# Check if wsgi.py exists
if [ ! -f /app/wsgi.py ]; then
    log "Error: wsgi.py not found in /app directory"
    log "Current directory contents:"
    ls -la /app/
    exit 1
fi

# Check Python environment
log "Python version: $(python --version)"
log "pip version: $(pip --version)"
log "Installed packages:"
pip list

# Run database migrations if needed
# log "Running database migrations..."
# python manage.py migrate --no-input

# Start Gunicorn
log "Starting Gunicorn..."
exec gunicorn \
    --bind "0.0.0.0:$APP_PORT" \
    --workers $WORKERS \
    --worker-class uvicorn.workers.UvicornWorker \
    --timeout $TIMEOUT \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    --capture-output \
    --enable-stdio-inheritance \
    wsgi:app
