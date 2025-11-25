<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WaitingList extends Model
{
    use HasFactory;

    protected $fillable = [
        'resource_id',
        'user_id',
        'date',
        'start_time',
        'end_time',
        'priority',
        'status',
        'notified_at',
    ];

    protected $casts = [
        'date' => 'date',
        'notified_at' => 'datetime',
        'priority' => 'integer',
    ];

    /**
     * Get the resource for this waiting list entry
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    /**
     * Get the user for this waiting list entry
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if this entry can be promoted to a booking
     */
    public function canBePromoted(): bool
    {
        $resource = $this->resource;
        return $resource->isAvailableAt(
            $this->date->toDateString(),
            $this->start_time,
            $this->end_time
        );
    }
}

