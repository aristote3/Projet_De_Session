<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->decimal('duration', 5, 2)->comment('Duration in hours');
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->enum('recurring_frequency', ['daily', 'weekly', 'monthly'])->nullable();
            $table->date('recurring_until')->nullable();
            $table->foreignId('parent_booking_id')->nullable()->constrained('bookings')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index('date');
            $table->index('status');
            $table->index(['resource_id', 'date']);
            $table->index(['user_id', 'date']);

            // Unique constraint to prevent double bookings
            // Validation is handled at application level to ensure no overlapping bookings
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};

