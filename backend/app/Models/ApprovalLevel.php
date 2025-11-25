<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApprovalLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'level',
        'approver_id',
        'status',
        'comments',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'level' => 'integer',
    ];

    /**
     * Get the booking for this approval level
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the approver user
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    /**
     * Check if all required levels are approved
     */
    public static function allLevelsApproved(int $bookingId, int $requiredLevels): bool
    {
        $approvedCount = self::where('booking_id', $bookingId)
            ->where('status', 'approved')
            ->count();

        return $approvedCount >= $requiredLevels;
    }
}

