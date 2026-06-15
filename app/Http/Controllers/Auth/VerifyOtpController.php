<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\RegistrationOtpMail;
use Inertia\Inertia;

class VerifyOtpController extends Controller
{
    /**
     * Tampilkan halaman verifikasi OTP.
     */
    public function show()
    {
        $user = Auth::user();

        // Jika user sudah terverifikasi, langsung arahkan ke dashboard
        if ($user && $user->is_verified) {
            return redirect($this->getDashboardRoute($user));
        }

        return Inertia::render('Auth/VerifyOtp', [
            'email' => $user->email ?? ''
        ]);
    }

    /**
     * Memproses verifikasi OTP.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|size:6'
        ]);

        $user = Auth::user();

        // Cek apakah user ada dan memiliki kode verifikasi pendaftaran
        if (!$user || !$user->register_otp) {
            return back()->withErrors(['otp' => 'Sesi tidak valid atau akun ini tidak memerlukan verifikasi OTP.']);
        }

        // Cek kedaluwarsa
        if (now()->isAfter($user->register_otp_expires_at)) {
            return back()->withErrors(['otp' => 'Kode OTP sudah kedaluwarsa. Silakan tekan tombol Kirim Ulang.']);
        }

        // Cek kecocokan kode
        if (!Hash::check($request->otp, $user->register_otp)) {
            return back()->withErrors(['otp' => 'Kode OTP tidak valid.']);
        }

        // Berhasil verifikasi, ubah status
        $user->is_verified = true;
        $user->email_verified_at = now();
        $user->register_otp = null;
        $user->register_otp_expires_at = null;
        $user->save();

        return redirect($this->getDashboardRoute($user))->with('success', 'Akun berhasil diverifikasi!');
    }

    /**
     * Mengirim ulang kode OTP ke email
     */
    public function resend(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return back()->withErrors(['otp' => 'Sesi tidak valid.']);
        }

        if ($user->is_verified) {
            return redirect($this->getDashboardRoute($user));
        }

        // Generate OTP baru
        $otpCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Update database
        $user->register_otp = Hash::make($otpCode);
        $user->register_otp_expires_at = now()->addMinutes(10);
        $user->save();

        // Kirim email
        try {
            Mail::to($user->email)->send(new RegistrationOtpMail($user, $otpCode));
            return back()->with('success', 'Kode OTP baru telah berhasil dikirim ke email Anda.');
        } catch (\Exception $e) {
            Log::error('Gagal mengirim ulang OTP Pendaftaran: ' . $e->getMessage());
            return back()->withErrors(['otp' => 'Gagal mengirim email OTP. Silakan coba beberapa saat lagi.']);
        }
    }

    /**
     * Mendapatkan rute dashboard berdasarkan role
     */
    private function getDashboardRoute($user)
    {
        if ($user->role === 'admin') {
            return '/admin/dashboard';
        }
        return '/perserta-tes/dashboard';
    }
}
