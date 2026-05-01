<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use App\Mail\OtpCodeMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ForgotPasswordController extends Controller
{
    /**
     * Tampilkan halaman forgot password
     */
    public function showForm()
    {
        return inertia('LupaSandi');
    }

    /**
     * Send OTP code ke email
     */
    public function sendCode(ForgotPasswordRequest $request)
    {
        try {
            $email = strtolower(trim($request->email));
            $user = User::where('email', $email)->first();

            if (!$user) {
                Log::warning('OTP request untuk email tidak terdaftar: ' . $email);
                throw ValidationException::withMessages([
                    'email' => 'Email tidak terdaftar dalam sistem',
                ]);
            }

            // Generate OTP code (6 digit)
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            Log::info('OTP generated untuk ' . $email . ': ' . $otp);

            // Simpan OTP ke database dengan expiry 10 menit
            $user->update([
                'verification_code' => Hash::make($otp),
                'verification_code_expires_at' => now()->addMinutes(10),
                'password_reset_requested_at' => now(),
            ]);
            Log::info('OTP disimpan ke database untuk ' . $email);

            // Kirim email dengan OTP - SYNC SEND (tidak queued)
            try {
                Mail::to($user->email)->send(new OtpCodeMail($user, $otp));
                Log::info('✓ Email OTP BERHASIL dikirim ke: ' . $user->email);
            } catch (\Exception $mailException) {
                Log::error('✗ GAGAL mengirim email OTP: ' . $mailException->getMessage());
                Log::error('Stack: ' . $mailException->getTraceAsString());

                // Clear OTP jika email gagal
                $user->update([
                    'verification_code' => null,
                    'verification_code_expires_at' => null,
                ]);

                throw ValidationException::withMessages([
                    'email' => 'Gagal mengirim email OTP. Periksa konfigurasi email atau coba lagi.',
                ]);
            }

            return back()->with([
                'success' => 'Kode OTP telah dikirim ke email Anda (' . substr($email, 0, 3) . '***@***).',
                'email' => $user->email,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Error sendCode: ' . $e->getMessage());
            Log::error('Stack: ' . $e->getTraceAsString());
            throw ValidationException::withMessages([
                'email' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Verify OTP code
     */
    public function verifyCode(Request $request)
    {
        try {
            Log::info('=== VERIFY OTP FLOW START ===');
            Log::info('Request email: ' . $request->email);
            Log::info('Request OTP: ' . $request->verification_code);

            $request->validate([
                'email' => 'required|email|exists:users,email',
                'verification_code' => 'required|string|min:6|max:6',
            ], [
                'email.required' => 'Email harus diisi',
                'email.email' => 'Format email tidak valid',
                'email.exists' => 'Email tidak ditemukan',
                'verification_code.required' => 'Kode OTP harus diisi',
                'verification_code.min' => 'Kode OTP harus 6 digit',
                'verification_code.max' => 'Kode OTP harus 6 digit',
            ]);

            $email = strtolower(trim($request->email));
            $user = User::where('email', $email)->firstOrFail();

            Log::info('✓ User ditemukan: ' . $user->id);
            Log::info('  Verification code in DB: ' . ($user->verification_code ? '(hashed)' : 'NULL'));
            Log::info('  Expires at: ' . ($user->verification_code_expires_at ?: 'NULL'));

            // Cek apakah OTP sudah ada di database
            if (!$user->verification_code) {
                Log::warning('❌ Tidak ada OTP di database untuk ' . $email);
                throw ValidationException::withMessages([
                    'verification_code' => 'Tidak ada kode OTP. Silakan minta kode baru',
                ]);
            }

            // Cek apakah OTP sudah expired
            if ($user->verification_code_expires_at && $user->verification_code_expires_at < now()) {
                Log::warning('❌ OTP sudah expired untuk ' . $email);
                $user->update(['verification_code' => null, 'verification_code_expires_at' => null]);
                throw ValidationException::withMessages([
                    'verification_code' => 'Kode OTP sudah expired. Silakan minta kode baru',
                ]);
            }

            Log::info('  Current time: ' . now());
            Log::info('  OTP input: ' . $request->verification_code);

            // Verify OTP dengan Hash::check
            $otpValid = Hash::check($request->verification_code, $user->verification_code);
            Log::info('  Hash check result: ' . ($otpValid ? 'VALID' : 'INVALID'));

            if (!$otpValid) {
                Log::warning('❌ Kode OTP TIDAK VALID untuk ' . $email);
                throw ValidationException::withMessages([
                    'verification_code' => 'Kode OTP tidak valid. Silakan cek email Anda',
                ]);
            }

            // OTP valid, simpan email di session
            session(['verified_email' => $email]);
            Log::info('✓✓ OTP BERHASIL DIVERIFIKASI untuk ' . $email);
            Log::info('=== VERIFY OTP FLOW END (SUCCESS) ===');

            return back()->with('success', 'OTP berhasil diverifikasi. Silakan masukkan password baru');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('❌ Validation error: ' . json_encode($e->errors()));
            throw $e;
        } catch (\Exception $e) {
            Log::error('❌ UNEXPECTED ERROR in verifyCode: ' . $e->getMessage());
            Log::error('   File: ' . $e->getFile() . ':' . $e->getLine());
            Log::error('   Stack: ' . $e->getTraceAsString());
            Log::info('=== VERIFY OTP FLOW END (ERROR) ===');
            throw ValidationException::withMessages([
                'verification_code' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        try {
            Log::info('=== RESET PASSWORD FLOW START ===');

            $request->validate([
                'password' => 'required|string|min:6|confirmed',
            ], [
                'password.required' => 'Password harus diisi',
                'password.min' => 'Password minimal 6 karakter',
                'password.confirmed' => 'Konfirmasi password tidak sesuai',
            ]);

            Log::info('✓ Password validation passed');

            // Ambil email dari session
            $email = session('verified_email');
            Log::info('Session email: ' . ($email ?: 'NULL'));

            if (!$email) {
                Log::warning('❌ Session email not found');
                throw ValidationException::withMessages([
                    'password' => 'Session expired. Silakan mulai dari awal',
                ]);
            }

            $user = User::where('email', $email)->first();

            if (!$user) {
                Log::warning('❌ User not found: ' . $email);
                throw ValidationException::withMessages([
                    'password' => 'User tidak ditemukan',
                ]);
            }

            Log::info('✓ User found: ' . $user->id);

            // Update password dan hapus OTP
            $user->update([
                'password' => Hash::make($request->password),
                'verification_code' => null,
                'verification_code_expires_at' => null,
                'password_reset_requested_at' => null,
            ]);

            Log::info('✓✓ Password updated successfully for: ' . $user->email);

            // Hapus dari session
            session()->forget('verified_email');

            Log::info('=== RESET PASSWORD FLOW END (SUCCESS) ===');

            return back()->with('success', 'Password berhasil direset. Silakan login dengan password baru');
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('❌ Validation error: ' . json_encode($e->errors()));
            throw $e;
        } catch (\Exception $e) {
            Log::error('❌ UNEXPECTED ERROR in resetPassword: ' . $e->getMessage());
            Log::error('   File: ' . $e->getFile() . ':' . $e->getLine());
            Log::error('   Stack: ' . $e->getTraceAsString());
            Log::info('=== RESET PASSWORD FLOW END (ERROR) ===');
            throw ValidationException::withMessages([
                'password' => 'Gagal mereset password: ' . $e->getMessage(),
            ]);
        }
    }
}
