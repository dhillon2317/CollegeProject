@echo off
echo ========================================
echo Checking Backend Status
echo ========================================
echo.
echo Checking if port 5001 is in use...
netstat -ano | findstr :5001
echo.
echo Testing backend health endpoint...
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5001/api/health' -Method GET -UseBasicParsing -TimeoutSec 5; Write-Host 'SUCCESS: Backend is running!' -ForegroundColor Green; Write-Host 'Status:' $response.StatusCode; Write-Host 'Response:' $response.Content } catch { Write-Host 'ERROR: Backend is not accessible' -ForegroundColor Red; Write-Host 'Error:' $_.Exception.Message }"
echo.
echo ========================================
pause

