# 🐳 YouManage - Docker Setup

Run YouManage with a single command using Docker!

## 📋 Prerequisites

- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)

That's it! No need to install PHP, Node, MySQL, or anything else.

---

## 🚀 Quick Start

### 1. Start all services

```bash
docker-compose up -d
```

First run takes ~3-5 minutes to download images and install dependencies.

### 2. Access the application

| Service | URL | Description |
|---------|-----|-------------|
| 🌐 **Frontend** | http://localhost:5173 | React Application |
| 🔌 **Backend API** | http://localhost:8001 | Laravel API |
| 🔭 **Telescope** | http://localhost:8001/telescope | Laravel Debugging |
| 🗄️ **phpMyAdmin** | http://localhost:8080 | Database Management |
| 📧 **Mailhog** | http://localhost:8025 | Email Testing |

### 3. Default Credentials

**Database (phpMyAdmin):**
- Server: mysql
- User: `youmanage`
- Password: `youmanage`
- Database: `youmanage`

**Admin Account:**
- Email: `admin@youmanage.com`
- Password: `admin123`

---

## 🛠️ Common Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop services
```bash
docker-compose down
```

### Rebuild after changes
```bash
docker-compose up -d --build
```

### Run artisan commands
```bash
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
docker-compose exec backend php artisan cache:clear
```

### Run npm commands
```bash
docker-compose exec frontend npm install <package>
docker-compose exec frontend npm run build
```

### Access container shell
```bash
# Backend (Laravel)
docker-compose exec backend bash

# Frontend (React)
docker-compose exec frontend sh

# MySQL
docker-compose exec mysql mysql -u youmanage -p
```

---

## 📊 Services Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Network                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Frontend   │    │   Backend    │    │    MySQL     │  │
│  │  (React)     │───▶│  (Laravel)   │───▶│   Database   │  │
│  │  Port: 5173  │    │  Port: 8001  │    │  Port: 3306  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                             │                    ▲          │
│                             │                    │          │
│                             ▼                    │          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Mailhog    │    │    Redis     │    │  phpMyAdmin  │  │
│  │  (Emails)    │    │   (Cache)    │    │  (DB Admin)  │  │
│  │  Port: 8025  │    │  Port: 6379  │    │  Port: 8080  │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :8001
lsof -i :5173

# Stop the conflicting process or change ports in docker-compose.yml
```

### Container won't start
```bash
# View detailed logs
docker-compose logs backend

# Rebuild from scratch
docker-compose down -v
docker-compose up -d --build
```

### Database connection issues
```bash
# Wait for MySQL to be ready
docker-compose exec backend php artisan migrate:status

# Reset database
docker-compose exec backend php artisan migrate:fresh --seed
```

### Clear all Docker data (nuclear option)
```bash
docker-compose down -v --rmi all
docker system prune -af
```

---

## 📁 File Structure

```
Projet_De_Session/
├── docker-compose.yml      # Main orchestration file
├── backend/
│   ├── Dockerfile          # Laravel container config
│   └── .dockerignore       # Files to exclude
├── frontend/
│   └── react-app/
│       ├── Dockerfile      # React container config
│       └── .dockerignore   # Files to exclude
└── docker/
    └── mysql/
        └── init.sql        # Database initialization
```

---

## 🎉 That's it!

You now have a fully containerized YouManage application.
Share the project with anyone - they just need Docker to run it!

