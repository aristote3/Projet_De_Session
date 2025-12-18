# ============================================
# YouManage Backend - Laravel Dockerfile (Simplified for Render)
# ============================================
FROM php:8.2-cli

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

# Copy composer.json first for caching
COPY composer.json ./

# Install dependencies (skip scripts to avoid errors during build)
# Use --ignore-platform-reqs to avoid platform requirement issues (PHP version)
RUN composer install --no-dev --no-scripts --optimize-autoloader --ignore-platform-reqs --no-interaction || \
    composer update --no-dev --no-scripts --optimize-autoloader --ignore-platform-reqs --no-interaction

# Copy application code
COPY . .

# Disable platform check to avoid PHP version issues
ENV COMPOSER_DISABLE_PLATFORM_CHECK=1

# Set permissions
RUN chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Expose port (Render uses dynamic PORT variable)
EXPOSE ${PORT:-8000}

# Simple startup command
# Hybrid APP_KEY: Generate only if not set in Render environment variables
# Automatically run migrations and start the server
CMD sh -c "if [ -z \"\$APP_KEY\" ]; then php artisan key:generate --force; fi && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=\${PORT:-8000}"
