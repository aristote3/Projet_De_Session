<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    /**
     * Display a listing of groups
     */
    public function index(Request $request)
    {
        $query = Group::with(['users', 'permissions']);

        if ($request->has('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $groups = $query->get();

        return response()->json([
            'data' => $groups
        ]);
    }

    /**
     * Store a newly created group
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:groups,name',
            'description' => 'nullable|string',
            'quota' => 'nullable|integer|min:0',
            'max_booking_duration' => 'nullable|integer|min:1',
            'advance_booking_days' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $group = Group::create($validator->validated());

        return response()->json([
            'data' => $group,
            'message' => 'Group created successfully'
        ], 201);
    }

    /**
     * Display the specified group
     */
    public function show(Group $group)
    {
        return response()->json([
            'data' => $group->load(['users', 'permissions'])
        ]);
    }

    /**
     * Update the specified group
     */
    public function update(Request $request, Group $group)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:groups,name,' . $group->id,
            'description' => 'nullable|string',
            'quota' => 'nullable|integer|min:0',
            'max_booking_duration' => 'nullable|integer|min:1',
            'advance_booking_days' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $group->update($validator->validated());

        return response()->json([
            'data' => $group,
            'message' => 'Group updated successfully'
        ]);
    }

    /**
     * Add users to group
     */
    public function addUsers(Request $request, Group $group)
    {
        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $group->users()->syncWithoutDetaching($request->user_ids);

        return response()->json([
            'data' => $group->load('users'),
            'message' => 'Users added to group successfully'
        ]);
    }

    /**
     * Add permissions to group
     */
    public function addPermissions(Request $request, Group $group)
    {
        $validator = Validator::make($request->all(), [
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $group->permissions()->syncWithoutDetaching($request->permission_ids);

        return response()->json([
            'data' => $group->load('permissions'),
            'message' => 'Permissions added to group successfully'
        ]);
    }
}

