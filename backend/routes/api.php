<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ResourceController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth routes (publiques - pas de middleware auth)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Auth routes protégées
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// Routes protégées par authentification
Route::middleware(['api', 'auth:sanctum'])->group(function () {
    // Resources
    Route::prefix('resources')->group(function () {
        Route::get('/', [ResourceController::class, 'index']);
        Route::post('/', [ResourceController::class, 'store']);
        Route::get('/{resource}', [ResourceController::class, 'show']);
        Route::put('/{resource}', [ResourceController::class, 'update']);
        Route::delete('/{resource}', [ResourceController::class, 'destroy']);
        Route::post('/{resource}/check-availability', [ResourceController::class, 'checkAvailability']);
    });

    // Bookings
    Route::prefix('bookings')->group(function () {
        Route::get('/', [BookingController::class, 'index']);
        Route::post('/', [BookingController::class, 'store']);
        Route::get('/{booking}', [BookingController::class, 'show']);
        Route::put('/{booking}', [BookingController::class, 'update']);
        Route::delete('/{booking}', [BookingController::class, 'cancel']);
        Route::post('/{booking}/approve', [BookingController::class, 'approve']);
        Route::post('/{booking}/reject', [BookingController::class, 'reject']);
    });

    // Calendar
    Route::prefix('calendar')->group(function () {
        Route::get('/events', [CalendarController::class, 'events']);
        Route::post('/sync/google', [CalendarController::class, 'syncGoogle']);
        Route::post('/sync/outlook', [CalendarController::class, 'syncOutlook']);
    });

    // Waiting List
    Route::prefix('waiting-list')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\WaitingListController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Api\WaitingListController::class, 'store']);
        Route::delete('/{waitingList}', [\App\Http\Controllers\Api\WaitingListController::class, 'destroy']);
        Route::post('/{waitingList}/promote', [\App\Http\Controllers\Api\WaitingListController::class, 'promote']);
    });

    // Users
    Route::prefix('users')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\UserController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Api\UserController::class, 'store']);
        Route::get('/{user}', [\App\Http\Controllers\Api\UserController::class, 'show']);
        Route::put('/{user}', [\App\Http\Controllers\Api\UserController::class, 'update']);
        Route::put('/{user}/profile', [\App\Http\Controllers\Api\UserController::class, 'updateProfile']);
        Route::get('/{user}/history', [\App\Http\Controllers\Api\UserController::class, 'bookingHistory']);
        Route::post('/{user}/credits', [\App\Http\Controllers\Api\UserController::class, 'addCredits']);
        Route::get('/{user}/credits', [\App\Http\Controllers\Api\UserController::class, 'getCredits']);
        Route::put('/{user}/subscription', [\App\Http\Controllers\Api\UserController::class, 'updateSubscription']);
        Route::put('/{user}/notifications', [\App\Http\Controllers\Api\UserController::class, 'updateNotificationPreferences']);
        Route::get('/{user}/permissions', [\App\Http\Controllers\Api\UserController::class, 'getPermissions']);
    });

    // Groups
    Route::prefix('groups')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\GroupController::class, 'index']);
        Route::post('/', [\App\Http\Controllers\Api\GroupController::class, 'store']);
        Route::get('/{group}', [\App\Http\Controllers\Api\GroupController::class, 'show']);
        Route::put('/{group}', [\App\Http\Controllers\Api\GroupController::class, 'update']);
        Route::post('/{group}/users', [\App\Http\Controllers\Api\GroupController::class, 'addUsers']);
        Route::post('/{group}/permissions', [\App\Http\Controllers\Api\GroupController::class, 'addPermissions']);
    });

    // Admin
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Api\AdminController::class, 'dashboard']);
        Route::get('/reports/attendance', [\App\Http\Controllers\Api\AdminController::class, 'attendanceReport']);
        Route::get('/reports/revenue', [\App\Http\Controllers\Api\AdminController::class, 'revenueReport']);
        Route::get('/reports/utilization', [\App\Http\Controllers\Api\AdminController::class, 'utilizationStats']);
        Route::get('/conflicts', [\App\Http\Controllers\Api\AdminController::class, 'conflicts']);
        Route::post('/conflicts/{conflict}/resolve', [\App\Http\Controllers\Api\AdminController::class, 'resolveConflict']);
        Route::get('/business-rules', [\App\Http\Controllers\Api\AdminController::class, 'businessRules']);
        Route::post('/business-rules', [\App\Http\Controllers\Api\AdminController::class, 'createBusinessRule']);
        Route::put('/business-rules/{businessRule}', [\App\Http\Controllers\Api\AdminController::class, 'updateBusinessRule']);
        Route::get('/audit-trail', [\App\Http\Controllers\Api\AdminController::class, 'auditTrail']);
        
        // Gestion des demandes de comptes en attente
        Route::get('/pending-requests', [\App\Http\Controllers\Api\UserController::class, 'pendingRequests']);
        Route::post('/users/{user}/approve', [\App\Http\Controllers\Api\UserController::class, 'approveRequest']);
        Route::post('/users/{user}/reject', [\App\Http\Controllers\Api\UserController::class, 'rejectRequest']);
    });

    // Messages & Broadcast
    Route::prefix('messages')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\MessageController::class, 'index']);
        Route::get('/sent', [\App\Http\Controllers\Api\MessageController::class, 'sent']);
        Route::get('/unread-count', [\App\Http\Controllers\Api\MessageController::class, 'unreadCount']);
        Route::post('/send', [\App\Http\Controllers\Api\MessageController::class, 'send']);
        Route::post('/broadcast', [\App\Http\Controllers\Api\MessageController::class, 'broadcast']);
        Route::post('/{message}/read', [\App\Http\Controllers\Api\MessageController::class, 'markAsRead']);
        Route::delete('/{message}', [\App\Http\Controllers\Api\MessageController::class, 'destroy']);
    });
});

