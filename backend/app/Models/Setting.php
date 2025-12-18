<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'user_id',
    ];

    /**
     * Get the user that owns the setting
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get setting value with type casting
     */
    public function getValueAttribute($value)
    {
        switch ($this->type) {
            case 'json':
                return json_decode($value, true);
            case 'boolean':
                return filter_var($value, FILTER_VALIDATE_BOOLEAN);
            case 'integer':
                return (int)$value;
            default:
                return $value;
        }
    }

    /**
     * Set setting value with type conversion
     */
    public function setValueAttribute($value)
    {
        switch ($this->type) {
            case 'json':
                $this->attributes['value'] = json_encode($value);
                break;
            case 'boolean':
                $this->attributes['value'] = $value ? '1' : '0';
                break;
            case 'integer':
                $this->attributes['value'] = (string)$value;
                break;
            default:
                $this->attributes['value'] = $value;
        }
    }
}

