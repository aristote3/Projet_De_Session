<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaitingList;
use App\Services\WaitingListService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class WaitingListController extends Controller
{
    protected $waitingListService;

    public function __construct(WaitingListService $waitingListService)
    {
        $this->waitingListService = $waitingListService;
    }

    /**
     * Get waiting list entries
     */
    public function index(Request $request): JsonResponse
    {
        $query = WaitingList::with(['resource', 'user'])
            ->where('status', 'active');

        if ($request->has('resource_id')) {
            $query->where('resource_id', $request->resource_id);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('date')) {
            $query->where('date', $request->date);
        }

        $entries = $query->orderBy('priority', 'desc')
                        ->orderBy('created_at', 'asc')
                        ->paginate(15);

        return response()->json($entries);
    }

    /**
     * Add to waiting list
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'resource_id' => 'required|exists:resources,id',
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'priority' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $entry = $this->waitingListService->addToWaitingList(
            $request->resource_id,
            $request->user_id,
            $request->date,
            $request->start_time,
            $request->end_time,
            $request->get('priority', 0)
        );

        return response()->json($entry->load(['resource', 'user']), 201);
    }

    /**
     * Remove from waiting list
     */
    public function destroy(WaitingList $waitingList): JsonResponse
    {
        $this->waitingListService->removeFromWaitingList($waitingList->id);
        return response()->json(['message' => 'Removed from waiting list']);
    }

    /**
     * Manually promote waiting list entry to booking
     */
    public function promote(WaitingList $waitingList): JsonResponse
    {
        $booking = $this->waitingListService->checkAndPromote(
            $waitingList->resource_id,
            $waitingList->date->toDateString(),
            $waitingList->start_time,
            $waitingList->end_time
        );

        if ($booking) {
            return response()->json([
                'message' => 'Promoted to booking successfully',
                'booking' => $booking->load(['resource', 'user'])
            ]);
        }

        return response()->json([
            'message' => 'Cannot promote: resource is not available'
        ], 422);
    }
}

