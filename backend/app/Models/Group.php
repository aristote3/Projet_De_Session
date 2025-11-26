<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_groups');
    }

    /**
     * Get permissions for this group
     */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'group_permissions');
    }
}

