# Guide de Dépannage - Frontend ne se charge pas

## Problème : Vous voyez le HTML brut au lieu de l'application React

Si vous voyez ceci dans votre navigateur :
```html
<div id="root"></div>
```

Cela signifie que React ne se charge pas correctement.

## Solutions

### 1. Vérifier que le serveur est démarré

**Dans le terminal, vous devriez voir :**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

Si vous ne voyez pas cela, démarrez le serveur :
```bash
cd frontend/react-app
npm run dev
```

### 2. Vérifier la console du navigateur (IMPORTANT)

1. Ouvrez votre navigateur
2. Appuyez sur **F12** (ou clic droit → Inspecter)
3. Allez dans l'onglet **Console**
4. Regardez les erreurs en rouge

**Erreurs communes :**

#### "Failed to fetch dynamically imported module"
- **Solution** : Redémarrez le serveur de développement
```bash
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez
npm run dev
```

#### "Cannot find module" ou "Module not found"
- **Solution** : Réinstallez les dépendances
```bash
cd frontend/react-app
rm -rf node_modules
npm install
npm run dev
```

#### "Uncaught SyntaxError"
- **Solution** : Vérifiez qu'il n'y a pas d'erreurs de syntaxe dans vos fichiers

### 3. Vérifier que les dépendances sont installées

```bash
cd frontend/react-app
npm install
```

### 4. Vider le cache du navigateur

1. Appuyez sur **Ctrl + Shift + R** (ou **Cmd + Shift + R** sur Mac)
2. Ou ouvrez les outils de développement (F12) → Onglet **Network** → Cochez **Disable cache**

### 5. Vérifier le port 3000

Si le port 3000 est déjà utilisé :
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

Si le port est utilisé, modifiez `vite.config.js` :
```js
server: {
  port: 3001, // Changez le port
}
```

### 6. Vérifier les fichiers essentiels

Assurez-vous que ces fichiers existent :
- ✅ `frontend/react-app/src/main.jsx`
- ✅ `frontend/react-app/src/App.jsx`
- ✅ `frontend/react-app/index.html`
- ✅ `frontend/react-app/package.json`

### 7. Réinstaller complètement

Si rien ne fonctionne :
```bash
cd frontend/react-app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Vérification rapide

**Dans la console du navigateur (F12), vous devriez voir :**
- ✅ Pas d'erreurs en rouge
- ✅ Le message "VITE" dans la console
- ✅ Les requêtes réseau vers `/src/main.jsx` réussissent (statut 200)

**Si vous voyez des erreurs, copiez-les et cherchez la solution correspondante ci-dessus.**

