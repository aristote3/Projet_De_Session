<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'resource_id',
        'start_date',
        'end_date',
        'reason',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    /**
     * Get the resource for this maintenance schedule
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    /**
     * Check if maintenance is active
     */
    public function isActive(): bool
    {
        $today = now()->toDateString();
        return $this->start_date <= $today && $this->end_date >= $today;
    }
}

