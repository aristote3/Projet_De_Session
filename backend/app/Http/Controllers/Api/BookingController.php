<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Display a listing of bookings
     */
    public function index(Request $request)
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

        // Pagination
        $perPage = $request->get('per_page', 15);
        $bookings = $query->orderBy('date', 'desc')->paginate($perPage);

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
     * Store a newly created booking
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'resource_id' => 'required|exists:resources,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string',
            'is_recurring' => 'nullable|boolean',
            'recurring_frequency' => 'nullable|in:daily,weekly,monthly',
            'recurring_until' => 'nullable|date|after:date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $resource = Resource::findOrFail($request->resource_id);

        // Check availability
        $overlapping = Booking::where('resource_id', $resource->id)
            ->where('date', $request->date)
            ->where('status', '!=', 'cancelled')
            ->where(function($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                      ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                      ->orWhere(function($q) use ($request) {
                          $q->where('start_time', '<=', $request->start_time)
                            ->where('end_time', '>=', $request->end_time);
                      });
            })
            ->exists();

        if ($overlapping) {
            return response()->json([
                'message' => 'Time slot is already booked',
                'errors' => ['time' => ['This time slot is not available']]
            ], 409);
        }

        // Calculate duration
        $start = \Carbon\Carbon::parse($request->date . ' ' . $request->start_time);
        $end = \Carbon\Carbon::parse($request->date . ' ' . $request->end_time);
        $duration = $start->diffInHours($end);

        $bookingData = $validator->validated();
        $bookingData['user_id'] = auth()->id() ?? 1; // TODO: Use actual auth
        $bookingData['duration'] = $duration;
        $bookingData['status'] = 'pending';

        $booking = Booking::create($bookingData);

        return response()->json([
            'data' => $booking->load(['resource', 'user']),
            'message' => 'Booking created successfully'
        ], 201);
    }

    /**
     * Display the specified booking
     */
    public function show(Booking $booking)
    {
        return response()->json([
            'data' => $booking->load(['resource', 'user', 'childBookings'])
        ]);
    }

    /**
     * Update the specified booking
     */
    public function update(Request $request, Booking $booking)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:pending,approved,rejected,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking->update($validator->validated());

        return response()->json([
            'data' => $booking->load(['resource', 'user']),
            'message' => 'Booking updated successfully'
        ]);
    }

    /**
     * Cancel the specified booking
     */
    public function cancel(Booking $booking)
    {
        if ($booking->status === 'cancelled') {
            return response()->json([
                'message' => 'Booking is already cancelled'
            ], 400);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json([
            'data' => $booking->load(['resource', 'user']),
            'message' => 'Booking cancelled successfully'
        ]);
    }

    /**
     * Approve the specified booking
     */
    public function approve(Booking $booking)
    {
        if ($booking->status === 'approved') {
            return response()->json([
                'message' => 'Booking is already approved'
            ], 400);
        }

        $booking->update(['status' => 'approved']);

        return response()->json([
            'data' => $booking->load(['resource', 'user']),
            'message' => 'Booking approved successfully'
        ]);
    }

    /**
     * Reject the specified booking
     */
    public function reject(Booking $booking)
    {
        if ($booking->status === 'rejected') {
            return response()->json([
                'message' => 'Booking is already rejected'
            ], 400);
        }

        $booking->update(['status' => 'rejected']);

        return response()->json([
            'data' => $booking->load(['resource', 'user']),
            'message' => 'Booking rejected successfully'
        ]);
    }
}

