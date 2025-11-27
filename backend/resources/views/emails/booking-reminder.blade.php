@extends('emails.layouts.base')

@section('title', 'Rappel de Réservation')

@section('content')
    <div style="text-align: center;">
        <div class="icon-circle icon-warning">⏰</div>
        <span class="status-badge status-warning">Rappel</span>
    </div>

    <p class="greeting">Bonjour {{ $booking->user->name }},</p>
    
    <p class="message">
        Nous vous rappelons que vous avez une <strong>réservation prévue</strong> 
        @if($hoursUntil <= 1)
            dans <strong>moins d'une heure</strong>.
        @elseif($hoursUntil <= 24)
            <strong>aujourd'hui</strong>.
        @else
            <strong>demain</strong>.
        @endif
    </p>

    <div class="details-card">
        <p class="details-title">📋 Votre réservation</p>
        
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
        
        @if($booking->resource->location)
        <div class="detail-row">
            <span class="detail-label">📌 Lieu</span>
            <span class="detail-value">{{ $booking->resource->location }}</span>
        </div>
        @endif
        
        <div class="detail-row">
            <span class="detail-label">🔖 Référence</span>
            <span class="detail-value">#{{ str_pad($booking->id, 6, '0', STR_PAD_LEFT) }}</span>
        </div>
    </div>

    <div style="background: #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0; text-align: center;">
        <p style="margin: 0; color: #92400e; font-weight: 500;">
            ⚠️ N'oubliez pas d'arriver à l'heure !
        </p>
    </div>

    <div class="cta-container">
        <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/calendar" class="cta-button">
            Voir mon calendrier
        </a>
    </div>

    <p class="message" style="text-align: center; color: #6b7280; font-size: 14px;">
        Besoin d'annuler ou modifier ? Connectez-vous à votre espace YouManage.
    </p>
@endsection

