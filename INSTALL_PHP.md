# Installation de PHP sur Windows

## Option 1 : Installer PHP manuellement (Recommandé)

### Étape 1 : Télécharger PHP
1. Allez sur https://windows.php.net/download/
2. Téléchargez la version **PHP 8.1** ou supérieure (Thread Safe)
3. Extrayez le fichier ZIP dans `C:\php`

### Étape 2 : Ajouter PHP au PATH
1. Ouvrez **Paramètres Windows** → **Système** → **À propos** → **Paramètres système avancés**
2. Cliquez sur **Variables d'environnement**
3. Dans **Variables système**, sélectionnez **Path** et cliquez sur **Modifier**
4. Cliquez sur **Nouveau** et ajoutez : `C:\php`
5. Cliquez sur **OK** pour fermer toutes les fenêtres

### Étape 3 : Vérifier l'installation
Ouvrez un **nouveau terminal** et tapez :
```bash
php -v
```

### Étape 4 : Activer les extensions nécessaires
1. Dans `C:\php`, copiez `php.ini-development` et renommez-le en `php.ini`
2. Ouvrez `php.ini` avec un éditeur de texte
3. Décommentez (enlevez le `;`) ces lignes :
   ```
   extension=pdo_pgsql
   extension=pgsql
   extension=curl
   extension=mbstring
   extension=openssl
   extension=fileinfo
   ```

## Option 2 : Utiliser XAMPP (Plus simple)

### Installation
1. Téléchargez XAMPP : https://www.apachefriends.org/download.html
2. Installez XAMPP (par défaut dans `C:\xampp`)

### Ajouter au PATH
1. Ouvrez **Paramètres Windows** → **Système** → **À propos** → **Paramètres système avancés**
2. Cliquez sur **Variables d'environnement**
3. Dans **Variables système**, sélectionnez **Path** et cliquez sur **Modifier**
4. Cliquez sur **Nouveau** et ajoutez : `C:\xampp\php`
5. Cliquez sur **OK** pour fermer toutes les fenêtres

### Vérifier
Ouvrez un **nouveau terminal** et tapez :
```bash
php -v
```

## Option 3 : Utiliser Laragon (Recommandé pour développement)

1. Téléchargez Laragon : https://laragon.org/download/
2. Installez Laragon (inclut PHP, MySQL, PostgreSQL, etc.)
3. PHP sera automatiquement dans le PATH

## Après l'installation

Une fois PHP installé, vous devez aussi installer **Composer** :

1. Téléchargez Composer : https://getcomposer.org/download/
2. Exécutez l'installateur
3. Vérifiez avec : `composer --version`

Ensuite, dans le dossier `backend`, exécutez :
```bash
composer install
```

