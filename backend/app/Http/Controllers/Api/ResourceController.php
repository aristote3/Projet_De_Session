<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ResourceController extends Controller
{
    /**
     * Display a listing of resources
     */
    public function index(Request $request)
    {
        $query = Resource::query();

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search by name or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $resources = $query->paginate($perPage);

        return response()->json([
            'data' => $resources->items(),
            'meta' => [
                'current_page' => $resources->currentPage(),
                'per_page' => $resources->perPage(),
                'total' => $resources->total(),
                'last_page' => $resources->lastPage(),
            ]
        ]);
    }

    /**
     * Store a newly created resource
     */
    public function store(Request $request)
    {
        // Vérifier que l'utilisateur est manager ou admin
        $user = $request->user();
        if (!$user || (!$user->isManager() && !$user->isAdmin())) {
            return response()->json([
                'message' => 'Unauthorized. Seuls les managers et administrateurs peuvent créer des ressources.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|in:salle,equipement,vehicule,service',
            'capacity' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'pricing_type' => 'nullable|in:gratuit,horaire,forfait',
            'price' => 'nullable|numeric|min:0',
            'equipments' => 'nullable|string',
            'status' => 'nullable|in:available,busy,maintenance',
            'image_url' => 'nullable|url',
            'opening_hours_start' => 'nullable|date_format:H:i',
            'opening_hours_end' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $resource = Resource::create($validator->validated());

        return response()->json([
            'data' => $resource,
            'message' => 'Resource created successfully'
        ], 201);
    }

    /**
     * Display the specified resource
     */
    public function show(Resource $resource)
    {
        return response()->json([
            'data' => $resource->load(['bookings', 'waitingLists'])
        ]);
    }

    /**
     * Update the specified resource
     */
    public function update(Request $request, Resource $resource)
    {
        // Vérifier que l'utilisateur est manager ou admin
        $user = $request->user();
        if (!$user || (!$user->isManager() && !$user->isAdmin())) {
            return response()->json([
                'message' => 'Unauthorized. Seuls les managers et administrateurs peuvent modifier des ressources.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|in:salle,equipement,vehicule,service',
            'capacity' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'pricing_type' => 'nullable|in:gratuit,horaire,forfait',
            'price' => 'nullable|numeric|min:0',
            'equipments' => 'nullable|string',
            'status' => 'nullable|in:available,busy,maintenance',
            'image_url' => 'nullable|url',
            'opening_hours_start' => 'nullable|date_format:H:i',
            'opening_hours_end' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $resource->update($validator->validated());

        return response()->json([
            'data' => $resource,
            'message' => 'Resource updated successfully'
        ]);
    }

    /**
     * Remove the specified resource
     */
    public function destroy(Resource $resource)
    {
        // Vérifier que l'utilisateur est manager ou admin
        $user = request()->user();
        if (!$user || (!$user->isManager() && !$user->isAdmin())) {
            return response()->json([
                'message' => 'Unauthorized. Seuls les managers et administrateurs peuvent supprimer des ressources.'
            ], 403);
        }

        $resource->delete();

        return response()->json([
            'message' => 'Resource deleted successfully'
        ]);
    }

    /**
     * Check resource availability
     */
    public function checkAvailability(Request $request, Resource $resource)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $date = $request->date;
        $startTime = $request->start_time;
        $endTime = $request->end_time;

        // Check if resource is in maintenance
        if ($resource->status === 'maintenance') {
            return response()->json([
                'available' => false,
                'reason' => 'Resource is under maintenance',
                'resource' => $resource
            ]);
        }

        // Check for overlapping bookings
        $overlapping = $resource->bookings()
            ->where('date', $date)
            ->where('status', '!=', 'cancelled')
            ->where(function($query) use ($startTime, $endTime) {
                $query->whereBetween('start_time', [$startTime, $endTime])
                      ->orWhereBetween('end_time', [$startTime, $endTime])
                      ->orWhere(function($q) use ($startTime, $endTime) {
                          $q->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                      });
            })
            ->exists();

        if ($overlapping) {
            return response()->json([
                'available' => false,
                'reason' => 'Time slot is already booked',
                'resource' => $resource
            ]);
        }

        return response()->json([
            'available' => true,
            'resource' => $resource
        ]);
    }
}

