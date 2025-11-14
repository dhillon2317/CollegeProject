# Frontend-Backend Connection Setup Guide

## Current Status
✅ Backend is running and healthy on `http://localhost:5001`
✅ Vite proxy is configured in `vite.config.ts`
✅ All API calls use relative URLs (via proxy)

## Critical Steps to Connect

### 1. **RESTART THE FRONTEND DEV SERVER** ⚠️
The Vite proxy configuration ONLY works after restarting the dev server.

**Steps:**
```bash
# Stop the current frontend (Ctrl+C in the terminal)
# Then restart:
cd frontend/complain-analyzer-ai
npm run dev
```

### 2. Verify Backend is Running
```bash
cd backend
python app.py
```

You should see:
```
Starting Complaint Management Backend
Data directory: ...
Complaints file: ...
Models directory: ...
```

### 3. Test the Connection

1. Open browser: `http://localhost:3000`
2. Open DevTools (F12) → Console tab
3. Look for these logs:
   - `API Base URL: (using relative URLs via Vite proxy)`
   - `Base URL: (relative - using Vite proxy)`
4. Try submitting a complaint
5. Check the Network tab for `/api/complaints` request

### 4. Expected Console Logs

When working correctly, you should see:
```
API Base URL: (using relative URLs via Vite proxy)
Environment variables: { VITE_API_URL: undefined, MODE: 'development', DEV: true }
[POST] /api/complaints
Base URL: (relative - using Vite proxy)
Checking backend health at /api/health...
Health check response status: 200
Backend is healthy: { status: 'healthy', ... }
```

### 5. Troubleshooting

**If you see "Network Error":**
1. ✅ Check backend is running: `curl http://localhost:5001/api/health`
2. ✅ Check frontend dev server is running on port 3000
3. ✅ **RESTART the frontend dev server** (most common issue!)
4. Check browser console for detailed error messages
5. Check Network tab for request details

**If proxy isn't working:**
- Verify `vite.config.ts` has the proxy configuration
- Make sure you're accessing via `http://localhost:3000` (not file://)
- Check that no other service is using port 3000

## How It Works

1. Frontend runs on `http://localhost:3000`
2. Backend runs on `http://localhost:5001`
3. Vite proxy intercepts requests to `/api/*` and forwards them to `http://localhost:5001`
4. Browser sees requests as same-origin (no CORS issues)

## Files Configured

- ✅ `vite.config.ts` - Proxy configuration
- ✅ `src/services/api.ts` - Uses relative URLs
- ✅ `src/config.ts` - Centralized API config
- ✅ `src/components/ComplaintForm.tsx` - Enhanced error logging
- ✅ `backend/app.py` - CORS and response format

## Next Steps

1. **RESTART frontend dev server**
2. Test complaint submission
3. Check browser console for logs
4. Verify complaint is saved in `backend/data/complaints.json`

