<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\Group;
use App\Models\Permission;
use App\Models\UserCredit;
use App\Models\Subscription;
use App\Models\UserNotificationPreference;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with(['profile', 'groups', 'subscription']);

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('group')) {
            $query->whereHas('groups', function ($q) use ($request) {
                $q->where('groups.id', $request->group);
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $users = $query->paginate(15);

        return response()->json($users);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'sometimes|in:admin,manager,user',
            'quota' => 'nullable|integer|min:0',
            'group_ids' => 'nullable|array',
            'group_ids.*' => 'exists:groups,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->get('role', 'user'),
            'quota' => $request->quota,
            'status' => 'active',
        ]);

        // Attach groups
        if ($request->has('group_ids')) {
            $user->groups()->attach($request->group_ids);
        }

        // Create profile
        UserProfile::create(['user_id' => $user->id]);

        return response()->json($user->load(['profile', 'groups']), 201);
    }

    /**
     * Display the specified user with full details
     */
    public function show(User $user): JsonResponse
    {
        $user->load([
            'profile',
            'groups.permissions',
            'permissions',
            'subscription',
            'credits' => function ($query) {
                $query->where(function ($q) {
                    $q->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
                });
            },
            'notificationPreferences',
        ]);

        $user->total_credits = UserCredit::getTotalCredits($user->id);
        $user->booking_history = $user->getBookingHistory(10);

        return response()->json($user);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|in:admin,manager,user',
            'quota' => 'nullable|integer|min:0',
            'status' => 'sometimes|in:active,inactive',
            'group_ids' => 'nullable|array',
            'group_ids.*' => 'exists:groups,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        // Update groups
        if ($request->has('group_ids')) {
            $user->groups()->sync($request->group_ids);
        }

        return response()->json($user->load(['profile', 'groups']));
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'phone' => 'nullable|string',
            'department' => 'nullable|string',
            'position' => 'nullable|string',
            'preferred_language' => 'nullable|string',
            'timezone' => 'nullable|string',
            'date_format' => 'nullable|string',
            'time_format' => 'nullable|string',
            'theme' => 'nullable|in:light,dark',
            'preferences' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $profile = $user->profile ?? UserProfile::create(['user_id' => $user->id]);
        $profile->update($validator->validated());

        return response()->json($profile);
    }

    /**
     * Get user booking history
     */
    public function bookingHistory(User $user, Request $request): JsonResponse
    {
        $limit = $request->get('limit', 20);
        $history = $user->getBookingHistory($limit);

        return response()->json($history);
    }

    /**
     * Add credits to user
     */
    public function addCredits(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:purchase,bonus,refund',
            'expires_at' => 'nullable|date',
            'source' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $credit = UserCredit::create([
            'user_id' => $user->id,
            ...$validator->validated(),
        ]);

        return response()->json([
            'message' => 'Credits added successfully',
            'credit' => $credit,
            'total_credits' => UserCredit::getTotalCredits($user->id),
        ], 201);
    }

    /**
     * Get user credits
     */
    public function getCredits(User $user): JsonResponse
    {
        $credits = $user->credits()
            ->where(function ($query) {
                $query->whereNull('expires_at')
                      ->orWhere('expires_at', '>', now());
            })
            ->get();

        return response()->json([
            'total_credits' => UserCredit::getTotalCredits($user->id),
            'credits' => $credits,
        ]);
    }

    /**
     * Create or update subscription
     */
    public function updateSubscription(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'plan_type' => 'required|in:basic,premium,enterprise',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'auto_renew' => 'boolean',
            'monthly_limit' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $subscription = $user->subscription ?? new Subscription(['user_id' => $user->id]);
        $subscription->fill($validator->validated());
        $subscription->status = 'active';
        $subscription->save();

        return response()->json($subscription);
    }

    /**
     * Update notification preferences
     */
    public function updateNotificationPreferences(Request $request, User $user): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'notification_type' => 'required|string',
            'email_enabled' => 'boolean',
            'sms_enabled' => 'boolean',
            'push_enabled' => 'boolean',
            'frequency' => 'sometimes|in:immediate,daily,weekly',
            'quiet_hours_start' => 'nullable|date_format:H:i',
            'quiet_hours_end' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $preference = UserNotificationPreference::updateOrCreate(
            [
                'user_id' => $user->id,
                'notification_type' => $request->notification_type,
            ],
            $validator->validated()
        );

        return response()->json($preference);
    }

    /**
     * Get user permissions
     */
    public function getPermissions(User $user): JsonResponse
    {
        $permissions = $user->getAllPermissions();

        return response()->json([
            'direct_permissions' => $user->permissions,
            'group_permissions' => $user->groups()->with('permissions')->get()->pluck('permissions')->flatten(),
            'all_permissions' => $permissions,
        ]);
    }
}

