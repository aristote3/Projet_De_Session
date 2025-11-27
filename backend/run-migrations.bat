@echo off
echo ========================================
echo   Execution des migrations Laravel
echo ========================================
echo.

cd backend

REM Vérifier si l'extension MySQL est activée
php -r "if (!extension_loaded('pdo_mysql')) { echo 'ERREUR: Extension pdo_mysql non activee\n'; echo 'Activez extension=pdo_mysql dans php.ini\n'; exit(1); }" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Extension MySQL non activee
    echo.
    echo Veuillez activer extension=pdo_mysql dans C:\php8.4\php.ini
    echo.
    pause
    exit /b 1
)

echo [OK] Extension MySQL activee
echo.

REM Vérifier la connexion à la base de données
echo [1/2] Verification de la connexion a la base de donnees...
php artisan migrate:status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Impossible de se connecter a la base de donnees
    echo.
    echo Verifiez:
    echo   - Que MySQL est demarre
    echo   - Que la base de donnees 'booking' existe
    echo   - Que les identifiants dans .env sont corrects
    echo.
    echo Pour creer la base de donnees, executez: create-database.bat
    echo.
    pause
    exit /b 1
)

echo [OK] Connexion a la base de donnees reussie
echo.

REM Lancer les migrations
echo [2/2] Execution des migrations...
php artisan migrate

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Migrations executees avec succes!
    echo ========================================
    echo.
) else (
    echo.
    echo [ERREUR] Erreur lors de l'execution des migrations
    echo.
)

pause

