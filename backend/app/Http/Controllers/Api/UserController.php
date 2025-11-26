<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $users = $query->paginate($perPage);

        return response()->json([
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|in:admin,manager,user',
            'group' => 'nullable|string',
            'quota' => 'nullable|integer|min:0',
            'status' => 'nullable|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return response()->json([
            'data' => $user,
            'message' => 'User created successfully'
        ], 201);
    }

    /**
     * Display the specified user
     */
    public function show(User $user)
    {
        return response()->json([
            'data' => $user->load(['groups', 'permissions'])
        ]);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'nullable|in:admin,manager,user',
            'group' => 'nullable|string',
            'quota' => 'nullable|integer|min:0',
            'status' => 'nullable|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'data' => $user,
            'message' => 'User updated successfully'
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'data' => $user,
            'message' => 'Profile updated successfully'
        ]);
    }

    /**
     * Get user booking history
     */
    public function bookingHistory(User $user, Request $request)
    {
        $query = Booking::where('user_id', $user->id)
            ->with(['resource'])
            ->orderBy('date', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $perPage = $request->get('per_page', 15);
        $bookings = $query->paginate($perPage);

        return response()->json([
            'data' => $bookings->items(),
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'per_page' => $bookings->perPage(),
                'total' => $bookings->total(),
                'last_page' => $bookings->lastPage(),
            ]
        ]);
    }

    /**
     * Add credits to user
     */
    public function addCredits(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // TODO: Implement credit system
        return response()->json([
            'message' => 'Credit system not implemented yet'
        ], 501);
    }

    /**
     * Get user credits
     */
    public function getCredits(User $user)
    {
        // TODO: Implement credit system
        return response()->json([
            'data' => [
                'credits' => 0,
                'quota' => $user->quota ?? 0,
            ]
        ]);
    }

    /**
     * Update user subscription
     */
    public function updateSubscription(Request $request, User $user)
    {
        // TODO: Implement subscription system
        return response()->json([
            'message' => 'Subscription system not implemented yet'
        ], 501);
    }

    /**
     * Update user notification preferences
     */
    public function updateNotificationPreferences(Request $request, User $user)
    {
        // TODO: Implement notification preferences
        return response()->json([
            'message' => 'Notification preferences not implemented yet'
        ], 501);
    }

    /**
     * Get user permissions
     */
    public function getPermissions(User $user)
    {
        $permissions = $user->permissions;
        $groupPermissions = $user->groups->flatMap->permissions;

        $allPermissions = $permissions->merge($groupPermissions)->unique('id');

        return response()->json([
            'data' => $allPermissions->values()
        ]);
    }
}

