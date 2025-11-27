# 🔐 Guide : Créer des Administrateurs

## Méthode 1 : Via Seeder (Recommandé pour le setup initial)

Crée des admins par défaut dans la base de données.

```bash
cd backend
php artisan db:seed --class=AdminSeeder
```

**Admins créés par défaut :**
- `admin@youmanage.com` / `admin123`
- `admin@example.com` / `password123`
- `superadmin@example.com` / `password123`

## Méthode 2 : Via Commande Artisan (Recommandé)

Crée un admin interactivement ou avec des options.

### Mode interactif :
```bash
cd backend
php artisan admin:create
```

### Avec options :
```bash
php artisan admin:create --name="Mon Admin" --email="admin@test.com" --password="secret123"
```

## Méthode 3 : Via Tinker (Rapide)

```bash
cd backend
php artisan tinker
```

Puis dans Tinker :
```php
$admin = App\Models\User::create([
    'name' => 'Admin Test',
    'email' => 'admin@test.com',
    'password' => Hash::make('password123'),
    'role' => 'admin',
    'status' => 'active',
]);
echo "Admin créé: {$admin->email}";
exit
```

## Méthode 4 : Via SQL Direct

```sql
INSERT INTO users (name, email, password, role, status, created_at, updated_at)
VALUES (
    'Admin',
    'admin@example.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'admin',
    'active',
    NOW(),
    NOW()
);
```

## Méthode 5 : Via Script Batch (Windows)

Double-clique sur `backend/create-admin.bat` ou exécute :
```bash
cd backend
create-admin.bat
```

## Vérifier les Admins Créés

### Via Commande Artisan (Recommandé) :
```bash
cd backend
php artisan admin:list
```

### Via Tinker :
```bash
cd backend
php artisan tinker
```

```php
$admins = App\Models\User::where('role', 'admin')->get(['id', 'name', 'email', 'role']);
$admins->each(fn($a) => print("{$a->id}: {$a->name} ({$a->email})\n"));
exit
```

## Utiliser les Admins

Une fois créés, tu peux te connecter avec ces identifiants dans le frontend :
- Email : `admin@youmanage.com`
- Mot de passe : `admin123`

## Notes

- Les mots de passe sont hashés avec bcrypt
- Le rôle doit être exactement `'admin'` (minuscules)
- Le statut doit être `'active'` pour pouvoir se connecter
- Les emails doivent être uniques

