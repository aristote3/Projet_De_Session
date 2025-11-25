<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cancellation_policies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('hours_before')->comment('Minimum hours before booking to cancel without penalty');
            $table->enum('penalty_type', ['none', 'fixed', 'percentage'])->default('none');
            $table->decimal('penalty_amount', 10, 2)->nullable();
            $table->decimal('refund_percentage', 5, 2)->default(100)->comment('Percentage refunded');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('resource_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cancellation_policies');
    }
};

