<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConflictResolution extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'conflict_type',
        'conflict_with_booking_id',
        'resolution_type',
        'resolved_by',
        'resolution_notes',
        'status',
        'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    /**
     * Get the booking
     */
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the conflicting booking
     */
    public function conflictWithBooking()
    {
        return $this->belongsTo(Booking::class, 'conflict_with_booking_id');
    }

    /**
     * Get the user who resolved the conflict
     */
    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}

