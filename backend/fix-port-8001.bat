@echo off
chcp 65001 >nul
echo ========================================
echo   YouManage - Liberation du Port 8001
echo ========================================
echo.

cd /d %~dp0

echo [1/3] Recherche des processus utilisant le port 8001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8001 ^| findstr LISTENING') do (
    set PID=%%a
    echo [2/3] Processus trouve: PID %%a
    echo [3/3] Arret du processus...
    taskkill /PID %%a /F >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Processus arrete avec succes
    ) else (
        echo [ERREUR] Impossible d'arreter le processus (peut-etre deja arrete)
    )
)

echo.
echo Verification du port 8001...
timeout /t 2 /nobreak >nul
netstat -ano | findstr :8001 | findstr LISTENING >nul
if %ERRORLEVEL% EQU 0 (
    echo [ATTENTION] Le port 8001 est toujours utilise
    echo Essayez de redemarrer le serveur manuellement
) else (
    echo [OK] Le port 8001 est maintenant libre
    echo.
    echo Vous pouvez maintenant demarrer le serveur avec:
    echo   php artisan serve --host=127.0.0.1 --port=8001
)

echo.
echo Appuyez sur une touche pour fermer...
pause >nul

