<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Booking $booking,
        public string $type = 'created'
    ) {}

    public function build()
    {
        $subject = match($this->type) {
            'created' => 'Nouvelle réservation créée',
            'approved' => 'Réservation approuvée',
            'rejected' => 'Réservation rejetée',
            'cancelled' => 'Réservation annulée',
            default => 'Notification de réservation'
        };

        return $this->subject($subject)
                    ->view('emails.booking-notification')
                    ->with([
                        'booking' => $this->booking,
                        'type' => $this->type,
                    ]);
    }
}

