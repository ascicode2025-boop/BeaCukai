<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\DiscResult;

class DiscController extends Controller
{
    /**
     * Hitung skor DISC dari jawaban user
     *
     * Format input dari React:
     * {
     * "1": { "M": "1A", "L": "1C" },
     * "2": { "M": "2B", "L": "2D" },
     * ...
     * "24": { "M": "24A", "L": "24B" }
     * }
     */
    public function calculateScore(Request $request)
    {
        // 1. Validasi input
        $validated = $request->validate([
            'answers' => 'required|array|min:24',
            'answers.*' => 'array:M,L',
            'answers.*.M' => 'required|string',
            'answers.*.L' => 'required|string',
        ]);

        $answers = $validated['answers'];

        // 2. SCORING KEY - Mapping jawaban ke skor DISC (LENGKAP 1 - 24)
        $scoringKey = [
            // SOAL 1 - 5
            '1A' => ['M' => 'I', 'L' => 'I'], '1B' => ['M' => 'S', 'L' => '*'], '1C' => ['M' => 'D', 'L' => 'D'], '1D' => ['M' => 'C', 'L' => 'C'],
            '2A' => ['M' => 'C', 'L' => 'C'], '2B' => ['M' => '*', 'L' => 'I'], '2C' => ['M' => 'I', 'L' => 'I'], '2D' => ['M' => 'S', 'L' => 'S'],
            '3A' => ['M' => 'I', 'L' => 'C'], '3B' => ['M' => 'C', 'L' => '*'], '3C' => ['M' => 'S', 'L' => 'S'], '3D' => ['M' => 'D', 'L' => 'D'],
            '4A' => ['M' => 'C', 'L' => 'C'], '4B' => ['M' => 'S', 'L' => '*'], '4C' => ['M' => 'I', 'L' => 'I'], '4D' => ['M' => 'D', 'L' => 'D'],
            '5A' => ['M' => 'I', 'L' => 'I'], '5B' => ['M' => 'D', 'L' => 'D'], '5C' => ['M' => 'S', 'L' => 'S'], '5D' => ['M' => 'C', 'L' => 'C'],

            // SOAL 6 - 10
            '6A' => ['M' => 'C', 'L' => 'C'], '6B' => ['M' => 'D', 'L' => 'D'], '6C' => ['M' => 'I', 'L' => 'I'], '6D' => ['M' => 'S', 'L' => 'S'],
            '7A' => ['M' => 'S', 'L' => 'S'], '7B' => ['M' => 'I', 'L' => 'C'], '7C' => ['M' => 'C', 'L' => '*'], '7D' => ['M' => 'D', 'L' => 'D'],
            '8A' => ['M' => 'I', 'L' => 'I'], '8B' => ['M' => 'S', 'L' => 'S'], '8C' => ['M' => 'C', 'L' => 'C'], '8D' => ['M' => 'D', 'L' => 'D'],
            '9A' => ['M' => 'D', 'L' => 'D'], '9B' => ['M' => 'C', 'L' => 'C'], '9C' => ['M' => 'I', 'L' => 'I'], '9D' => ['M' => 'S', 'L' => '*'],
            '10A'=> ['M' => 'D', 'L' => 'D'], '10B'=> ['M' => 'I', 'L' => 'C'], '10C'=> ['M' => 'S', 'L' => 'S'], '10D'=> ['M' => 'C', 'L' => '*'],

            // SOAL 11 - 15
            '11A'=> ['M' => 'I', 'L' => 'I'], '11B'=> ['M' => 'D', 'L' => 'D'], '11C'=> ['M' => 'S', 'L' => '*'], '11D'=> ['M' => 'C', 'L' => 'C'],
            '12A'=> ['M' => 'S', 'L' => 'S'], '12B'=> ['M' => 'C', 'L' => 'C'], '12C'=> ['M' => 'I', 'L' => 'I'], '12D'=> ['M' => 'D', 'L' => 'D'],
            '13A'=> ['M' => 'D', 'L' => 'D'], '13B'=> ['M' => 'S', 'L' => 'S'], '13C'=> ['M' => 'I', 'L' => 'I'], '13D'=> ['M' => 'C', 'L' => 'C'],
            '14A'=> ['M' => 'C', 'L' => 'C'], '14B'=> ['M' => 'I', 'L' => 'I'], '14C'=> ['M' => 'S', 'L' => 'S'], '14D'=> ['M' => 'D', 'L' => 'D'],
            '15A'=> ['M' => 'I', 'L' => 'I'], '15B'=> ['M' => 'C', 'L' => 'C'], '15C'=> ['M' => 'D', 'L' => 'D'], '15D'=> ['M' => 'S', 'L' => 'S'],

            // SOAL 16 - 20
            '16A'=> ['M' => 'D', 'L' => 'D'], '16B'=> ['M' => 'C', 'L' => 'C'], '16C'=> ['M' => 'I', 'L' => 'I'], '16D'=> ['M' => 'S', 'L' => 'S'],
            '17A'=> ['M' => 'C', 'L' => 'C'], '17B'=> ['M' => 'D', 'L' => 'D'], '17C'=> ['M' => 'S', 'L' => 'S'], '17D'=> ['M' => 'I', 'L' => 'I'],
            '18A'=> ['M' => 'D', 'L' => 'D'], '18B'=> ['M' => 'I', 'L' => 'I'], '18C'=> ['M' => 'S', 'L' => 'S'], '18D'=> ['M' => 'C', 'L' => 'C'],
            '19A'=> ['M' => 'D', 'L' => 'D'], '19B'=> ['M' => 'S', 'L' => '*'], '19C'=> ['M' => 'I', 'L' => 'I'], '19D'=> ['M' => 'C', 'L' => 'C'],
            '20A'=> ['M' => 'D', 'L' => 'D'], '20B'=> ['M' => 'S', 'L' => 'S'], '20C'=> ['M' => 'I', 'L' => 'I'], '20D'=> ['M' => 'C', 'L' => 'C'],

            // SOAL 21 - 24
            '21A'=> ['M' => 'S', 'L' => 'S'], '21B'=> ['M' => 'D', 'L' => 'D'], '21C'=> ['M' => 'I', 'L' => 'I'], '21D'=> ['M' => 'C', 'L' => 'C'],
            '22A'=> ['M' => 'S', 'L' => 'S'], '22B'=> ['M' => 'I', 'L' => 'I'], '22C'=> ['M' => 'D', 'L' => 'D'], '22D'=> ['M' => 'C', 'L' => 'C'],
            '23A'=> ['M' => 'D', 'L' => 'D'], '23B'=> ['M' => 'I', 'L' => 'I'], '23C'=> ['M' => 'S', 'L' => 'S'], '23D'=> ['M' => 'C', 'L' => 'C'],
            '24A'=> ['M' => 'S', 'L' => 'S'], '24B'=> ['M' => 'I', 'L' => 'I'], '24C'=> ['M' => 'D', 'L' => 'D'], '24D'=> ['M' => 'C', 'L' => 'C'],
        ];

        // 3. TABEL KONVERSI GRAFIK (diambil dari referensi CSV)
        $conversionTable = [
            'Most' => [ // Untuk Graph 1 — values mapped for raw scores 0..18
                'D' => [-6, -5, -4, -2, -2, -1, 0, 0, 1, 2, 3, 4, 4, 5, 5, 6, 7, 7, 7],
                'I' => [-7, -5, -2, -1, 1, 3, 4, 5, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8],
                'S' => [-6, -4, -4, -2, -1, 0, 1, 2, 3, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7],
                'C' => [-6, -5, -4, -2, 0, 2, 3, 5, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8]
            ],
            'Least' => [ // Untuk Graph 2 — values mapped for raw scores 0..18
                'D' => [8, 6, 4, 2, 2, 0, 0, -1, -2, -2, -3, -4, -4, -5, -6, -6, -6, 7, 7],
                'I' => [7, 6, 4, 2, 0, 0, -2, -4, -4, -5, -6, -6, -7, -7, -7, -7, -7, -7, -7],
                'S' => [8, 7, 6, 4, 2, 2, 0, -1, -2, -3, -4, -5, -6, -6, -7, -7, -7, -7, -7],
                'C' => [8, 7, 6, 4, 2, 2, 0, 0, -1, -2, -4, -5, -6, -6, -6, -7, -7, -8, -8]
            ],
            'Change' => [ // Untuk Graph 3 — full mapping (from CSV)
                'D' => [
                    -22 => -8, -21 => -8, -20 => -7, -19 => -7, -18 => -7, -17 => -7, -16 => -6,
                    -15 => -6, -14 => -6, -13 => -6, -12 => -6, -11 => -5, -10 => -4, -9 => -4,
                    -8 => -3, -7 => -3, -6 => -3, -5 => -2, -4 => -2, -3 => -1, -2 => 0, -1 => 0,
                    0 => 0, 1 => 0, 2 => 1, 3 => 1, 4 => 1, 5 => 2, 7 => 2, 8 => 4, 9 => 4, 10 => 5,
                    11 => 5, 12 => 5, 13 => 6, 14 => 6, 15 => 6, 16 => 6, 17 => 7, 18 => 7, 19 => 7,
                    20 => 7, 21 => 8, 22 => 8,
                ],
                'I' => [
                    -22 => -8, -21 => -8, -20 => -8, -19 => -8, -18 => -7, -17 => -7, -16 => -7,
                    -15 => -7, -14 => -7, -13 => -7, -12 => -7, -11 => -7, -10 => -6, -9 => -6,
                    -8 => -6, -7 => -5, -6 => -4, -5 => -4, -4 => -3, -3 => -2, -2 => -2, -1 => 0,
                    0 => 0, 1 => 1, 2 => 2, 3 => 3, 4 => 4, 5 => 4, 7 => 6, 8 => 6, 9 => 7, 10 => 7,
                    11 => 7, 12 => 7, 13 => 7, 14 => 7, 15 => 7, 16 => 7, 17 => 7, 18 => 8, 19 => 8,
                    20 => 8, 21 => 8, 22 => 8,
                ],
                'S' => [
                    -22 => -8, -21 => -8, -20 => -8, -19 => -8, -18 => -8, -17 => -7, -16 => -7,
                    -15 => -7, -14 => -6, -13 => -6, -12 => -6, -11 => -6, -10 => -6, -9 => -5,
                    -8 => -4, -7 => -4, -6 => -3, -5 => -2, -4 => -2, -3 => -1, -2 => 0, -1 => 0,
                    0 => 1, 1 => 2, 2 => 2, 3 => 3, 4 => 4, 5 => 4, 7 => 5, 8 => 5, 9 => 6, 10 => 6,
                    11 => 6, 12 => 6, 13 => 6, 14 => 7, 15 => 7, 16 => 7, 17 => 7, 18 => 7, 19 => 7,
                    20 => 8, 21 => 8, 22 => 8,
                ],
                'C' => [
                    -22 => -8, -21 => -7, -20 => -7, -19 => -7, -18 => -7, -17 => -7, -16 => -7,
                    -15 => -6, -14 => -6, -13 => -6, -12 => -6, -11 => -6, -10 => -6, -9 => -5,
                    -8 => -4, -7 => -4, -6 => -3, -5 => -2, -4 => 0, -3 => 0, -2 => 0, -1 => 0,
                    0 => 2, 1 => 3, 2 => 4, 3 => 4, 4 => 6, 5 => 6, 7 => 6, 8 => 6, 9 => 7, 10 => 7,
                    11 => 7, 12 => 7, 13 => 7, 14 => 7, 15 => 7, 16 => 7, 17 => 8, 18 => 8, 19 => 8,
                    20 => 8, 21 => 8, 22 => 8,
                ],
            ]
        ];

        // 4. Siapkan wadah untuk menghitung skor mentah
        $rawMost = ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0, '*' => 0];
        $rawLeast = ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0, '*' => 0];

        // 5. KALKULASI SKOR MENTAH
        foreach ($answers as $qNum => $choices) {
            $selM = $choices['M'];
            $selL = $choices['L'];

            // Proses jawaban MOST
            if (isset($scoringKey[$selM]['M'])) {
                $rawMost[$scoringKey[$selM]['M']]++;
            }

            // Proses jawaban LEAST
            if (isset($scoringKey[$selL]['L'])) {
                $rawLeast[$scoringKey[$selL]['L']]++;
            }
        }

        // 6. KONVERSI KE NILAI GRAFIK (Graph 1 & 2)
        // Gunakan min() & max() untuk menjaga index tidak out of bounds
        $graph1 = [
            'D' => $conversionTable['Most']['D'][min(max($rawMost['D'], 0), 18)],
            'I' => $conversionTable['Most']['I'][min(max($rawMost['I'], 0), 18)],
            'S' => $conversionTable['Most']['S'][min(max($rawMost['S'], 0), 18)],
            'C' => $conversionTable['Most']['C'][min(max($rawMost['C'], 0), 18)]
        ];

        $graph2 = [
            'D' => $conversionTable['Least']['D'][min(max($rawLeast['D'], 0), 18)],
            'I' => $conversionTable['Least']['I'][min(max($rawLeast['I'], 0), 18)],
            'S' => $conversionTable['Least']['S'][min(max($rawLeast['S'], 0), 18)],
            'C' => $conversionTable['Least']['C'][min(max($rawLeast['C'], 0), 18)]
        ];

        // 7. GRAPH 3: CHANGE (Raw dan Converted)
        $graph3_Raw = [
            'D' => $rawMost['D'] - $rawLeast['D'],
            'I' => $rawMost['I'] - $rawLeast['I'],
            'S' => $rawMost['S'] - $rawLeast['S'],
            'C' => $rawMost['C'] - $rawLeast['C'],
        ];

        // Fallback (??) digunakan agar jika nilai minus lebih dalam dari -10 (misal -12),
        // sistem tidak error dan mengembalikan nilai mentahnya.
        $graph3 = [
            'D' => $conversionTable['Change']['D'][$graph3_Raw['D']] ?? $graph3_Raw['D'],
            'I' => $conversionTable['Change']['I'][$graph3_Raw['I']] ?? $graph3_Raw['I'],
            'S' => $conversionTable['Change']['S'][$graph3_Raw['S']] ?? $graph3_Raw['S'],
            'C' => $conversionTable['Change']['C'][$graph3_Raw['C']] ?? $graph3_Raw['C'],
        ];

        // 8. DESKRIPSI LAPORAN (REPORT DATA)
        // Struktur ini disesuaikan untuk langsung dipanggil oleh React 'GenerateHasil.jsx'
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

        // 9. PENENTUAN PROFIL BERDASARKAN GRAPH 3 TERTINGGI
        $sortedGraph3 = $graph3;
        arsort($sortedGraph3); // Mengurutkan Graph 3 dari yang paling tinggi ke rendah
        $sortedTraits = array_keys($sortedGraph3);
        $primaryTrait = $sortedTraits[0] ?? null; // Mendapatkan Tipe (D, I, S, C)
        $secondaryTrait = $sortedTraits[1] ?? null;
        $reportData = $profileDescriptions[$primaryTrait];

        // 9b. Nilai JPM (dinormalisasi 0-100 dari skor Graph 3 tertinggi)
        $primaryGraphScore = $graph3[$primaryTrait] ?? 0;
        $jpmPercentage = (int) round((($primaryGraphScore + 28) / 56) * 100);
        $jpmPercentage = max(0, min(100, $jpmPercentage));

        // 10. SIMPAN KE DATABASE
        try {
            $discResult = DiscResult::create([
                'user_id' => Auth::id(),
                'raw_scores_most' => $rawMost,
                'raw_scores_least' => $rawLeast,
                'raw_scores_change' => $graph3_Raw,
                'graph_scores_most' => $graph1,
                'graph_scores_least' => $graph2,
                'graph_scores_change' => $graph3,
                'primary_type' => $primaryTrait,
                'personality_profile' => $primaryTrait . ' - ' . $reportData['primaryType'],
                'summary' => $reportData['summary'],
                'total_questions' => count($answers),
                'completion_percentage' => 100,
                'test_date' => now(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error saving DISC result: ' . $e->getMessage());
            // Continue even if save fails - don't block user
        }

        // 11. RETURN RESPONSE JSON
        return response()->json([
            'status' => 'success',
            'message' => 'Skor DISC berhasil dihitung dengan konversi grafik dan profil',
            'data' => [
                'raw_scores' => [
                    'Most' => $rawMost,
                    'Least' => $rawLeast,
                    'Change' => $graph3_Raw
                ],
                'graph_scores' => [
                    'Graph_1' => $graph1,
                    'Graph_2' => $graph2,
                    'Graph_3' => $graph3
                ],
                'report' => $reportData,
                'all_profiles' => $profileDescriptions,
                'sorted_traits' => $sortedTraits,
                'jpm' => [
                    'percentage' => $jpmPercentage,
                    'graph3_score' => $primaryGraphScore,
                    'primary_trait' => $primaryTrait,
                    'secondary_trait' => $secondaryTrait,
                ]
            ],
            'processing_info' => [
                'total_questions' => count($answers),
                'formula' => 'Change = Raw Most - Raw Least',
                'conversion_applied' => true
            ]
        ], 200);
    }
}
