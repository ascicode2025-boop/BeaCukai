<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use Illuminate\Support\Facades\Auth;
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

    // Riwayat Tes
    Route::get('/perserta-tes/riwayat', function () {
        $user = Auth::user();
        return Inertia::render('perserta-tes/RiwayatTest', [
            'user' => $user,
        ]);
    })->name('riwayat-tes');

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

    // Logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});

// Admin routes - harus login + admin role + session timeout
Route::prefix('admin')->middleware(['admin', 'session.timeout'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/data-peserta', function () {
        return Inertia::render('admin/DataPeserta');
    })->name('admin.data-peserta');
    Route::get('/manage-positions', function () {
        return Inertia::render('admin/KelolaJabatan');
    })->name('admin.manage-positions');
    Route::get('/add-jabatan', function () {
        return Inertia::render('admin/AddJabatan');
    })->name('admin.add-jabatan');
    Route::get('/kelola-akun', function () {
        return Inertia::render('admin/KelolaAkun');
    })->name('admin.kelola-akun');
    Route::get('/hasil', function () {
        $user = Auth::user();
        return Inertia::render('admin/GenerateHasil', [
            'user' => $user,
        ]);
    })->name('admin.hasil');
});

// Forgot Password routes (mock - tidak perlu database)
Route::middleware('guest.custom')->group(function () {
    Route::get('/forgot-password', function () {
        return inertia('LupaSandi', [
            'success' => session('success'),
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
        ]);
    })->name('password.request');

    // Mock endpoint - hanya untuk UI testing tanpa database
    Route::post('/forgot-password/send-code', function () {
        // Simulasi mengirim kode (tanpa email asli)
        session(['forgot_email' => request()->email, 'otp_sent' => true]);
        return back()->with('success', 'Kode verifikasi telah dikirim');
    });

    Route::post('/forgot-password/verify-code', function () {
        // Mock verifikasi OTP - terima kode apapun
        session(['otp_verified' => true]);
        return back()->with('success', 'OTP berhasil diverifikasi');
    });

    Route::post('/forgot-password/reset', function () {
        // Mock reset password - hanya UI
        session()->forget(['forgot_email', 'otp_verified', 'otp_sent']);
        return back()->with('success', 'Password berhasil diubah');
    });
});
