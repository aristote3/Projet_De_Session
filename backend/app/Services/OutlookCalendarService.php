<?php

namespace App\Services;

use App\Models\Booking;
use Microsoft\Graph\Graph;
use Microsoft\Graph\GraphServiceClient;
use Illuminate\Support\Facades\Log;

class OutlookCalendarService
{
    protected $graph;

    public function __construct()
    {
        $clientId = config('services.microsoft.client_id');
        $clientSecret = config('services.microsoft.client_secret');

        if (!$clientId || !$clientSecret) {
            Log::warning('Microsoft Outlook credentials not configured');
            return;
        }

        // Initialize Microsoft Graph client
        // This is a simplified version - full implementation would require OAuth flow
        $this->graph = new Graph();
        $this->graph->setAccessToken($this->getAccessToken());
    }

    /**
     * Create event in Outlook Calendar
     */
    public function createEvent(Booking $booking): ?string
    {
        if (!$this->graph) {
            return null;
        }

        try {
            $event = [
                'subject' => $booking->resource->name,
                'body' => [
                    'contentType' => 'HTML',
                    'content' => "Réservation pour {$booking->user->name}<br>" . ($booking->notes ?? ''),
                ],
                'start' => [
                    'dateTime' => $booking->date->format('Y-m-d') . 'T' . $booking->start_time . ':00',
                    'timeZone' => config('app.timezone', 'UTC'),
                ],
                'end' => [
                    'dateTime' => $booking->date->format('Y-m-d') . 'T' . $booking->end_time . ':00',
                    'timeZone' => config('app.timezone', 'UTC'),
                ],
            ];

            $response = $this->graph->createRequest('POST', '/me/events')
                ->attachBody($event)
                ->execute();

            return $response->getId();
        } catch (\Exception $e) {
            Log::error('Outlook Calendar event creation failed: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get access token (simplified - should use OAuth flow)
     */
    private function getAccessToken(): string
    {
        // In production, this should retrieve a stored OAuth token
        // or initiate the OAuth flow
        return config('services.microsoft.access_token', '');
    }
}

