<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
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

    // Logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
});

// Admin routes - harus login + admin role + session timeout
Route::prefix('admin')->middleware(['admin', 'session.timeout'])->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
});
