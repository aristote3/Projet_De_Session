<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Group;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class GroupController extends Controller
{
    /**
     * Display a listing of groups
     */
    public function index(): JsonResponse
    {
        $groups = Group::with(['users', 'permissions'])->get();
        return response()->json($groups);
    }

    /**
     * Store a newly created group
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:groups,name',
            'description' => 'nullable|string',
            'quota' => 'nullable|integer|min:0',
            'max_booking_duration' => 'nullable|integer|min:1',
            'advance_booking_days' => 'nullable|integer|min:1',
            'permission_ids' => 'nullable|array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $group = Group::create($validator->except('permission_ids'));

        if ($request->has('permission_ids')) {
            $group->permissions()->attach($request->permission_ids);
        }

        return response()->json($group->load('permissions'), 201);
    }

    /**
     * Display the specified group
     */
    public function show(Group $group): JsonResponse
    {
        $group->load(['users', 'permissions']);
        return response()->json($group);
    }

    /**
     * Update the specified group
     */
    public function update(Request $request, Group $group): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|unique:groups,name,' . $group->id,
            'description' => 'nullable|string',
            'quota' => 'nullable|integer|min:0',
            'max_booking_duration' => 'nullable|integer|min:1',
            'advance_booking_days' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'permission_ids' => 'nullable|array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $group->update($validator->except('permission_ids'));

        if ($request->has('permission_ids')) {
            $group->permissions()->sync($request->permission_ids);
        }

        return response()->json($group->load('permissions'));
    }

    /**
     * Add users to group
     */
    public function addUsers(Request $request, Group $group): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $group->users()->syncWithoutDetaching($request->user_ids);

        return response()->json([
            'message' => 'Users added to group',
            'group' => $group->load('users'),
        ]);
    }

    /**
     * Add permissions to group
     */
    public function addPermissions(Request $request, Group $group): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $group->permissions()->syncWithoutDetaching($request->permission_ids);

        return response()->json([
            'message' => 'Permissions added to group',
            'group' => $group->load('permissions'),
        ]);
    }
}

