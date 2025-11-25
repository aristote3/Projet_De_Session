<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('category', ['salle', 'equipement', 'vehicule', 'service']);
            $table->integer('capacity')->default(1);
            $table->text('description')->nullable();
            $table->enum('pricing_type', ['gratuit', 'horaire', 'forfait'])->default('gratuit');
            $table->decimal('price', 10, 2)->default(0);
            $table->text('equipments')->nullable();
            $table->enum('status', ['available', 'busy', 'maintenance'])->default('available');
            $table->string('image_url')->nullable();
            $table->time('opening_hours_start')->default('08:00');
            $table->time('opening_hours_end')->default('18:00');
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index('category');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};

