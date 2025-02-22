<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGstsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gsts', function (Blueprint $table) {
            $table->id();
            $table->string('gst_id')->unique();
            $table->timestamp('start_time')->nullable();
            $table->string('link')->nullable();
            $table->timestamp('submission_time')->nullable();
            $table->integer('version_id')->nullable();
            $table->integer('intensity')->nullable();
            $table->timestamps();
        });

        Schema::create('kp_indices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gst_id')->constrained('gsts')->onDelete('cascade');
            $table->timestamp('observed_time')->nullable();
            $table->integer('kp_index')->nullable();
            $table->string('source')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kp_indices');
        Schema::dropIfExists('gsts');
    }
}
