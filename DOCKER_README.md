# 🐳 YouManage - Configuration Docker

Lancez YouManage avec une seule commande grâce à Docker !

## 📋 Prérequis

- **Docker Desktop** - [Télécharger ici](https://www.docker.com/products/docker-desktop/)

C'est tout ! Pas besoin d'installer PHP, Node, MySQL, ou quoi que ce soit d'autre.

---

## 🚀 Démarrage Rapide

### 1. Démarrer tous les services

```bash
docker-compose up -d
```

Le premier lancement prend environ 3-5 minutes pour télécharger les images et installer les dépendances.

### 2. Accéder à l'application

| Service | URL | Description |
|---------|-----|-------------|
| 🌐 **Frontend** | http://localhost:5173 | Application React |
| 🔌 **Backend API** | http://localhost:8001 | API Laravel |
| 🔭 **Telescope** | http://localhost:8001/telescope | Débogage Laravel |
| 🗄️ **phpMyAdmin** | http://localhost:8080 | Gestion de la base de données |
| 📧 **Mailhog** | http://localhost:8025 | Test des emails |

### 3. Identifiants par défaut

**Base de données (phpMyAdmin) :**
- Serveur : mysql
- Utilisateur : `youmanage`
- Mot de passe : `youmanage`
- Base de données : `youmanage`

**Compte Administrateur :**
- Email : `admin@youmanage.com`
- Mot de passe : `admin123`

---

## 🛠️ Commandes Utiles

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Arrêter les services
```bash
docker-compose down
```

### Reconstruire après des modifications
```bash
docker-compose up -d --build
```

### Exécuter des commandes Artisan (Laravel)
```bash
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
docker-compose exec backend php artisan cache:clear
```

### Exécuter des commandes npm (React)
```bash
docker-compose exec frontend npm install <package>
docker-compose exec frontend npm run build
```

### Accéder au terminal d'un conteneur
```bash
# Backend (Laravel)
docker-compose exec backend bash

# Frontend (React)
docker-compose exec frontend sh

# MySQL
docker-compose exec mysql mysql -u youmanage -p
```

---

## 📊 Vue d'ensemble des Services

```
┌─────────────────────────────────────────────────────────────┐
│                      Réseau Docker                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │    │   Backend    │    │    MySQL     │  │
│  │   (React)    │───▶│  (Laravel)   │───▶│ Base données │  │
│  │  Port: 5173  │    │  Port: 8001  │    │  Port: 3306  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                             │                    ▲          │
│                             │                    │          │
│                             ▼                    │          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Mailhog    │    │    Redis     │    │  phpMyAdmin  │  │
│  │   (Emails)   │    │   (Cache)    │    │ (Admin BDD)  │  │
│  │  Port: 8025  │    │  Port: 6379  │    │  Port: 8080  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Résolution de Problèmes

### Port déjà utilisé
```bash
# Vérifier quel processus utilise le port
lsof -i :8001
lsof -i :5173

# Arrêter le processus en conflit ou modifier les ports dans docker-compose.yml
```

### Le conteneur ne démarre pas
```bash
# Voir les logs détaillés
docker-compose logs backend

# Reconstruire depuis zéro
docker-compose down -v
docker-compose up -d --build
```

### Problèmes de connexion à la base de données
```bash
# Attendre que MySQL soit prêt
docker-compose exec backend php artisan migrate:status

# Réinitialiser la base de données
docker-compose exec backend php artisan migrate:fresh --seed
```

### Tout effacer et recommencer (option nucléaire)
```bash
docker-compose down -v --rmi all
docker system prune -af
```

---

## 📁 Structure des Fichiers

```
Projet_De_Session/
├── docker-compose.yml      # Fichier principal d'orchestration
├── backend/
│   ├── Dockerfile          # Configuration du conteneur Laravel
│   └── .dockerignore       # Fichiers à exclure
├── frontend/
│   └── react-app/
│       ├── Dockerfile      # Configuration du conteneur React
│       └── .dockerignore   # Fichiers à exclure
└── docker/
    └── mysql/
        └── init.sql        # Initialisation de la base de données
```

---

## 📝 Variables d'Environnement

Les variables d'environnement sont configurées directement dans `docker-compose.yml`. 
Pour un déploiement en production, créez un fichier `.env` à la racine du projet :

```env
# Base de données
MYSQL_ROOT_PASSWORD=votre_mot_de_passe_root
MYSQL_DATABASE=youmanage
MYSQL_USER=youmanage
MYSQL_PASSWORD=votre_mot_de_passe

# Application
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:votre_cle_secrete

# API
VITE_API_URL=https://votre-domaine.com/api
```

---

## 🎉 C'est tout !

Vous avez maintenant une application YouManage entièrement conteneurisée.
Partagez le projet avec n'importe qui - ils n'ont besoin que de Docker pour le lancer !

### Support

En cas de problème :
1. Vérifiez les logs : `docker-compose logs -f`
2. Consultez la documentation Laravel/React
3. Ouvrez une issue sur GitHub
