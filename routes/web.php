<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\KelolaAkunController;
use App\Http\Controllers\Admin\KelolaJabatanController;
use App\Http\Controllers\DiscController;
use Illuminate\Support\Facades\Auth;
use App\Models\DiscResult;
use App\Models\User;

Route::get('/', function () {
    return Inertia::render('landingPage');
});

// Login route - perlu nama 'login' untuk Laravel auth middleware
Route::get('/login', function () {
    return Inertia::render('LoginPage', [
        'success' => session('success'),
        'warning' => session('warning'),
        'info' => session('info'),
        'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
    ]);
})->middleware('guest.custom')->name('login');

// Guest routes - hanya bisa diakses jika BELUM login
Route::middleware('guest.custom')->group(function () {
    Route::get('/register', function () {
        return Inertia::render('RegisterPage', [
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
        ]);
    });

    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');

    // Forgot Password routes
    Route::get('/forgot-password', [ForgotPasswordController::class, 'showForm'])->name('forgot-password');
    Route::post('/forgot-password/send-code', [ForgotPasswordController::class, 'sendCode'])->name('forgot-password.send-code');
    Route::post('/forgot-password/verify-code', [ForgotPasswordController::class, 'verifyCode'])->name('forgot-password.verify-code');
    Route::post('/forgot-password/reset', [ForgotPasswordController::class, 'resetPassword'])->name('forgot-password.reset');
});

// Protected routes - harus login + session timeout
Route::middleware(['auth', 'session.timeout'])->group(function () {
    // Peserta dashboard
    Route::get('/perserta-tes/dashboard', function () {
        $user = Auth::user();
        return Inertia::render('perserta-tes/Dashboard', [
            'user' => $user,
        ]);
    });

    // Pengerjaan soal
    Route::get('/perserta-tes/soal', function () {
        $user = Auth::user();
        return Inertia::render('perserta-tes/PengerjaanSoal', [
            'user' => $user,
        ]);
    })->name('pengerjaan-soal');

    // Generate Hasil
    Route::get('/perserta-tes/hasil', function () {
        $user = Auth::user();
        return Inertia::render('perserta-tes/GenerateHasil', [
            'user' => $user,
        ]);
    })->name('generate-hasil');

    // Ringkasan hasil sebelum halaman PDF
    Route::get('/perserta-tes/hasil-ringkas', function () {
        $user = Auth::user();
        return Inertia::render('perserta-tes/HasilRingkas', [
            'user' => $user,
        ]);
    })->name('hasil-ringkas');

    // Riwayat Tes
    Route::get('/perserta-tes/riwayat', function () {
        $user = Auth::user();
        return Inertia::render('perserta-tes/RiwayatTest', [
            'user' => $user,
        ]);
    })->name('riwayat-tes');

    // DISC Test API Endpoint (Hitung Skor)
    Route::post('/api/submit-disc', [DiscController::class, 'calculateScore'])
        ->name('submit.disc');

    // Riwayat List Tes
    Route::get('/perserta-tes/riwayat-list', function () {
        $user = Auth::user();
        return Inertia::render('perserta-tes/RiwayatTestList', [
            'user' => $user,
        ]);
    })->name('riwayat-tes-list');

    // Profile page
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');

    // Update profile
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');

    // Serve profile photo (fallback if public/storage missing)
    Route::get('/profile/photo/{id}', [ProfileController::class, 'photo'])->name('profile.photo');

    // Logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});

// Admin routes - harus login + admin role + session timeout
Route::prefix('admin')->middleware(['admin', 'session.timeout'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/data-peserta', function () {
        $pesertaData = User::where('role', 'peserta')
            ->with(['discResults' => function ($query) {
                $query->latest('test_date');
            }])
            ->orderBy('name')
            ->get(['id', 'name', 'nip', 'unit_kerja'])
            ->map(function ($user, $index) {
                $latestResult = $user->discResults->first();
                $jpm = $latestResult?->completion_percentage;
                $status = 'Belum Tes';

                if ($latestResult) {
                    if ($jpm >= 85) {
                        $status = 'Sangat Cocok';
                    } elseif ($jpm >= 70) {
                        $status = 'Cocok';
                    } elseif ($jpm >= 55) {
                        $status = 'Cukup Cocok';
                    } else {
                        $status = 'Kurang Cocok';
                    }
                }

                return [
                    'id' => $user->id,
                    'no' => $index + 1,
                    'nama' => $user->name,
                    'nip' => $user->nip,
                    'jabatan' => $user->unit_kerja ?? 'Belum diisi',
                    'tanggalTes' => $latestResult?->test_date?->format('d-m-Y') ?? '-',
                    'skorDominan' => $latestResult?->primary_type ?? '-',
                    'jpm' => $jpm !== null ? round($jpm) : '-',
                    'status' => $status,
                ];
            })
            ->values()
            ->all();

        return Inertia::render('admin/DataPeserta', [
            'pesertaData' => $pesertaData,
        ]);
    })->name('admin.data-peserta');
    Route::get('/manage-positions', [KelolaJabatanController::class, 'index'])
        ->name('admin.manage-positions');
    Route::post('/manage-positions', [KelolaJabatanController::class, 'store'])
        ->name('admin.manage-positions.store');
    Route::put('/manage-positions/{jobStandard}', [KelolaJabatanController::class, 'update'])
        ->name('admin.manage-positions.update');
    Route::delete('/manage-positions/{jobStandard}', [KelolaJabatanController::class, 'destroy'])
        ->name('admin.manage-positions.destroy');
    Route::get('/add-jabatan', function () {
        return Inertia::render('admin/AddJabatan');
    })->name('admin.add-jabatan');
    Route::get('/kelola-akun', [KelolaAkunController::class, 'index'])
        ->name('admin.kelola-akun');
    Route::post('/kelola-akun', [KelolaAkunController::class, 'store'])
        ->name('admin.kelola-akun.store');
    Route::post('/kelola-akun/{user}/toggle-status', [KelolaAkunController::class, 'toggleStatus'])
        ->name('admin.kelola-akun.toggle-status');
    Route::get('/hasil', function (Request $request) {
        $admin = Auth::user();
        $userId = $request->query('user_id');

        if (!$userId) {
            return redirect('/admin/data-peserta')->with('error', 'Peserta tidak dipilih');
        }

        $peserta = User::find($userId);
        if (!$peserta || $peserta->role !== 'peserta') {
            return redirect('/admin/data-peserta')->with('error', 'Peserta tidak ditemukan');
        }

        $latestResult = DiscResult::where('user_id', $userId)
            ->latest('test_date')
            ->first();

        return Inertia::render('admin/GenerateHasil', [
            'admin' => $admin,
            'peserta' => $peserta,
            'discResult' => $latestResult,
        ]);
    })->name('admin.hasil');

    Route::get('/hasil-ringkas', function (Request $request) {
        $userId = $request->query('user_id');

        if (!$userId) {
            return redirect('/admin/data-peserta')->with('error', 'Peserta tidak dipilih');
        }

        $peserta = User::find($userId);
        if (!$peserta || $peserta->role !== 'peserta') {
            return redirect('/admin/data-peserta')->with('error', 'Peserta tidak ditemukan');
        }

        $latestResult = DiscResult::where('user_id', $userId)
            ->latest('test_date')
            ->first();

        $discResultData = null;
        if ($latestResult) {
            $discResultData = [
                'graph_scores' => [
                    'Graph_1' => $latestResult->graph_scores_most ?? ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0],
                    'Graph_2' => $latestResult->graph_scores_least ?? ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0],
                    'Graph_3' => $latestResult->graph_scores_change ?? ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0],
                ],
                'report' => [
                    'summary' => $latestResult->report_data['summary'] ?? $latestResult->summary ?? null,
                ],
                'jpm' => [
                    'percentage' => $latestResult->completion_percentage !== null
                        ? round($latestResult->completion_percentage)
                        : null,
                ],
                'submitted_at' => optional($latestResult->test_date)->toIso8601String() ?? now()->toIso8601String(),
            ];

            if (!empty($latestResult->report_data)) {
                $discResultData['report'] = $latestResult->report_data;
            }
        }

        return Inertia::render('perserta-tes/HasilRingkas', [
            'user' => $peserta,
            'discResultData' => $discResultData,
        ]);
    })->name('admin.hasil-ringkas');
});
