<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Confirmation de Réservation</title>
</head>
<body>
    <h2>✓ Réservation Confirmée</h2>
    
    <p>Bonjour {{ $booking->user->name }},</p>
    
    <p>Votre réservation a été confirmée avec succès !</p>
    
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
    
    <p>Nous vous attendons !</p>
    
    <p>Cordialement,<br>L'équipe BookingSystem</p>
</body>
</html>

