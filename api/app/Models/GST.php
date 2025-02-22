<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GST extends Model
{
    use HasFactory;

    protected $table = 'gsts'; // Explicitly define the table name

    protected $fillable = [
        'gst_id',
        'start_time',
        'link',
        'submission_time',
        'version_id',
        'intensity'
    ];

    public function kpIndices()
    {
        return $this->hasMany(KpIndex::class, 'gst_id', 'id'); // Define the relationship
    }
}
