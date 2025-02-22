<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CME extends Model
{
    use HasFactory;

    protected $fillable = [
        'begin_time',
        'end_time',
        'peak_time',
        'catalog',
        'source_location',
        'speed',
        'half_angle',
        'most_accurate_only',
        'intensity',
        'class_type',
        'note',

    ];

}
