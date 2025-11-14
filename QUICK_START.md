# Quick Start Guide - Fixing Connection Issues

## Step 1: Start the Backend

**Option A: Using the batch file (Windows)**
```bash
# Double-click START_BACKEND.bat
# OR run from command prompt:
START_BACKEND.bat
```

**Option B: Manual start**
```bash
cd backend
python app.py
```

**You should see:**
```
==================================================
Starting Complaint Management Backend
...
Backend will be available at:
  - http://localhost:5001
  - http://127.0.0.1:5001

Health check: http://localhost:5001/api/health
==================================================

Waiting for requests...
```

## Step 2: Verify Backend is Running

**Option A: Using the batch file (Windows)**
```bash
CHECK_BACKEND.bat
```

**Option B: Manual check**
1. Open your browser
2. Go to: http://localhost:5001/api/health
3. You should see: `{"status":"healthy","message":"Backend service is running",...}`

**Option C: Check port**
```bash
netstat -ano | findstr :5001
```
You should see port 5001 in LISTENING state.

## Step 3: Start the Frontend

```bash
cd frontend/complain-analyzer-ai
npm run dev
```

**You should see:**
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Step 4: Test the Signup Page

1. Open browser: http://localhost:3000/register
2. The page will automatically check backend connection
3. If connected: Form will be enabled
4. If not connected: You'll see connection error with instructions

## Troubleshooting

### Backend won't start

**Error: "Address already in use"**
- Another process is using port 5001
- Solution: Stop the other process or change the port

**Error: "Module not found"**
- Missing dependencies
- Solution: `cd backend && pip install -r requirements.txt`

### Frontend can't connect

**Check 1: Is backend running?**
- Run: `CHECK_BACKEND.bat`
- Or visit: http://localhost:5001/api/health

**Check 2: Browser console (F12)**
- Look for error messages
- Check the "Network" tab for failed requests

**Check 3: Firewall**
- Windows Firewall might be blocking port 5001
- Solution: Allow Python through firewall

**Check 4: CORS errors**
- Backend CORS is configured correctly
- If you see CORS errors, restart the backend

### Still not working?

1. **Check both terminals:**
   - Backend terminal should show: "Waiting for requests..."
   - Frontend terminal should show: "Local: http://localhost:3000/"

2. **Check browser console (F12):**
   - Look for: "Checking backend health at: http://localhost:5001/api/health"
   - Check for any error messages

3. **Test backend directly:**
   - Open: http://localhost:5001/api/health
   - Should return JSON response

4. **Restart everything:**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend again
   - Start frontend again

## Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to backend" | Ensure backend is running on port 5001 |
| Port 5001 in use | Stop other process or change port |
| CORS errors | Backend CORS is configured - restart backend |
| Module not found | Run `pip install -r requirements.txt` |
| Network timeout | Check firewall settings |

## Need Help?

1. Check backend terminal for error messages
2. Check browser console (F12) for detailed errors
3. Verify backend is accessible: http://localhost:5001/api/health
4. Check both servers are running simultaneously

