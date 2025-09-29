# Deployment Guide for Complaint Analyzer

This guide will help you deploy the Complaint Analyzer application to Render.

## Prerequisites

1. A [Render](https://render.com) account
2. [Git](https://git-scm.com/) installed
3. [Docker](https://www.docker.com/) installed (for local testing)
4. [Render CLI](https://render.com/docs/cli) installed (optional, for CLI deployment)

## Deployment Steps

### 1. Prepare Your Repository

1. Push your code to a GitHub repository if you haven't already:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```

### 2. Deploy to Render

#### Option 1: Using Render Dashboard (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Select the repository and click "Connect"
5. Click "Apply" to deploy all services

#### Option 2: Using Render CLI

1. Install Render CLI if you haven't already:
   ```bash
   npm install -g @render-oss/cli
   ```

2. Login to Render:
   ```bash
   render login
   ```

3. Run the deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

### 3. Configure Environment Variables

After deployment, update the environment variables in the Render dashboard for each service:

#### Frontend Service
- `VITE_API_URL`: URL of your backend service (e.g., https://your-backend-service.onrender.com)
- `VITE_ML_API_URL`: URL of your ML service (e.g., https://your-ml-service.onrender.com)

#### Backend Service
- `FLASK_ENV`: production
- `DATABASE_URL`: Your database connection string (if using a database)
- Any other required environment variables

#### ML Service
- `FLASK_ENV`: production
- Any other required environment variables

### 4. Verify Deployment

1. Check the logs in the Render dashboard for any errors
2. Visit your frontend URL to test the application
3. Test the API endpoints using a tool like Postman or curl

## Local Development

To run the application locally:

1. Start the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   python run.py
   ```

2. Start the ML service:
   ```bash
   cd ../sbackend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app:app --reload --port 10001
   ```

3. Start the frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## Troubleshooting

- **Build Failures**: Check the logs in the Render dashboard for detailed error messages
- **Connection Issues**: Ensure all services are running and the URLs in the environment variables are correct
- **CORS Errors**: Verify that CORS is properly configured in your backend services

## Support

If you encounter any issues, please open an issue in the repository or contact support.
