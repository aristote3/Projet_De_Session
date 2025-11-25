<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CancellationPolicy extends Model
{
    use HasFactory;

    protected $fillable = [
        'resource_id',
        'hours_before',
        'penalty_type',
        'penalty_amount',
        'refund_percentage',
        'is_active',
    ];

    protected $casts = [
        'hours_before' => 'integer',
        'penalty_amount' => 'decimal:2',
        'refund_percentage' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the resource for this policy
     */
    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }

    /**
     * Check if cancellation is allowed for a booking
     */
    public function canCancel($booking): bool
    {
        if (!$this->is_active) {
            return true; // No policy, allow cancellation
        }

        $bookingDateTime = \Carbon\Carbon::parse($booking->date->format('Y-m-d') . ' ' . $booking->start_time);
        $hoursUntilBooking = now()->diffInHours($bookingDateTime, false);

        return $hoursUntilBooking >= $this->hours_before;
    }

    /**
     * Calculate refund amount
     */
    public function calculateRefund($booking): float
    {
        if (!$this->canCancel($booking)) {
            return 0;
        }

        $resource = $booking->resource;
        $totalAmount = $resource->price * $booking->duration;

        if ($this->penalty_type === 'percentage') {
            return $totalAmount * ($this->refund_percentage / 100);
        }

        if ($this->penalty_type === 'fixed') {
            return max(0, $totalAmount - $this->penalty_amount);
        }

        return $totalAmount;
    }
}

