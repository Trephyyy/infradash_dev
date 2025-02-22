<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCmesTable extends Migration
{
    public function up()
    {
        Schema::create('cmes', function (Blueprint $table) {
            $table->id();
            $table->string('event_id')->unique();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('catalog');
            $table->string('source_location')->nullable();
            $table->integer('speed')->nullable();
            $table->integer('half_angle')->nullable();
            $table->boolean('most_accurate_only')->default(true);
            $table->integer('intensity')->nullable();
            $table->string('class_type')->nullable();
            $table->string('note')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cmes');
    }
}
