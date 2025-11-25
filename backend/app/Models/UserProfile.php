<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'department',
        'position',
        'preferred_language',
        'timezone',
        'date_format',
        'time_format',
        'theme',
        'preferences',
    ];

    protected $casts = [
        'preferences' => 'array',
    ];

    /**
     * Get the user for this profile
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

