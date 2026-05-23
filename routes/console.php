<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\DiscResult;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('disc:backfill-report-data {--force : Overwrite existing report_data} {--dry : Dry run only}', function () {
    $force = (bool) $this->option('force');
    $dryRun = (bool) $this->option('dry');

    $profileDescriptions = [
        'D' => [
            'primaryType' => 'D - Dominance',
            'summary' => 'Anda adalah pribadi dengan dorongan hasil yang sangat kuat, percaya diri saat mengambil keputusan, dan cenderung nyaman berada di posisi yang memimpin arah. Dalam situasi kerja, Anda cepat membaca peluang, berani mengambil risiko terukur, serta mampu bergerak tegas saat tim membutuhkan kejelasan. Gaya Anda efektif untuk mencapai target menantang, terutama ketika dibutuhkan kecepatan eksekusi, ketegasan prioritas, dan keberanian menghadapi hambatan. Agar potensi Anda semakin optimal, keseimbangan antara ketegasan dan empati akan menjadi kunci penting dalam menjaga kolaborasi tim tetap sehat sekaligus produktif.',
            'strengths' => [
                'Mampu mengatasi berbagai masalah dengan cepat',
                'Berorientasi pada hasil dan tujuan yang tinggi',
                'Berani mengambil tanggung jawab dan risiko',
                'Pengambilan keputusan yang tegas dan efektif',
                'Percaya diri dan mandiri'
            ],
            'weaknesses' => [
                'Suka berargumen dan berpotensi terlihat agresif',
                'Kurang menyukai rutinitas dan pekerjaan detail',
                'Cenderung impulsif dan tidak sabaran',
                'Terkadang kurang empati terhadap orang lain',
                'Sulit menerima kritik'
            ],
            'workCharacteristics' => [
                'Memimpin proyek dengan arah yang sangat jelas',
                'Senang memberikan tantangan kepada tim',
                'Fokus pada efisiensi pekerjaan',
                'Gaya komunikasi langsung (direct)'
            ],
            'recommendations' => [
                'Tingkatkan empati dalam kepemimpinan',
                'Dengarkan perspektif dan masukan tim secara lebih aktif',
                'Beri waktu untuk perencanaan yang lebih detail',
                'Kembangkan kesabaran dalam proses bekerja'
            ]
        ],
        'I' => [
            'primaryType' => 'I - Influence',
            'summary' => 'Anda adalah individu yang komunikatif, ekspresif, dan mampu membangun energi positif di lingkungan kerja. Anda cenderung mudah terhubung dengan orang lain, menyampaikan ide dengan antusias, serta memengaruhi tim melalui pendekatan interpersonal yang hangat. Dalam kolaborasi, Anda sering menjadi penggerak suasana, pendorong motivasi, dan jembatan komunikasi antaranggota tim. Kekuatan ini sangat berharga pada peran yang membutuhkan persuasi, presentasi, dan koordinasi lintas fungsi. Untuk hasil yang lebih konsisten, kemampuan Anda akan semakin kuat jika dipadukan dengan pengelolaan fokus, ketelitian pada detail, dan disiplin eksekusi terhadap prioritas utama.',
            'strengths' => [
                'Sangat mudah bergaul dan membangun relasi',
                'Memiliki antusiasme dan energi yang menular',
                'Kemampuan persuasi dan meyakinkan yang baik',
                'Optimis dan mampu melihat sisi positif',
                'Komunikator yang ulung'
            ],
            'weaknesses' => [
                'Lebih mementingkan popularitas daripada hasil akhir',
                'Kurang teliti pada hal-hal detail',
                'Mudah terdistraksi dan kesulitan fokus',
                'Cenderung mengandalkan intuisi daripada data analisis',
                'Terkadang menjanjikan lebih dari yang bisa ditepati'
            ],
            'workCharacteristics' => [
                'Menciptakan suasana kerja yang menyenangkan',
                'Suka bekerja secara kolaboratif (teamwork)',
                'Lebih suka tugas yang melibatkan interaksi dengan orang',
                'Pendekatan kerja yang dinamis'
            ],
            'recommendations' => [
                'Buat prioritas kerja dan taati jadwal',
                'Fokus pada objektivitas hasil, bukan sekadar respons sosial',
                'Latih ketelitian terhadap detail tugas',
                'Tingkatkan kemampuan analitis sebelum bertindak'
            ]
        ],
        'S' => [
            'primaryType' => 'S - Steadiness',
            'summary' => 'Anda adalah fondasi tim yang tenang, konsisten, dan sangat dapat diandalkan. Anda menghargai keharmonisan, bekerja dengan stabil, dan selalu menjadi pendengar yang baik bagi rekan kerja.',
            'strengths' => [
                'Pendengar yang sangat baik dan suportif',
                'Sangat konsisten dan bekerja dengan ritme stabil',
                'Dapat diandalkan dan berdedikasi tinggi',
                'Sabar dan kooperatif dengan rekan setim',
                'Pemersatu tim yang menjaga keharmonisan'
            ],
            'weaknesses' => [
                'Cenderung menolak perubahan yang terjadi tiba-tiba',
                'Sering kali menghindari konflik',
                'Lambat dalam mengambil inisiatif baru',
                'Menyimpan perasaan sendiri saat tidak setuju',
                'Butuh waktu lama untuk menyesuaikan diri'
            ],
            'workCharacteristics' => [
                'Bekerja dengan sangat baik dalam lingkungan yang terstruktur',
                'Suka menyelesaikan tugas satu per satu hingga tuntas',
                'Lebih menyukai instruksi yang jelas dan terarah',
                'Mendukung dan membantu anggota tim lain'
            ],
            'recommendations' => [
                'Belajar mengutarakan opini atau ketidaksetujuan secara asertif',
                'Berlatih mengambil inisiatif mandiri tanpa harus menunggu arahan',
                'Terbuka dan lebih adaptif terhadap perubahan sistem/kerja',
                'Belajar menghadapi konflik secara konstruktif'
            ]
        ],
        'C' => [
            'primaryType' => 'C - Compliance',
            'summary' => 'Anda adalah pemikir yang logis, akurat, dan sangat sistematis. Anda selalu memastikan pekerjaan mematuhi standar yang tinggi dan selalu fokus pada kualitas serta analisis yang mendalam.',
            'strengths' => [
                'Sangat sistematis dan analitis dalam bekerja',
                'Memiliki standar kualitas yang sangat tinggi',
                'Sangat akurat dan teliti terhadap detail',
                'Pemikir yang logis dan objektif',
                'Ahli dalam memecahkan masalah yang kompleks'
            ],
            'weaknesses' => [
                'Terlalu perfeksionis dan kaku',
                'Terlalu fokus pada detail hingga kehilangan gambaran besar',
                'Kurang nyaman dengan situasi yang ambigu (tidak jelas)',
                'Lambat mengambil keputusan karena butuh banyak data',
                'Cenderung menghindari risiko'
            ],
            'workCharacteristics' => [
                'Bekerja dengan mengacu pada fakta, data, dan aturan',
                'Sangat terorganisir dalam merencanakan tugas',
                'Mengevaluasi setiap kemungkinan sebelum bertindak',
                'Suka bekerja dengan sistem yang terstruktur'
            ],
            'recommendations' => [
                'Belajar untuk lebih fleksibel jika situasi membutuhkan adaptasi',
                'Sadari bahwa tidak semua hal harus 100% sempurna',
                'Beranikan diri untuk mengambil keputusan meskipun data belum sepenuhnya lengkap',
                'Kurangi sifat terlalu kritis terhadap rekan kerja'
            ]
        ]
    ];

    $total = DiscResult::count();
    $updated = 0;
    $skipped = 0;

    DiscResult::orderBy('id')->chunk(200, function ($results) use (
        &$updated,
        &$skipped,
        $force,
        $dryRun,
        $profileDescriptions
    ) {
        foreach ($results as $result) {
            /** @var DiscResult $result */
            $existing = $result->report_data ?? [];
            $hasFull = is_array($existing)
                && array_key_exists('all_profiles', $existing)
                && array_key_exists('primary_trait', $existing)
                && array_key_exists('secondary_trait', $existing);

            if ($hasFull && !$force) {
                $skipped++;
                continue;
            }

            $graph3 = $result->graph_scores_change ?? [];
            $sortedGraph3 = $graph3;
            arsort($sortedGraph3);
            $sortedTraits = array_keys($sortedGraph3);
            $primaryTrait = $sortedTraits[0] ?? null;
            $secondaryTrait = $sortedTraits[1] ?? null;

            $reportData = $primaryTrait ? ($profileDescriptions[$primaryTrait] ?? []) : [];

            $reportDataFull = [
                'primaryType' => $reportData['primaryType'] ?? null,
                'summary' => $reportData['summary'] ?? null,
                'strengths' => $reportData['strengths'] ?? [],
                'weaknesses' => $reportData['weaknesses'] ?? [],
                'workCharacteristics' => $reportData['workCharacteristics'] ?? [],
                'recommendations' => $reportData['recommendations'] ?? [],
                'primary_trait' => $primaryTrait,
                'secondary_trait' => $secondaryTrait,
                'secondaryType' => $secondaryTrait ? ($profileDescriptions[$secondaryTrait]['primaryType'] ?? null) : null,
                'all_profiles' => $profileDescriptions,
            ];

            if ($dryRun) {
                $updated++;
                continue;
            }

            if (!$result->summary && ($reportData['summary'] ?? null)) {
                $result->summary = $reportData['summary'];
            }

            if (!$result->personality_profile && $primaryTrait) {
                $result->personality_profile = $primaryTrait . ' - ' . ($reportData['primaryType'] ?? '');
            }

            $result->report_data = $reportDataFull;
            $result->save();
            $updated++;
        }
    });

    $this->info('Disc report_data backfill complete.');
    $this->line('Total: ' . $total . ', Updated: ' . $updated . ', Skipped: ' . $skipped . ($dryRun ? ' (dry run)' : ''));
})->purpose('Backfill report_data for existing disc_results');
