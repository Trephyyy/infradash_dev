<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KpIndex extends Model
{
    use HasFactory;

    protected $fillable = [
        'gst_id',
        'observed_time',
        'kp_index',
        'source'
    ];
}
