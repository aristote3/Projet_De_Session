<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Resource extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'category',
        'capacity',
        'description',
        'pricing_type',
        'price',
        'equipments',
        'status',
        'image_url',
        'opening_hours_start',
        'opening_hours_end',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'price' => 'decimal:2',
        'opening_hours_start' => 'string',
        'opening_hours_end' => 'string',
    ];

    /**
     * Get all bookings for this resource
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get all maintenance schedules for this resource
     */
    public function maintenanceSchedules(): HasMany
    {
        return $this->hasMany(MaintenanceSchedule::class);
    }

    /**
     * Check if resource is available at given time
     */
    public function isAvailableAt(string $date, string $startTime, string $endTime): bool
    {
        // Check if resource status is available
        if ($this->status !== 'available') {
            return false;
        }

        // Check opening hours
        if ($this->opening_hours_start && $this->opening_hours_end) {
            if ($startTime < $this->opening_hours_start || $endTime > $this->opening_hours_end) {
                return false;
            }
        }

        // Check for active maintenance
        $hasMaintenance = $this->maintenanceSchedules()
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->exists();

        if ($hasMaintenance) {
            return false;
        }

        // Check for conflicting bookings
        $hasConflict = $this->bookings()
            ->where('date', $date)
            ->where('status', 'approved')
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where(function ($q) use ($startTime, $endTime) {
                    $q->where('start_time', '<', $endTime)
                      ->where('end_time', '>', $startTime);
                });
            })
            ->exists();

        return !$hasConflict;
    }

    /**
     * Get active maintenance schedules
     */
    public function getActiveMaintenanceSchedules()
    {
        $today = now()->toDateString();
        return $this->maintenanceSchedules()
            ->where('start_date', '<=', $today)
            ->where('end_date', '>=', $today)
            ->get();
    }
}

