@echo off
echo ====================================
echo   Creation de la base de donnees PostgreSQL
echo ====================================
echo.

set /p dbname="Nom de la base de donnees [bookingsystem]: "
if "%dbname%"=="" set dbname=bookingsystem

set /p dbuser="Utilisateur PostgreSQL [postgres]: "
if "%dbuser%"=="" set dbuser=postgres

echo.
echo Creation de la base de donnees: %dbname%
echo.

psql -U %dbuser% -c "CREATE DATABASE %dbname%;" 2>nul
if errorlevel 1 (
    echo.
    echo [ERREUR] Impossible de creer la base de donnees
    echo.
    echo Solutions possibles:
    echo 1. Verifiez que PostgreSQL est demarre
    echo 2. Verifiez que l'utilisateur %dbuser% existe
    echo 3. Entrez le mot de passe si demande
    echo.
    echo Vous pouvez aussi creer la base manuellement:
    echo   psql -U postgres
    echo   CREATE DATABASE %dbname%;
    echo   \q
) else (
    echo.
    echo [SUCCES] Base de donnees '%dbname%' creee avec succes!
    echo.
    echo N'oubliez pas de configurer le mot de passe dans .env
)

pause

