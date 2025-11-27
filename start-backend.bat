@echo off
echo ========================================
echo   YouManage - Serveur Backend Laravel
echo ========================================
echo.

cd backend

REM Check if PHP is available
where php >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] PHP n'est pas installe ou n'est pas dans le PATH
    echo.
    echo Veuillez installer PHP et Composer, puis:
    echo   1. Executer: composer install
    echo   2. Creer le fichier .env
    echo   3. Executer: php artisan key:generate
    echo   4. Configurer la base de donnees dans .env
    echo   5. Executer: php artisan migrate
    echo.
    pause
    exit /b 1
)

REM Check if .env exists
if not exist .env (
    echo [ATTENTION] Le fichier .env n'existe pas
    echo.
    echo Veuillez d'abord configurer le backend:
    echo   1. Executer: create-env.bat
    echo   2. Configurer la base de donnees
    echo   3. Executer: php artisan migrate
    echo.
    pause
    exit /b 1
)

REM Verifier si le port 8001 est libre
echo Verification du port 8001...
netstat -ano | findstr :8001 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo [ATTENTION] Le port 8001 est deja utilise
    echo Liberation du port...
    
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
        echo Utilisation du port 8002...
        set PORT=8002
        echo.
        echo [ATTENTION] Le serveur demarre sur le port 8002
        echo Tu devras mettre a jour la configuration frontend si necessaire
    ) else (
        echo [OK] Port 8001 libere
        set PORT=8001
    )
) else (
    echo [OK] Port 8001 disponible
    set PORT=8001
)

echo.
echo Demarrage du serveur backend Laravel sur http://127.0.0.1:%PORT%
echo.
echo API disponible sur: http://127.0.0.1:%PORT%/api
echo Documentation: backend\docs\API.md
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

php artisan serve --host=127.0.0.1 --port=%PORT%

