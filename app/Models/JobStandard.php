<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobStandard extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_code',
        'job_title',
        'd',
        'i',
        's',
        'c',
    ];
}
