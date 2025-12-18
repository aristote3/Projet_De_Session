<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Get settings by group
     */
    public function getSettings(Request $request)
    {
        $group = $request->get('group', 'business');
        $userId = $request->get('user_id');
        
        $query = Setting::where('group', $group);
        
        // If user_id is provided, get user-specific settings, otherwise get global
        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            $query->whereNull('user_id');
        }
        
        $settings = $query->get()->pluck('value', 'key')->toArray();
        
        return response()->json([
            'data' => $settings
        ]);
    }

    /**
     * Save settings
     */
    public function saveSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'group' => 'required|string',
            'settings' => 'required|array',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $group = $request->group;
        $userId = $request->user_id;
        $settingsData = $request->settings;

        foreach ($settingsData as $key => $value) {
            // Determine type
            $type = 'string';
            if (is_array($value)) {
                $type = 'json';
            } elseif (is_bool($value)) {
                $type = 'boolean';
            } elseif (is_int($value)) {
                $type = 'integer';
            }

            Setting::updateOrCreate(
                [
                    'key' => $key,
                    'group' => $group,
                    'user_id' => $userId,
                ],
                [
                    'value' => $value,
                    'type' => $type,
                ]
            );
        }

        return response()->json([
            'message' => 'Settings saved successfully'
        ]);
    }

    /**
     * Get platform settings (admin only)
     */
    public function getPlatformSettings(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $settings = Setting::where('group', 'platform')
            ->whereNull('user_id')
            ->get()
            ->pluck('value', 'key')
            ->toArray();

        // Default values if not set
        $defaults = [
            'resourceCategories' => ['Salle', 'Équipement', 'Service', 'Personnel'],
            'defaultBookingRules' => [
                'maxDuration' => 24,
                'bufferMinutes' => 15,
                'requireApproval' => false,
                'maxAdvanceDays' => 90,
            ],
            'notificationTemplates' => [
                'bookingConfirmation' => 'Votre réservation a été confirmée',
                'bookingReminder' => 'Rappel : votre réservation approche',
                'bookingCancelled' => 'Votre réservation a été annulée',
            ],
            'branding' => [
                'platformName' => 'YouManage',
                'primaryColor' => '#1890ff',
                'logoUrl' => '',
            ],
            'apiLimits' => [
                'rateLimit' => 1000,
                'rateLimitWindow' => 60,
                'maxRequestsPerMinute' => 100,
            ],
            'maintenanceMode' => false,
        ];

        $merged = array_merge($defaults, $settings);

        return response()->json([
            'data' => $merged
        ]);
    }

    /**
     * Save platform settings (admin only)
     */
    public function savePlatformSettings(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $settings = $request->all();
        
        foreach ($settings as $key => $value) {
            $type = 'string';
            if (is_array($value)) {
                $type = 'json';
            } elseif (is_bool($value)) {
                $type = 'boolean';
            } elseif (is_int($value)) {
                $type = 'integer';
            }

            Setting::updateOrCreate(
                [
                    'key' => $key,
                    'group' => 'platform',
                    'user_id' => null,
                ],
                [
                    'value' => $value,
                    'type' => $type,
                ]
            );
        }

        return response()->json([
            'message' => 'Platform settings saved successfully'
        ]);
    }

    /**
     * Get business settings for manager
     */
    public function getBusinessSettings(Request $request)
    {
        $userId = $request->user()->id;
        
        $settings = Setting::where('group', 'business')
            ->where('user_id', $userId)
            ->get()
            ->pluck('value', 'key')
            ->toArray();

        // Default values
        $defaults = [
            'businessName' => '',
            'businessHours' => [
                'monday' => ['start' => '09:00', 'end' => '18:00', 'enabled' => true],
                'tuesday' => ['start' => '09:00', 'end' => '18:00', 'enabled' => true],
                'wednesday' => ['start' => '09:00', 'end' => '18:00', 'enabled' => true],
                'thursday' => ['start' => '09:00', 'end' => '18:00', 'enabled' => true],
                'friday' => ['start' => '09:00', 'end' => '18:00', 'enabled' => true],
                'saturday' => ['start' => '09:00', 'end' => '18:00', 'enabled' => false],
                'sunday' => ['start' => '09:00', 'end' => '18:00', 'enabled' => false],
            ],
            'holidays' => [],
            'timezone' => 'Europe/Paris',
            'notifications' => [
                'newBooking' => true,
                'cancellation' => true,
                'reminder' => true,
            ],
        ];

        $merged = array_merge($defaults, $settings);

        return response()->json([
            'data' => $merged
        ]);
    }

    /**
     * Save business settings for manager
     */
    public function saveBusinessSettings(Request $request)
    {
        $userId = $request->user()->id;
        $settings = $request->all();

        foreach ($settings as $key => $value) {
            $type = 'string';
            if (is_array($value)) {
                $type = 'json';
            } elseif (is_bool($value)) {
                $type = 'boolean';
            } elseif (is_int($value)) {
                $type = 'integer';
            }

            Setting::updateOrCreate(
                [
                    'key' => $key,
                    'group' => 'business',
                    'user_id' => $userId,
                ],
                [
                    'value' => $value,
                    'type' => $type,
                ]
            );
        }

        return response()->json([
            'message' => 'Business settings saved successfully'
        ]);
    }
}




