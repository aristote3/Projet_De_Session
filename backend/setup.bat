@echo off
echo BookingSystem Backend Setup
echo.

REM Check if PHP is installed
php --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] PHP n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer PHP 8.1+ et l'ajouter au PATH
    pause
    exit /b 1
)

REM Check if Composer is installed
composer --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Composer n'est pas installe
    echo Veuillez installer Composer depuis https://getcomposer.org/
    pause
    exit /b 1
)

echo [1/5] Installation des dependances Composer...
call composer install
if errorlevel 1 (
    echo [ERREUR] Echec de l'installation des dependances
    pause
    exit /b 1
)

echo.
echo [2/5] Creation du fichier .env...
if not exist .env (
    call create-env.bat
) else (
    echo Fichier .env existe deja
)

echo.
echo [3/5] Generation de la cle d'application...
php artisan key:generate
if errorlevel 1 (
    echo [ERREUR] Echec de la generation de la cle
    pause
    exit /b 1
)

echo.
echo [4/5] Configuration de la base de donnees...
echo.
echo IMPORTANT: Vous devez maintenant:
echo 1. Creer la base de donnees PostgreSQL: bookingsystem
echo    (Utilisez: create-database.bat)
echo 2. Configurer .env avec vos identifiants PostgreSQL
echo 3. Executer: php artisan migrate
echo.

echo [5/5] Verification de la configuration...
echo.
echo Configuration actuelle dans .env:
findstr /C:"DB_" .env 2>nul
if errorlevel 1 (
    echo [ATTENTION] Impossible de lire .env. Verifiez qu'il existe.
)

echo.
echo ====================================
echo   Setup termine!
echo ====================================
echo.
echo Prochaines etapes:
echo 1. Configurez PostgreSQL dans .env
echo 2. Executez: php artisan migrate
echo 3. Executez: php artisan serve
echo.
echo OU utilisez: install-complete.bat pour tout automatiser
echo.
pause

