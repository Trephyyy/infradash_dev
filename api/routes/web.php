<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    Log::info('Test log entry');
    return ['Laravel' => app()->version()];
});

require __DIR__ . '/auth.php';
