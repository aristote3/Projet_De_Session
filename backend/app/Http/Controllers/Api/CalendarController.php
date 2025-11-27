<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    /**
     * Get calendar events
     */
    public function events(Request $request)
    {
        $query = Booking::with(['resource', 'user'])
            ->where('status', '!=', 'cancelled');

        // Filter by resource
        if ($request->has('resource_id')) {
            $query->where('resource_id', $request->resource_id);
        }

        // Filter by date range
        if ($request->has('start')) {
            $query->where('date', '>=', $request->start);
        }

        if ($request->has('end')) {
            $query->where('date', '<=', $request->end);
        }

        $bookings = $query->get();

        $events = $bookings->map(function ($booking) {
            $dateStr = $booking->date ? $booking->date->format('Y-m-d') : date('Y-m-d');
            $start = $dateStr . 'T' . $booking->start_time;
            $end = $dateStr . 'T' . $booking->end_time;

            return [
                'id' => $booking->id,
                'title' => ($booking->resource?->name ?? 'Ressource') . ' - ' . ($booking->user?->name ?? 'Utilisateur'),
                'start' => $start,
                'end' => $end,
                'resource' => $booking->resource ? [
                    'id' => $booking->resource->id,
                    'name' => $booking->resource->name,
                ] : null,
                'user' => $booking->user ? [
                    'id' => $booking->user->id,
                    'name' => $booking->user->name,
                ] : null,
                'status' => $booking->status,
                'color' => $this->getStatusColor($booking->status),
            ];
        });

        return response()->json([
            'data' => $events
        ]);
    }

    /**
     * Sync with Google Calendar
     */
    public function syncGoogle(Request $request)
    {
        // TODO: Implement Google Calendar sync
        return response()->json([
            'message' => 'Google Calendar sync not implemented yet'
        ], 501);
    }

    /**
     * Sync with Outlook Calendar
     */
    public function syncOutlook(Request $request)
    {
        // TODO: Implement Outlook Calendar sync
        return response()->json([
            'message' => 'Outlook Calendar sync not implemented yet'
        ], 501);
    }

    /**
     * Get color for booking status
     */
    private function getStatusColor($status)
    {
        return match($status) {
            'pending' => '#faad14',
            'approved' => '#52c41a',
            'rejected' => '#ff4d4f',
            'cancelled' => '#8c8c8c',
            default => '#1890ff',
        };
    }
}

