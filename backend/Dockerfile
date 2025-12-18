# ============================================
# YouManage Backend - Laravel Dockerfile
# ============================================
FROM php:8.2-fpm

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    default-mysql-client \
    libpq-dev \
    postgresql-client \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd zip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create necessary directories
RUN mkdir -p /var/www/html/storage/framework/{sessions,views,cache} \
    && mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/bootstrap/cache

# Copy composer files first for caching
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-scripts --no-autoloader --prefer-dist

# Copy application code
COPY . .

# Generate autoloader
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Create entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Create directories if they dont exist\n\
mkdir -p /var/www/html/storage/framework/{sessions,views,cache}\n\
mkdir -p /var/www/html/storage/logs\n\
mkdir -p /var/www/html/bootstrap/cache\n\
\n\
# Fix permissions\n\
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache\n\
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache\n\
\n\
# Create .env file if it doesn't exist\n\
if [ ! -f /var/www/html/.env ]; then\n\
    cat > /var/www/html/.env << EOF\n\
APP_NAME=${APP_NAME:-YouManage}\n\
APP_ENV=${APP_ENV:-production}\n\
APP_KEY=${APP_KEY:-}\n\
APP_DEBUG=${APP_DEBUG:-false}\n\
APP_URL=${APP_URL:-http://127.0.0.1:${PORT:-8000}}\n\
LOG_CHANNEL=stack\n\
LOG_LEVEL=${LOG_LEVEL:-info}\n\
DB_CONNECTION=${DB_CONNECTION:-pgsql}\n\
DB_HOST=\${DB_HOST:-localhost}\n\
DB_PORT=\${DB_PORT:-5432}\n\
DB_DATABASE=\${DB_DATABASE:-youmanage}\n\
DB_USERNAME=\${DB_USERNAME:-youmanage}\n\
DB_PASSWORD=\${DB_PASSWORD:-}\n\
BROADCAST_DRIVER=log\n\
CACHE_DRIVER=${CACHE_DRIVER:-file}\n\
FILESYSTEM_DISK=local\n\
QUEUE_CONNECTION=sync\n\
SESSION_DRIVER=${SESSION_DRIVER:-file}\n\
SESSION_LIFETIME=120\n\
MAIL_MAILER=smtp\n\
MAIL_HOST=${MAIL_HOST:-smtp.mailtrap.io}\n\
MAIL_PORT=${MAIL_PORT:-2525}\n\
MAIL_USERNAME=${MAIL_USERNAME:-null}\n\
MAIL_PASSWORD=${MAIL_PASSWORD:-null}\n\
MAIL_ENCRYPTION=${MAIL_ENCRYPTION:-null}\n\
MAIL_FROM_ADDRESS=${MAIL_FROM_ADDRESS:-"hello@example.com"}\n\
MAIL_FROM_NAME=${MAIL_FROM_NAME:-"YouManage"}\n\
SANCTUM_STATEFUL_DOMAINS=${SANCTUM_STATEFUL_DOMAINS:-localhost}\n\
SESSION_DOMAIN=${SESSION_DOMAIN:-localhost}\n\
FRONTEND_URL=${FRONTEND_URL:-http://localhost:5173}\n\
EOF\n\
fi\n\
\n\
# Wait for database (PostgreSQL or MySQL)\n\
echo "Waiting for database..."\n\
if [ "$DB_CONNECTION" = "pgsql" ]; then\n\
    until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" 2>/dev/null; do\n\
        sleep 1\n\
    done\n\
    echo "PostgreSQL is ready!"\n\
else\n\
    until mysqladmin ping -h"$DB_HOST" -u"$DB_USERNAME" -p"$DB_PASSWORD" --skip-ssl --silent 2>/dev/null; do\n\
        sleep 1\n\
    done\n\
    echo "MySQL is ready!"\n\
fi\n\
\n\
# Generate app key if not set in .env file\n\
APP_KEY_FROM_FILE=$(grep "^APP_KEY=" /var/www/html/.env | cut -d '=' -f2- | tr -d '\n')\n\
if [ -z "$APP_KEY_FROM_FILE" ] || [ "$APP_KEY_FROM_FILE" = "base64:randomkeyhere123456789012345678901234=" ]; then\n\
    php artisan key:generate --force\n\
fi\n\
\n\
# Run migrations\n\
php artisan migrate --force\n\
\n\
# Clear and cache config\n\
php artisan config:clear\n\
php artisan cache:clear\n\
php artisan route:clear\n\
php artisan view:clear\n\
\n\
# Start PHP-FPM or artisan serve\n\
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8000}\n\
' > /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port (Render utilise une variable PORT dynamique)
EXPOSE ${PORT:-8000}

# Start application
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

