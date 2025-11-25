<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'quota',
        'max_booking_duration',
        'advance_booking_days',
        'is_active',
    ];

    protected $casts = [
        'quota' => 'integer',
        'max_booking_duration' => 'integer',
        'advance_booking_days' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get users in this group
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_groups');
    }

    /**
     * Get permissions for this group
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'group_permissions');
    }

    /**
     * Check if group has a specific permission
     */
    public function hasPermission(string $permission): bool
    {
        return $this->permissions()->where('name', $permission)->exists();
    }
}

