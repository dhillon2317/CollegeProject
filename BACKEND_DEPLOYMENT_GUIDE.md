# Backend Deployment Guide

## Problem
Your frontend is deployed on AWS Amplify, but the backend is still running locally on `localhost:5001`.
The deployed frontend cannot connect to localhost, so complaints cannot be submitted.

## Solution: Deploy Backend to Cloud

### Option 1: Render.com (Recommended - Easiest & Free)

#### Step 1: Prepare Backend
1. Make sure `requirements.txt` is complete
2. Create `render.yaml` in backend folder

#### Step 2: Deploy to Render
1. Go to https://render.com/
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository: `dhillon2317/CollegeProject`
5. Configure:
   - **Name**: `complaint-analyzer-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
   - **Instance Type**: Free
6. Add Environment Variables:
   ```
   MONGODB_USERNAME=dhillon2317
   MONGODB_PASSWORD=dhillon1000
   MONGODB_CLUSTER=cluster0.6ebj5lk.mongodb.net
   FLASK_ENV=production
   ```
7. Click "Create Web Service"
8. Wait 5-10 minutes for deployment
9. Copy the URL (e.g., `https://complaint-analyzer-backend.onrender.com`)

#### Step 3: Update Frontend
1. Update `.env.production`:
   ```
   VITE_API_URL=https://complaint-analyzer-backend.onrender.com/api
   ```
2. Commit and push to trigger Amplify rebuild

---

### Option 2: Railway.app (Also Free & Easy)

1. Go to https://railway.app/
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Configure:
   - **Root Directory**: `/backend`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
6. Add environment variables (same as Render)
7. Deploy and get URL

---

### Option 3: AWS Elastic Beanstalk (More Complex)

You already have some EB files, but need to complete setup:

1. Install EB CLI (already done)
2. Navigate to backend folder
3. Initialize EB:
   ```bash
   cd backend
   eb init -p python-3.12 complaint-backend --region us-east-1
   ```
4. Create environment:
   ```bash
   eb create complaint-backend-env
   ```
5. Set environment variables:
   ```bash
   eb setenv MONGODB_USERNAME=dhillon2317 MONGODB_PASSWORD=dhillon1000 MONGODB_CLUSTER=cluster0.6ebj5lk.mongodb.net
   ```
6. Deploy:
   ```bash
   eb deploy
   ```
7. Get URL:
   ```bash
   eb status
   ```

---

### Option 4: Heroku (Paid - $5/month minimum)

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create complaint-analyzer-backend`
4. Add buildpack: `heroku buildpacks:set heroku/python`
5. Set env vars:
   ```bash
   heroku config:set MONGODB_USERNAME=dhillon2317
   heroku config:set MONGODB_PASSWORD=dhillon1000
   heroku config:set MONGODB_CLUSTER=cluster0.6ebj5lk.mongodb.net
   ```
6. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

---

## Quick Start: Deploy to Render (5 Minutes)

### Step-by-Step:

1. **Create `render.yaml` in backend folder**:
   ```yaml
   services:
     - type: web
       name: complaint-analyzer-backend
       env: python
       region: oregon
       buildCommand: pip install -r requirements.txt
       startCommand: gunicorn --bind 0.0.0.0:$PORT app:app
       envVars:
         - key: MONGODB_USERNAME
           value: dhillon2317
         - key: MONGODB_PASSWORD
           value: dhillon1000
         - key: MONGODB_CLUSTER
           value: cluster0.6ebj5lk.mongodb.net
         - key: FLASK_ENV
           value: production
   ```

2. **Update `requirements.txt`** to include gunicorn:
   ```
   flask
   flask-cors
   python-dotenv
   pymongo>=4.0.0
   dnspython>=2.0.0
   certifi
   joblib
   pandas
   numpy
   scikit-learn
   gunicorn
   ```

3. **Commit changes**:
   ```bash
   git add .
   git commit -m "Prepare backend for Render deployment"
   git push origin main
   ```

4. **Go to Render.com**:
   - Sign up with GitHub
   - New Web Service
   - Connect repository
   - Select `backend` as root directory
   - Deploy

5. **Update Frontend**:
   - Edit `.env.production` with your Render URL
   - Commit and push
   - Amplify will auto-rebuild

---

## After Backend Deployment

### Update CORS in backend/app.py:
```python
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://main.d1nokap2upnclw.amplifyapp.com",
            "http://localhost:5173"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
```

### Test Your Deployment:
1. Visit your Render URL: `https://your-app.onrender.com/api/complaints`
2. Should return JSON with complaints
3. Visit your Amplify frontend
4. Submit a complaint - it should work!

---

## Troubleshooting

### Backend not starting:
- Check Render logs
- Verify all dependencies in requirements.txt
- Check environment variables are set

### CORS errors:
- Update CORS origins in app.py
- Include your Amplify URL
- Redeploy backend

### MongoDB connection fails:
- Verify MongoDB Atlas Network Access allows all IPs (0.0.0.0/0)
- Check environment variables are correct
- Test connection locally first

---

## Cost Comparison

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| **Render** | ✅ Yes | Sleeps after 15 min inactivity, 750 hrs/month |
| **Railway** | ✅ Yes | $5 credit/month, then pay-as-you-go |
| **AWS EB** | ✅ 12 months | Then ~$10-20/month |
| **Heroku** | ❌ No | $5/month minimum |

**Recommendation**: Start with Render.com (free and easy)

---

## Current Status

- ✅ Frontend deployed: https://main.d1nokap2upnclw.amplifyapp.com
- ❌ Backend: Not deployed (running locally only)
- ✅ MongoDB: Connected and working
- ✅ ML Models: Working locally

**Next Step**: Deploy backend to Render.com (takes 5 minutes)
