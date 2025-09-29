#!/bin/bash
set -e

# Run database migrations if needed
# python manage.py migrate

# Start Gunicorn
exec gunicorn --bind :$PORT --workers 4 --worker-class uvicorn.workers.UvicornWorker --timeout 120 wsgi:app
