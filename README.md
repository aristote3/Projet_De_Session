# YouManage - Système de Réservation Moderne

Système complet de gestion de réservations avec backend Laravel et frontend React moderne.

## 🚀 Démarrage Rapide

### Option 1 : Démarrage Automatique (Recommandé)
```bash
start.bat
```
Démarre automatiquement les deux serveurs (frontend + backend).

### Option 2 : Démarrage Séparé
```bash
# Backend
start-backend.bat

# Frontend (dans un autre terminal)
start-frontend.bat
```

### URLs
- **Frontend** : http://localhost:5173
- **Backend API** : http://127.0.0.1:8001/api
- **Backend Root** : http://127.0.0.1:8001

---

## 📁 Structure

```
Projet_De_Session/
├── frontend/
│   └── react-app/         # Application React 18+ avec Ant Design
│       ├── src/           # Code source React
│       └── package.json
│
├── backend/               # Application backend Laravel
│   ├── app/              # Code application
│   ├── database/         # Migrations et Seeders
│   ├── routes/           # Routes API
│   └── config/           # Configuration (CORS, etc.)
│
├── start.bat             # Script principal (démarre les 2 serveurs)
├── start-frontend.bat    # Démarrage frontend seul
├── start-backend.bat     # Démarrage backend seul
└── README.md            # Cette documentation
```

---

## 👥 Comptes de Test

Voir `COMPTES_TEST.md` pour la liste complète des comptes créés.

**Comptes rapides** :
- **Admin** : `admin@youmanage.com` / `admin123`
- **Manager** : `jean.dupont@acme.com` / `manager123`
- **User** : `alice.tremblay@example.com` / `user123`

Pour créer plus d'utilisateurs :
```bash
backend\seed-test-users.bat
```

---

## 🔧 Dépannage

### Port 8001 Occupé
Si tu vois l'erreur `Failed to listen on 127.0.0.1:8001` :
```bash
# Solution automatique
backend\fix-port-8001.bat

# Ou démarre avec gestion automatique
backend\start-server-safe.bat
```

Le script `start.bat` gère automatiquement ce problème.

### Frontend ne se charge pas
1. Vérifie que le serveur est démarré (voir message VITE dans le terminal)
2. Vérifie la console du navigateur (F12) pour les erreurs
3. Vide le cache : `Ctrl + Shift + R`
4. Réinstalle les dépendances :
   ```bash
   cd frontend/react-app
   rm -rf node_modules
   npm install
   ```

---

## 🛠️ Technologies

### Frontend
- **React 18+** - Framework UI moderne
- **Ant Design** - Bibliothèque de composants
- **FullCalendar** - Calendrier interactif
- **Redux Toolkit** - Gestion d'état
- **Formik** - Formulaires avec validation
- **Vite** - Build tool (port 5173)

### Backend
- **Laravel 10** - Framework PHP
- **MySQL** - Base de données
- **Laravel Sanctum** - Authentification API (port 8001)
- **REST API** - API RESTful

---

## 📦 Installation

### Prérequis
- **Frontend** : Node.js 16+, npm
- **Backend** : PHP 8.1+, Composer, MySQL

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
php artisan db:seed
php artisan serve
```

---

## 📚 Documentation

- **Comptes de test** : `COMPTES_TEST.md`
- **Création d'admin** : `backend/CREATE_ADMIN.md`
- **Seeders** : `backend/README_SEEDERS.md`

---

## ✅ Fonctionnalités

- ✅ Authentification réelle avec base de données
- ✅ Gestion des rôles (Admin, Manager, User)
- ✅ Réservation de ressources
- ✅ Calendrier interactif
- ✅ Dashboard par rôle
- ✅ API REST complète
