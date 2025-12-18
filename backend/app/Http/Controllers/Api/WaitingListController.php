<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaitingList;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WaitingListController extends Controller
{
    /**
     * Display a listing of waiting lists
     */
    public function index(Request $request)
    {
        $query = WaitingList::with(['resource', 'user'])
            ->where('status', 'active');

        // Filter by resource
        if ($request->has('resource_id')) {
            $query->where('resource_id', $request->resource_id);
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $waitingLists = $query->orderBy('priority', 'desc')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'data' => $waitingLists
        ]);
    }

    /**
     * Store a newly created waiting list entry
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'resource_id' => 'required|exists:resources,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'priority' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier que l'utilisateur est authentifié
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Vous devez être connecté pour ajouter une entrée à la liste d\'attente'
            ], 401);
        }

        $waitingList = WaitingList::create([
            ...$validator->validated(),
            'user_id' => auth()->id(),
            'status' => 'active',
        ]);

        return response()->json([
            'data' => $waitingList->load(['resource', 'user']),
            'message' => 'Added to waiting list successfully'
        ], 201);
    }

    /**
     * Remove the specified waiting list entry
     */
    public function destroy(WaitingList $waitingList)
    {
        $waitingList->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Removed from waiting list successfully'
        ]);
    }

    /**
     * Promote waiting list entry to booking
     */
    public function promote(WaitingList $waitingList)
    {
        if ($waitingList->status !== 'active') {
            return response()->json([
                'message' => 'Waiting list entry is not active'
            ], 400);
        }

        // Check if slot is still available
        $overlapping = Booking::where('resource_id', $waitingList->resource_id)
            ->where('date', $waitingList->date)
            ->where('status', '!=', 'cancelled')
            ->where(function($query) use ($waitingList) {
                $query->whereBetween('start_time', [$waitingList->start_time, $waitingList->end_time])
                      ->orWhereBetween('end_time', [$waitingList->start_time, $waitingList->end_time])
                      ->orWhere(function($q) use ($waitingList) {
                          $q->where('start_time', '<=', $waitingList->start_time)
                            ->where('end_time', '>=', $waitingList->end_time);
                      });
            })
            ->exists();

        if ($overlapping) {
            return response()->json([
                'message' => 'Time slot is no longer available'
            ], 409);
        }

        // Create booking
        $start = \Carbon\Carbon::parse($waitingList->date . ' ' . $waitingList->start_time);
        $end = \Carbon\Carbon::parse($waitingList->date . ' ' . $waitingList->end_time);
        $duration = $start->diffInHours($end);

        $booking = Booking::create([
            'resource_id' => $waitingList->resource_id,
            'user_id' => $waitingList->user_id,
            'date' => $waitingList->date,
            'start_time' => $waitingList->start_time,
            'end_time' => $waitingList->end_time,
            'duration' => $duration,
            'status' => 'approved',
        ]);

        // Update waiting list status
        $waitingList->update([
            'status' => 'promoted',
            'notified_at' => now(),
        ]);

        return response()->json([
            'data' => [
                'booking' => $booking->load(['resource', 'user']),
                'waiting_list' => $waitingList,
            ],
            'message' => 'Waiting list entry promoted to booking successfully'
        ]);
    }
}

