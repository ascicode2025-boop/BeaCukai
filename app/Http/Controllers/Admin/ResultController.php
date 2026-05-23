<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\DiscResult;
use App\Models\JobStandard;

class ResultController extends Controller
{
    /**
     * Hitung kesesuaian jabatan (sama dengan logika di HasilRingkas.jsx)
     * Membandingkan graph3 peserta dengan standar jabatan.
     * Return null jika jabatan tidak ditemukan.
     */
    private function calculateJobFitness(?array $graph3, string $unitKerja, $jobStandards): ?int
    {
        if (!$graph3 || !$unitKerja) return null;

        $jobStandard = $jobStandards->first(
            fn($job) => strtolower($job->job_title) === strtolower($unitKerja)
        );

        if (!$jobStandard) return null;

        $totalFitness = 0;
        foreach (['D', 'I', 'S', 'C'] as $trait) {
            $userScore     = $graph3[$trait] ?? 0;
            $standardScore = $jobStandard->{strtolower($trait)} ?? 0;
            $difference    = abs($userScore - $standardScore);
            $fitness       = max(0, 100 - ($difference / 16) * 100);
            $totalFitness += $fitness;
        }

        return (int) round($totalFitness / 4);
    }

    public function hasil(Request $request)
    {
        $admin        = Auth::user();
        $userId       = $request->query('user_id');
        $jobStandards = JobStandard::all();

        // ── Build peserta list ────────────────────────────────────────────────
        $pesertaData = User::where('role', 'peserta')
            ->with(['discResults' => function ($query) {
                $query->orderByDesc('test_date')->orderByDesc('id');
            }])
            ->orderBy('name')
            ->get(['id', 'name', 'nip', 'unit_kerja'])
            ->map(function ($user, $index) use ($jobStandards) {
                $latestResult = $user->discResults->first();

                $jpm = 0;
                if ($latestResult) {
                    $graph3 = $latestResult->graph_scores_change ?? [];

                    // Prioritas: kesesuaian jabatan → completion_percentage → hitung dari graph
                    $jobFitness = $this->calculateJobFitness($graph3, $user->unit_kerja ?? '', $jobStandards);

                    if ($jobFitness !== null) {
                        $jpm = $jobFitness;
                    } elseif ($latestResult->completion_percentage !== null) {
                        $jpm = (int) $latestResult->completion_percentage;
                    } elseif (!empty($graph3)) {
                        $maxScore = max($graph3['D'] ?? 0, $graph3['I'] ?? 0, $graph3['S'] ?? 0, $graph3['C'] ?? 0);
                        $jpm = (int) round((($maxScore - (-8)) / 16) * 100);
                    }
                }

                $status = 'Belum Tes';
                if ($latestResult) {
                    if ($jpm >= 85)      $status = 'Sangat Cocok';
                    elseif ($jpm >= 70)  $status = 'Cocok';
                    elseif ($jpm >= 55)  $status = 'Cukup Cocok';
                    else                 $status = 'Kurang Cocok';
                }

                return [
                    'id'          => $user->id,
                    'no'          => $index + 1,
                    'nama'        => $user->name,
                    'nip'         => $user->nip,
                    'jabatan'     => $user->unit_kerja ?? 'Belum diisi',
                    'tanggalTes'  => $latestResult?->test_date?->format('d-m-Y') ?? '-',
                    'skorDominan' => $latestResult?->primary_type ?? '-',
                    'jpm'         => $jpm,
                    'status'      => $status,
                ];
            })
            ->values()
            ->all();

        // ── Build detail peserta jika user_id ada ─────────────────────────────
        $peserta        = null;
        $allDiscResults = [];

        if ($userId) {
            $peserta = User::find($userId);
            if ($peserta && $peserta->role === 'peserta') {
                $allDiscResults = DiscResult::where('user_id', $userId)
                    ->orderByDesc('test_date')
                    ->orderByDesc('id')
                    ->get()
                    ->map(function ($result, $index) use ($peserta, $jobStandards) {
                        $graph3 = $result->graph_scores_change ?? [];

                        // Prioritas: kesesuaian jabatan → completion_percentage → hitung dari graph
                        $jobFitness = $this->calculateJobFitness($graph3, $peserta->unit_kerja ?? '', $jobStandards);

                        if ($jobFitness !== null) {
                            $jpm = $jobFitness;
                        } elseif ($result->completion_percentage !== null) {
                            $jpm = (int) $result->completion_percentage;
                        } else {
                            $maxScore = !empty($graph3)
                                ? max($graph3['D'] ?? 0, $graph3['I'] ?? 0, $graph3['S'] ?? 0, $graph3['C'] ?? 0)
                                : 0;
                            $jpm = (int) round((($maxScore - (-8)) / 16) * 100);
                        }

                        return [
                            'id'                  => $result->id,
                            'test_date'           => $result->test_date,
                            'formatted_date'      => $result->test_date?->format('d-m-Y') ?? '-',
                            'formatted_full_date' => $result->test_date?->toFormattedDateString() ?? '-',
                            'test_number'         => $index + 1,
                            'primary_type'        => $result->primary_type,
                            'graph_scores_most'   => $result->graph_scores_most,
                            'graph_scores_least'  => $result->graph_scores_least,
                            'graph_scores_change' => $graph3,
                            'report_data'         => $result->report_data,
                            'summary'             => $result->summary,
                            'jpm'                 => $jpm,
                            'completion_percentage' => $result->completion_percentage,
                        ];
                    })
                    ->toArray();
            }
        }

        return Inertia::render('admin/LihatHasilAdmin', [
            'admin'          => $admin,
            'pesertaData'    => $pesertaData,
            'peserta'        => $peserta,
            'allDiscResults' => $allDiscResults,
            'discResult'     => !empty($allDiscResults) ? $allDiscResults[0] : null,
            'jobStandards'   => $jobStandards->map(fn($job) => [
                'id'        => $job->id,
                'job_code'  => $job->job_code,
                'job_title' => $job->job_title,
                'd'         => $job->d,
                'i'         => $job->i,
                's'         => $job->s,
                'c'         => $job->c,
            ])->toArray(),
        ]);
    }
}
