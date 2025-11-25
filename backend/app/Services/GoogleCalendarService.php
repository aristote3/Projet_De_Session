<?php

namespace App\Services;

use App\Models\Booking;
use Google_Client;
use Google_Service_Calendar;
use Google_Service_Calendar_Event;
use Google_Service_Calendar_EventDateTime;
use Illuminate\Support\Facades\Log;

class GoogleCalendarService
{
    protected $client;
    protected $service;

    public function __construct()
    {
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');

        if (!$clientId || !$clientSecret) {
            Log::warning('Google Calendar credentials not configured');
            return;
        }

        $this->client = new Google_Client();
        $this->client->setClientId($clientId);
        $this->client->setClientSecret($clientSecret);
        $this->client->setRedirectUri(config('services.google.redirect_uri'));
        $this->client->addScope(Google_Service_Calendar::CALENDAR);
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');

        $this->service = new Google_Service_Calendar($this->client);
    }

    /**
     * Create event in Google Calendar
     */
    public function createEvent(Booking $booking): ?string
    {
        if (!$this->service) {
            return null;
        }

        try {
            $event = new Google_Service_Calendar_Event([
                'summary' => $booking->resource->name,
                'description' => "Réservation pour {$booking->user->name}\n" . ($booking->notes ?? ''),
                'start' => new Google_Service_Calendar_EventDateTime([
                    'dateTime' => $booking->date->format('Y-m-d') . 'T' . $booking->start_time . ':00',
                    'timeZone' => config('app.timezone', 'UTC'),
                ]),
                'end' => new Google_Service_Calendar_EventDateTime([
                    'dateTime' => $booking->date->format('Y-m-d') . 'T' . $booking->end_time . ':00',
                    'timeZone' => config('app.timezone', 'UTC'),
                ]),
            ]);

            $createdEvent = $this->service->events->insert('primary', $event);

            return $createdEvent->getId();
        } catch (\Exception $e) {
            Log::error('Google Calendar event creation failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get authorization URL
     */
    public function getAuthUrl(): string
    {
        return $this->client->createAuthUrl();
    }

    /**
     * Set access token
     */
    public function setAccessToken(string $token): void
    {
        $this->client->setAccessToken($token);
    }
}

