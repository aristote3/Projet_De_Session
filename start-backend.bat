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

echo Demarrage du serveur backend Laravel sur http://localhost:8000
echo.
echo API disponible sur: http://localhost:8000/api
echo Documentation: backend\docs\API.md
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

php artisan serve --host=127.0.0.1 --port=8000

