@echo off
echo Creation du fichier .env...

if exist .env (
    echo Le fichier .env existe deja.
    set /p overwrite="Voulez-vous le remplacer? (o/n): "
    if /i not "%overwrite%"=="o" (
        echo Annule.
        exit /b 0
    )
)

(
echo APP_NAME=BookingSystem
echo APP_ENV=local
echo APP_KEY=
echo APP_DEBUG=true
echo APP_TIMEZONE=UTC
echo APP_URL=http://localhost:8000
echo.
echo LOG_CHANNEL=stack
echo LOG_LEVEL=debug
echo.
echo DB_CONNECTION=pgsql
echo DB_HOST=127.0.0.1
echo DB_PORT=5432
echo DB_DATABASE=bookingsystem
echo DB_USERNAME=postgres
echo DB_PASSWORD=
echo.
echo BROADCAST_DRIVER=log
echo CACHE_DRIVER=file
echo FILESYSTEM_DISK=local
echo QUEUE_CONNECTION=database
echo SESSION_DRIVER=file
echo SESSION_LIFETIME=120
echo.
echo MAIL_MAILER=smtp
echo MAIL_HOST=mailpit
echo MAIL_PORT=1025
echo MAIL_USERNAME=null
echo MAIL_PASSWORD=null
echo MAIL_ENCRYPTION=null
echo MAIL_FROM_ADDRESS="hello@example.com"
echo MAIL_FROM_NAME="${APP_NAME}"
echo.
echo TWILIO_SID=
echo TWILIO_AUTH_TOKEN=
echo TWILIO_PHONE_NUMBER=
echo.
echo GOOGLE_CLIENT_ID=
echo GOOGLE_CLIENT_SECRET=
echo GOOGLE_REDIRECT_URI=http://localhost:8000/api/calendar/google/callback
echo.
echo MICROSOFT_CLIENT_ID=
echo MICROSOFT_CLIENT_SECRET=
echo MICROSOFT_REDIRECT_URI=http://localhost:8000/api/calendar/outlook/callback
echo.
echo FRONTEND_URL=http://localhost:3000
) > .env

echo Fichier .env cree avec succes!
echo.
echo IMPORTANT: Modifiez DB_PASSWORD dans .env avec votre mot de passe PostgreSQL

