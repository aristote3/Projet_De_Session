<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Resource;
use App\Models\User;
use App\Models\ConflictResolution;
use App\Models\BusinessRule;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Get admin dashboard data
     */
    public function dashboard()
    {
        $stats = [
            'total_resources' => Resource::count(),
            'total_users' => User::count(),
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'approved_bookings' => Booking::where('status', 'approved')->count(),
            'today_bookings' => Booking::where('date', today())->count(),
            'upcoming_bookings' => Booking::where('date', '>=', today())
                ->where('status', 'approved')
                ->count(),
        ];

        $recentBookings = Booking::with(['resource', 'user'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Get clients (managers) with their statistics
        $clients = User::where('role', 'manager')
            ->withCount(['bookings' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->get()
            ->map(function ($manager) {
                // Get resources count for this manager
                // Note: Since resources table doesn't have created_by, we count all resources
                // In a real multi-tenant system, you'd filter by organization/tenant
                $resourcesCount = Resource::count(); // Simplified - all resources
                
                // Calculate revenue (simplified - can be enhanced)
                $revenue = Booking::whereHas('user', function ($q) use ($manager) {
                    // Get bookings from users in this manager's organization
                    // This is simplified - in real app, you'd have organization/tenant structure
                })
                ->where('status', 'approved')
                ->sum(DB::raw('duration * 10')); // Simplified revenue calculation

                return [
                    'id' => $manager->id,
                    'name' => $manager->name . ' Organization', // Simplified
                    'manager' => $manager->name,
                    'email' => $manager->email,
                    'phone' => null, // TODO: Add phone field to users table
                    'subscription' => 'Premium', // TODO: Add subscription model
                    'status' => $manager->status ?? 'active',
                    'users' => User::where('role', 'user')->count(), // Simplified
                    'resources' => $resourcesCount,
                    'bookings' => $manager->bookings_count,
                    'revenue' => $revenue,
                    'quota' => [
                        'maxUsers' => $manager->quota ?? 100,
                        'maxResources' => 50,
                        'maxBookings' => 1000,
                    ],
                    'billing' => [
                        'plan' => 'Premium',
                        'price' => 299,
                        'billingCycle' => 'monthly',
                        'nextBilling' => now()->addMonth()->format('Y-m-d'),
                    ],
                    'createdAt' => $manager->created_at->format('Y-m-d'),
                    'growth' => 0, // TODO: Calculate growth
                    'lastActivity' => $manager->updated_at->toIso8601String(),
                ];
            });

        return response()->json([
            'data' => [
                'stats' => $stats,
                'recent_bookings' => $recentBookings,
                'clients' => $clients,
            ]
        ]);
    }

    /**
     * Get attendance report
     */
    public function attendanceReport(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $report = Booking::whereBetween('date', [$startDate, $endDate])
            ->where('status', 'approved')
            ->select(
                DB::raw('DATE(date) as booking_date'),
                DB::raw('COUNT(*) as total_bookings'),
                DB::raw('COUNT(DISTINCT user_id) as unique_users'),
                DB::raw('SUM(duration) as total_hours')
            )
            ->groupBy('booking_date')
            ->orderBy('booking_date')
            ->get();

        return response()->json([
            'data' => $report,
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }

    /**
     * Get revenue report
     */
    public function revenueReport(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        // TODO: Implement revenue calculation when pricing is fully implemented
        $report = Booking::whereBetween('date', [$startDate, $endDate])
            ->where('status', 'approved')
            ->with('resource')
            ->get()
            ->map(function ($booking) {
                $price = $booking->resource->price ?? 0;
                $revenue = $price * $booking->duration;
                return [
                    'booking_id' => $booking->id,
                    'date' => $booking->date,
                    'resource' => $booking->resource->name,
                    'duration' => $booking->duration,
                    'price_per_hour' => $price,
                    'revenue' => $revenue,
                ];
            });

        $totalRevenue = $report->sum('revenue');

        return response()->json([
            'data' => $report,
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_bookings' => $report->count(),
                'period' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ]
            ]
        ]);
    }

    /**
     * Get utilization statistics
     */
    public function utilizationStats(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $stats = Resource::withCount([
            'bookings' => function ($query) use ($startDate, $endDate) {
                $query->whereBetween('date', [$startDate, $endDate])
                      ->where('status', 'approved');
            }
        ])
        ->with(['bookings' => function ($query) use ($startDate, $endDate) {
            $query->whereBetween('date', [$startDate, $endDate])
                  ->where('status', 'approved');
        }])
        ->get()
        ->map(function ($resource) use ($startDate, $endDate) {
            $totalHours = $resource->bookings->sum('duration');
            $daysInPeriod = Carbon::parse($startDate)->diffInDays(Carbon::parse($endDate)) + 1;
            $maxHours = $daysInPeriod * 8; // Assuming 8 hours per day
            $utilization = $maxHours > 0 ? ($totalHours / $maxHours) * 100 : 0;

            return [
                'resource_id' => $resource->id,
                'resource_name' => $resource->name,
                'total_bookings' => $resource->bookings_count,
                'total_hours' => $totalHours,
                'utilization_percentage' => round($utilization, 2),
            ];
        });

        return response()->json([
            'data' => $stats,
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }

    /**
     * Get conflicts
     */
    public function conflicts(Request $request)
    {
        $query = ConflictResolution::with(['booking', 'conflictWithBooking', 'resolvedBy']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $conflicts = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'data' => $conflicts
        ]);
    }

    /**
     * Resolve conflict
     */
    public function resolveConflict(Request $request, ConflictResolution $conflict)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'resolution_type' => 'required|in:manual,auto_cancel,auto_reschedule,waiting_list',
            'resolution_notes' => 'nullable|string',
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
                'message' => 'Vous devez être connecté pour résoudre un conflit'
            ], 401);
        }

        $conflict->update([
            'resolution_type' => $request->resolution_type,
            'resolution_notes' => $request->resolution_notes,
            'resolved_by' => auth()->id(),
            'status' => 'resolved',
            'resolved_at' => now(),
        ]);

        return response()->json([
            'data' => $conflict->load(['booking', 'conflictWithBooking', 'resolvedBy']),
            'message' => 'Conflict resolved successfully'
        ]);
    }

    /**
     * Get business rules
     */
    public function businessRules()
    {
        $rules = BusinessRule::where('is_active', true)
            ->orderBy('priority', 'desc')
            ->get();

        return response()->json([
            'data' => $rules
        ]);
    }

    /**
     * Create business rule
     */
    public function createBusinessRule(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'nullable|string',
            'rule_type' => 'required|string',
            'conditions' => 'required|array',
            'actions' => 'required|array',
            'priority' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $rule = BusinessRule::create($validator->validated());

        return response()->json([
            'data' => $rule,
            'message' => 'Business rule created successfully'
        ], 201);
    }

    /**
     * Update business rule
     */
    public function updateBusinessRule(Request $request, BusinessRule $businessRule)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'nullable|string',
            'rule_type' => 'sometimes|required|string',
            'conditions' => 'sometimes|required|array',
            'actions' => 'sometimes|required|array',
            'priority' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $businessRule->update($validator->validated());

        return response()->json([
            'data' => $businessRule,
            'message' => 'Business rule updated successfully'
        ]);
    }

    /**
     * Get audit trail
     */
    public function auditTrail(Request $request)
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

        $perPage = $request->get('per_page', 50);
        $logs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => $logs->items(),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
                'last_page' => $logs->lastPage(),
            ]
        ]);
    }

    /**
     * Get error logs from Laravel log file
     */
    public function errorLogs(Request $request)
    {
        $logFile = storage_path('logs/laravel.log');
        $lines = $request->get('lines', 100);
        
        if (!file_exists($logFile)) {
            return response()->json([
                'data' => [],
                'message' => 'Log file not found'
            ]);
        }

        $errorLogs = [];
        $file = new \SplFileObject($logFile);
        $file->seek(PHP_INT_MAX);
        $totalLines = $file->key();
        
        // Read last N lines
        $startLine = max(0, $totalLines - $lines);
        $file->seek($startLine);
        
        $currentLog = null;
        while (!$file->eof()) {
            $line = $file->current();
            $file->next();
            
            // Parse Laravel log format: [YYYY-MM-DD HH:MM:SS] local.LEVEL: message
            if (preg_match('/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\] (\w+)\.(\w+): (.+)$/', $line, $matches)) {
                if ($currentLog) {
                    $errorLogs[] = $currentLog;
                }
                
                $currentLog = [
                    'timestamp' => $matches[1],
                    'environment' => $matches[2],
                    'level' => strtolower($matches[3]),
                    'message' => $matches[4],
                    'stack' => '',
                ];
            } elseif ($currentLog && (strpos($line, 'Stack trace:') !== false || strpos($line, 'at ') !== false)) {
                $currentLog['stack'] .= $line . "\n";
            } elseif ($currentLog && trim($line) !== '') {
                $currentLog['message'] .= "\n" . trim($line);
            }
        }
        
        if ($currentLog) {
            $errorLogs[] = $currentLog;
        }
        
        // Filter by level if requested
        if ($request->has('level')) {
            $errorLogs = array_filter($errorLogs, function($log) use ($request) {
                return $log['level'] === $request->level;
            });
        }
        
        // Reverse to show newest first
        $errorLogs = array_reverse($errorLogs);
        
        return response()->json([
            'data' => array_values($errorLogs),
            'total' => count($errorLogs)
        ]);
    }

    /**
     * Get API usage statistics from Telescope
     */
    public function apiUsage(Request $request)
    {
        try {
            // Use Telescope data if available
            $telescopeEnabled = config('telescope.enabled', false);
            
            if ($telescopeEnabled && DB::connection()->getDatabaseName()) {
                $startDate = $request->get('start_date', now()->subDays(7)->toDateString());
                $endDate = $request->get('end_date', now()->toDateString());
                
                $usage = DB::table('telescope_entries')
                    ->where('type', 'request')
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->select(
                        DB::raw('content->>"$.uri" as endpoint'),
                        DB::raw('content->>"$.method" as method'),
                        DB::raw('COUNT(*) as requests'),
                        DB::raw('AVG(CAST(content->>"$.duration" AS UNSIGNED)) as avg_response_time')
                    )
                    ->groupBy('endpoint', 'method')
                    ->orderBy('requests', 'desc')
                    ->get()
                    ->map(function ($item) {
                        return [
                            'endpoint' => $item->endpoint ?? 'unknown',
                            'method' => $item->method ?? 'GET',
                            'requests' => (int)$item->requests,
                            'avgResponseTime' => round($item->avg_response_time ?? 0, 2),
                            'errorRate' => 0, // Would need to calculate from exceptions
                        ];
                    });
                
                return response()->json([
                    'data' => $usage,
                    'period' => [
                        'start_date' => $startDate,
                        'end_date' => $endDate,
                    ]
                ]);
            }
            
            // Fallback: return empty array if Telescope not available
            return response()->json([
                'data' => [],
                'message' => 'Telescope not enabled or database not available'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'data' => [],
                'message' => 'Error fetching API usage: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get security events (failed logins, unauthorized access, etc.)
     */
    public function securityEvents(Request $request)
    {
        $query = AuditLog::with('user')
            ->whereIn('action', ['failed_login', 'unauthorized_access', 'suspicious_activity'])
            ->orWhere(function($q) {
                $q->where('action', 'delete')
                  ->where('model_type', 'App\Models\User');
            });

        if ($request->has('severity')) {
            // Map severity to actions
            $severityMap = [
                'high' => ['unauthorized_access', 'suspicious_activity'],
                'medium' => ['failed_login'],
                'low' => ['delete'],
            ];
            
            if (isset($severityMap[$request->severity])) {
                $query->whereIn('action', $severityMap[$request->severity]);
            }
        }

        $perPage = $request->get('per_page', 50);
        $events = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $eventsData = $events->map(function ($log) {
            $severity = 'low';
            if (in_array($log->action, ['unauthorized_access', 'suspicious_activity'])) {
                $severity = 'high';
            } elseif ($log->action === 'failed_login') {
                $severity = 'medium';
            }

            return [
                'id' => $log->id,
                'timestamp' => $log->created_at,
                'type' => $log->action,
                'user' => $log->user ? $log->user->email : 'Unknown',
                'ip' => $log->ip_address,
                'details' => $log->changes ? json_encode($log->changes) : $log->action,
                'severity' => $severity,
            ];
        });

        return response()->json([
            'data' => $eventsData,
            'meta' => [
                'current_page' => $events->currentPage(),
                'per_page' => $events->perPage(),
                'total' => $events->total(),
                'last_page' => $events->lastPage(),
            ]
        ]);
    }
}

