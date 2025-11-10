# 🚀 Deploy Your Backend NOW (5 Minutes)

## The Problem
Your AWS Amplify frontend is live at: https://main.d1nokap2upnclw.amplifyapp.com
But it can't submit complaints because the backend is only on your local machine (localhost:5001).

## The Solution
Deploy backend to Render.com (FREE)

---

## Step-by-Step Instructions

### 1. Commit Your Changes
```bash
git add .
git commit -m "Prepare for backend deployment"
git push origin main
```

### 2. Go to Render.com
1. Open https://render.com/ in your browser
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (easiest)
4. Authorize Render to access your repositories

### 3. Create New Web Service
1. Click **"New +"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect account"** if needed
4. Find and select your repository: **`dhillon2317/CollegeProject`**

### 4. Configure the Service
Fill in these settings:

- **Name**: `complaint-analyzer-backend`
- **Region**: Oregon (US West) or closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`
- **Instance Type**: **Free**

### 5. Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables:

| Key | Value |
|-----|-------|
| `MONGODB_USERNAME` | `dhillon2317` |
| `MONGODB_PASSWORD` | `dhillon1000` |
| `MONGODB_CLUSTER` | `cluster0.6ebj5lk.mongodb.net` |
| `FLASK_ENV` | `production` |

### 6. Deploy!
1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Watch the logs - you should see:
   ```
   All models loaded successfully
   Connected to MongoDB successfully!
   ```
4. Once deployed, you'll see: **"Your service is live 🎉"**

### 7. Copy Your Backend URL
- Look for the URL at the top: `https://complaint-analyzer-backend.onrender.com`
- **COPY THIS URL** - you'll need it next

---

## Update Frontend to Use Deployed Backend

### Option A: Update in Amplify Console (Easiest)

1. Go to https://console.aws.amazon.com/amplify/
2. Select your app: `complain-analyzer-ai`
3. Click **"Environment variables"** in left sidebar
4. Click **"Manage variables"**
5. Add new variable:
   - **Variable name**: `VITE_API_URL`
   - **Value**: `https://complaint-analyzer-backend.onrender.com/api`
     (Replace with YOUR Render URL)
6. Click **"Save"**
7. Go to **"Rewrites and redirects"**
8. Click **"Redeploy this version"**

### Option B: Update Code and Push (Alternative)

1. Edit `.env.production` file:
   ```bash
   cd frontend/complain-analyzer-ai
   ```
   
2. Update the file:
   ```
   VITE_API_URL=https://complaint-analyzer-backend.onrender.com/api
   ```
   (Replace with YOUR Render URL)

3. Commit and push:
   ```bash
   git add .
   git commit -m "Update production API URL"
   git push origin main
   ```

4. Amplify will auto-rebuild (takes 2-3 minutes)

---

## Test Your Deployment

### 1. Test Backend Directly
Open in browser: `https://your-backend-url.onrender.com/api/complaints`

Should see JSON response:
```json
{
  "success": true,
  "data": [...]
}
```

### 2. Test Frontend
1. Go to: https://main.d1nokap2upnclw.amplifyapp.com
2. Click **"Submit"** tab
3. Fill in a complaint
4. Click **"Submit Complaint"**
5. Should see success message!
6. Go to **"Dashboard"** - your complaint should appear!

---

## Troubleshooting

### Backend shows "Service Unavailable"
- Check Render logs for errors
- Verify MongoDB connection
- Wait a few more minutes (first deploy can be slow)

### Frontend still says "localhost"
- Clear browser cache (Ctrl + Shift + R)
- Check Amplify environment variables
- Verify Amplify rebuild completed

### CORS Error
Backend needs to allow your Amplify URL. I'll fix this after you deploy.

### Render Free Tier Sleeps
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Upgrade to paid ($7/month) for always-on

---

## What Happens Next

1. ✅ Backend deployed on Render
2. ✅ Frontend connects to deployed backend
3. ✅ Users can submit complaints
4. ✅ Data saves to MongoDB
5. ✅ Dashboard shows real data

---

## Current URLs

- **Frontend (Amplify)**: https://main.d1nokap2upnclw.amplifyapp.com
- **Backend (Render)**: `https://your-backend-url.onrender.com` (after deployment)
- **MongoDB**: cluster0.6ebj5lk.mongodb.net (already working)

---

## Need Help?

If you get stuck:
1. Check Render deployment logs
2. Check Amplify build logs
3. Check browser console (F12) for errors
4. Let me know the error message

**Ready? Go to https://render.com/ and start deploying!** 🚀
