# YouManage - Système de Réservation Moderne

Système complet de gestion de réservations avec backend Laravel et frontend React moderne.

## Structure

```
Projet_De_Session/
├── frontend/              # Application frontend React
│   └── react-app/         # Application React 18+ avec Ant Design
│       ├── src/           # Code source React
│       └── package.json
│
├── backend/               # Application backend Laravel
│   ├── app/              # Code application
│   ├── database/         # Migrations PostgreSQL
│   ├── routes/           # Routes API
│   ├── docs/             # Documentation API
│   └── create-env.bat    # Configuration
│
└── start-*.bat            # Scripts de démarrage
```

## Technologies

### Frontend
- **React 18+** - Framework UI moderne
- **Ant Design** - Bibliothèque de composants
- **FullCalendar** - Calendrier interactif
- **Redux Toolkit** - Gestion d'état
- **Formik** - Formulaires avec validation
- **Vite** - Build tool

### Backend
- **Laravel 10+** - Framework PHP
- **PostgreSQL** - Base de données
- **Laravel Queue** - Tâches asynchrones
- **REST API** - API RESTful

## Démarrage rapide

### Option 1 : Démarrer les deux serveurs
```bash
start-servers.bat
```

### Option 2 : Démarrer séparément

**Frontend React :**
```bash
start-frontend.bat
```
Ouvrir : http://localhost:3000

**Backend Laravel :**
```bash
start-backend.bat
```
API : http://localhost:8000/api

## Installation

### Frontend
```bash
cd frontend/react-app
npm install
npm run dev
```

### Backend
```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Documentation

- **API Backend** : `backend/docs/API.md`
- **Frontend** : `frontend/README.md`

## Prérequis

- **Frontend** : Node.js 16+, npm
- **Backend** : PHP 8.1+, Composer, PostgreSQL
