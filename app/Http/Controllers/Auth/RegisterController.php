<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Mail\RegistrationOtpMail;
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
            $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

            $user = User::create([
                'name' => $request->name,
                'nip' => $request->nip,
                'email' => $request->email,
                'unit_kerja' => $request->unit_kerja,
                'telepon' => $request->telepon,
                'password' => Hash::make($request->password),
                'is_verified' => false,
                'register_otp' => Hash::make($otpCode),
                'register_otp_expires_at' => now()->addMinutes(10),
            ]);

            // Kirim email notifikasi OTP
            try {
                Mail::to($user->email)->send(new RegistrationOtpMail($user, $otpCode));
            } catch (\Exception $mailError) {
                Log::error('Email OTP sending failed: ' . $mailError->getMessage());
                // Email gagal tapi user tetap berhasil dibuat
            }

            // Redirect dengan flash message sukses dan email
            return redirect('/login')->with([
                'success' => 'Registrasi berhasil!',
                'email' => $request->email,
                'message' => 'Silakan login menggunakan NIP dan password Anda. Anda akan diminta memasukkan kode OTP yang telah dikirim ke email.'
            ]);
        } catch (\Exception $e) {
            // Jika ada error, redirect back dengan error message
            return back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()])->withInput();
        }
    }
}
