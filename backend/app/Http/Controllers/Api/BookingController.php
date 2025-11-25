<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Jobs\SendBookingNotification;
use App\Jobs\SendBookingConfirmation;
use App\Services\WaitingListService;
use App\Models\WaitingList;
use App\Models\ApprovalLevel;
use App\Models\CancellationPolicy;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings
     */
    public function index(Request $request): JsonResponse
    {
        $query = Booking::with(['resource', 'user']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by resource
        if ($request->has('resource_id')) {
            $query->where('resource_id', $request->resource_id);
        }

        // Filter by user
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        $bookings = $query->orderBy('date', 'desc')
                         ->orderBy('start_time', 'desc')
                         ->paginate(15);

        return response()->json($bookings);
    }

    /**
     * Store a newly created booking
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'resource_id' => 'required|exists:resources,id',
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string',
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'required_if:is_recurring,true|in:daily,weekly,monthly',
            'recurring_until' => 'required_if:is_recurring,true|date|after:date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check user quota
        $user = \App\Models\User::findOrFail($request->user_id);
        if ($user->hasReachedQuota()) {
            return response()->json([
                'message' => 'User has reached monthly booking quota',
                'quota' => $user->quota,
            ], 422);
        }

        // Check group quotas
        foreach ($user->groups as $group) {
            if ($group->quota) {
                $groupBookings = \App\Models\Booking::whereHas('user', function ($q) use ($group) {
                    $q->whereHas('groups', function ($q2) use ($group) {
                        $q2->where('groups.id', $group->id);
                    });
                })
                ->whereMonth('date', now()->month)
                ->whereYear('date', now()->year)
                ->where('status', '!=', 'cancelled')
                ->count();

                if ($groupBookings >= $group->quota) {
                    return response()->json([
                        'message' => "Group '{$group->name}' has reached monthly booking quota",
                        'group' => $group->name,
                        'quota' => $group->quota,
                    ], 422);
                }
            }

            // Check max booking duration (will be calculated later)

            if ($group->max_booking_duration && $duration > $group->max_booking_duration) {
                return response()->json([
                    'message' => "Booking duration exceeds group limit of {$group->max_booking_duration} hours",
                    'max_duration' => $group->max_booking_duration,
                ], 422);
            }

            // Check advance booking days
            if ($group->advance_booking_days) {
                $bookingDate = \Carbon\Carbon::parse($request->date);
                $daysInAdvance = now()->diffInDays($bookingDate, false);
                if ($daysInAdvance > $group->advance_booking_days) {
                    return response()->json([
                        'message' => "Cannot book more than {$group->advance_booking_days} days in advance",
                        'max_days' => $group->advance_booking_days,
                    ], 422);
                }
            }
        }

        // Calculate duration for group checks
        $start = \Carbon\Carbon::parse($request->date . ' ' . $request->start_time);
        $end = \Carbon\Carbon::parse($request->date . ' ' . $request->end_time);
        $duration = $start->diffInHours($end, true);

        // Re-check group max duration with calculated duration
        foreach ($user->groups as $group) {
            if ($group->max_booking_duration && $duration > $group->max_booking_duration) {
                return response()->json([
                    'message' => "Booking duration exceeds group limit of {$group->max_booking_duration} hours",
                    'max_duration' => $group->max_booking_duration,
                ], 422);
            }
        }

        // Check subscription
        if ($user->subscription && !$user->subscription->canMakeBooking()) {
            return response()->json([
                'message' => 'Subscription limit reached or subscription expired',
            ], 422);
        }

        // Get resource
        $resource = Resource::findOrFail($request->resource_id);

        // Calculate duration
        $start = \Carbon\Carbon::parse($request->date . ' ' . $request->start_time);
        $end = \Carbon\Carbon::parse($request->date . ' ' . $request->end_time);
        $duration = $start->diffInHours($end, true);

        // Check credits if resource is paid
        if ($resource->price > 0) {
            $totalCost = $resource->price * $duration;
            $totalCredits = \App\Models\UserCredit::getTotalCredits($user->id);

            if ($totalCredits < $totalCost) {
                return response()->json([
                    'message' => 'Insufficient credits',
                    'required' => $totalCost,
                    'available' => $totalCredits,
                ], 422);
            }
        }

        // Check availability
        $isAvailable = $resource->isAvailableAt($request->date, $request->start_time, $request->end_time);
        
        // If not available, check if user wants to join waiting list
        if (!$isAvailable) {
            if ($request->boolean('add_to_waiting_list')) {
                $waitingListService = new WaitingListService();
                $priority = $request->get('priority', 0);
                $waitingEntry = $waitingListService->addToWaitingList(
                    $request->resource_id,
                    $request->user_id,
                    $request->date,
                    $request->start_time,
                    $request->end_time,
                    $priority
                );
                
                return response()->json([
                    'message' => 'Resource not available. Added to waiting list.',
                    'waiting_list_id' => $waitingEntry->id
                ], 202);
            }
            
            return response()->json([
                'message' => 'Resource is not available at the requested time',
                'suggestion' => 'You can add this request to the waiting list by setting add_to_waiting_list=true'
            ], 422);
        }

        DB::beginTransaction();
        try {
            $booking = Booking::create([
                'resource_id' => $request->resource_id,
                'user_id' => $request->user_id,
                'date' => $request->date,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'duration' => $duration,
                'status' => 'pending',
                'notes' => $request->notes,
                'is_recurring' => $request->boolean('is_recurring'),
                'recurring_frequency' => $request->recurring_frequency,
                'recurring_until' => $request->recurring_until,
            ]);

            // Handle recurring bookings
            if ($request->boolean('is_recurring')) {
                $this->createRecurringBookings($booking);
            }

            // Create approval levels if multi-level approval is required
            $requiredApprovalLevels = $request->get('required_approval_levels', 1);
            if ($requiredApprovalLevels > 1) {
                $this->createApprovalLevels($booking, $requiredApprovalLevels);
            }

            // Deduct credits if resource is paid
            if ($resource->price > 0) {
                $totalCost = $resource->price * $duration;
                \App\Models\UserCredit::useCredits($user->id, $totalCost);
            }

            // Send notification
            SendBookingNotification::dispatch($booking);

            DB::commit();

            return response()->json($booking->load(['resource', 'user']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error creating booking: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified booking
     */
    public function show(Booking $booking): JsonResponse
    {
        $booking->load(['resource', 'user', 'childBookings']);
        return response()->json($booking);
    }

    /**
     * Update the specified booking
     */
    public function update(Request $request, Booking $booking): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date' => 'sometimes|date|after_or_equal:today',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check availability if time changed
        if ($request->has('date') || $request->has('start_time') || $request->has('end_time')) {
            $date = $request->date ?? $booking->date->toDateString();
            $startTime = $request->start_time ?? $booking->start_time;
            $endTime = $request->end_time ?? $booking->end_time;

            $resource = $booking->resource;
            if (!$resource->isAvailableAt($date, $startTime, $endTime)) {
                // Check if conflict is with the same booking
                $conflictingBooking = Booking::where('resource_id', $resource->id)
                    ->where('date', $date)
                    ->where('id', '!=', $booking->id)
                    ->where('status', 'approved')
                    ->where(function ($query) use ($startTime, $endTime) {
                        $query->where(function ($q) use ($startTime, $endTime) {
                            $q->where('start_time', '<', $endTime)
                              ->where('end_time', '>', $startTime);
                        });
                    })
                    ->exists();

                if ($conflictingBooking) {
                    return response()->json([
                        'message' => 'Resource is not available at the requested time'
                    ], 422);
                }
            }
        }

        $booking->update($validator->validated());

        return response()->json($booking->load(['resource', 'user']));
    }

    /**
     * Cancel the specified booking with policy check
     */
    public function cancel(Booking $booking): JsonResponse
    {
        // Get cancellation policy
        $policy = CancellationPolicy::where('resource_id', $booking->resource_id)
            ->where('is_active', true)
            ->first();

        if ($policy && !$policy->canCancel($booking)) {
            $hoursUntil = \Carbon\Carbon::parse($booking->date->format('Y-m-d') . ' ' . $booking->start_time)
                ->diffInHours(now(), false);
            
            return response()->json([
                'message' => "Booking cannot be cancelled. Minimum {$policy->hours_before} hours notice required.",
                'hours_until_booking' => abs($hoursUntil),
                'required_hours' => $policy->hours_before,
                'refund_amount' => 0,
            ], 422);
        }

        // Calculate refund if applicable
        $refundAmount = $policy ? $policy->calculateRefund($booking) : 0;

        DB::beginTransaction();
        try {
            $booking->update(['status' => 'cancelled']);

            // Refund credits if resource was paid
            if ($booking->resource->price > 0 && $refundAmount > 0) {
                \App\Models\UserCredit::create([
                    'user_id' => $booking->user_id,
                    'amount' => $refundAmount,
                    'type' => 'refund',
                    'source' => 'cancellation',
                    'notes' => "Refund for cancelled booking #{$booking->id}",
                ]);
            }

            // Cancel child bookings if recurring
            if ($booking->is_recurring) {
                $booking->childBookings()->update(['status' => 'cancelled']);
            }

            // Check waiting list and promote if possible
            $waitingListService = new WaitingListService();
            $waitingListService->checkAndPromote(
                $booking->resource_id,
                $booking->date->toDateString(),
                $booking->start_time,
                $booking->end_time
            );

            // Send cancellation notification
            SendBookingNotification::dispatch($booking, 'cancelled');

            DB::commit();

            return response()->json([
                'message' => 'Booking cancelled successfully',
                'refund_amount' => $refundAmount,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error cancelling booking: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Approve the specified booking (single level or multi-level)
     */
    public function approve(Request $request, Booking $booking): JsonResponse
    {
        if ($booking->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending bookings can be approved'
            ], 422);
        }

        $approverId = $request->get('approver_id', auth()->id() ?? 1);
        $level = $request->get('level', 1);
        $comments = $request->get('comments');

        // Check if multi-level approval is required
        $approvalLevels = ApprovalLevel::where('booking_id', $booking->id)->get();
        
        if ($approvalLevels->count() > 0) {
            // Multi-level approval
            $approvalLevel = ApprovalLevel::where('booking_id', $booking->id)
                ->where('level', $level)
                ->where('approver_id', $approverId)
                ->first();

            if (!$approvalLevel) {
                return response()->json([
                    'message' => 'Approval level not found or you are not authorized to approve this level'
                ], 422);
            }

            if ($approvalLevel->status !== 'pending') {
                return response()->json([
                    'message' => 'This approval level has already been processed'
                ], 422);
            }

            // Approve this level
            $approvalLevel->update([
                'status' => 'approved',
                'comments' => $comments,
                'approved_at' => now(),
            ]);

            // Check if all required levels are approved
            $requiredLevels = $approvalLevels->max('level');
            if (ApprovalLevel::allLevelsApproved($booking->id, $requiredLevels)) {
                // All levels approved, approve the booking
                if (!$booking->resource->isAvailableAt(
                    $booking->date->toDateString(),
                    $booking->start_time,
                    $booking->end_time
                )) {
                    return response()->json([
                        'message' => 'Resource is no longer available at this time'
                    ], 422);
                }

                $booking->update(['status' => 'approved']);
                SendBookingConfirmation::dispatch($booking);

                return response()->json([
                    'message' => 'All approval levels completed. Booking approved.',
                    'booking' => $booking->load(['resource', 'user'])
                ]);
            }

            return response()->json([
                'message' => "Approval level {$level} approved. Waiting for other levels.",
                'approved_levels' => ApprovalLevel::where('booking_id', $booking->id)
                    ->where('status', 'approved')
                    ->count(),
                'required_levels' => $requiredLevels,
            ]);
        } else {
            // Single level approval (original behavior)
            if (!$booking->resource->isAvailableAt(
                $booking->date->toDateString(),
                $booking->start_time,
                $booking->end_time
            )) {
                return response()->json([
                    'message' => 'Resource is no longer available at this time'
                ], 422);
            }

            $booking->update(['status' => 'approved']);
            SendBookingConfirmation::dispatch($booking);

            return response()->json(['message' => 'Booking approved successfully', 'booking' => $booking]);
        }
    }

    /**
     * Reject the specified booking
     */
    public function reject(Booking $booking): JsonResponse
    {
        if ($booking->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending bookings can be rejected'
            ], 422);
        }

        $booking->update(['status' => 'rejected']);

        // Reject child bookings if recurring
        if ($booking->is_recurring) {
            $booking->childBookings()->update(['status' => 'rejected']);
        }

        // Send rejection notification
        SendBookingNotification::dispatch($booking, 'rejected');

        return response()->json(['message' => 'Booking rejected']);
    }

    /**
     * Create recurring bookings
     */
    private function createRecurringBookings(Booking $parentBooking): void
    {
        $startDate = \Carbon\Carbon::parse($parentBooking->date);
        $endDate = \Carbon\Carbon::parse($parentBooking->recurring_until);
        $currentDate = $startDate->copy();

        $frequency = $parentBooking->recurring_frequency;
        $resource = $parentBooking->resource;

        while ($currentDate->lte($endDate)) {
            // Skip the first date (already created)
            if ($currentDate->gt($startDate)) {
                // Check availability
                if ($resource->isAvailableAt(
                    $currentDate->toDateString(),
                    $parentBooking->start_time,
                    $parentBooking->end_time
                )) {
                    Booking::create([
                        'resource_id' => $parentBooking->resource_id,
                        'user_id' => $parentBooking->user_id,
                        'date' => $currentDate->toDateString(),
                        'start_time' => $parentBooking->start_time,
                        'end_time' => $parentBooking->end_time,
                        'duration' => $parentBooking->duration,
                        'status' => 'pending',
                        'notes' => $parentBooking->notes,
                        'is_recurring' => false,
                        'parent_booking_id' => $parentBooking->id,
                    ]);
                }
            }

            // Move to next occurrence
            match ($frequency) {
                'daily' => $currentDate->addDay(),
                'weekly' => $currentDate->addWeek(),
                'monthly' => $currentDate->addMonth(),
            };
        }
    }

    /**
     * Create approval levels for multi-level approval
     */
    private function createApprovalLevels(Booking $booking, int $requiredLevels): void
    {
        // Get approvers (in production, this would come from configuration)
        // For now, using admin users
        $approvers = \App\Models\User::where('role', 'admin')
            ->orWhere('role', 'manager')
            ->limit($requiredLevels)
            ->get();

        if ($approvers->count() < $requiredLevels) {
            // Not enough approvers, use single approval
            return;
        }

        for ($level = 1; $level <= $requiredLevels; $level++) {
            $approver = $approvers[$level - 1] ?? $approvers->first();
            
            ApprovalLevel::create([
                'booking_id' => $booking->id,
                'level' => $level,
                'approver_id' => $approver->id,
                'status' => 'pending',
            ]);
        }
    }
}

