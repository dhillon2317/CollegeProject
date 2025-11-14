@echo off
echo ========================================
echo Starting Backend Server
echo ========================================
cd backend
echo.
echo Checking Python installation...
python --version
echo.
echo Installing/updating dependencies...
pip install -q -r requirements.txt
echo.
echo Starting Flask backend on http://localhost:5001
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.
python app.py
pause

