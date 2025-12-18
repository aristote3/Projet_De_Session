<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Identifiants invalides'
            ], 401);
        }

        // Vérifier que l'utilisateur est actif
        if ($user->status === 'pending') {
            return response()->json([
                'message' => 'Votre compte est en attente de validation par un administrateur'
            ], 403);
        }
        
        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Votre compte est désactivé'
            ], 403);
        }

        // Créer un token Sanctum
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'token' => $token,
            ],
            'message' => 'Connexion réussie'
        ]);
    }

    /**
     * Register new user
     */
    public function register(Request $request)
    {
        try {
            \Log::info('Registration attempt started', ['email' => $request->email]);
            
            $requestedRole = $request->role ?? 'user';
            
            // Règles de validation de base
            $rules = [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6|confirmed',
                'role' => 'nullable|in:admin,manager,user',
            ];

            // Règles supplémentaires pour les managers
            if ($requestedRole === 'manager') {
                $rules['company_name'] = 'required|string|max:255';
                $rules['phone'] = 'nullable|string|max:20';
                $rules['industry'] = 'nullable|string|max:100';
                $rules['company_size'] = 'nullable|string|max:50';
                $rules['description'] = 'nullable|string|max:1000';
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                \Log::warning('Registration validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Les managers doivent être approuvés par un admin
            // Les admins ne peuvent pas s'auto-créer via l'inscription publique
            if ($requestedRole === 'admin') {
                $requestedRole = 'user'; // Forcer le rôle user pour sécurité
            }
            
            $status = ($requestedRole === 'manager') ? 'pending' : 'active';

            \Log::info('Creating user', ['email' => $request->email, 'role' => $requestedRole]);
            
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $requestedRole,
                'status' => $status,
            ]);

            \Log::info('User created successfully', ['user_id' => $user->id]);

            // Si c'est un manager, créer aussi l'organisation
            if ($requestedRole === 'manager') {
                \Log::info('Creating organization for manager', ['user_id' => $user->id]);
                Organization::create([
                    'user_id' => $user->id,
                    'company_name' => $request->company_name,
                    'phone' => $request->phone,
                    'industry' => $request->industry,
                    'company_size' => $request->company_size,
                    'description' => $request->description,
                ]);
                \Log::info('Organization created successfully');
            }

            // Pour les managers en attente, ne pas créer de token (ils ne peuvent pas se connecter)
            if ($status === 'pending') {
                return response()->json([
                    'data' => [
                        'user' => [
                            'id' => $user->id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'role' => $user->role,
                            'status' => $user->status,
                        ],
                    ],
                    'message' => 'Demande de compte Manager soumise. Un administrateur validera votre compte.'
                ], 201);
            }

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'token' => $token,
                ],
                'message' => 'Inscription réussie'
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->except(['password', 'password_confirmation'])
            ]);
            
            // Log to stderr for Render logs visibility
            error_log('REGISTRATION ERROR: ' . $e->getMessage());
            error_log('File: ' . $e->getFile() . ':' . $e->getLine());
            
            return response()->json([
                'message' => 'Erreur lors de l\'inscription',
                'error' => config('app.debug') ? $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine() : 'Une erreur est survenue. Veuillez réessayer.'
            ], 500);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Get current authenticated user
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
            ]
        ]);
    }
}

