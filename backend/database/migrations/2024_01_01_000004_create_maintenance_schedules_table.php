<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained()->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->text('reason');
            $table->enum('status', ['scheduled', 'in_progress', 'completed'])->default('scheduled');
            $table->timestamps();

            // Indexes
            $table->index(['resource_id', 'start_date', 'end_date']);
            $table->index('status');

            // Check constraint: end_date must be >= start_date
            $table->check('end_date >= start_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_schedules');
    }
};

