<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

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
    ];

    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'duration' => 'decimal:2',
        'is_recurring' => 'boolean',
        'recurring_until' => 'date',
    ];

    /**
     * Get the resource that owns the booking
     */
    public function resource()
    {
        return $this->belongsTo(Resource::class);
    }

    /**
     * Get the user that made the booking
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get parent booking for recurring bookings
     */
    public function parentBooking()
    {
        return $this->belongsTo(Booking::class, 'parent_booking_id');
    }

    /**
     * Get child bookings for recurring bookings
     */
    public function childBookings()
    {
        return $this->hasMany(Booking::class, 'parent_booking_id');
    }
}

