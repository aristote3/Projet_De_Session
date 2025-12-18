<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resource extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $fillable = [
        'name',
        'category',
        'capacity',
        'description',
        'pricing_type',
        'price',
        'equipments',
        'status',
        'image_url',
        'opening_hours_start',
        'opening_hours_end',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'price' => 'decimal:2',
        'opening_hours_start' => 'datetime:H:i',
        'opening_hours_end' => 'datetime:H:i',
    ];

    /**
     * Get all bookings for this resource
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get active bookings
     */
    public function activeBookings()
    {
        return $this->bookings()
            ->where('status', '!=', 'cancelled')
            ->where('date', '>=', now()->toDateString());
    }

    /**
     * Get waiting lists for this resource
     */
    public function waitingLists()
    {
        return $this->hasMany(WaitingList::class);
    }
}

