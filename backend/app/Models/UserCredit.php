<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserCredit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'type',
        'expires_at',
        'source',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the user for this credit
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get total available credits for a user
     */
    public static function getTotalCredits(int $userId): float
    {
        return self::where('user_id', $userId)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->sum('amount');
    }

    /**
     * Use credits for a booking
     */
    public static function useCredits(int $userId, float $amount): bool
    {
        $totalCredits = self::getTotalCredits($userId);
        
        if ($totalCredits < $amount) {
            return false;
        }

        // Deduct credits (FIFO - First In First Out)
        $credits = self::where('user_id', $userId)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->orderBy('created_at', 'asc')
            ->get();

        $remaining = $amount;
        foreach ($credits as $credit) {
            if ($remaining <= 0) break;

            if ($credit->amount <= $remaining) {
                $remaining -= $credit->amount;
                $credit->delete();
            } else {
                $credit->amount -= $remaining;
                $credit->save();
                $remaining = 0;
            }
        }

        return true;
    }
}

