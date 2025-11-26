@echo off
echo ========================================
echo   YouManage - Frontend React
echo ========================================
echo.

cd frontend\react-app

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installation des dependances...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERREUR] Echec de l'installation des dependances
        pause
        exit /b 1
    )
)

echo Demarrage du serveur React sur http://localhost:3000
echo.
echo Ouvrez votre navigateur et allez sur:
echo   http://localhost:3000
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

call npm run dev
