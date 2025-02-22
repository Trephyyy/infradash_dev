<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCmesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cmes', function (Blueprint $table) {
            $table->id();
            $table->string('activity_id')->unique();
            $table->string('catalog')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->string('source_location')->nullable();
            $table->integer('active_region_num')->nullable();
            $table->text('note')->nullable();
            $table->timestamp('submission_time')->nullable();
            $table->integer('version_id')->nullable();
            $table->string('link')->nullable();
            $table->integer('intensity')->nullable();
            $table->timestamps();
        });

        Schema::create('cme_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cme_id')->constrained('cmes')->onDelete('cascade');
            $table->boolean('is_most_accurate')->default(false);
            $table->timestamp('time21_5')->nullable();
            $table->integer('latitude')->nullable();
            $table->integer('longitude')->nullable();
            $table->integer('half_angle')->nullable();
            $table->integer('speed')->nullable();
            $table->string('type')->nullable();
            $table->string('feature_code')->nullable();
            $table->string('image_type')->nullable();
            $table->string('measurement_technique')->nullable();
            $table->text('note')->nullable();
            $table->integer('level_of_data')->nullable();
            $table->float('tilt')->nullable(); // Changed to float
            $table->float('minor_half_width')->nullable(); // Changed to float
            $table->float('speed_measured_at_height')->nullable(); // Changed to float
            $table->timestamp('submission_time')->nullable();
            $table->string('link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cme_analyses');
        Schema::dropIfExists('cmes');
    }
}
