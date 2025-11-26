@echo off
chcp 65001 >nul
echo ========================================
echo   YouManage - Demarrage des Serveurs
echo ========================================
echo.

echo [INFO] Assurez-vous que PHP et Node.js sont installes
echo.

echo [1/2] Demarrage du backend Laravel (port 8000)...
start "Backend Laravel" cmd /k "cd backend && php artisan serve --host=127.0.0.1 --port=8000"
timeout /t 3 /nobreak >nul

echo [2/2] Demarrage du frontend React (port 3000)...
start "Frontend React" cmd /k "cd frontend\react-app && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Serveurs demarres!
echo ========================================
echo.
echo URLs:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8000/api
echo.
echo Appuyez sur une touche pour fermer...
pause >nul

