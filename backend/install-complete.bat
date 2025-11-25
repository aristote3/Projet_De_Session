@echo off
echo Installation Complete - BookingSystem Backend
echo.

REM Check PHP
php --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] PHP n'est pas installe ou n'est pas dans le PATH
    echo.
    echo Installez PHP 8.1+ depuis: https://windows.php.net/download/
    echo Ou installez XAMPP: https://www.apachefriends.org/
    pause
    exit /b 1
)
echo [OK] PHP detecte

REM Check Composer
composer --version >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Composer n'est pas installe
    echo.
    echo Installez Composer depuis: https://getcomposer.org/download/
    pause
    exit /b 1
)
echo [OK] Composer detecte

echo.
echo ====================================
echo   ETAPE 1: Installation des dependances
echo ====================================
echo.
call composer install
if errorlevel 1 (
    echo [ERREUR] Echec de l'installation des dependances
    pause
    exit /b 1
)
echo [OK] Dependances installees

echo.
echo ====================================
echo   ETAPE 2: Creation du fichier .env
echo ====================================
echo.
if exist .env (
    echo Le fichier .env existe deja.
    set /p overwrite="Voulez-vous le remplacer? (o/n): "
    if /i "%overwrite%"=="o" (
        call create-env.bat
    )
) else (
    call create-env.bat
)

echo.
echo ====================================
echo   ETAPE 3: Generation de la cle
echo ====================================
echo.
php artisan key:generate
if errorlevel 1 (
    echo [ERREUR] Echec de la generation de la cle
    pause
    exit /b 1
)
echo [OK] Cle generee

echo.
echo ====================================
echo   ETAPE 4: Configuration PostgreSQL
echo ====================================
echo.
echo IMPORTANT: Vous devez maintenant:
echo 1. Creer la base de donnees PostgreSQL
echo 2. Configurer le mot de passe dans .env
echo.
set /p create_db="Voulez-vous creer la base de donnees maintenant? (o/n): "
if /i "%create_db%"=="o" (
    call create-database.bat
)

echo.
echo ====================================
echo   ETAPE 5: Configuration du mot de passe
echo ====================================
echo.
set /p config_pass="Voulez-vous configurer le mot de passe PostgreSQL dans .env? (o/n): "
if /i "%config_pass%"=="o" (
    set /p db_password="Entrez le mot de passe PostgreSQL: "
    powershell -Command "(Get-Content .env) -replace 'DB_PASSWORD=', 'DB_PASSWORD=%db_password%' | Set-Content .env"
    echo [OK] Mot de passe configure
)

echo.
echo ====================================
echo   ETAPE 6: Migrations de la base de donnees
echo ====================================
echo.
set /p run_migrate="Voulez-vous executer les migrations maintenant? (o/n): "
if /i "%run_migrate%"=="o" (
    echo Creation de la table pour les queues...
    php artisan queue:table
    
    echo.
    echo Execution des migrations...
    php artisan migrate
    if errorlevel 1 (
        echo [ERREUR] Echec des migrations
        echo Verifiez votre configuration PostgreSQL dans .env
    ) else (
        echo [OK] Migrations executees avec succes
    )
)

echo.
echo ====================================
echo   Installation Terminee!
echo ====================================
echo.
echo Prochaines etapes:
echo 1. Verifiez la configuration dans .env
echo 2. Demarrez le serveur: php artisan serve
echo 3. Testez l'API: http://localhost:8000/api/resources
echo.
echo Pour demarrer le worker de queue (nouveau terminal):
echo   php artisan queue:work
echo.
pause

