<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
            return back()->withErrors([
                'nip' => 'NIP tidak terdaftar',
            ]);
        }

        // Cek password
        if (!Hash::check($request->password, $user->password)) {
            return back()->withErrors([
                'password' => 'Password salah',
            ]);
        }

        // Login user dengan Remember Me
        $remember = $request->boolean('remember');
        Auth::login($user, $remember);

        // Set initial session activity time
        session(['last_activity_time' => time()]);

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

        return redirect('/login')->with('success', 'Anda telah logout');
    }
}
