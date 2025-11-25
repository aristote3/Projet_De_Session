<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'plan_type',
        'start_date',
        'end_date',
        'status',
        'auto_renew',
        'monthly_limit',
        'features',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'auto_renew' => 'boolean',
        'monthly_limit' => 'integer',
        'features' => 'array',
    ];

    /**
     * Get the user for this subscription
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if subscription is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' 
            && $this->start_date <= now() 
            && $this->end_date >= now();
    }

    /**
     * Check if user can make booking based on subscription
     */
    public function canMakeBooking(): bool
    {
        if (!$this->isActive()) {
            return false;
        }

        if ($this->monthly_limit) {
            $currentMonthBookings = $this->user->bookings()
                ->whereMonth('date', now()->month)
                ->whereYear('date', now()->year)
                ->where('status', '!=', 'cancelled')
                ->count();

            return $currentMonthBookings < $this->monthly_limit;
        }

        return true;
    }
}

