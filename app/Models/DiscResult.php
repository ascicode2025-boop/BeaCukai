<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiscResult extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'disc_results';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'raw_scores_most',
        'raw_scores_least',
        'raw_scores_change',
        'graph_scores_most',
        'graph_scores_least',
        'graph_scores_change',
        'primary_type',
        'personality_profile',
        'summary',
        'report_data',
        'total_questions',
        'completion_percentage',
        'time_spent_seconds',
        'test_date',
        'idempotency_key',
        'jpm',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'raw_scores_most' => 'array',
        'raw_scores_least' => 'array',
        'raw_scores_change' => 'array',
        'graph_scores_most' => 'array',
        'graph_scores_least' => 'array',
        'graph_scores_change' => 'array',
        'report_data' => 'array',
        'test_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [];

    /**
     * Get the user that owns the DISC result.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: Get only recent results (last N days)
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('test_date', '>=', now()->subDays($days));
    }

    /**
     * Scope: Get results by personality type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('primary_type', $type);
    }

    /**
     * Scope: Get results for a specific user
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Accessor: Get formatted personality profile
     */
    public function getFormattedProfileAttribute()
    {
        $profiles = [
            'D' => 'Dominance',
            'I' => 'Influence',
            'S' => 'Steadiness',
            'C' => 'Compliance',
        ];

        return $profiles[$this->primary_type] ?? 'Unknown';
    }

    /**
     * Get latest test result for user
     */
    public static function getLatestForUser($userId)
    {
        return self::where('user_id', $userId)
            ->orderBy('test_date', 'desc')
            ->first();
    }

    /**
     * Get all test history for user
     */
    public static function getHistoryForUser($userId)
    {
        return self::where('user_id', $userId)
            ->orderBy('test_date', 'desc')
            ->paginate(10);
    }
}
