<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\GoogleCalendarService;
use App\Services\OutlookCalendarService;

class CalendarController extends Controller
{
    /**
     * Get calendar events with multiple view support (day/week/month)
     */
    public function events(Request $request): JsonResponse
    {
        $viewType = $request->get('view', 'month'); // day, week, month
        $date = $request->get('date', now()->toDateString());

        $query = Booking::with(['resource', 'user'])
            ->where('status', 'approved');

        // Calculate date range based on view type
        $startDate = \Carbon\Carbon::parse($date);
        $endDate = clone $startDate;

        switch ($viewType) {
            case 'day':
                $endDate = clone $startDate;
                break;
            case 'week':
                $startDate->startOfWeek();
                $endDate->endOfWeek();
                break;
            case 'month':
            default:
                $startDate->startOfMonth();
                $endDate->endOfMonth();
                break;
        }

        $query->whereBetween('date', [$startDate->toDateString(), $endDate->toDateString()]);

        if ($request->has('resource_id')) {
            $query->where('resource_id', $request->resource_id);
        }

        $bookings = $query->orderBy('date')
                         ->orderBy('start_time')
                         ->get();

        $events = $bookings->map(function ($booking) {
            return [
                'id' => $booking->id,
                'title' => $booking->resource->name . ' - ' . $booking->user->name,
                'start' => $booking->date->format('Y-m-d') . 'T' . $booking->start_time,
                'end' => $booking->date->format('Y-m-d') . 'T' . $booking->end_time,
                'resource' => $booking->resource->name,
                'resource_id' => $booking->resource_id,
                'user' => $booking->user->name,
                'user_id' => $booking->user_id,
                'status' => $booking->status,
                'notes' => $booking->notes,
            ];
        });

        return response()->json([
            'view' => $viewType,
            'date' => $date,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'events' => $events,
        ]);
    }

    /**
     * Sync with Google Calendar
     */
    public function syncGoogle(Request $request): JsonResponse
    {
        $validator = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
        ]);

        $booking = Booking::with(['resource', 'user'])->findOrFail($request->booking_id);

        $googleService = new GoogleCalendarService();
        $eventId = $googleService->createEvent($booking);

        if ($eventId) {
            $booking->update(['google_calendar_event_id' => $eventId]);
            return response()->json(['message' => 'Synced with Google Calendar', 'event_id' => $eventId]);
        }

        return response()->json(['message' => 'Failed to sync with Google Calendar'], 500);
    }

    /**
     * Sync with Outlook Calendar
     */
    public function syncOutlook(Request $request): JsonResponse
    {
        $validator = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
        ]);

        $booking = Booking::with(['resource', 'user'])->findOrFail($request->booking_id);

        $outlookService = new OutlookCalendarService();
        $eventId = $outlookService->createEvent($booking);

        if ($eventId) {
            $booking->update(['outlook_calendar_event_id' => $eventId]);
            return response()->json(['message' => 'Synced with Outlook Calendar', 'event_id' => $eventId]);
        }

        return response()->json(['message' => 'Failed to sync with Outlook Calendar'], 500);
    }
}

