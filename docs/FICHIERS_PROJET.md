# 📋 Fichiers du Projet BookingSystem - Système de réservation

## Date de mise à jour : 5 novembre 2025

---

## 📁 Structure complète du projet

```
Projet_De_Session/
│
├── src/
│   └── index.html              ✅ Mis à jour - Interface principale complète
│
├── css/
│   ├── style.css               ✅ Mis à jour - Styles principaux (1000+ lignes)
│   └── responsive.css          ✅ Mis à jour - Styles responsifs pour mobile/tablette
│
├── js/
│   └── script.js               ✅ Mis à jour - Logique JavaScript complète (800+ lignes)
│
├── docs/
│   ├── CONTRIBUTING.md         ⚪ Existant
│   ├── DEVOIR_HAMECONNAGE.md   ⚪ Existant
│   ├── FICHIERS_PROJET.md      ✅ Nouveau - Ce fichier
│   └── captures/
│       └── README_CAPTURES.md  ⚪ Existant
│
├── README.md                   ✅ Mis à jour - Documentation complète du projet
└── .gitignore                  ⚪ Existant
```

---

## 📄 Détails des fichiers mis à jour

### 1. **src/index.html** ✅

**Taille :** ~500 lignes  
**Dernière modification :** 5 novembre 2025  

**Contenu :**
- Structure HTML5 sémantique complète
- Header avec navigation responsive
- 5 vues principales :
  - Dashboard (statistiques, activité récente)
  - Réservations (tableau, filtres, formulaire)
  - Ressources (catalogue avec cartes)
  - Calendrier (vue mensuelle interactive)
  - Administration (utilisateurs, approbations, rapports, paramètres)
- 2 modals (réservations et ressources)
- Footer avec informations de l'équipe

**Fonctionnalités clés :**
- Navigation par onglets
- Formulaires de création/modification
- Tableaux de données interactifs
- Calendrier mensuel
- Système de filtrage
- Interface responsive

---

### 2. **css/style.css** ✅

**Taille :** ~1050 lignes  
**Dernière modification :** 5 novembre 2025  

**Contenu :**
- Variables CSS pour le thème
- Reset et styles de base
- Header et navigation
- Cartes statistiques animées
- Tableaux de données
- Modals et overlays
- Formulaires stylisés
- Grille de ressources
- Calendrier interactif
- Onglets d'administration
- Footer
- Classes utilitaires
- Animations et transitions

**Palette de couleurs :**
- Primary: `#2563eb` (Bleu)
- Success: `#10b981` (Vert)
- Warning: `#f59e0b` (Orange)
- Danger: `#ef4444` (Rouge)
- Dark: `#1e293b`

---

### 3. **css/responsive.css** ✅

**Taille :** ~300 lignes  
**Dernière modification :** 5 novembre 2025  

**Contenu :**
- Media queries pour tablettes (≤1024px)
- Media queries pour mobiles (≤768px)
- Media queries pour petits mobiles (≤480px)
- Styles pour mode paysage
- Styles pour impression

**Breakpoints :**
- Desktop: > 1024px
- Tablette: 768px - 1024px
- Mobile: 480px - 768px
- Petit mobile: < 480px

---

### 4. **js/script.js** ✅

**Taille :** ~850 lignes  
**Dernière modification :** 5 novembre 2025  

**Contenu :**

#### Structures de données :
- `resources[]` - Catalogue des ressources (salles, équipements, véhicules, services)
- `bookings[]` - Liste des réservations
- `users[]` - Base d'utilisateurs

#### Fonctions principales :

**Navigation :**
- `initializeApp()` - Initialisation de l'application
- `setupNavigation()` - Configuration du menu
- `switchView(viewName)` - Changement de vue
- `switchTab(tabName)` - Changement d'onglet admin

**Dashboard :**
- `loadDashboard()` - Chargement du tableau de bord
- `updateStatistics()` - Mise à jour des statistiques
- `loadRecentActivity()` - Activité récente

**Réservations :**
- `loadBookings()` - Affichage des réservations
- `createBooking(data)` - Création de réservation
- `hasConflict(data)` - Détection de conflits
- `createRecurringBookings(data)` - Réservations récurrentes
- `editBooking(id)` - Modification
- `cancelBooking(id)` - Annulation
- `approveBooking(id)` - Approbation
- `rejectBooking(id)` - Rejet

**Ressources :**
- `loadResources()` - Affichage du catalogue
- `getFilteredResources()` - Filtrage
- `bookResource(id)` - Réservation rapide
- `editResource(id)` - Modification

**Calendrier :**
- `renderCalendar()` - Rendu du calendrier mensuel
- `selectCalendarDay(date)` - Sélection d'un jour
- Navigation mois précédent/suivant

**Administration :**
- `loadAdminData()` - Chargement des données admin
- `loadUsersTable()` - Table des utilisateurs
- `loadApprovals()` - Liste des approbations

**Modals :**
- `openBookingModal()` - Ouverture modal réservation
- `closeBookingModalFunc()` - Fermeture modal réservation
- `openResourceModal()` - Ouverture modal ressource
- `closeResourceModalFunc()` - Fermeture modal ressource

**Formulaires :**
- `setupForms()` - Configuration des formulaires
- Validation des données
- Gestion de la récurrence

**Filtres :**
- `setupFilters()` - Configuration des filtres
- `getFilteredBookings()` - Filtrage des réservations
- `getFilteredResources()` - Filtrage des ressources

**Utilitaires :**
- `formatDate(dateString)` - Formatage de date
- `getStatusText(status)` - Texte du statut
- `getCategoryText(category)` - Texte de catégorie
- `getIconForCategory(category)` - Icône par catégorie
- `getColorForCategory(category)` - Couleur par catégorie

---

### 5. **README.md** ✅

**Taille :** ~350 lignes  
**Dernière modification :** 5 novembre 2025  

**Contenu :**
- Description du projet
- Fonctionnalités principales détaillées
- Technologies utilisées
- Structure du projet
- Instructions d'installation
- Guide d'utilisation
- Défis techniques résolus
- Informations sur l'équipe
- Évolutions futures planifiées
- Licence et contact

---

## 🎯 Fonctionnalités implémentées

### ✅ Tableau de bord (Dashboard)
- 4 cartes statistiques en temps réel
- Activité récente
- Actions rapides
- Indicateurs de performance

### ✅ Gestion des réservations
- Création avec formulaire complet
- Détection automatique de conflits
- Réservations récurrentes (quotidien/hebdomadaire/mensuel)
- Modification et annulation
- Filtrage par statut, période, ressource
- Recherche en temps réel
- Statuts : Pending, Approved, Rejected, Cancelled

### ✅ Catalogue de ressources
- Cartes visuelles avec informations
- Catégories : Salles, Équipements, Véhicules, Services
- Tarification flexible (Gratuit, Horaire, Forfait)
- Filtrage par catégorie et disponibilité
- Recherche en temps réel
- Actions rapides (Réserver, Modifier)

### ✅ Calendrier interactif
- Vue mensuelle avec grille
- Navigation entre les mois
- Affichage des réservations approuvées
- Création rapide par clic sur jour
- Légende colorée par statut
- Bouton "Aujourd'hui"

### ✅ Administration
- **Utilisateurs :** Gestion complète avec quotas
- **Approbations :** Validation des réservations
- **Rapports :** Statistiques et graphiques
- **Paramètres :** Configuration du système

### ✅ Interface responsive
- Adaptation tablette (≤1024px)
- Adaptation mobile (≤768px)
- Adaptation petit mobile (≤480px)
- Mode paysage optimisé
- Styles d'impression

---

## 🛠️ Technologies utilisées

### Frontend
- **HTML5** - Structure sémantique
- **CSS3** - Design moderne avec variables CSS
- **JavaScript ES6+** - Logique métier

### Fonctionnalités techniques
- Architecture modulaire
- Gestion d'état côté client
- Détection de conflits temporels
- Algorithme de réservations récurrentes
- Filtrage et recherche en temps réel
- Interface responsive complète
- Animations et transitions CSS
- Modal system
- Event delegation

---

## 📊 Statistiques du projet

| Métrique | Valeur |
|----------|--------|
| Fichiers HTML | 1 |
| Fichiers CSS | 2 |
| Fichiers JavaScript | 1 |
| Lignes de code HTML | ~500 |
| Lignes de code CSS | ~1350 |
| Lignes de code JavaScript | ~850 |
| **Total lignes de code** | **~2700** |
| Vues principales | 5 |
| Modals | 2 |
| Formulaires | 3 |
| Tableaux de données | 2 |
| Ressources d'exemple | 4 |
| Réservations d'exemple | 3 |
| Utilisateurs d'exemple | 3 |

---

## 🚀 Comment utiliser les fichiers

### Installation
```bash
# Cloner le repository
git clone https://github.com/aristote3/Projet_De_Session.git
cd Projet_De_Session
```

### Lancement
```bash
# Option 1 : Ouvrir directement
# Double-cliquer sur src/index.html

# Option 2 : Serveur local avec Python
python -m http.server 8000
# Accéder à http://localhost:8000/src/index.html

# Option 3 : Serveur local avec Node.js
npx http-server
# Accéder à http://localhost:8080/src/index.html
```

### Développement
- Modifier `src/index.html` pour la structure
- Modifier `css/style.css` pour les styles
- Modifier `css/responsive.css` pour le responsive
- Modifier `js/script.js` pour la logique
- Rafraîchir le navigateur pour voir les changements

---

## 👥 Équipe de développement

- **Baltha Jonel Bula Bula**
- **Bajoudjoum abidé**
- **Dushime Anne Ciella**
- **Bubala Aristote**
- **Coly Claude Raphael**

---

## 📝 Notes importantes

### Données d'exemple
Tous les fichiers utilisent actuellement des données statiques définies dans `js/script.js`. Pour une version production :
- Implémenter un backend (Spring Boot, Laravel, Node.js)
- Connecter à une base de données (PostgreSQL, MySQL)
- Créer des APIs REST
- Ajouter l'authentification

### Évolutions futures recommandées
1. Backend avec API REST
2. Base de données PostgreSQL
3. Authentification JWT
4. Notifications email/SMS
5. Intégration calendriers externes
6. Tests automatisés
7. Déploiement cloud
8. Application mobile

---

## 📄 Licence

Projet développé dans le cadre du projet **Projet_De_Session** - Développement Web

**© 2025 BookingSystem - Projet_De_Session | Équipe 14**

---

**Dernière mise à jour :** 5 novembre 2025  
**Version :** 1.0.0  
**Statut :** ✅ Complet et fonctionnel
