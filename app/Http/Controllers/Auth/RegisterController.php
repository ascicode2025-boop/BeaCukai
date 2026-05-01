<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Mail\RegistrationMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RegisterController extends Controller
{
    /**
     * Menangani proses registrasi user baru
     *
     * @param RegisterRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(RegisterRequest $request)
    {
        try {
            // Simpan plain password sebelum di-hash
            $plainPassword = $request->password;

            $user = User::create([
                'name' => $request->name,
                'nip' => $request->nip,
                'email' => $request->email,
                'unit_kerja' => $request->unit_kerja,
                'telepon' => $request->telepon,
                'password' => Hash::make($request->password),
            ]);

            // Kirim email notifikasi registrasi
            try {
                Mail::to($user->email)->send(new RegistrationMail($user, $plainPassword));
            } catch (\Exception $mailError) {
                Log::error('Email sending failed: ' . $mailError->getMessage());
                // Email gagal tapi user tetap berhasil dibuat
            }

            // Redirect dengan flash message sukses dan email
            return redirect('/login')->with([
                'success' => 'Registrasi berhasil!',
                'email' => $request->email,
                'message' => 'Silakan cek email Anda untuk informasi login.'
            ]);
        } catch (\Exception $e) {
            // Jika ada error, redirect back dengan error message
            return back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()])->withInput();
        }
    }
}
