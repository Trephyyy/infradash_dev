<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KpIndex extends Model
{
    use HasFactory;

    protected $table = 'kp_indices'; // Explicitly define the table name

    protected $fillable = [
        'gst_id',
        'observed_time',
        'kp_index',
        'source'
    ];

    public function gst()
    {
        return $this->belongsTo(GST::class, 'gst_id', 'id'); // Define the relationship
    }
}
