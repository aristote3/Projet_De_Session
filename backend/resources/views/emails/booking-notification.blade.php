<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Notification de Réservation</title>
</head>
<body>
    <h2>Notification de Réservation</h2>
    
    <p>Bonjour {{ $booking->user->name }},</p>
    
    @if($type === 'created')
        <p>Votre réservation a été créée avec succès et est en attente d'approbation.</p>
    @elseif($type === 'approved')
        <p>Votre réservation a été approuvée !</p>
    @elseif($type === 'rejected')
        <p>Votre réservation a été rejetée.</p>
    @elseif($type === 'cancelled')
        <p>Votre réservation a été annulée.</p>
    @endif
    
    <h3>Détails de la réservation :</h3>
    <ul>
        <li><strong>Ressource :</strong> {{ $booking->resource->name }}</li>
        <li><strong>Date :</strong> {{ $booking->date->format('d/m/Y') }}</li>
        <li><strong>Heure :</strong> {{ $booking->start_time }} - {{ $booking->end_time }}</li>
        <li><strong>Durée :</strong> {{ $booking->duration }} heures</li>
        @if($booking->notes)
        <li><strong>Notes :</strong> {{ $booking->notes }}</li>
        @endif
    </ul>
    
    <p>Cordialement,<br>L'équipe BookingSystem</p>
</body>
</html>

