<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('key')->unique();
            $table->text('description')->nullable();
            $table->enum('status', ['enabled', 'disabled', 'beta'])->default('disabled');
            $table->integer('rollout')->default(0)->comment('Percentage rollout (0-100)');
            $table->string('target_tenants')->default('all'); // all, premium, none, specific
            $table->json('config')->nullable();
            $table->timestamps();

            $table->index('status');
            $table->index('key');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('features');
    }
};

