# Deployment Guide for Complaint Analyzer

This guide will walk you through deploying both the frontend and backend components of the Complaint Analyzer application.

## Prerequisites

- Node.js (v14+)
- Python (3.8+)
- MongoDB Atlas account (for production database)
- Vercel account (for frontend deployment)
- Render account (for backend deployment)

## Backend Deployment (Render.com)

1. **Prepare the Backend**
   - Ensure all dependencies are listed in `backend/requirements.txt`
   - Make sure your ML model files are in the `backend/models` directory
   - Test locally by running `python app.py`

2. **Deploy to Render**
   1. Create a new Web Service on Render
   2. Connect your GitHub repository
   3. Configure settings:
      - **Name**: complaint-analyzer-api
      - **Region**: Choose the one closest to your users
      - **Branch**: main (or your preferred branch)
      - **Build Command**: `pip install -r requirements.txt`
      - **Start Command**: `gunicorn -c gunicorn_config.py app:app`
   4. Add environment variables:
      - `FLASK_ENV=production`
      - `MONGODB_URI=your_mongodb_connection_string`
      - `PYTHONUNBUFFERED=True`
   5. Click "Create Web Service"

## Frontend Deployment (Vercel)

1. **Prepare the Frontend**
   - Copy `.env.local.example` to `.env.local`
   - Update the `NEXT_PUBLIC_API_URL` to point to your deployed backend
   - Test locally with `npm run dev`

2. **Deploy to Vercel**
   1. Push your code to GitHub
   2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
   3. Click "New Project"
   4. Import your repository
   5. Configure settings:
      - **Framework Preset**: Next.js
      - **Root Directory**: `frontend/complain-analyzer-ai`
      - **Build Command**: `npm run build` (or `yarn build`)
      - **Output Directory**: `.next`
   6. Add environment variables:
      - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://your-app.onrender.com`)
      - `NODE_ENV`: production
   7. Click "Deploy"

## Environment Variables

### Backend (Render)
- `FLASK_ENV`: Production/development environment
- `MONGODB_URI`: MongoDB connection string
- `PYTHONUNBUFFERED`: Set to `True` for logging

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL`: URL of your deployed backend API
- `NODE_ENV`: Production/development environment

## Post-Deployment

1. **Verify Backend**
   - Visit `https://your-render-app.onrender.com/health`
   - Should return `{"status":"ok","models_loaded":true}`

2. **Test Frontend**
   - Open your Vercel URL
   - Submit a test complaint to verify API connectivity

3. **Set Up Custom Domain (Optional)**
   - In Vercel, go to your project settings
   - Navigate to "Domains"
   - Add your custom domain and follow the verification steps

## Troubleshooting

### Backend Issues
- Check Render logs for startup errors
- Verify MongoDB connection string
- Ensure all model files are present in the correct location

### Frontend Issues
- Check browser console for errors
- Verify API URL is correct in environment variables
- Ensure CORS is properly configured on the backend

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend/complain-analyzer-ai
npm install
npm run dev
```

## Support

For any issues, please open an issue in the GitHub repository.
