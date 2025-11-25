<?php

namespace App\Services;

use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $client;
    protected $from;

    public function __construct()
    {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.auth_token');
        $this->from = config('services.twilio.phone_number');

        if ($sid && $token) {
            $this->client = new Client($sid, $token);
        }
    }

    /**
     * Send booking notification SMS
     */
    public function sendBookingNotification(string $phone, $booking, string $type): bool
    {
        if (!$this->client) {
            Log::warning('Twilio not configured, SMS not sent');
            return false;
        }

        $message = $this->buildBookingMessage($booking, $type);

        try {
            $this->client->messages->create(
                $phone,
                [
                    'from' => $this->from,
                    'body' => $message
                ]
            );
            return true;
        } catch (\Exception $e) {
            Log::error('SMS sending failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Build SMS message for booking
     */
    private function buildBookingMessage($booking, string $type): string
    {
        $resourceName = $booking->resource->name;
        $date = $booking->date->format('d/m/Y');
        $time = $booking->start_time . ' - ' . $booking->end_time;

        return match($type) {
            'created' => "Votre réservation pour {$resourceName} le {$date} à {$time} a été créée. En attente d'approbation.",
            'approved' => "✓ Réservation confirmée: {$resourceName} le {$date} à {$time}",
            'rejected' => "✗ Réservation rejetée: {$resourceName} le {$date} à {$time}",
            'cancelled' => "Réservation annulée: {$resourceName} le {$date} à {$time}",
            default => "Notification: {$resourceName} le {$date} à {$time}"
        };
    }
}

