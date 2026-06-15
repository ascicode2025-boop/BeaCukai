<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DiscResult;
use App\Models\JobStandard;
use App\Models\UserFeedback;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Show admin dashboard
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $admin = Auth::user();

        // Debug: cek apa admin sudah login dengan benar
        $adminName = $admin ? ($admin->name ?? $admin->username ?? 'Admin') : 'Admin';

        // ===== GET BASIC STATISTICS =====

        // Total participants (users with role 'peserta') - tIDAK is_active filter untuk debugging
        $totalPeserta = User::where('role', 'peserta')->count();

        // Total completed tests (from disc_results table)
        $totalTesSelesai = DiscResult::count();

        // Total admins
        $totalAdmins = User::where('role', 'admin')->count();

        // ===== GET MOST COMMON JOB/UNIT KERJA =====

        // Get most common unit_kerja among peserta - tanpa is_active filter
        $jabatanStats = User::where('role', 'peserta')
            ->whereNotNull('unit_kerja')
            ->select('unit_kerja', DB::raw('COUNT(*) as total'))
            ->groupBy('unit_kerja')
            ->orderByDesc('total')
            ->first();

        $jabatanTerbanyak = $jabatanStats ? $jabatanStats->unit_kerja : 'Belum ada data';
        $pesertaJabatan = $jabatanStats ? $jabatanStats->total : 0;

        // ===== GET DISC SCORE AVERAGES =====

        // Calculate average DISC scores from all completed tests
        $discResults = DiscResult::whereNotNull('graph_scores_most')
            ->get(['graph_scores_most']);

        $avgD = 0;
        $avgI = 0;
        $avgS = 0;
        $avgC = 0;

        if ($discResults->count() > 0) {
            $totalD = 0;
            $totalI = 0;
            $totalS = 0;
            $totalC = 0;

            foreach ($discResults as $result) {
                $scores = $result->graph_scores_most;
                if (is_array($scores)) {
                    $totalD += $scores['D'] ?? 0;
                    $totalI += $scores['I'] ?? 0;
                    $totalS += $scores['S'] ?? 0;
                    $totalC += $scores['C'] ?? 0;
                }
            }

            $count = $discResults->count();
            $avgD = round($totalD / $count, 1);
            $avgI = round($totalI / $count, 1);
            $avgS = round($totalS / $count, 1);
            $avgC = round($totalC / $count, 1);
        }

        // ===== GET DONUT CHART DATA: PARTICIPANTS PER JOB/UNIT KERJA =====

        $pesertaPerJabatan = User::where('role', 'peserta')
            ->whereNotNull('unit_kerja')
            ->select('unit_kerja', DB::raw('COUNT(*) as total'))
            ->groupBy('unit_kerja')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->map(function ($item, $index) {
                $colors = ['#facc15', '#00d9ff', '#00ffaa', '#ff6b6b', '#9b59b6'];
                return [
                    'value' => $item->total,
                    'label' => $item->unit_kerja,
                    'color' => $colors[$index % count($colors)],
                ];
            })
            ->toArray();

        // If no data, use placeholder
        if (empty($pesertaPerJabatan)) {
            $pesertaPerJabatan = [
                ['value' => 0, 'label' => 'Tidak ada data', 'color' => '#cccccc'],
            ];
        }

        // ===== GET DONUT CHART DATA: TESTS PER MONTH =====

        $tesPerBulan = DiscResult::select(
                DB::raw("DATE_FORMAT(test_date, '%Y-%m') as month"),
                DB::raw('COUNT(*) as total')
            )
            ->whereNotNull('test_date')
            ->groupBy('month')
            ->orderByDesc('month')
            ->limit(6)
            ->get()
            ->map(function ($item, $index) {
                $colors = ['#facc15', '#00d9ff', '#00ffaa', '#ff6b6b', '#9b59b6', '#3498db'];
                return [
                    'value' => $item->total,
                    'label' => $item->month,
                    'color' => $colors[$index % count($colors)],
                ];
            })
            ->toArray();

        // If no data, use placeholder
        if (empty($tesPerBulan)) {
            $tesPerBulan = [
                ['value' => 0, 'label' => 'Tidak ada data', 'color' => '#cccccc'],
            ];
        }

        // ===== JOB STANDARDS =====
        // Count and list of job standards (seeded from sheet / JSON)
        $totalJabatan = JobStandard::count();
        $jobStandardsList = JobStandard::orderBy('job_title')
            ->get(['id', 'job_code', 'job_title', 'd', 'i', 's', 'c'])
            ->toArray();

        // ===== GET RECENT USERS =====

        $recentUsers = User::where('role', 'peserta')
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'nip', 'email', 'unit_kerja', 'created_at']);

        // ===== DISC DISTRIBUTION LINE CHART =====
        // Count dominant DISC profile per month for the last 12 months.
        $startMonth = now()->startOfMonth()->subMonths(11);
        $monthLabels = [];
        $discDistributionByMonth = [];

        for ($month = 0; $month < 12; $month++) {
            $date = $startMonth->copy()->addMonths($month);
            $key = $date->format('Y-m');
            $monthLabels[$key] = $date->translatedFormat('M Y');
            $discDistributionByMonth[$key] = [
                'x' => $date->translatedFormat('M Y'),
                'd' => 0,
                'i' => 0,
                's' => 0,
                'c' => 0,
                'total' => 0,
            ];
        }

        DiscResult::query()
            ->whereNotNull('test_date')
            ->where('test_date', '>=', $startMonth)
            ->get(['primary_type', 'test_date'])
            ->each(function ($result) use (&$discDistributionByMonth) {
                $key = Carbon::parse($result->test_date)->format('Y-m');
                $trait = strtolower((string) $result->primary_type);

                if (isset($discDistributionByMonth[$key], $discDistributionByMonth[$key][$trait])) {
                    $discDistributionByMonth[$key][$trait]++;
                    $discDistributionByMonth[$key]['total']++;
                }
            });

        $discDistribution = array_values($discDistributionByMonth);

        // ===== GET FEEDBACK STATISTICS BY CATEGORY =====

        $feedbackStats = UserFeedback::select('category', DB::raw('COUNT(*) as total'))
            ->groupBy('category')
            ->get()
            ->keyBy('category');

        $categoryMapping = [
            'Feedback' => 'Umum',
            'bug'      => 'Bug',
            'feature'  => 'Fitur',
            'other'    => 'Lainnya',
        ];

        $colorMapping = [
            'Umum' => '#7C3AED',
            'Bug' => '#DC2626',
            'Fitur' => '#3B82F6',
            'Lainnya' => '#6B7280',
        ];

        $feedbackStatsFormatted = [];
        foreach ($categoryMapping as $dbValue => $displayLabel) {
            $count = $feedbackStats->get($dbValue)?->total ?? 0;
            $feedbackStatsFormatted[] = [
                'label' => $displayLabel,
                'value' => $count,
                'color' => $colorMapping[$displayLabel],
            ];
        }

        // ===== COMPILE ALL STATISTICS =====

        $stats = [
            'total_peserta' => $totalPeserta,
            'total_tes_selesai' => $totalTesSelesai,
            'total_admins' => $totalAdmins,
            'jabatan_terbanyak' => $jabatanTerbanyak,
            'peserta_jabatan' => $pesertaJabatan,
            'disc_averages' => [
                'D' => $avgD,
                'I' => $avgI,
                'S' => $avgS,
                'C' => $avgC,
            ],
            'peserta_per_jabatan' => $pesertaPerJabatan,
            'tes_per_bulan' => $tesPerBulan,
            'disc_distribution' => $discDistribution,
            'Feedback_stats' => $feedbackStatsFormatted,
            'recent_users' => $recentUsers,
            '_debug' => [
                'admin_id' => $admin->id ?? null,
                'admin_name' => $adminName,
                'admin_email' => $admin->email ?? null,
            ],
            'total_jabatan' => $totalJabatan,
            'job_standards' => $jobStandardsList,
        ];

        // Debug: log untuk troubleshooting
        \Illuminate\Support\Facades\Log::info('Admin Dashboard loaded', [
            'admin_id' => $admin->id ?? null,
            'total_peserta' => $totalPeserta,
            'total_tes' => $totalTesSelesai,
        ]);

        return Inertia::render('admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
