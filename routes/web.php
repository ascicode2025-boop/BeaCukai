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
use App\Http\Controllers\Admin\ResultController;
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
    // Use ResultController to render admin data peserta (list + detail)
    Route::get('/data-peserta', [ResultController::class, 'hasil'])->name('admin.data-peserta');
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
    // Admin hasil list / view
    // /admin/hasil route removed; use /admin/data-peserta for listing and detail

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
