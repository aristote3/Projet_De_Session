<?php

namespace App\Services;

use App\Models\WaitingList;
use App\Models\Booking;
use App\Models\Resource;
use App\Jobs\SendBookingNotification;
use Illuminate\Support\Facades\DB;

class WaitingListService
{
    /**
     * Add a booking request to waiting list
     */
    public function addToWaitingList(int $resourceId, int $userId, string $date, string $startTime, string $endTime, int $priority = 0): WaitingList
    {
        return WaitingList::create([
            'resource_id' => $resourceId,
            'user_id' => $userId,
            'date' => $date,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'priority' => $priority,
            'status' => 'active',
        ]);
    }

    /**
     * Check and promote waiting list entries when a slot becomes available
     */
    public function checkAndPromote(int $resourceId, string $date, string $startTime, string $endTime): ?Booking
    {
        $resource = Resource::findOrFail($resourceId);

        // Find the highest priority waiting list entry for this slot
        $waitingEntry = WaitingList::where('resource_id', $resourceId)
            ->where('date', $date)
            ->where('start_time', $startTime)
            ->where('end_time', $endTime)
            ->where('status', 'active')
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'asc')
            ->first();

        if (!$waitingEntry) {
            return null;
        }

        // Check if resource is now available
        if (!$resource->isAvailableAt($date, $startTime, $endTime)) {
            return null;
        }

        DB::beginTransaction();
        try {
            // Create booking from waiting list entry
            $start = \Carbon\Carbon::parse($date . ' ' . $startTime);
            $end = \Carbon\Carbon::parse($date . ' ' . $endTime);
            $duration = $start->diffInHours($end, true);

            $booking = Booking::create([
                'resource_id' => $resourceId,
                'user_id' => $waitingEntry->user_id,
                'date' => $date,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration' => $duration,
                'status' => 'pending',
            ]);

            // Mark waiting list entry as promoted
            $waitingEntry->update([
                'status' => 'promoted',
                'notified_at' => now(),
            ]);

            // Send notification
            SendBookingNotification::dispatch($booking, 'promoted_from_waiting_list');

            DB::commit();
            return $booking;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get waiting list for a resource and date
     */
    public function getWaitingList(int $resourceId, ?string $date = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = WaitingList::with(['resource', 'user'])
            ->where('resource_id', $resourceId)
            ->where('status', 'active');

        if ($date) {
            $query->where('date', $date);
        }

        return $query->orderBy('priority', 'desc')
                    ->orderBy('created_at', 'asc')
                    ->get();
    }

    /**
     * Remove from waiting list
     */
    public function removeFromWaitingList(int $waitingListId): bool
    {
        $entry = WaitingList::findOrFail($waitingListId);
        $entry->update(['status' => 'cancelled']);
        return true;
    }
}

