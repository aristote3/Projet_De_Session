<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    /**
     * Boot the trait
     */
    protected static function bootLogsActivity()
    {
        static::created(function ($model) {
            static::logActivity($model, 'create');
        });

        static::updated(function ($model) {
            static::logActivity($model, 'update');
        });

        static::deleted(function ($model) {
            static::logActivity($model, 'delete');
        });

        // For soft deletes
        if (method_exists(static::class, 'bootSoftDeletes')) {
            static::restored(function ($model) {
                static::logActivity($model, 'restore');
            });
        }
    }

    /**
     * Log the activity
     */
    protected static function logActivity($model, $action)
    {
        // Skip logging if no authenticated user (e.g., during seeding)
        if (!Auth::check()) {
            return;
        }

        try {
            $changes = null;
            
            if ($action === 'update' && $model->wasChanged()) {
                $changes = [
                    'old' => $model->getOriginal(),
                    'new' => $model->getChanges(),
                ];
            }

            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => $action,
                'model_type' => get_class($model),
                'model_id' => $model->id,
                'changes' => $changes,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            // Silently fail to avoid breaking the main operation
            // Log to Laravel log instead
            \Log::warning('Failed to create audit log: ' . $e->getMessage());
        }
    }

    /**
     * Log a custom activity (for special actions like approve, reject, etc.)
     */
    public function logCustomActivity($action, $changes = null)
    {
        if (!Auth::check()) {
            return;
        }

        try {
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => $action,
                'model_type' => get_class($this),
                'model_id' => $this->id,
                'changes' => $changes,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            \Log::warning('Failed to create custom audit log: ' . $e->getMessage());
        }
    }
}

