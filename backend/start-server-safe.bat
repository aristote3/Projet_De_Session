@echo off
chcp 65001 >nul
echo ========================================
echo   YouManage - Demarrage Serveur Backend
echo ========================================
echo.

cd /d %~dp0

REM Verifier si le port 8001 est libre
echo [1/3] Verification du port 8001...
netstat -ano | findstr :8001 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo [ATTENTION] Le port 8001 est deja utilise
    echo [2/3] Liberation du port...
    
    REM Tuer le processus utilisant le port 8001
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8001 ^| findstr LISTENING') do (
        echo Arret du processus PID %%a...
        taskkill /PID %%a /F >nul 2>&1
    )
    
    timeout /t 2 /nobreak >nul
    
    REM Verifier a nouveau
    netstat -ano | findstr :8001 | findstr LISTENING >nul
    if %ERRORLEVEL% EQU 0 (
        echo [ERREUR] Impossible de liberer le port 8001
        echo Tentative sur le port 8002...
        set PORT=8002
    ) else (
        echo [OK] Port 8001 libere
        set PORT=8001
    )
) else (
    echo [OK] Port 8001 disponible
    set PORT=8001
)

echo.
echo [3/3] Demarrage du serveur Laravel sur le port %PORT%...
echo.
echo Serveur accessible sur: http://127.0.0.1:%PORT%
echo API accessible sur: http://127.0.0.1:%PORT%/api
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

php artisan serve --host=127.0.0.1 --port=%PORT%

