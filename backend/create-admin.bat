@echo off
chcp 65001 >nul
echo ========================================
echo   YouManage - Creation d'Administrateur
echo ========================================
echo.

cd /d "%~dp0"

REM Vérifier si PHP est disponible
where php >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] PHP n'est pas installe ou n'est pas dans le PATH
    echo Veuillez installer PHP et l'ajouter au PATH
    pause
    exit /b 1
)

echo Choisissez une option:
echo.
echo 1. Creer un admin interactivement
echo 2. Creer les admins par defaut (via seeder)
echo 3. Lister tous les admins existants
echo.
set /p choice="Votre choix (1-3): "

if "%choice%"=="1" (
    echo.
    echo Creation interactive d'un admin...
    php artisan admin:create
) else if "%choice%"=="2" (
    echo.
    echo Creation des admins par defaut...
    php artisan db:seed --class=AdminSeeder
) else if "%choice%"=="3" (
    echo.
    echo Liste des admins:
    php artisan tinker --execute="App\Models\User::where('role', 'admin')->get(['id', 'name', 'email', 'role'])->each(function(\$a) { echo \$a->id . ': ' . \$a->name . ' (' . \$a->email . ')' . PHP_EOL; });"
) else (
    echo Choix invalide!
)

echo.
echo ========================================
pause

