<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('waiting_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('priority')->default(0)->comment('Higher priority = first in queue');
            $table->enum('status', ['active', 'promoted', 'cancelled'])->default('active');
            $table->timestamp('notified_at')->nullable();
            $table->timestamps();

            $table->index(['resource_id', 'date', 'status']);
            $table->index(['user_id', 'status']);
            $table->index('priority');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waiting_lists');
    }
};

