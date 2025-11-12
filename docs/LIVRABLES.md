# Liste des Livrables - Projet BookingSystem
## Projet_De_Session - Équipe 14

---

## 📋 Vue d'ensemble du projet

**Nom du projet :** BookingSystem - Système de réservation  
**Équipe 14 :**
- Baltha Jonel Bula Bula
- Bajoudjoum abidé
- Dushime Anne Ciella
- Bubala Aristote
- Coly Claude Raphael

---

## 1. Gestion de projet et collaboration

### 1.1. Accès à GitHub
**URL du repository :** https://github.com/aristote3/Projet_De_Session

**Accès :** L'enseignant et les auxiliaires d'enseignement ont un accès "Collaborator" au repository.

#### Critères d'évaluation

**✅ Issues**
- [ ] Utilisation systématique des issues pour le suivi des tâches
- [ ] Chaque issue clairement décrite et assignée
- [ ] Issues liées aux user stories
- [ ] Mise à jour régulière du statut

**✅ Pull Requests (PR)**
- [ ] Toutes les modifications passent par des PR
- [ ] Description claire de chaque PR
- [ ] Lien vers les issues correspondantes
- [ ] Revue de code par au moins un membre de l'équipe
- [ ] Tests passés avant le merge

**✅ Branches**
- [ ] Stratégie de branching : GitHub Flow
  - `main` : branche principale (production)
  - `develop` : branche de développement
  - `feature/*` : branches de fonctionnalités
  - `bugfix/*` : corrections de bugs
  - `hotfix/*` : corrections urgentes

**✅ Historique des commits**
- [ ] Convention de commit : Type(scope): Description
  - `feat`: nouvelle fonctionnalité
  - `fix`: correction de bug
  - `docs`: documentation
  - `style`: formatage du code
  - `refactor`: refactorisation
  - `test`: ajout de tests
  - `chore`: tâches de maintenance

**Exemple :**
```
feat(booking): add recurring booking functionality
fix(calendar): resolve date conflict detection
docs(readme): update installation instructions
```

---

### 1.2. Accès à Jira
**URL de l'instance Jira :** [À compléter - Lien vers Jira]

**Accès :** L'enseignant et les auxiliaires ont un accès en lecture à l'ensemble du projet.

#### Critères d'évaluation

**✅ Product Backlog**
- [ ] Product backlog complet et priorisé
- [ ] User stories avec format : "En tant que [utilisateur], je veux [action] afin de [bénéfice]"
- [ ] Critères d'acceptation clairs pour chaque story
- [ ] Story points estimés

**Exemples de User Stories :**
1. En tant qu'utilisateur, je veux créer une réservation afin de bloquer une ressource
2. En tant qu'administrateur, je veux approuver les réservations afin de valider leur conformité
3. En tant qu'utilisateur, je veux consulter le calendrier afin de voir les disponibilités

**✅ Sprints**
- [ ] Organisation en sprints de 2 semaines
- [ ] Objectifs clairs pour chaque sprint
- [ ] Sprint Planning documenté
- [ ] Sprint Review et Retrospective

**✅ Tableaux de bord**
- [ ] Burndown charts configurés
- [ ] Suivi de la vélocité
- [ ] Tableau Kanban actif
- [ ] Diagramme de flux cumulatif

---

## 2. Documentation et rapports

### 2.1. Rapport des événements Scrum
**Lien :** [docs/SCRUM_EVENTS.md](./SCRUM_EVENTS.md) ou Google Docs partagé

**Contenu attendu :**

#### Sprint Planning
- [ ] Ordre du jour de chaque planning
- [ ] Liste des participants
- [ ] Objectifs du sprint définis
- [ ] Sprint backlog établi
- [ ] Estimation des tâches

#### Daily Scrums
- [ ] Résumé des discussions quotidiennes
- [ ] Ce qui a été fait hier
- [ ] Ce qui sera fait aujourd'hui
- [ ] Obstacles identifiés et suivis

#### Sprint Reviews
- [ ] Démonstrations effectuées
- [ ] Feedbacks reçus et documentés
- [ ] Incréments livrés
- [ ] Ajustements du product backlog

#### Sprint Retrospectives
- [ ] Ce qui a bien fonctionné
- [ ] Ce qui doit être amélioré
- [ ] Actions d'amélioration identifiées
- [ ] Suivi des actions précédentes

---

### 2.2. Documentation technique

#### ✅ ARCHITECTURE.md
**Localisation :** [docs/ARCHITECTURE.md](./ARCHITECTURE.md)

**Contenu :**
- [ ] Architecture globale de l'application
- [ ] Diagrammes d'architecture (MVC/Frontend-Backend)
- [ ] Choix technologiques justifiés
  - Frontend : HTML5, CSS3, JavaScript ES6+
  - Backend : (À venir) Spring Boot / Laravel
  - Base de données : (À venir) PostgreSQL
- [ ] Description des principaux composants
- [ ] Flux de données
- [ ] Patterns utilisés

#### ✅ DEFINITION_OF_DONE.md
**Localisation :** [docs/DEFINITION_OF_DONE.md](./DEFINITION_OF_DONE.md)

**Critères de "Done" :**
- [ ] Code écrit et fonctionnel
- [ ] Tests unitaires passés (couverture > 80%)
- [ ] Tests d'intégration validés
- [ ] Revue de code effectuée et approuvée
- [ ] Documentation mise à jour
- [ ] Aucun bug critique ou bloquant
- [ ] Interface responsive testée
- [ ] Performance acceptable
- [ ] Code conforme aux standards de l'équipe
- [ ] Déployé en environnement de test
- [ ] Validation par le Product Owner

#### ✅ Critères d'acceptation
**Localisation :** Intégrés dans chaque user story Jira

**Format :**
```
GIVEN [contexte initial]
WHEN [action effectuée]
THEN [résultat attendu]
```

**Exemple pour "Créer une réservation" :**
```
GIVEN Je suis connecté comme utilisateur
WHEN Je remplis le formulaire de réservation avec une ressource, une date et un horaire valides
THEN La réservation est créée avec le statut "En attente"
AND Une notification est envoyée à l'administrateur
AND La ressource apparaît occupée dans le calendrier
```

---

### 2.3. Rapport technique de projet
**Format :** PDF, 10 pages maximum  
**Localisation :** [docs/RAPPORT_TECHNIQUE.pdf](./RAPPORT_TECHNIQUE.pdf)

**Structure du rapport :**

1. **Introduction** (1 page)
   - Présentation du projet BookingSystem
   - Contexte et objectifs

2. **Choix du thème** (1 page)
   - Pourquoi un système de réservation ?
   - Problématiques identifiées
   - Valeur ajoutée de la solution

3. **Étapes de réalisation** (2 pages)
   - Méthodologie Agile/Scrum adoptée
   - Sprints et jalons principaux
   - Répartition des tâches

4. **Technologies et architecture** (2 pages)
   - Stack technique choisie
   - Architecture de l'application
   - Justification des choix technologiques

5. **Difficultés rencontrées** (2 pages)
   - Gestion des conflits de réservation
   - Implémentation des réservations récurrentes
   - Synchronisation calendrier
   - Solutions apportées

6. **État de l'art** (1 page)
   - Recherche sur les systèmes existants
   - Comparaison avec des solutions commerciales
   - Innovations et différenciateurs

7. **Recommandations et améliorations** (1 page)
   - Fonctionnalités futures
   - Optimisations possibles
   - Évolutions technologiques
   - Leçons apprises

---

## 3. Code source et application

### 3.1. Code source
**Repository :** https://github.com/aristote3/Projet_De_Session

#### Critères d'évaluation

**✅ Qualité du code**
- [ ] Respect des conventions de nommage
- [ ] Code commenté et documenté
- [ ] Fonctions modulaires et réutilisables
- [ ] Pas de code dupliqué
- [ ] Gestion des erreurs appropriée
- [ ] Sécurité (validation des inputs, protection XSS)

**✅ Tests**
- [ ] Tests unitaires (Jest/Mocha)
- [ ] Tests d'intégration
- [ ] Tests fonctionnels (Selenium/Cypress)
- [ ] Couverture de code > 80%
- [ ] Tests automatisés dans CI/CD

**✅ Configuration**
- [ ] Fichiers de configuration pour environnements
  - `config/dev.json`
  - `config/test.json`
  - `config/prod.json`
- [ ] Variables d'environnement (.env)
- [ ] Documentation de configuration

**Structure du code :**
```
Projet_De_Session/
├── src/
│   ├── index.html          # Page principale
│   ├── components/         # Composants réutilisables
│   └── views/              # Vues de l'application
├── css/
│   ├── style.css           # Styles principaux
│   └── responsive.css      # Styles responsifs
├── js/
│   ├── script.js           # Logique principale
│   ├── models/             # Modèles de données
│   ├── controllers/        # Contrôleurs
│   └── utils/              # Fonctions utilitaires
├── tests/
│   ├── unit/               # Tests unitaires
│   ├── integration/        # Tests d'intégration
│   └── e2e/                # Tests end-to-end
├── config/                 # Fichiers de configuration
├── docs/                   # Documentation
└── README.md
```

---

### 3.2. Application déployée
**URL de l'application :** [À compléter après déploiement]

**Options de déploiement :**
- [ ] GitHub Pages (frontend statique)
- [ ] Netlify / Vercel
- [ ] Heroku (avec backend)
- [ ] AWS / Azure (production)

**Critères de déploiement :**
- [ ] Application accessible publiquement
- [ ] HTTPS activé
- [ ] Performance optimale
- [ ] Monitoring en place
- [ ] Logs accessibles

---

## 4. Contrat d'équipe

**Format :** PDF signé par tous les membres  
**Localisation :** [docs/CONTRAT_EQUIPE.pdf](./CONTRAT_EQUIPE.pdf)

### 4.1. Contenu du contrat d'équipe

#### ✅ Répartition des tâches et responsabilités

| Membre | Rôle principal | Responsabilités |
|--------|---------------|-----------------|
| Baltha Jonel Bula Bula | Product Owner | Gestion du backlog, priorisation, validation |
| Bajoudjoum abidé | Scrum Master | Animation des cérémonies, résolution obstacles |
| Dushime Anne Ciella | Lead Frontend | Architecture frontend, UI/UX |
| Bubala Aristote | Lead Backend | Architecture backend, base de données |
| Coly Claude Raphael | QA/DevOps | Tests, CI/CD, déploiement |

**Responsabilités partagées :**
- [ ] Revue de code
- [ ] Documentation
- [ ] Tests
- [ ] Participation aux cérémonies Scrum

#### ✅ Calendrier de travail et échéances internes

**Sprint 1 : [Dates]**
- Mise en place de l'environnement
- Architecture de base
- Authentification

**Sprint 2 : [Dates]**
- Gestion des ressources
- Catalogue et filtres

**Sprint 3 : [Dates]**
- Système de réservation
- Détection de conflits

**Sprint 4 : [Dates]**
- Calendrier interactif
- Réservations récurrentes

**Sprint 5 : [Dates]**
- Administration
- Système d'approbation

**Sprint 6 : [Dates]**
- Tests finaux
- Déploiement
- Documentation

**Jalons importants :**
- [ ] Démo intermédiaire : [Date]
- [ ] Tests utilisateurs : [Date]
- [ ] Livraison finale : [Date]

#### ✅ Modalités de communication

**Outils de communication :**
- **Discord/Teams :** Communication quotidienne et informelle
- **Email :** Communications officielles et avec l'enseignant
- **Jira :** Suivi des tâches et assignations
- **GitHub :** Revues de code et discussions techniques

**Réunions planifiées :**
- **Daily Scrum :** Lundi-Vendredi, 9h00, 15 minutes max
- **Sprint Planning :** Début de sprint, 2 heures
- **Sprint Review :** Fin de sprint, 1 heure
- **Sprint Retrospective :** Fin de sprint, 1 heure
- **Réunion technique :** Mercredi, au besoin

**Canaux d'urgence :**
- Appel/SMS pour urgences critiques
- Message @mention sur Discord pour urgences mineures

#### ✅ Règles de fonctionnement

**Ponctualité et participation :**
- [ ] Arriver à l'heure aux réunions (tolérance 5 min)
- [ ] Prévenir en cas d'absence minimum 24h à l'avance
- [ ] Participation active aux discussions
- [ ] Caméra activée lors des réunions virtuelles

**Disponibilité et contribution :**
- [ ] Minimum 10-12 heures de travail par semaine
- [ ] Réponse aux messages dans les 24 heures
- [ ] Respect des deadlines internes
- [ ] Contribution équitable au code

**Code de conduite :**
- [ ] Respect mutuel et écoute active
- [ ] Communication constructive
- [ ] Partage des connaissances
- [ ] Transparence sur les difficultés

#### ✅ Procédures de résolution de conflits

**Niveau 1 : Discussion directe**
- Les parties concernées discutent en privé
- Recherche d'une solution mutuellement acceptable
- Délai : 48 heures

**Niveau 2 : Médiation par le Scrum Master**
- Le Scrum Master facilite une discussion
- Recherche de compromis
- Documentation des accords
- Délai : 1 semaine

**Niveau 3 : Escalade à l'équipe**
- Discussion en réunion d'équipe
- Vote démocratique si nécessaire
- Décision contraignante pour tous

**Niveau 4 : Recours à l'enseignant**
- Si aucune solution n'est trouvée
- L'enseignant arbitre le conflit
- Décision finale

**Types de conflits anticipés :**
- Désaccord sur les priorités
- Qualité du code
- Charge de travail inégale
- Retards dans les livrables

#### ✅ Critères d'évaluation par les pairs

**Grille d'évaluation (total : 100 points)**

| Critère | Points | Description |
|---------|--------|-------------|
| **Contribution au code** | 25 | Quantité et qualité du code produit |
| **Participation aux réunions** | 15 | Présence et engagement actif |
| **Respect des deadlines** | 15 | Livraison dans les temps |
| **Collaboration** | 15 | Entraide et partage de connaissances |
| **Communication** | 10 | Clarté et réactivité |
| **Initiative** | 10 | Proactivité et résolution de problèmes |
| **Documentation** | 10 | Contribution à la documentation |

**Échelle de notation :**
- 5 : Excellent - Dépasse les attentes
- 4 : Très bien - Atteint pleinement les attentes
- 3 : Bien - Atteint les attentes de base
- 2 : Insuffisant - En dessous des attentes
- 1 : Très insuffisant - Contribution minimale

**Processus d'évaluation :**
1. Évaluation individuelle anonyme à mi-parcours
2. Discussion des résultats en équipe
3. Plan d'amélioration si nécessaire
4. Évaluation finale en fin de projet
5. Remise des notes à l'enseignant

**Signature du contrat :**
- [ ] Baltha Jonel Bula Bula - Date : ___________
- [ ] Bajoudjoum abidé - Date : ___________
- [ ] Dushime Anne Ciella - Date : ___________
- [ ] Bubala Aristote - Date : ___________
- [ ] Coly Claude Raphael - Date : ___________

---

## 5. Format des documents

### ✅ Documents PDF requis

1. **Rapport des événements Scrum**
   - [ ] Format : PDF
   - [ ] Langue : Français
   - [ ] Fichier : `docs/SCRUM_EVENTS.pdf`

2. **Documentation technique**
   - [ ] ARCHITECTURE.pdf
   - [ ] DEFINITION_OF_DONE.pdf
   - [ ] CRITERES_ACCEPTATION.pdf

3. **Rapport technique de projet**
   - [ ] Format : PDF
   - [ ] Maximum : 10 pages
   - [ ] Fichier : `docs/RAPPORT_TECHNIQUE.pdf`

4. **Contrat d'équipe**
   - [ ] Format : PDF signé
   - [ ] Fichier : `docs/CONTRAT_EQUIPE.pdf`

### ✅ Checklist finale de livraison

**Avant la remise finale :**
- [ ] Tous les accès GitHub/Jira fournis à l'enseignant
- [ ] Tous les documents PDF générés et versionnés
- [ ] Application déployée et testée
- [ ] README.md à jour avec toutes les informations
- [ ] Code nettoyé et commenté
- [ ] Tests passent à 100%
- [ ] Documentation technique complète
- [ ] Rapport de projet finalisé
- [ ] Contrat d'équipe signé par tous

---

## 📅 Échéancier de remise

| Livrable | Date limite | Statut |
|----------|-------------|--------|
| Contrat d'équipe | [Date] | ⏳ À faire |
| Accès GitHub/Jira | [Date] | ⏳ À faire |
| Sprint 1 - Demo | [Date] | ⏳ À faire |
| Documentation technique v1 | [Date] | ⏳ À faire |
| Sprint 2 - Demo | [Date] | ⏳ À faire |
| Sprint 3 - Demo | [Date] | ⏳ À faire |
| Rapport intermédiaire | [Date] | ⏳ À faire |
| Sprint 4 - Demo | [Date] | ⏳ À faire |
| Application déployée | [Date] | ⏳ À faire |
| Rapport technique final | [Date] | ⏳ À faire |
| Tous les livrables | [Date] | ⏳ À faire |

---

## 📞 Contact

**Enseignant :** [Nom de l'enseignant]  
**Email :** [Email]

**Équipe 14 - BookingSystem**  
**Repository :** https://github.com/aristote3/Projet_De_Session

---

*Document maintenu à jour par l'équipe 14 - Dernière mise à jour : 5 novembre 2025*
