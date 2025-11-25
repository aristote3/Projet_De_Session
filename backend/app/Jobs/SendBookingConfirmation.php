<?php

namespace App\Jobs;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmationMail;

class SendBookingConfirmation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public Booking $booking
    ) {}

    public function handle(): void
    {
        $user = $this->booking->user;

        if ($user->email) {
            Mail::to($user->email)->send(
                new BookingConfirmationMail($this->booking)
            );
        }
    }
}

