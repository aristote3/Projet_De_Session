@extends('emails.layouts.base')

@section('title', 'Message de votre Manager')

@section('content')
    <div style="text-align: center;">
        <div class="icon-circle icon-info">📢</div>
        <span class="status-badge status-info">Message Important</span>
    </div>

    <p class="greeting">Bonjour {{ $user->name }},</p>
    
    <p class="message">
        Votre manager <strong>{{ $manager->name }}</strong> 
        @if($manager->organization)
            de <strong>{{ $manager->organization->company_name }}</strong>
        @endif
        vous a envoyé un message :
    </p>

    <div class="details-card" style="background: #f0f9ff; border-color: #0ea5e9;">
        <p style="margin: 0; color: #1e40af; font-size: 16px; line-height: 1.8;">
            {{ $message }}
        </p>
    </div>

    @if($subject)
    <div style="margin: 16px 0;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
            <strong>Sujet :</strong> {{ $subject }}
        </p>
    </div>
    @endif

    <div class="cta-container">
        <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/messages" class="cta-button">
            Voir dans YouManage
        </a>
    </div>

    <p class="message" style="text-align: center; color: #6b7280; font-size: 14px;">
        Ce message a été envoyé via YouManage.<br>
        Connectez-vous pour répondre ou voir plus de détails.
    </p>
@endsection

