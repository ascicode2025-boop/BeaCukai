<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\DiscResult;
use App\Models\JobStandard;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
        $totalAdmins = User::whereIn('role', ['admin', 'super_admin'])->count();

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
                if (is_array($scores) && count($scores) >= 4) {
                    $totalD += $scores[0] ?? 0;
                    $totalI += $scores[1] ?? 0;
                    $totalS += $scores[2] ?? 0;
                    $totalC += $scores[3] ?? 0;
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

        // ===== GET RECENT USERS =====

        $recentUsers = User::where('role', 'peserta')
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'nip', 'email', 'unit_kerja', 'created_at']);

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
            'recent_users' => $recentUsers,
            '_debug' => [
                'admin_id' => $admin->id ?? null,
                'admin_name' => $adminName,
                'admin_email' => $admin->email ?? null,
            ],
        ];

        // Debug: log untuk troubleshooting
        \Illuminate\Support\Facades\Log::info('Admin Dashboard loaded', [
            'admin_id' => $admin->id ?? null,
            'total_peserta' => $totalPeserta,
            'total_tes' => $totalTesSelesai,
        ]);

        return Inertia::render('admin/Dashboard', [
            'admin' => [
                'name' => $adminName,
                'email' => $admin->email ?? '',
            ],
            'stats' => $stats,
        ]);
    }
}
