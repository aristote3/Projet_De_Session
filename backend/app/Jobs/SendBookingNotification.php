<?php

namespace App\Jobs;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingNotificationMail;
use App\Services\SmsService;

class SendBookingNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Booking $booking,
        public string $type = 'created'
    ) {}

    public function handle(): void
    {
        $user = $this->booking->user;
        $resource = $this->booking->resource;

        // Get notification preferences
        $preference = \App\Models\UserNotificationPreference::where('user_id', $user->id)
            ->where('notification_type', $this->getNotificationType())
            ->first();

        // Check if email is enabled
        $emailEnabled = $preference ? $preference->shouldSend('email') : true;
        if ($emailEnabled && $user->email) {
            Mail::to($user->email)->send(
                new BookingNotificationMail($this->booking, $this->type)
            );
        }

        // Check if SMS is enabled
        $smsEnabled = $preference ? $preference->shouldSend('sms') : false;
        if ($smsEnabled && $user->profile && $user->profile->phone) {
            $smsService = new SmsService();
            $smsService->sendBookingNotification($user->profile->phone, $this->booking, $this->type);
        }
    }

    /**
     * Get notification type based on booking status
     */
    private function getNotificationType(): string
    {
        return match($this->type) {
            'created' => 'booking_created',
            'approved' => 'booking_approved',
            'rejected' => 'booking_rejected',
            'cancelled' => 'booking_cancelled',
            'promoted_from_waiting_list' => 'booking_approved',
            default => 'booking_created',
        };
    }
}

