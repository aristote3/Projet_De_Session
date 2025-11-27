@echo off
chcp 65001 >nul
echo ========================================
echo   YouManage - Creation des Utilisateurs de Test
echo ========================================
echo.

cd /d %~dp0

echo [1/2] Execution du seeder...
php artisan db:seed --class=TestUsersSeeder

echo.
echo ========================================
echo   Utilisateurs crees avec succes!
echo ========================================
echo.
echo Comptes crees:
echo   - Admins: 3
echo   - Managers: 4
echo   - Users: 8
echo.
echo Mots de passe par defaut:
echo   - Admins: admin123
echo   - Managers: manager123
echo   - Users: user123
echo.
echo Appuyez sur une touche pour fermer...
pause >nul

