<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
    ];

    /**
     * Get groups that have this permission
     */
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_permissions');
    }

    /**
     * Get users that have this permission directly
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_permissions');
    }
}

