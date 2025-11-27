@extends('emails.layouts.base')

@section('title', 'Réservation Confirmée')

@section('content')
    <div style="text-align: center;">
        <div class="icon-circle icon-success">
            ✓
        </div>
        <span class="status-badge status-success">Réservation Confirmée</span>
    </div>

    <p class="greeting">Bonjour {{ $booking->user->name }},</p>
    
    <p class="message">
        Excellente nouvelle ! Votre réservation a été <strong>confirmée avec succès</strong>. 
        Vous trouverez ci-dessous tous les détails de votre réservation.
    </p>

    <div class="details-card">
        <p class="details-title">📋 Détails de la réservation</p>
        
        <div class="detail-row">
            <span class="detail-label">📍 Ressource</span>
            <span class="detail-value">{{ $booking->resource->name }}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">📅 Date</span>
            <span class="detail-value">{{ $booking->date->format('l d F Y') }}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">🕐 Horaire</span>
            <span class="detail-value">{{ $booking->start_time }} - {{ $booking->end_time }}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">⏱️ Durée</span>
            <span class="detail-value">{{ $booking->duration }} heure(s)</span>
        </div>
        
        @if($booking->notes)
        <div class="detail-row">
            <span class="detail-label">📝 Notes</span>
            <span class="detail-value">{{ $booking->notes }}</span>
        </div>
        @endif
        
        <div class="detail-row">
            <span class="detail-label">🔖 Référence</span>
            <span class="detail-value">#{{ str_pad($booking->id, 6, '0', STR_PAD_LEFT) }}</span>
        </div>
    </div>

    <div class="cta-container">
        <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/bookings" class="cta-button">
            Voir mes réservations
        </a>
    </div>

    <p class="message" style="text-align: center; color: #6b7280;">
        Nous avons hâte de vous accueillir !<br>
        N'hésitez pas à nous contacter si vous avez des questions.
    </p>
@endsection
