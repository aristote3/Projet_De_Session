<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'group',
        'quota',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'quota' => 'integer',
    ];

    /**
     * Get all bookings for this user
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Check if user has reached booking quota
     */
    public function hasReachedQuota(): bool
    {
        if (!$this->quota) {
            return false;
        }

        $currentMonthBookings = $this->bookings()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->where('status', '!=', 'cancelled')
            ->count();

        return $currentMonthBookings >= $this->quota;
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Get user profile
     */
    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * Get user groups
     */
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class, 'user_groups');
    }

    /**
     * Get user permissions (direct and from groups)
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'user_permissions');
    }

    /**
     * Get all permissions (direct + from groups)
     */
    public function getAllPermissions(): \Illuminate\Support\Collection
    {
        $directPermissions = $this->permissions;
        $groupPermissions = $this->groups()->with('permissions')->get()
            ->pluck('permissions')
            ->flatten();

        return $directPermissions->merge($groupPermissions)->unique('id');
    }

    /**
     * Check if user has permission
     */
    public function hasPermission(string $permission): bool
    {
        // Check direct permissions
        if ($this->permissions()->where('name', $permission)->exists()) {
            return true;
        }

        // Check group permissions
        foreach ($this->groups as $group) {
            if ($group->hasPermission($permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get user credits
     */
    public function credits(): HasMany
    {
        return $this->hasMany(UserCredit::class);
    }

    /**
     * Get user subscription
     */
    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class);
    }

    /**
     * Get notification preferences
     */
    public function notificationPreferences(): HasMany
    {
        return $this->hasMany(UserNotificationPreference::class);
    }

    /**
     * Get booking history
     */
    public function getBookingHistory(int $limit = 10)
    {
        return $this->bookings()
            ->with(['resource'])
            ->orderBy('date', 'desc')
            ->orderBy('start_time', 'desc')
            ->limit($limit)
            ->get();
    }
}

