<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'group_permissions');
    }

    /**
     * Get users that have this permission
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_permissions');
    }
}

