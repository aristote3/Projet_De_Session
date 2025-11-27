@echo off
chcp 65001 >nul
echo ========================================
echo   YouManage - Demarrage des Serveurs
echo ========================================
echo.

REM Vérifier PHP
where php >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] PHP n'est pas installe ou n'est pas dans le PATH
    echo.
    pause
    exit /b 1
)

REM Vérifier Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Node.js n'est pas installe ou n'est pas dans le PATH
    echo.
    pause
    exit /b 1
)

echo [OK] PHP et Node.js detectes
echo.

REM Vérifier que le dossier backend existe
if not exist "backend" (
    echo [ERREUR] Dossier backend non trouve
    pause
    exit /b 1
)

REM Vérifier que le dossier frontend/react-app existe
if not exist "frontend\react-app" (
    echo [ERREUR] Dossier frontend\react-app non trouve
    pause
    exit /b 1
)

echo [1/2] Demarrage du backend Laravel (port 8001)...
REM Verifier si le port 8001 est libre
netstat -ano | findstr :8001 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo [ATTENTION] Port 8001 occupe, tentative de liberation...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8001 ^| findstr LISTENING') do (
        echo Arret du processus PID %%a...
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 3 /nobreak >nul
    
    REM Verifier a nouveau que le port est libre
    netstat -ano | findstr :8001 | findstr LISTENING >nul
    if %ERRORLEVEL% EQU 0 (
        echo [ERREUR] Impossible de liberer le port 8001
        echo.
        echo Solutions possibles:
        echo   1. Fermez manuellement les processus utilisant le port 8001
        echo   2. Executez: backend\fix-port-8001.bat
        echo   3. Redemarrez votre ordinateur
        echo.
        pause
        exit /b 1
    ) else (
        echo [OK] Port 8001 libere avec succes
    )
) else (
    echo [OK] Port 8001 disponible
)
start "Backend Laravel - Port 8001" cmd /k "cd /d %~dp0backend && php artisan serve --host=127.0.0.1 --port=8001"
timeout /t 3 /nobreak >nul

echo [2/2] Demarrage du frontend React (port 5173)...
start "Frontend React - Port 5173" cmd /k "cd /d %~dp0frontend\react-app && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Serveurs demarres!
echo ========================================
echo.
echo URLs disponibles:
echo   Frontend React:  http://localhost:5173
echo   Backend API:     http://127.0.0.1:8001/api
echo   Backend Root:    http://127.0.0.1:8001
echo.
echo Les serveurs tournent dans des fenetres separees.
echo Appuyez sur Ctrl+C dans chaque fenetre pour arreter.
echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul

