<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flare extends Model
{
    use HasFactory;

    protected $fillable = [
        'flr_id',
        'catalog',
        'instrument',
        'begin_time',
        'peak_time',
        'end_time',
        'class_type',
        'source_location',
        'active_region_num',
        'note',
        'submission_time',
        'version_id',
        'link',
        'intensity',
    ];
}
