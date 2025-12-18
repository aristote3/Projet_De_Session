<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FeatureController extends Controller
{
    /**
     * Get all features
     */
    public function index(Request $request)
    {
        $features = Feature::orderBy('created_at', 'desc')->get();

        return response()->json([
            'data' => $features
        ]);
    }

    /**
     * Create a feature
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'key' => 'required|string|max:255|unique:features,key',
            'description' => 'nullable|string',
            'status' => 'required|in:enabled,disabled,beta',
            'rollout' => 'nullable|integer|min:0|max:100',
            'target_tenants' => 'nullable|string',
            'config' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $feature = Feature::create($validator->validated());

        return response()->json([
            'data' => $feature,
            'message' => 'Feature created successfully'
        ], 201);
    }

    /**
     * Update a feature
     */
    public function update(Request $request, Feature $feature)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'key' => 'sometimes|required|string|max:255|unique:features,key,' . $feature->id,
            'description' => 'nullable|string',
            'status' => 'sometimes|required|in:enabled,disabled,beta',
            'rollout' => 'nullable|integer|min:0|max:100',
            'target_tenants' => 'nullable|string',
            'config' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $feature->update($validator->validated());

        return response()->json([
            'data' => $feature,
            'message' => 'Feature updated successfully'
        ]);
    }

    /**
     * Delete a feature
     */
    public function destroy(Feature $feature)
    {
        $feature->delete();

        return response()->json([
            'message' => 'Feature deleted successfully'
        ]);
    }
}

