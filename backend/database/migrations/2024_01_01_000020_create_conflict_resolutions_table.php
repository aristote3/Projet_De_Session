<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conflict_resolutions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->enum('conflict_type', ['time_overlap', 'resource_unavailable', 'quota_exceeded', 'other'])->default('time_overlap');
            $table->foreignId('conflict_with_booking_id')->nullable()->constrained('bookings')->onDelete('set null');
            $table->enum('resolution_type', ['manual', 'auto_cancel', 'auto_reschedule', 'waiting_list'])->default('manual');
            $table->foreignId('resolved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('resolution_notes')->nullable();
            $table->enum('status', ['pending', 'resolved', 'escalated'])->default('pending');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['booking_id', 'status']);
            $table->index('conflict_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conflict_resolutions');
    }
};

