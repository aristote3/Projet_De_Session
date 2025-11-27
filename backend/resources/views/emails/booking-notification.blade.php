@extends('emails.layouts.base')

@section('title', 'Notification de Réservation')

@section('content')
    <div style="text-align: center;">
        @if($type === 'created')
            <div class="icon-circle icon-info">🕐</div>
            <span class="status-badge status-info">En attente d'approbation</span>
        @elseif($type === 'approved')
            <div class="icon-circle icon-success">✓</div>
            <span class="status-badge status-success">Réservation Approuvée</span>
        @elseif($type === 'rejected')
            <div class="icon-circle icon-error">✕</div>
            <span class="status-badge status-error">Réservation Refusée</span>
        @elseif($type === 'cancelled')
            <div class="icon-circle icon-warning">⚠</div>
            <span class="status-badge status-warning">Réservation Annulée</span>
        @endif
    </div>

    <p class="greeting">Bonjour {{ $booking->user->name }},</p>
    
    <p class="message">
        @if($type === 'created')
            Votre demande de réservation a été <strong>créée avec succès</strong> et est actuellement en attente d'approbation. 
            Vous recevrez une notification dès qu'un administrateur aura traité votre demande.
        @elseif($type === 'approved')
            Bonne nouvelle ! Votre réservation a été <strong>approuvée</strong>. 
            Vous pouvez maintenant profiter de votre créneau réservé.
        @elseif($type === 'rejected')
            Nous sommes désolés de vous informer que votre réservation a été <strong>refusée</strong>.
            @if(isset($reason) && $reason)
                <br><br><strong>Raison :</strong> {{ $reason }}
            @endif
        @elseif($type === 'cancelled')
            Votre réservation a été <strong>annulée</strong>.
            @if(isset($reason) && $reason)
                <br><br><strong>Raison :</strong> {{ $reason }}
            @endif
        @endif
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
        @if($type === 'approved')
            <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/calendar" class="cta-button">
                Voir mon calendrier
            </a>
        @elseif($type === 'rejected' || $type === 'cancelled')
            <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/resources" class="cta-button">
                Nouvelle réservation
            </a>
        @else
            <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/bookings" class="cta-button">
                Voir mes réservations
            </a>
        @endif
    </div>
@endsection
