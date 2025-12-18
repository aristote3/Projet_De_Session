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

# Copy composer files first for caching
COPY composer.json composer.lock ./

# Install dependencies (skip scripts to avoid errors during build)
RUN composer install --no-dev --no-scripts --optimize-autoloader

# Copy application code
COPY . .

# Run composer scripts after copying code
RUN composer dump-autoload --optimize

# Set permissions
RUN chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Expose port (Render uses dynamic PORT variable)
EXPOSE ${PORT:-8000}

# Simple startup command
# Note: Migrations and key generation should be done manually via Render shell after first deploy
CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
