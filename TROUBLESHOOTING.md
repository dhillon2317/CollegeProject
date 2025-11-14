# Troubleshooting Guide

## Network Error: Unable to connect to the server

If you're getting a network error when trying to sign up or use the application, follow these steps:

### 1. Check if Backend is Running

Open a terminal and run:
```bash
cd backend
python app.py
```

You should see:
```
==================================================
Starting Complaint Management Backend
Data directory: ...
...
==================================================
 * Running on http://0.0.0.0:5001
```

### 2. Test Backend Connection

Open your browser and go to:
```
http://localhost:5001/api/health
```

You should see a JSON response:
```json
{
  "status": "healthy",
  "message": "Backend service is running",
  "complaints_file": "..."
}
```

### 3. Check Frontend Configuration

The frontend is configured to connect to `http://localhost:5001` by default.

If you need to change this, create a `.env` file in `frontend/complain-analyzer-ai/`:
```
VITE_API_URL=http://localhost:5001
```

### 4. Restart Frontend Dev Server

After making changes, restart the frontend:
```bash
cd frontend/complain-analyzer-ai
npm run dev
```

### 5. Check Browser Console

Open browser DevTools (F12) and check the Console tab for detailed error messages.

### 6. Common Issues

**Port 5001 already in use:**
- Change the port in `backend/app.py` (line 261): `app.run(host='0.0.0.0', port=5001, debug=True)`
- Update frontend API URL accordingly

**CORS errors:**
- Backend CORS is configured to allow all origins
- If issues persist, check browser console for specific CORS errors

**Firewall blocking:**
- Ensure Windows Firewall allows connections on port 5001
- Or run backend on a different port

### 7. Verify Both Servers are Running

You should have TWO terminals running:

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend/complain-analyzer-ai
npm run dev
```

Both should be running simultaneously!

