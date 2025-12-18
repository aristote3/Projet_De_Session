<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
        // Vérifier que l'utilisateur peut modifier son propre profil ou est admin
        if ($request->user()->id !== $user->id && !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $user->update($data);

        return response()->json([
            'data' => $user->fresh(),
            'message' => 'Profile updated successfully'
        ]);
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request, User $user)
    {
        // Vérifier que l'utilisateur peut modifier son propre mot de passe ou est admin
        if ($request->user()->id !== $user->id && !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier le mot de passe actuel (sauf pour les admins)
        if (!$request->user()->isAdmin() && !Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect',
                'errors' => ['current_password' => ['Le mot de passe actuel est incorrect']]
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'message' => 'Password changed successfully'
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
        // Vérifier que l'utilisateur peut modifier ses propres préférences ou est admin
        if ($request->user()->id !== $user->id && !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'nullable|boolean',
            'sms' => 'nullable|boolean',
            'push' => 'nullable|boolean',
            'bookingConfirmation' => 'nullable|boolean',
            'bookingReminder' => 'nullable|boolean',
            'bookingCancellation' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Stocker les préférences dans un champ JSON ou une table séparée
        // Pour l'instant, on utilise un champ JSON dans la table users
        $preferences = $validator->validated();
        
        // Si la table user_notification_preferences existe, utiliser celle-ci
        // Sinon, stocker dans un champ JSON
        $user->notification_preferences = $preferences;
        $user->save();

        return response()->json([
            'data' => $preferences,
            'message' => 'Notification preferences updated successfully'
        ]);
    }

    /**
     * Reset user password (admin only)
     */
    public function resetPassword(Request $request, User $user)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'send_email' => 'nullable|boolean',
        ]);

        // Générer un mot de passe temporaire
        $tempPassword = Str::random(12);
        
        $user->update([
            'password' => Hash::make($tempPassword)
        ]);

        // TODO: Envoyer un email avec le nouveau mot de passe si send_email est true
        if ($request->get('send_email', false)) {
            // Mail::to($user->email)->send(new PasswordResetMail($tempPassword));
        }

        return response()->json([
            'message' => 'Password reset successfully',
            'temp_password' => $tempPassword, // Retourner seulement si admin (pour test)
        ]);
    }

    /**
     * Impersonate a user (admin only)
     */
    public function impersonate(Request $request, User $user)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Unauthorized. Admin access required.'
            ], 403);
        }

        // Créer un token Sanctum pour l'utilisateur à impersonner
        $token = $user->createToken('impersonation-token', ['*'], now()->addHours(1))->plainTextToken;

        return response()->json([
            'message' => 'Impersonation token created',
            'token' => $token,
            'user' => $user,
            'redirect_url' => '/manager', // ou '/user' selon le rôle
        ]);
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

    /**
     * Get pending manager requests
     */
    public function pendingRequests()
    {
        $pendingUsers = User::with('organization')
            ->where('status', 'pending')
            ->where('role', 'manager')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $pendingUsers,
            'count' => $pendingUsers->count()
        ]);
    }

    /**
     * Approve a pending user request
     */
    public function approveRequest(User $user)
    {
        if ($user->status !== 'pending') {
            return response()->json([
                'message' => 'Cet utilisateur n\'est pas en attente d\'approbation'
            ], 400);
        }

        $user->update(['status' => 'active']);

        // TODO: Envoyer un email de notification à l'utilisateur

        return response()->json([
            'data' => $user,
            'message' => 'Compte approuvé avec succès. L\'utilisateur peut maintenant se connecter.'
        ]);
    }

    /**
     * Reject a pending user request
     */
    public function rejectRequest(Request $request, User $user)
    {
        if ($user->status !== 'pending') {
            return response()->json([
                'message' => 'Cet utilisateur n\'est pas en attente d\'approbation'
            ], 400);
        }

        $reason = $request->get('reason', 'Demande refusée par l\'administrateur');

        // On peut soit supprimer l'utilisateur, soit le marquer comme rejeté
        $user->update(['status' => 'rejected']);

        // TODO: Envoyer un email de notification avec la raison du refus

        return response()->json([
            'data' => $user,
            'message' => 'Demande refusée.'
        ]);
    }
}

