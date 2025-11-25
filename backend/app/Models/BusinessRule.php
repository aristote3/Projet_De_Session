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

    /**
     * Apply business rule to a booking
     */
    public function apply($booking): bool
    {
        if (!$this->is_active) {
            return false;
        }

        // Check conditions
        foreach ($this->conditions as $condition) {
            if (!$this->checkCondition($condition, $booking)) {
                return false;
            }
        }

        // Execute actions
        foreach ($this->actions as $action) {
            $this->executeAction($action, $booking);
        }

        return true;
    }

    /**
     * Check a condition
     */
    private function checkCondition(array $condition, $booking): bool
    {
        $field = $condition['field'];
        $operator = $condition['operator'];
        $value = $condition['value'];

        $fieldValue = data_get($booking, $field);

        return match($operator) {
            'equals' => $fieldValue == $value,
            'not_equals' => $fieldValue != $value,
            'greater_than' => $fieldValue > $value,
            'less_than' => $fieldValue < $value,
            'contains' => str_contains($fieldValue ?? '', $value),
            'in' => in_array($fieldValue, (array)$value),
            default => false,
        };
    }

    /**
     * Execute an action
     */
    private function executeAction(array $action, $booking): void
    {
        $actionType = $action['type'];
        $params = $action['params'] ?? [];

        match($actionType) {
            'auto_approve' => $booking->update(['status' => 'approved']),
            'require_approval' => $booking->update(['status' => 'pending']),
            'send_notification' => \App\Jobs\SendBookingNotification::dispatch($booking, $params['type'] ?? 'created'),
            default => null,
        };
    }
}

