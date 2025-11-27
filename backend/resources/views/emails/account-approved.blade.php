@extends('emails.layouts.base')

@section('title', 'Compte Approuvé')

@section('content')
    <div style="text-align: center;">
        <div class="icon-circle icon-success">🎉</div>
        <span class="status-badge status-success">Compte Approuvé</span>
    </div>

    <p class="greeting">Félicitations {{ $user->name }} !</p>
    
    <p class="message">
        Nous avons le plaisir de vous informer que votre demande de compte <strong>Manager</strong> 
        a été <strong>approuvée</strong> par notre équipe d'administration.
    </p>

    <p class="message">
        Vous pouvez maintenant vous connecter à YouManage et commencer à gérer vos ressources, 
        utilisateurs et réservations.
    </p>

    <div class="details-card">
        <p class="details-title">🔐 Vos informations de connexion</p>
        
        <div class="detail-row">
            <span class="detail-label">📧 Email</span>
            <span class="detail-value">{{ $user->email }}</span>
        </div>
        
        <div class="detail-row">
            <span class="detail-label">👤 Rôle</span>
            <span class="detail-value">Manager</span>
        </div>
        
        @if($user->organization)
        <div class="detail-row">
            <span class="detail-label">🏢 Organisation</span>
            <span class="detail-value">{{ $user->organization->company_name }}</span>
        </div>
        @endif
    </div>

    <div class="cta-container">
        <a href="{{ config('app.frontend_url', 'http://localhost:5173') }}/login" class="cta-button">
            Se connecter maintenant
        </a>
    </div>

    <p class="message" style="text-align: center; color: #6b7280;">
        Bienvenue dans la famille YouManage !<br>
        Nous sommes ravis de vous compter parmi nous.
    </p>
@endsection

