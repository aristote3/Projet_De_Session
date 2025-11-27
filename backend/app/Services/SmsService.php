<?php

namespace App\Services;

use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use App\Models\Booking;

class SmsService
{
    protected $client;
    protected $from;
    protected $isConfigured = false;

    public function __construct()
    {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.auth_token');
        $this->from = config('services.twilio.phone_number');

        if ($sid && $token) {
            $this->client = new Client($sid, $token);
            $this->isConfigured = true;
        }
    }

    /**
     * Check if Twilio is configured
     */
    public function isConfigured(): bool
    {
        return $this->isConfigured;
    }

    /**
     * Send a single SMS
     */
    public function send(string $phone, string $message): bool
    {
        if (!$this->client) {
            Log::warning('Twilio not configured, SMS not sent');
            return false;
        }

        try {
            $this->client->messages->create(
                $phone,
                [
                    'from' => $this->from,
                    'body' => $message
                ]
            );
            Log::info("SMS sent to {$phone}");
            return true;
        } catch (\Exception $e) {
            Log::error('SMS sending failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send booking notification SMS
     */
    public function sendBookingNotification(string $phone, $booking, string $type): bool
    {
        $message = $this->buildBookingMessage($booking, $type);
        return $this->send($phone, $message);
    }

    /**
     * Send booking reminder SMS
     */
    public function sendBookingReminder(Booking $booking, int $hoursUntil = 24): bool
    {
        $user = $booking->user;
        if (!$user->phone) {
            Log::info("No phone number for user {$user->id}, reminder not sent");
            return false;
        }

        $resourceName = $booking->resource->name;
        $date = $booking->date->format('d/m/Y');
        $time = $booking->start_time;

        if ($hoursUntil <= 1) {
            $message = "⏰ Rappel: Votre réservation pour {$resourceName} commence dans moins d'1 heure ({$time})";
        } elseif ($hoursUntil <= 24) {
            $message = "📅 Rappel: Réservation aujourd'hui - {$resourceName} à {$time}";
        } else {
            $message = "📅 Rappel: Réservation demain - {$resourceName} le {$date} à {$time}";
        }

        return $this->send($user->phone, $message);
    }

    /**
     * Send broadcast message to multiple users
     */
    public function sendBroadcast(array $users, string $message, ?User $sender = null): array
    {
        $results = [
            'total' => count($users),
            'sent' => 0,
            'failed' => 0,
            'no_phone' => 0,
            'details' => []
        ];

        // Prepend sender info if available
        $formattedMessage = $message;
        if ($sender) {
            $senderName = $sender->name;
            if ($sender->organization) {
                $senderName .= " ({$sender->organization->company_name})";
            }
            $formattedMessage = "📢 Message de {$senderName}:\n\n{$message}";
        }

        foreach ($users as $user) {
            if (!$user->phone) {
                $results['no_phone']++;
                $results['details'][] = [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'status' => 'no_phone'
                ];
                continue;
            }

            $sent = $this->send($user->phone, $formattedMessage);
            
            if ($sent) {
                $results['sent']++;
                $results['details'][] = [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'status' => 'sent'
                ];
            } else {
                $results['failed']++;
                $results['details'][] = [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'status' => 'failed'
                ];
            }
        }

        return $results;
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
            'created' => "📋 Réservation créée: {$resourceName} le {$date} à {$time}. En attente d'approbation.",
            'approved' => "✅ Réservation confirmée: {$resourceName} le {$date} à {$time}",
            'rejected' => "❌ Réservation rejetée: {$resourceName} le {$date} à {$time}",
            'cancelled' => "⚠️ Réservation annulée: {$resourceName} le {$date} à {$time}",
            'reminder' => "⏰ Rappel: {$resourceName} le {$date} à {$time}",
            default => "📌 {$resourceName} le {$date} à {$time}"
        };
    }
}

