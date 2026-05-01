<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LoginController extends Controller
{
/**
     * Menangani proses login user
     */
    public function store(Request $request)
    {
        $request->validate([
            'nip' => 'required|string',
            'password' => 'required|string',
        ], [
            'nip.required' => 'NIP harus diisi',
            'password.required' => 'Password harus diisi',
        ]);

        // Cari user berdasarkan NIP
        $user = User::where('nip', $request->nip)->first();

        if (!$user) {
            $errors = ['nip' => 'NIP tidak terdaftar'];
            // Jika request berasal dari Inertia (AJAX), kirim kembali Inertia response
            if ($request->headers->has('X-Inertia')) {
                return Inertia::render('LoginPage', [
                    'errors' => ['nip' => [$errors['nip']]],
                ])->toResponse($request)->setStatusCode(422);
            }

            return back()->withErrors($errors);
        }

        // Debug - check user status
        Log::info('User found', [
            'id' => $user->id,
            'nip' => $user->nip,
            'role' => $user->role,
            'is_active' => $user->is_active ?? 'null',
            'isAdmin' => $user->isAdmin(),
        ]);

        if (!$user->is_active) {
            $errors = ['nip' => 'Akun Anda sedang dinonaktifkan. Silakan hubungi admin.'];
            if ($request->headers->has('X-Inertia')) {
                return Inertia::render('LoginPage', [
                    'errors' => ['nip' => [$errors['nip']]],
                ])->toResponse($request)->setStatusCode(422);
            }

            return back()->withErrors($errors);
        }

        // Cek password
        if (!Hash::check($request->password, $user->password)) {
            $errors = ['password' => 'Password salah'];
            if ($request->headers->has('X-Inertia')) {
                return Inertia::render('LoginPage', [
                    'errors' => ['password' => [$errors['password']]],
                ])->toResponse($request)->setStatusCode(422);
            }

            return back()->withErrors($errors);
        }

        // Login user dengan Remember Me
        $remember = $request->boolean('remember');
        Auth::login($user, $remember);

        // Set initial session activity time
        session(['last_activity_time' => time()]);

        // Debug - check if login successful
        Log::info('Login successful', [
            'user_id' => Auth::id(),
            'is_admin' => $user->isAdmin(),
        ]);

        // Redirect berdasarkan role
        if ($user->isAdmin()) {
            return redirect('/admin/dashboard');
        }

        return redirect('/perserta-tes/dashboard');
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
