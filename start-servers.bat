@echo off
echo ========================================
echo   YouManage - Demarrage des serveurs
echo ========================================
echo.

REM Check Node.js for frontend
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ATTENTION] Node.js n'est pas installe - Le serveur frontend React ne peut pas demarrer
    echo Veuillez installer Node.js pour utiliser le frontend React
    set FRONTEND_OK=0
) else (
    set FRONTEND_OK=1
)

REM Check PHP for backend
where php >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ATTENTION] PHP n'est pas installe - Le serveur backend ne peut pas demarrer
    echo Veuillez installer PHP et Composer pour utiliser le backend
    set BACKEND_OK=0
) else (
    set BACKEND_OK=1
)

echo.
echo Demarrage des serveurs...
echo.

REM Start frontend server
if %FRONTEND_OK%==1 (
    echo [1/2] Demarrage du serveur frontend React sur http://localhost:3000...
    start "Frontend React - Port 3000" cmd /k "cd frontend\react-app && npm run dev"
    timeout /t 3 /nobreak >nul
    echo    Frontend: http://localhost:3000
) else (
    echo [1/2] Serveur frontend non demarre (Node.js non disponible)
)

REM Start backend server
if %BACKEND_OK%==1 (
    cd backend
    if exist .env (
        echo [2/2] Demarrage du serveur backend Laravel sur http://localhost:8000...
        start "Backend Laravel - Port 8000" cmd /k "php artisan serve --host=127.0.0.1 --port=8000"
        timeout /t 2 /nobreak >nul
        echo    Backend API: http://localhost:8000/api
        echo    Documentation: backend\docs\API.md
    ) else (
        echo [2/2] Serveur backend non demarre (.env manquant)
        echo    Veuillez executer: backend\create-env.bat
        echo    Puis configurer la base de donnees et executer: php artisan migrate
    )
    cd ..
) else (
    echo [2/2] Serveur backend non demarre (PHP non disponible)
)

echo.
echo ========================================
echo   Serveurs demarres!
echo ========================================
echo.
echo URLs disponibles:
if %FRONTEND_OK%==1 (
    echo   Frontend React: http://localhost:3000
)
if %BACKEND_OK%==1 (
    echo   Backend API:    http://localhost:8000/api
)
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
echo (Les serveurs continueront de fonctionner dans leurs fenetres separees)
pause >nul
