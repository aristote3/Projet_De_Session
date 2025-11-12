# Projet_De_Session - Équipe 14

## 📅 BookingSystem - Système de Réservation

### Description
BookingSystem est une plateforme web moderne et intuitive de gestion de réservations. Le système permet aux organisations de gérer efficacement la réservation de ressources (salles de conférence, équipements, véhicules, services) avec un calendrier interactif et des outils d'administration complets.

## 🌟 Fonctionnalités principales

### 1. Tableau de Bord
- Statistiques en temps réel (réservations du jour, ressources disponibles, revenus)
- Activité récente et notifications
- Actions rapides pour une navigation efficace
- Indicateurs de performance

### 2. Gestion des Réservations
- **Création de réservations** avec vérification automatique de conflits
- **Réservations récurrentes** (quotidiennes, hebdomadaires, mensuelles)
- **Système d'approbation** multi-niveaux
- Filtrage avancé par statut, période et ressource
- Modification et annulation de réservations
- Statuts: En attente, Approuvé, Rejeté, Annulé

### 3. Catalogue de Ressources
- Gestion complète des ressources avec photos et descriptions
- Catégorisation (Salles, Équipements, Véhicules, Services)
- Tarification flexible (Gratuit, Horaire, Forfait)
- Informations détaillées (capacité, équipements, disponibilité)
- Filtrage et recherche avancée

### 4. Calendrier Interactif
- Vues multiples (Mois, Semaine, Jour)
- Visualisation des réservations approuvées
- Navigation intuitive
- Création rapide de réservations par clic
- Légende colorée par statut

### 5. Administration
- **Gestion des utilisateurs** avec quotas et permissions
- **Approbations** de réservations en attente
- **Rapports et statistiques** (fréquentation, revenus, utilisation)
- **Paramètres système** (règles de réservation, notifications, politiques)
- Audit trail complet

## 🛠️ Technologies utilisées

### Frontend
- **HTML5** - Structure sémantique moderne
- **CSS3** - Design responsive avec variables CSS et animations
- **JavaScript ES6+** - Logique métier et interactions

### Fonctionnalités techniques
- Architecture modulaire et maintenable
- Gestion d'état côté client
- Détection de conflits temporels
- Réservations récurrentes avec gestion d'exceptions
- Interface responsive (mobile, tablette, desktop)
- Système de notifications
- Filtrage et recherche en temps réel

## 📁 Structure du projet

```
Projet_De_Session/
│
├── src/
│   └── index.html          # Interface principale
│
├── css/
│   ├── style.css           # Styles principaux
│   └── responsive.css      # Styles responsifs
│
├── js/
│   └── script.js           # Logique JavaScript
│
├── docs/
│   ├── CONTRIBUTING.md
│   ├── DEVOIR_HAMECONNAGE.md
│   └── captures/
│       └── README_CAPTURES.md
│
└── README.md               # Ce fichier
```

## 🚀 Installation et Utilisation

### Prérequis
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Aucune installation de logiciel supplémentaire requise

### Installation

1. **Cloner le repository**
  ```bash
  git clone https://github.com/aristote3/Projet_De_Session.git
  cd Projet_De_Session
  ```

2. **Ouvrir l'application**
   - Ouvrir le fichier `src/index.html` dans votre navigateur
   - Ou utiliser un serveur local (recommandé):
     ```bash
     # Avec Python 3
     python -m http.server 8000
     
     # Avec Node.js (http-server)
     npx http-server
     ```
   - Accéder à `http://localhost:8000/src/index.html`

### Utilisation

#### Navigation
- Utilisez le menu principal pour naviguer entre les sections:
  - **Dashboard**: Vue d'ensemble et statistiques
  - **Réservations**: Gestion des réservations
  - **Ressources**: Catalogue des ressources
  - **Calendrier**: Vue calendrier
  - **Administration**: Outils d'administration

#### Créer une réservation
1. Cliquer sur "➕ Nouvelle Réservation"
2. Sélectionner une ressource
3. Renseigner l'utilisateur et les horaires
4. Option: Activer la récurrence pour des réservations répétitives
5. Soumettre le formulaire

#### Gérer les ressources
1. Accéder à la section "Ressources"
2. Cliquer sur "➕ Ajouter une ressource"
3. Remplir les informations (nom, catégorie, tarification, équipements)
4. Enregistrer

#### Approuver des réservations
1. Accéder à "Administration" > "Approbations"
2. Consulter les réservations en attente
3. Approuver ou rejeter selon les besoins

## 🎯 Défis techniques résolus

### 1. Gestion des conflits
- Algorithme de détection de chevauchement temporel
- Vérification en temps réel lors de la création/modification
- Messages d'erreur explicites

### 2. Réservations récurrentes
- Génération automatique de séries
- Support des fréquences quotidiennes, hebdomadaires, mensuelles
- Vérification de conflits pour chaque occurrence

### 3. Interface responsive
- Design adaptatif pour tous les écrans
- Optimisation mobile (navigation, formulaires, tableaux)
- Media queries pour tablettes et smartphones

### 4. Gestion d'état
- Stockage de données côté client
- Mise à jour dynamique de l'interface
- Synchronisation des statistiques en temps réel

## 👥 Équipe de développement

- **Baltha Jonel Bula Bula**
- **Bajoudjoum abidé**
- **Dushime Anne Ciella**
- **Bubala Aristote**
- **Coly Claude Raphael**

## 📝 Cours
**Projet_De_Session** - Développement Web

## 🔮 Évolutions futures

### Fonctionnalités planifiées
- [ ] Backend avec API REST (Spring Boot ou Laravel)
- [ ] Base de données PostgreSQL
- [ ] Authentification et autorisation
- [ ] Intégration calendriers externes (Google Calendar, Outlook)
- [ ] Notifications email/SMS automatiques
- [ ] Système de paiement en ligne
- [ ] Export de rapports (PDF, Excel)
- [ ] Application mobile (React Native / Flutter)
- [ ] Gestion des listes d'attente automatiques
- [ ] Intelligence artificielle pour optimisation des réservations

### Améliorations techniques
- [ ] Tests unitaires et d'intégration
- [ ] CI/CD avec GitHub Actions
- [ ] Docker pour le déploiement
- [ ] Cache et optimisation des performances
- [ ] Accessibilité WCAG 2.1
- [ ] Internationalisation (i18n)

## 📄 Licence
Ce projet est développé dans le cadre du projet Projet_De_Session.

## 📧 Contact
Pour toute question ou suggestion, veuillez contacter l'équipe via le repository GitHub.

---

**© 2025 BookingSystem - Projet_De_Session | Équipe 14**