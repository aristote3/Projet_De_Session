<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\ApprovalLevel;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'resource_id',
        'user_id',
        'date',
        'start_time',
        'end_time',
        'duration',
        'status',
        'notes',
        'is_recurring',
        'recurring_frequency',
        'recurring_until',
        'parent_booking_id',
        'google_calendar_event_id',
        'outlook_calendar_event_id',
    ];

    protected $casts = [
        'date' => 'date',
        'duration' => 'decimal:2',
        'is_recurring' => 'boolean',
        'recurring_until' => 'date',
    ];

    /**
     * Get the resource for this booking
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    /**
     * Get the user for this booking
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get parent booking for recurring bookings
     */
    public function parentBooking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'parent_booking_id');
    }

    /**
     * Get child bookings (recurring instances)
     */
    public function childBookings()
    {
        return $this->hasMany(Booking::class, 'parent_booking_id');
    }

    /**
     * Get approval levels for this booking
     */
    public function approvalLevels(): HasMany
    {
        return $this->hasMany(ApprovalLevel::class);
    }

    /**
     * Check if booking is in the past
     */
    public function isPast(): bool
    {
        $bookingDateTime = $this->date->format('Y-m-d') . ' ' . $this->end_time;
        return strtotime($bookingDateTime) < now()->timestamp;
    }

    /**
     * Check if booking can be cancelled
     */
    public function canBeCancelled(): bool
    {
        if ($this->status === 'cancelled' || $this->status === 'rejected') {
            return false;
        }

        // Check cancellation policy (24 hours before)
        $bookingDateTime = $this->date->format('Y-m-d') . ' ' . $this->start_time;
        $hoursUntilBooking = (strtotime($bookingDateTime) - now()->timestamp) / 3600;
        
        return $hoursUntilBooking >= 24;
    }
}

