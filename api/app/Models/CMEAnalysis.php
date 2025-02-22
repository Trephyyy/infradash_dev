<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CMEAnalysis extends Model
{
    use HasFactory;

    protected $table = 'cme_analyses'; // Explicitly define the table name

    protected $fillable = [
        'cme_id',
        'is_most_accurate',
        'time21_5',
        'latitude',
        'longitude',
        'half_angle',
        'speed',
        'type',
        'feature_code',
        'image_type',
        'measurement_technique',
        'note',
        'level_of_data',
        'tilt',
        'minor_half_width',
        'speed_measured_at_height',
        'submission_time',
        'link'
    ];

    public function cme()
    {
        return $this->belongsTo(CME::class, 'activity_id', 'id');// Ensure the correct column name is used
    }
}
