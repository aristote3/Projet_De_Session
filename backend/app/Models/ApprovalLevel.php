<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApprovalLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'level',
        'approver_id',
        'status',
        'comments',
        'approved_at',
    ];

    protected $casts = [
        'level' => 'integer',
        'approved_at' => 'datetime',
    ];

    /**
     * Get the booking
     */
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Get the approver
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }
}

