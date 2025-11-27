# 📋 Comptes de Test - YouManage

## ✅ Utilisateurs Créés dans la Base de Données

Tous les utilisateurs de test ont été créés avec succès dans la base de données.

---

## 👑 Admins (3 comptes)

| Email | Nom | Mot de passe | Rôle |
|-------|-----|--------------|------|
| `admin@youmanage.com` | Admin Principal | `admin123` | admin |
| `aristotebubala4@gmail.com` | Aristote Bubala | `admin123` | admin |
| `superadmin@youmanage.com` | Super Admin | `admin123` | admin |

**Accès** : Dashboard admin complet, gestion des clients, rapports, monitoring, etc.

---

## 👔 Managers / Gérants (4 comptes)

| Email | Nom | Mot de passe | Rôle |
|-------|-----|--------------|------|
| `jean.dupont@acme.com` | Jean Dupont | `manager123` | manager |
| `marie.martin@techstart.com` | Marie Martin | `manager123` | manager |
| `pierre.dubois@globalservices.com` | Pierre Dubois | `manager123` | manager |
| `sophie.bernard@startuphub.com` | Sophie Bernard | `manager123` | manager |

**Accès** : Dashboard manager, gestion des ressources, gestion des utilisateurs de leur organisation, rapports, etc.

---

## 👤 Users / Utilisateurs (8 comptes)

| Email | Nom | Mot de passe | Rôle |
|-------|-----|--------------|------|
| `alice.tremblay@example.com` | Alice Tremblay | `user123` | user |
| `bob.lavoie@example.com` | Bob Lavoie | `user123` | user |
| `claire.gagnon@example.com` | Claire Gagnon | `user123` | user |
| `david.roy@example.com` | David Roy | `user123` | user |
| `emma.leblanc@example.com` | Emma Leblanc | `user123` | user |
| `francois.cote@example.com` | François Côté | `user123` | user |
| `gabrielle.bouchard@example.com` | Gabrielle Bouchard | `user123` | user |
| `henri.pelletier@example.com` | Henri Pelletier | `user123` | user |

**Accès** : Dashboard utilisateur, réservation de ressources, consultation des réservations, profil, etc.

---

## 🚀 Comment Utiliser

### 1. Se Connecter

1. Va sur `http://localhost:5173/login`
2. Entre l'email et le mot de passe d'un des comptes ci-dessus
3. Clique sur "Se connecter"

### 2. Tester les Différents Rôles

**Test Admin** :
- Email : `admin@youmanage.com`
- Mot de passe : `admin123`
- Accès : `/admin` - Dashboard admin complet

**Test Manager** :
- Email : `jean.dupont@acme.com`
- Mot de passe : `manager123`
- Accès : `/manager` - Dashboard manager

**Test User** :
- Email : `alice.tremblay@example.com`
- Mot de passe : `user123`
- Accès : `/dashboard` - Dashboard utilisateur

---

## 🔄 Recréer les Utilisateurs

Si tu veux recréer tous les utilisateurs de test :

```bash
# Option 1 : Via le script batch
backend\seed-test-users.bat

# Option 2 : Via artisan
cd backend
php artisan db:seed --class=TestUsersSeeder
```

---

## 📊 Statistiques

- **Total utilisateurs** : 15
- **Admins** : 3
- **Managers** : 4
- **Users** : 8

---

## 🔐 Sécurité

⚠️ **Important** : Ces comptes sont uniquement pour le développement et les tests.

**En production** :
- Change tous les mots de passe
- Utilise des mots de passe forts
- Active l'authentification à deux facteurs
- Limite l'accès aux comptes admin

---

## ✅ Vérification

Pour vérifier que les utilisateurs ont été créés :

```bash
cd backend
php artisan tinker
```

Puis dans tinker :
```php
// Compter les utilisateurs par rôle
User::where('role', 'admin')->count();
User::where('role', 'manager')->count();
User::where('role', 'user')->count();

// Lister tous les admins
User::where('role', 'admin')->get(['name', 'email']);

// Lister tous les managers
User::where('role', 'manager')->get(['name', 'email']);

// Lister tous les users
User::where('role', 'user')->get(['name', 'email']);
```

---

## 🎯 Prochaines Étapes

Maintenant que les utilisateurs sont créés, tu peux :
1. ✅ Tester l'authentification avec différents rôles
2. ✅ Vérifier que les dashboards s'affichent correctement
3. ✅ Tester les permissions et accès selon les rôles
4. ✅ Créer des ressources et des réservations pour tester le système complet

