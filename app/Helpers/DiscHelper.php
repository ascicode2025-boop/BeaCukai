<?php

if (! function_exists('transformDiscResult')) {
    /**
     * Transform DiscResult ke format yang dipakai frontend.
     * Dipakai oleh route peserta DAN admin agar data selalu konsisten.
     */
    function transformDiscResult($result): ?array
    {
        if (!$result) return null;

        $reportData = $result->report_data ?? [];
        $graph3     = $result->graph_scores_change ?? ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0];

        // JPM: pakai completion_percentage (sudah tersimpan di DB saat submit)
        // fallback hitung dari graph3 jika completion_percentage juga null
        $jpmValue = $result->completion_percentage !== null
            ? (int) round((float) $result->completion_percentage)
            : (int) round(((max(
                $graph3['D'] ?? 0,
                $graph3['I'] ?? 0,
                $graph3['S'] ?? 0,
                $graph3['C'] ?? 0
              ) - (-8)) / 16) * 100);

        return [
            'id'                  => $result->id,
            'user_id'             => $result->user_id,
            'submitted_at'        => $result->test_date,
            'test_date'           => $result->test_date,
            'graph_scores'        => [
                'Graph_1' => $result->graph_scores_most  ?? ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0],
                'Graph_2' => $result->graph_scores_least ?? ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0],
                'Graph_3' => $graph3,
            ],
            'graph_scores_most'   => $result->graph_scores_most  ?? ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0],
            'graph_scores_least'  => $result->graph_scores_least ?? ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0],
            'graph_scores_change' => $graph3,
            'report_data'         => $reportData,
            'report'              => $reportData,
            'primary_type'        => $result->primary_type,
            'primary_trait'       => $reportData['primary_trait'] ?? $result->primary_type,
            'secondary_trait'     => $reportData['secondary_trait'] ?? null,
            'personality_profile' => $result->personality_profile,
            'summary'             => $reportData['summary'] ?? $result->summary,
            'jpm'                 => [
                'percentage' => $jpmValue,
            ],
            // Tambahkan perhitungan perbandingan dengan standar jabatan di server agar konsisten
            'jobStandardComparison' => (function() use ($result, $graph3) {
                $jobStd = null;
                // cari user untuk mendapatkan unit_kerja
                $user = \App\Models\User::find($result->user_id);
                $unitKerja = $user?->unit_kerja ?? '';
                if (!$unitKerja) return null;

                $job = \App\Models\JobStandard::whereRaw('LOWER(job_title) = ?', [strtolower($unitKerja)])->first();
                if (!$job) return null;

                $traits = ['D','I','S','C'];
                $traitComparison = [];
                $traitFitness = [];
                $totalFitness = 0;

                foreach ($traits as $t) {
                    $userScore = $graph3[$t] ?? 0;
                    $standardScore = $job->{strtolower($t)} ?? 0;
                    $difference = abs($userScore - $standardScore);
                    $fitnessPercentage = max(0, 100 - ($difference / 16) * 100);

                    $traitComparison[$t] = [
                        'userScore' => $userScore,
                        'standardScore' => $standardScore,
                        'difference' => $difference,
                        'fitnessPercentage' => (int) round($fitnessPercentage),
                    ];

                    $traitFitness[$t] = (int) round($fitnessPercentage);
                    $totalFitness += $fitnessPercentage;
                }

                $overallFitness = (int) round($totalFitness / 4);

                return [
                    'jobTitle' => $job->job_title,
                    'jobCode' => $job->job_code,
                    'traitComparison' => $traitComparison,
                    'traitFitness' => $traitFitness,
                    'overallFitness' => $overallFitness,
                    'hasStandard' => true,
                ];
            })(),
        ];
    }
}
