<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CME extends Model
{
    use HasFactory;

    protected $table = 'cmes'; // Explicitly define the table name

    protected $fillable = [
        'activity_id',
        'catalog',
        'start_time',
        'source_location',
        'active_region_num',
        'note',
        'submission_time',
        'version_id',
        'link',
        'intensity'
    ];

    public function analyses()
    {
        return $this->hasMany(CMEAnalysis::class, 'cme_id', 'id');
    }
}
