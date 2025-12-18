<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feature extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'key',
        'description',
        'status',
        'rollout',
        'target_tenants',
        'config',
    ];

    protected $casts = [
        'rollout' => 'integer',
        'config' => 'array',
    ];
}

