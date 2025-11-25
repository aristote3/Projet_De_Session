# BookingSystem Backend

Backend Laravel avec PostgreSQL pour le système de gestion de réservations.

## Installation

```bash
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

## Configuration

Configurer `.env` avec vos identifiants PostgreSQL.

## API Endpoints

- `/api/resources` - Gestion des ressources
- `/api/bookings` - Gestion des réservations  
- `/api/calendar/events` - Événements calendrier

