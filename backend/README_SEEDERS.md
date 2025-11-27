# 🌱 Seeders - Base de Données

## 📋 Seeders Disponibles

### 1. AdminSeeder
Crée les administrateurs par défaut.

**Commande** :
```bash
php artisan db:seed --class=AdminSeeder
```

### 2. TestUsersSeeder
Crée tous les utilisateurs de test (admins, managers, users).

**Commande** :
```bash
php artisan db:seed --class=TestUsersSeeder
```

**Ou via le script batch** :
```bash
backend\seed-test-users.bat
```

### 3. DatabaseSeeder
Exécute tous les seeders configurés.

**Commande** :
```bash
php artisan db:seed
```

---

## 🔄 Réinitialiser la Base de Données

Pour réinitialiser complètement la base de données avec les seeders :

```bash
php artisan migrate:fresh --seed
```

⚠️ **Attention** : Cela supprime toutes les données existantes !

---

## 📊 Utilisateurs Créés

Voir `COMPTES_TEST.md` pour la liste complète des comptes de test.

