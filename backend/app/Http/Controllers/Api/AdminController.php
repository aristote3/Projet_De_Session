<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Resource;
use App\Models\User;
use App\Models\AuditLog;
use App\Models\ConflictResolution;
use App\Models\BusinessRule;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function dashboard(Request $request): JsonResponse
    {
        $period = $request->get('period', 'month'); // day, week, month, year
        $startDate = $this->getStartDate($period);
        $endDate = now();

        $stats = [
            'period' => $period,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'bookings' => [
                'total' => Booking::whereBetween('created_at', [$startDate, $endDate])->count(),
                'approved' => Booking::whereBetween('created_at', [$startDate, $endDate])->where('status', 'approved')->count(),
                'pending' => Booking::whereBetween('created_at', [$startDate, $endDate])->where('status', 'pending')->count(),
                'cancelled' => Booking::whereBetween('created_at', [$startDate, $endDate])->where('status', 'cancelled')->count(),
            ],
            'resources' => [
                'total' => Resource::count(),
                'available' => Resource::where('status', 'available')->count(),
                'busy' => Resource::where('status', 'busy')->count(),
                'maintenance' => Resource::where('status', 'maintenance')->count(),
            ],
            'users' => [
                'total' => User::count(),
                'active' => User::where('status', 'active')->count(),
                'with_bookings' => User::whereHas('bookings', function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('created_at', [$startDate, $endDate]);
                })->count(),
            ],
            'revenue' => $this->calculateRevenue($startDate, $endDate),
            'utilization' => $this->calculateUtilization($startDate, $endDate),
            'top_resources' => $this->getTopResources($startDate, $endDate),
            'recent_activity' => AuditLog::with('user')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Get attendance report
     */
    public function attendanceReport(Request $request): JsonResponse
    {
        $startDate = Carbon::parse($request->get('start_date', now()->startOfMonth()));
        $endDate = Carbon::parse($request->get('end_date', now()->endOfMonth()));
        $groupBy = $request->get('group_by', 'day'); // day, week, month

        $bookings = Booking::whereBetween('date', [$startDate, $endDate])
            ->where('status', 'approved')
            ->select(
                DB::raw("DATE(date) as period"),
                DB::raw("COUNT(*) as count"),
                DB::raw("SUM(duration) as total_hours")
            )
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        $attendance = [];
        foreach ($bookings as $booking) {
            $attendance[] = [
                'period' => $booking->period,
                'bookings_count' => $booking->count,
                'total_hours' => (float)$booking->total_hours,
            ];
        }

        return response()->json([
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'attendance' => $attendance,
            'summary' => [
                'total_bookings' => array_sum(array_column($attendance, 'bookings_count')),
                'total_hours' => array_sum(array_column($attendance, 'total_hours')),
            ],
        ]);
    }

    /**
     * Get revenue report
     */
    public function revenueReport(Request $request): JsonResponse
    {
        $startDate = Carbon::parse($request->get('start_date', now()->startOfMonth()));
        $endDate = Carbon::parse($request->get('end_date', now()->endOfMonth()));

        $revenue = $this->calculateRevenue($startDate, $endDate, true);

        return response()->json([
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'revenue' => $revenue,
        ]);
    }

    /**
     * Get conflicts and exceptions
     */
    public function conflicts(Request $request): JsonResponse
    {
        $query = ConflictResolution::with(['booking.resource', 'booking.user', 'conflictWithBooking', 'resolver']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('conflict_type')) {
            $query->where('conflict_type', $request->conflict_type);
        }

        $conflicts = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($conflicts);
    }

    /**
     * Resolve a conflict
     */
    public function resolveConflict(Request $request, ConflictResolution $conflict): JsonResponse
    {
        $validator = $request->validate([
            'resolution_type' => 'required|in:manual,auto_cancel,auto_reschedule,waiting_list',
            'resolution_notes' => 'nullable|string',
        ]);

        DB::beginTransaction();
        try {
            $conflict->update([
                'resolution_type' => $request->resolution_type,
                'resolution_notes' => $request->resolution_notes,
                'resolved_by' => auth()->id() ?? 1,
                'status' => 'resolved',
                'resolved_at' => now(),
            ]);

            // Apply resolution
            match($request->resolution_type) {
                'auto_cancel' => $conflict->booking->update(['status' => 'cancelled']),
                'auto_reschedule' => $this->rescheduleBooking($conflict->booking),
                'waiting_list' => (new \App\Services\WaitingListService())->addToWaitingList(
                    $conflict->booking->resource_id,
                    $conflict->booking->user_id,
                    $conflict->booking->date->toDateString(),
                    $conflict->booking->start_time,
                    $conflict->booking->end_time
                ),
                default => null,
            };

            // Log action
            AuditLog::log('conflict_resolved', $conflict, auth()->id() ?? 1, $validator);

            DB::commit();

            return response()->json([
                'message' => 'Conflict resolved successfully',
                'conflict' => $conflict->load(['booking', 'resolver']),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error resolving conflict: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get business rules
     */
    public function businessRules(): JsonResponse
    {
        $rules = BusinessRule::orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($rules);
    }

    /**
     * Create business rule
     */
    public function createBusinessRule(Request $request): JsonResponse
    {
        $validator = $request->validate([
            'name' => 'required|string',
            'category' => 'nullable|string',
            'rule_type' => 'required|string',
            'conditions' => 'required|array',
            'actions' => 'required|array',
            'priority' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $rule = BusinessRule::create($validator);

        AuditLog::log('business_rule_created', $rule, auth()->id() ?? 1, $validator);

        return response()->json($rule, 201);
    }

    /**
     * Update business rule
     */
    public function updateBusinessRule(Request $request, BusinessRule $businessRule): JsonResponse
    {
        $validator = $request->validate([
            'name' => 'sometimes|string',
            'category' => 'nullable|string',
            'rule_type' => 'sometimes|string',
            'conditions' => 'sometimes|array',
            'actions' => 'sometimes|array',
            'priority' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);

        $oldData = $businessRule->toArray();
        $businessRule->update($validator);

        AuditLog::log('business_rule_updated', $businessRule, auth()->id() ?? 1, [
            'old' => $oldData,
            'new' => $businessRule->toArray(),
        ]);

        return response()->json($businessRule);
    }

    /**
     * Get audit trail
     */
    public function auditTrail(Request $request): JsonResponse
    {
        $query = AuditLog::with('user');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        if ($request->has('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        if ($request->has('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('created_at', '<=', $request->end_date);
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(50);

        return response()->json($logs);
    }

    /**
     * Get utilization statistics
     */
    public function utilizationStats(Request $request): JsonResponse
    {
        $startDate = Carbon::parse($request->get('start_date', now()->startOfMonth()));
        $endDate = Carbon::parse($request->get('end_date', now()->endOfMonth()));

        $utilization = $this->calculateUtilization($startDate, $endDate, true);

        return response()->json([
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'utilization' => $utilization,
        ]);
    }

    /**
     * Helper: Get start date based on period
     */
    private function getStartDate(string $period): Carbon
    {
        return match($period) {
            'day' => now()->startOfDay(),
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
            default => now()->startOfMonth(),
        };
    }

    /**
     * Helper: Calculate revenue
     */
    private function calculateRevenue(Carbon $startDate, Carbon $endDate, bool $detailed = false): array
    {
        $bookings = Booking::whereBetween('date', [$startDate, $endDate])
            ->where('status', 'approved')
            ->with('resource')
            ->get();

        $totalRevenue = 0;
        $byResource = [];
        $byCategory = [];

        foreach ($bookings as $booking) {
            $resource = $booking->resource;
            if ($resource && $resource->price > 0) {
                $amount = $resource->price * $booking->duration;
                $totalRevenue += $amount;

                if ($detailed) {
                    // By resource
                    if (!isset($byResource[$resource->id])) {
                        $byResource[$resource->id] = [
                            'resource_id' => $resource->id,
                            'resource_name' => $resource->name,
                            'revenue' => 0,
                            'bookings_count' => 0,
                        ];
                    }
                    $byResource[$resource->id]['revenue'] += $amount;
                    $byResource[$resource->id]['bookings_count']++;

                    // By category
                    if (!isset($byCategory[$resource->category])) {
                        $byCategory[$resource->category] = [
                            'category' => $resource->category,
                            'revenue' => 0,
                            'bookings_count' => 0,
                        ];
                    }
                    $byCategory[$resource->category]['revenue'] += $amount;
                    $byCategory[$resource->category]['bookings_count']++;
                }
            }
        }

        $result = ['total' => round($totalRevenue, 2)];

        if ($detailed) {
            $result['by_resource'] = array_values($byResource);
            $result['by_category'] = array_values($byCategory);
        }

        return $result;
    }

    /**
     * Helper: Calculate utilization
     */
    private function calculateUtilization(Carbon $startDate, Carbon $endDate, bool $detailed = false): array
    {
        $resources = Resource::all();
        $utilization = [];

        foreach ($resources as $resource) {
            $bookings = Booking::where('resource_id', $resource->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->where('status', 'approved')
                ->get();

            $totalHours = $bookings->sum('duration');
            $daysInPeriod = $startDate->diffInDays($endDate) + 1;
            $openingHours = $this->getOpeningHours($resource);
            $maxPossibleHours = $daysInPeriod * $openingHours;
            $utilizationRate = $maxPossibleHours > 0 ? ($totalHours / $maxPossibleHours) * 100 : 0;

            $utilization[] = [
                'resource_id' => $resource->id,
                'resource_name' => $resource->name,
                'total_hours' => round($totalHours, 2),
                'bookings_count' => $bookings->count(),
                'utilization_rate' => round($utilizationRate, 2),
            ];
        }

        usort($utilization, fn($a, $b) => $b['utilization_rate'] <=> $a['utilization_rate']);

        return $detailed ? $utilization : [
            'average' => round(array_sum(array_column($utilization, 'utilization_rate')) / count($utilization), 2),
            'top_5' => array_slice($utilization, 0, 5),
        ];
    }

    /**
     * Helper: Get opening hours
     */
    private function getOpeningHours(Resource $resource): float
    {
        if (!$resource->opening_hours_start || !$resource->opening_hours_end) {
            return 24; // Default 24 hours
        }

        $start = Carbon::parse($resource->opening_hours_start);
        $end = Carbon::parse($resource->opening_hours_end);
        
        if ($end->lt($start)) {
            $end->addDay(); // Handle overnight hours
        }

        return $start->diffInHours($end);
    }

    /**
     * Helper: Get top resources
     */
    private function getTopResources(Carbon $startDate, Carbon $endDate, int $limit = 5): array
    {
        $resources = Resource::withCount(['bookings' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('date', [$startDate, $endDate])
                  ->where('status', 'approved');
        }])
        ->orderBy('bookings_count', 'desc')
        ->limit($limit)
        ->get();

        return $resources->map(function ($resource) {
            return [
                'id' => $resource->id,
                'name' => $resource->name,
                'bookings_count' => $resource->bookings_count,
            ];
        })->toArray();
    }

    /**
     * Helper: Reschedule booking
     */
    private function rescheduleBooking(Booking $booking): void
    {
        // Find next available slot
        $resource = $booking->resource;
        $currentDate = Carbon::parse($booking->date);
        
        for ($i = 1; $i <= 30; $i++) {
            $newDate = $currentDate->copy()->addDays($i);
            
            if ($resource->isAvailableAt(
                $newDate->toDateString(),
                $booking->start_time,
                $booking->end_time
            )) {
                $booking->update([
                    'date' => $newDate->toDateString(),
                ]);
                break;
            }
        }
    }
}

