# Complaint Analyzer Backend

This is the backend service for the Complaint Analyzer application, built with Flask and PostgreSQL, designed for deployment on AWS.

## Prerequisites

- Python 3.9+
- Docker and Docker Compose (for local development)
- AWS Account with necessary permissions
- AWS CLI configured with appropriate credentials
- Git installed

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd backend
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Using Docker (Recommended)**
   ```bash
   # Start PostgreSQL and pgAdmin
   docker-compose up -d
   
   # Build and run the application
   docker build -t complaint-backend .
   docker run -p 8000:8000 --env-file .env complaint-backend
   ```

4. **Manual Setup**
   ```bash
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Initialize database
   flask db upgrade
   
   # Run the application
   gunicorn --bind 0.0.0.0:8000 app:app
   ```
   The server will start on `http://localhost:8000`

## AWS Deployment

### Prerequisites
- AWS Account with appropriate IAM permissions
- AWS CLI configured
- Docker installed (for building the container image)
- ECR repository created
- RDS PostgreSQL instance set up

### 1. Build and Push Docker Image to ECR

```bash
# Login to ECR
aws ecr get-login-password --region your-region | docker login --username AWS --password-stdin your-account-id.dkr.ecr.your-region.amazonaws.com

# Build the Docker image
docker build -t complaint-backend .

# Tag the image
docker tag complaint-backend:latest your-account-id.dkr.ecr.your-region.amazonaws.com/complaint-backend:latest

# Push the image to ECR
docker push your-account-id.dkr.ecr.your-region.amazonaws.com/complaint-backend:latest
```

### 2. Deploy to AWS App Runner

1. Go to AWS App Runner Console
2. Click "Create service"
3. Select "Container registry" → "Amazon ECR"
4. Select your container image
5. Configure service:
   - Service name: `complaint-backend`
   - Port: `8000`
   - Auto-deploy: Enable
6. Add environment variables from your `.env` file
7. Click "Create & deploy"

### 3. Set Up RDS PostgreSQL

1. Go to AWS RDS Console
2. Create a new PostgreSQL database
3. Configure security group to allow traffic from App Runner
4. Update your `.env` with the RDS endpoint

### 4. Set Up Environment Variables in App Runner

Add these environment variables in App Runner:
- `DATABASE_URL`: Your PostgreSQL connection string
- `SECRET_KEY`: A strong secret key
- `FLASK_ENV`: `production`
- `CORS_ALLOWED_ORIGINS`: Your frontend URL(s)

## Database Migrations

To create a new migration:
```bash
flask db migrate -m "Your migration message"
flask db upgrade
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info (requires authentication)

### Complaints
- `GET /api/health` - Health check endpoint
- `POST /api/complaints` - Submit a new complaint (requires authentication)
- `GET /api/complaints` - Get all complaints (with optional filters, requires authentication)
- `GET /api/complaints/<id>` - Get a specific complaint (requires authentication)
- `PUT /api/complaints/<id>` - Update a complaint (requires authentication)
- `DELETE /api/complaints/<id>` - Delete a complaint (requires admin)

### Admin
- `GET /api/admin/users` - List all users (admin only)
- `PUT /api/admin/users/<id>` - Update user (admin only)
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
