#!/bin/bash

# Wait for the database to be ready
echo "Waiting for database to be ready..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "Running database migrations..."
# Add your migration commands here if using Flask-Migrate/Alembic
# Example: flask db upgrade

echo "Starting the application..."
exec gunicorn --bind 0.0.0.0:8000 --workers 4 app:app
