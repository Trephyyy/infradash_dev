<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFlaresTable extends Migration
{
    public function up()
    {
        Schema::create('flares', function (Blueprint $table) {
            $table->id();
            $table->string('flr_id')->unique();
            $table->string('catalog')->nullable();
            $table->string('instrument')->nullable();
            $table->dateTime('begin_time')->nullable();
            $table->dateTime('peak_time')->nullable();
            $table->dateTime('end_time')->nullable();
            $table->string('class_type')->nullable();
            $table->string('source_location')->nullable();
            $table->integer('active_region_num')->nullable();
            $table->text('note')->nullable(); // Changed from string to text
            $table->dateTime('submission_time')->nullable();
            $table->integer('version_id')->nullable();
            $table->string('link')->nullable();
            $table->integer('intensity')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cmes');
    }
}
