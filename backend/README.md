# Complaint Analyzer Backend

This is the backend service for the Complaint Analyzer application, built with Flask and MongoDB.

## Prerequisites

- Python 3.8+
- MongoDB (local or remote)
- pip (Python package manager)

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd backend
   ```

2. **Create and activate a virtual environment**
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update the MongoDB connection string if needed

5. **Run the application**
   ```bash
   python app.py
   ```
   The server will start on `http://localhost:5001`

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/complaints` - Submit a new complaint
- `GET /api/complaints` - Get all complaints (with optional filters)
- `GET /api/complaints/<id>` - Get a specific complaint
- `PUT /api/complaints/<id>` - Update complaint status

## Environment Variables

- `MONGODB_URI`: MongoDB connection string (default: `mongodb://localhost:27017/`)
- `FLASK_APP`: Entry point of the application (default: `app.py`)
- `FLASK_ENV`: Environment (development/production)
- `SECRET_KEY`: Secret key for the application

## Development

To run in development mode with auto-reload:
```bash
flask run --port=5001 --debug
```

## Production

For production, it's recommended to use a production WSGI server like Gunicorn:
```bash
gunicorn --bind 0.0.0.0:5001 app:app
```
