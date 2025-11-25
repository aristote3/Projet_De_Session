<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserNotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'notification_type',
        'email_enabled',
        'sms_enabled',
        'push_enabled',
        'frequency',
        'quiet_hours_start',
        'quiet_hours_end',
    ];

    protected $casts = [
        'email_enabled' => 'boolean',
        'sms_enabled' => 'boolean',
        'push_enabled' => 'boolean',
    ];

    /**
     * Get the user for this preference
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if notification should be sent based on preferences
     */
    public function shouldSend(string $channel): bool
    {
        $now = now();
        $currentHour = (int) $now->format('H');

        // Check quiet hours
        if ($this->quiet_hours_start && $this->quiet_hours_end) {
            $startHour = (int) $this->quiet_hours_start;
            $endHour = (int) $this->quiet_hours_end;
            
            if ($startHour <= $endHour) {
                if ($currentHour >= $startHour && $currentHour < $endHour) {
                    return false; // In quiet hours
                }
            } else {
                // Quiet hours span midnight
                if ($currentHour >= $startHour || $currentHour < $endHour) {
                    return false;
                }
            }
        }

        // Check channel preference
        return match($channel) {
            'email' => $this->email_enabled ?? true,
            'sms' => $this->sms_enabled ?? false,
            'push' => $this->push_enabled ?? false,
            default => true,
        };
    }
}

