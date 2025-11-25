<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ResourceController extends Controller
{
    /**
     * Display a listing of resources
     */
    public function index(Request $request): JsonResponse
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
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        $resources = $query->with('maintenanceSchedules')->paginate(15);

        return response()->json($resources);
    }

    /**
     * Store a newly created resource
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|in:salle,equipement,vehicule,service',
            'capacity' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'pricing_type' => 'required|in:gratuit,horaire,forfait',
            'price' => 'nullable|numeric|min:0',
            'equipments' => 'nullable|string',
            'image_url' => 'nullable|url',
            'opening_hours_start' => 'nullable|date_format:H:i',
            'opening_hours_end' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $resource = Resource::create($validator->validated());

        return response()->json($resource, 201);
    }

    /**
     * Display the specified resource
     */
    public function show(Resource $resource): JsonResponse
    {
        $resource->load(['maintenanceSchedules', 'bookings' => function ($query) {
            $query->where('status', 'approved')
                  ->where('date', '>=', now()->toDateString())
                  ->orderBy('date')
                  ->orderBy('start_time')
                  ->limit(10);
        }]);

        return response()->json($resource);
    }

    /**
     * Update the specified resource
     */
    public function update(Request $request, Resource $resource): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|in:salle,equipement,vehicule,service',
            'capacity' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'pricing_type' => 'sometimes|in:gratuit,horaire,forfait',
            'price' => 'nullable|numeric|min:0',
            'equipments' => 'nullable|string',
            'image_url' => 'nullable|url',
            'status' => 'sometimes|in:available,busy,maintenance',
            'opening_hours_start' => 'nullable|date_format:H:i',
            'opening_hours_end' => 'nullable|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $resource->update($validator->validated());

        return response()->json($resource);
    }

    /**
     * Remove the specified resource
     */
    public function destroy(Resource $resource): JsonResponse
    {
        // Check if resource has active bookings
        $hasActiveBookings = $resource->bookings()
            ->where('status', 'approved')
            ->where('date', '>=', now()->toDateString())
            ->exists();

        if ($hasActiveBookings) {
            return response()->json([
                'message' => 'Cannot delete resource with active bookings'
            ], 422);
        }

        $resource->delete();

        return response()->json(['message' => 'Resource deleted successfully']);
    }

    /**
     * Check availability of a resource
     */
    public function checkAvailability(Request $request, Resource $resource): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $isAvailable = $resource->isAvailableAt(
            $request->date,
            $request->start_time,
            $request->end_time
        );

        return response()->json([
            'available' => $isAvailable,
            'resource' => $resource,
        ]);
    }
}

