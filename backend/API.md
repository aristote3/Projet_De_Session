# API Documentation - BookingSystem

## Base URL
```
http://localhost:8000/api
```

## Resources

### GET /api/resources
Liste toutes les ressources.

**Query Parameters:**
- `category` (optional): `salle`, `equipement`, `vehicule`, `service`
- `status` (optional): `available`, `busy`, `maintenance`
- `search` (optional): Recherche par nom/description
- `page` (optional): Numéro de page

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Salle de Conférence A",
      "category": "salle",
      "capacity": 50,
      "description": "Grande salle équipée",
      "pricing_type": "horaire",
      "price": "75.00",
      "status": "available",
      "opening_hours_start": "08:00",
      "opening_hours_end": "18:00"
    }
  ]
}
```

### POST /api/resources
Créer une ressource.

**Body:**
```json
{
  "name": "Salle de Conférence A",
  "category": "salle",
  "capacity": 50,
  "description": "Grande salle équipée",
  "pricing_type": "horaire",
  "price": 75.00,
  "equipments": "Projecteur, WiFi",
  "image_url": "https://example.com/image.jpg",
  "opening_hours_start": "08:00",
  "opening_hours_end": "18:00"
}
```

### GET /api/resources/{id}
Détails d'une ressource.

### PUT /api/resources/{id}
Modifier une ressource.

### DELETE /api/resources/{id}
Supprimer une ressource.

### POST /api/resources/{id}/check-availability
Vérifier la disponibilité.

**Body:**
```json
{
  "date": "2025-11-15",
  "start_time": "09:00",
  "end_time": "12:00"
}
```

**Response:**
```json
{
  "available": true,
  "resource": {...}
}
```

---

## Bookings

### GET /api/bookings
Liste toutes les réservations.

**Query Parameters:**
- `status` (optional): `pending`, `approved`, `rejected`, `cancelled`
- `resource_id` (optional): Filtrer par ressource
- `user_id` (optional): Filtrer par utilisateur
- `date_from` (optional): Date de début
- `date_to` (optional): Date de fin

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "resource_id": 1,
      "user_id": 1,
      "date": "2025-11-15",
      "start_time": "09:00",
      "end_time": "12:00",
      "duration": 3.00,
      "status": "pending",
      "notes": "Réunion importante"
    }
  ]
}
```

### POST /api/bookings
Créer une réservation. Si la ressource n'est pas disponible, peut être ajoutée à la liste d'attente.

**Body:**
```json
{
  "resource_id": 1,
  "user_id": 1,
  "date": "2025-11-15",
  "start_time": "09:00",
  "end_time": "12:00",
  "notes": "Réunion importante",
  "is_recurring": false,
  "recurring_frequency": "weekly",
  "recurring_until": "2025-12-15",
  "add_to_waiting_list": false,
  "priority": 0,
  "required_approval_levels": 1
}
```

**Response:** `201 Created` ou `202 Accepted` (si ajouté à la liste d'attente)

**Si ressource non disponible et `add_to_waiting_list=true`:**
```json
{
  "message": "Resource not available. Added to waiting list.",
  "waiting_list_id": 5
}
```

### GET /api/bookings/{id}
Détails d'une réservation.

### PUT /api/bookings/{id}
Modifier une réservation.

**Body:**
```json
{
  "date": "2025-11-16",
  "start_time": "10:00",
  "end_time": "13:00",
  "notes": "Notes mises à jour"
}
```

### DELETE /api/bookings/{id}
Annuler une réservation.

**Response:**
```json
{
  "message": "Booking cancelled successfully"
}
```

### POST /api/bookings/{id}/approve
Approuver une réservation (admin).

**Response:**
```json
{
  "message": "Booking approved successfully",
  "booking": {...}
}
```

### POST /api/bookings/{id}/reject
Rejeter une réservation (admin).

**Response:**
```json
{
  "message": "Booking rejected"
}
```

---

## Calendar

### GET /api/calendar/events
Obtenir les événements du calendrier avec support de vues multiples (jour/semaine/mois).

**Query Parameters:**
- `view` (optional): `day`, `week`, `month` (défaut: `month`)
- `date` (optional): Date de référence (défaut: aujourd'hui)
- `resource_id` (optional): Filtrer par ressource

**Response:**
```json
{
  "view": "month",
  "date": "2025-11-15",
  "start_date": "2025-11-01",
  "end_date": "2025-11-30",
  "events": [
    {
      "id": 1,
      "title": "Salle de Conférence A - John Doe",
      "start": "2025-11-15T09:00",
      "end": "2025-11-15T12:00",
      "resource": "Salle de Conférence A",
      "resource_id": 1,
      "user": "John Doe",
      "user_id": 1,
      "status": "approved",
      "notes": "Réunion importante"
    }
  ]
}
```

### POST /api/calendar/sync/google
Synchroniser avec Google Calendar.

**Body:**
```json
{
  "booking_id": 1
}
```

**Response:**
```json
{
  "message": "Synced with Google Calendar",
  "event_id": "google_event_id"
}
```

### POST /api/calendar/sync/outlook
Synchroniser avec Outlook Calendar.

**Body:**
```json
{
  "booking_id": 1
}
```

**Response:**
```json
{
  "message": "Synced with Outlook Calendar",
  "event_id": "outlook_event_id"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `422` - Validation Error
- `404` - Not Found
- `500` - Server Error

## Error Response Format

```json
{
  "message": "Error description",
  "errors": {
    "field": ["Error message"]
  }
}
```

---

## Waiting List

### GET /api/waiting-list
Liste des entrées en liste d'attente.

**Query Parameters:**
- `resource_id` (optional): Filtrer par ressource
- `user_id` (optional): Filtrer par utilisateur
- `date` (optional): Filtrer par date

### POST /api/waiting-list
Ajouter une demande à la liste d'attente.

**Body:**
```json
{
  "resource_id": 1,
  "user_id": 1,
  "date": "2025-11-15",
  "start_time": "09:00",
  "end_time": "12:00",
  "priority": 0
}
```

### DELETE /api/waiting-list/{id}
Retirer de la liste d'attente.

### POST /api/waiting-list/{id}/promote
Promouvoir manuellement une entrée en réservation (si disponible).

## Multi-Level Approval

### POST /api/bookings/{id}/approve
Approuver une réservation (support multi-niveaux).

**Body (pour approbation multi-niveaux):**
```json
{
  "approver_id": 2,
  "level": 1,
  "comments": "Approuvé par le manager"
}
```

**Response (si plusieurs niveaux requis):**
```json
{
  "message": "Approval level 1 approved. Waiting for other levels.",
  "approved_levels": 1,
  "required_levels": 3
}
```

## Cancellation Policies

Les politiques d'annulation sont appliquées automatiquement lors de l'annulation. Le système calcule le remboursement selon la politique configurée.

**Response lors de l'annulation:**
```json
{
  "message": "Booking cancelled successfully",
  "refund_amount": 75.00
}
```

## Users

### GET /api/users
Liste tous les utilisateurs.

**Query Parameters:**
- `role` (optional): Filtrer par rôle
- `group` (optional): Filtrer par groupe
- `status` (optional): Filtrer par statut

### POST /api/users
Créer un utilisateur.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "quota": 10,
  "group_ids": [1, 2]
}
```

### GET /api/users/{id}
Obtenir les détails complets d'un utilisateur (profil, groupes, crédits, abonnement, historique).

### PUT /api/users/{id}
Modifier un utilisateur.

### PUT /api/users/{id}/profile
Mettre à jour le profil utilisateur.

**Body:**
```json
{
  "phone": "+1234567890",
  "department": "IT",
  "position": "Developer",
  "preferred_language": "fr",
  "timezone": "America/Montreal",
  "theme": "dark"
}
```

### GET /api/users/{id}/history
Obtenir l'historique des réservations.

### POST /api/users/{id}/credits
Ajouter des crédits à un utilisateur.

**Body:**
```json
{
  "amount": 100.00,
  "type": "purchase",
  "expires_at": "2025-12-31",
  "source": "payment",
  "notes": "Achat de crédits"
}
```

### GET /api/users/{id}/credits
Obtenir les crédits disponibles.

### PUT /api/users/{id}/subscription
Créer ou mettre à jour un abonnement.

**Body:**
```json
{
  "plan_type": "premium",
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "auto_renew": true,
  "monthly_limit": 50,
  "features": ["unlimited_bookings", "priority_support"]
}
```

### PUT /api/users/{id}/notifications
Mettre à jour les préférences de notification.

**Body:**
```json
{
  "notification_type": "booking_created",
  "email_enabled": true,
  "sms_enabled": false,
  "push_enabled": true,
  "frequency": "immediate",
  "quiet_hours_start": "22:00",
  "quiet_hours_end": "08:00"
}
```

### GET /api/users/{id}/permissions
Obtenir toutes les permissions (directes + groupes).

## Groups

### GET /api/groups
Liste tous les groupes.

### POST /api/groups
Créer un groupe.

**Body:**
```json
{
  "name": "Developers",
  "description": "Groupe des développeurs",
  "quota": 20,
  "max_booking_duration": 8,
  "advance_booking_days": 30,
  "permission_ids": [1, 2, 3]
}
```

### GET /api/groups/{id}
Détails d'un groupe.

### PUT /api/groups/{id}
Modifier un groupe.

### POST /api/groups/{id}/users
Ajouter des utilisateurs au groupe.

**Body:**
```json
{
  "user_ids": [1, 2, 3]
}
```

### POST /api/groups/{id}/permissions
Ajouter des permissions au groupe.

**Body:**
```json
{
  "permission_ids": [1, 2, 3]
}
```

## Admin

### GET /api/admin/dashboard
Obtenir les statistiques du tableau de bord.

**Query Parameters:**
- `period` (optional): `day`, `week`, `month`, `year` (default: `month`)

**Response:**
```json
{
  "period": "month",
  "bookings": {
    "total": 150,
    "approved": 120,
    "pending": 20,
    "cancelled": 10
  },
  "resources": {
    "total": 25,
    "available": 20,
    "busy": 3,
    "maintenance": 2
  },
  "users": {
    "total": 50,
    "active": 45,
    "with_bookings": 30
  },
  "revenue": {
    "total": 15000.00
  },
  "utilization": {
    "average": 75.5,
    "top_5": [...]
  }
}
```

### GET /api/admin/reports/attendance
Rapport de fréquentation.

**Query Parameters:**
- `start_date` (optional): Date de début
- `end_date` (optional): Date de fin
- `group_by` (optional): `day`, `week`, `month`

### GET /api/admin/reports/revenue
Rapport de revenus.

**Query Parameters:**
- `start_date` (optional): Date de début
- `end_date` (optional): Date de fin

**Response:**
```json
{
  "revenue": {
    "total": 15000.00,
    "by_resource": [...],
    "by_category": [...]
  }
}
```

### GET /api/admin/reports/utilization
Statistiques d'utilisation.

**Query Parameters:**
- `start_date` (optional): Date de début
- `end_date` (optional): Date de fin

### GET /api/admin/conflicts
Liste des conflits et exceptions.

**Query Parameters:**
- `status` (optional): `pending`, `resolved`, `escalated`
- `conflict_type` (optional): `time_overlap`, `resource_unavailable`, `quota_exceeded`, `other`

### POST /api/admin/conflicts/{id}/resolve
Résoudre un conflit.

**Body:**
```json
{
  "resolution_type": "manual",
  "resolution_notes": "Résolu manuellement"
}
```

### GET /api/admin/business-rules
Liste des règles métier.

### POST /api/admin/business-rules
Créer une règle métier.

**Body:**
```json
{
  "name": "Auto-approve for managers",
  "category": "approval",
  "rule_type": "auto_approve",
  "conditions": [
    {
      "field": "user.role",
      "operator": "equals",
      "value": "manager"
    }
  ],
  "actions": [
    {
      "type": "auto_approve",
      "params": {}
    }
  ],
  "priority": 10,
  "is_active": true
}
```

### PUT /api/admin/business-rules/{id}
Modifier une règle métier.

### GET /api/admin/audit-trail
Piste d'audit complète.

**Query Parameters:**
- `user_id` (optional): Filtrer par utilisateur
- `action` (optional): Filtrer par action
- `model_type` (optional): Filtrer par type de modèle
- `start_date` (optional): Date de début
- `end_date` (optional): Date de fin

## Examples

### Créer une ressource
```bash
curl -X POST http://localhost:8000/api/resources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Salle Test",
    "category": "salle",
    "capacity": 20,
    "pricing_type": "gratuit"
  }'
```

### Créer une réservation
```bash
curl -X POST http://localhost:8000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "resource_id": 1,
    "user_id": 1,
    "date": "2025-11-15",
    "start_time": "09:00",
    "end_time": "12:00"
  }'
```

### Lister les ressources
```bash
curl http://localhost:8000/api/resources
```

