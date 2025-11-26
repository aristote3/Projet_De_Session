<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'rule_type',
        'conditions',
        'actions',
        'priority',
        'is_active',
    ];

    protected $casts = [
        'conditions' => 'array',
        'actions' => 'array',
        'priority' => 'integer',
        'is_active' => 'boolean',
    ];
}

