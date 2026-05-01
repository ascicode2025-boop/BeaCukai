<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SessionTimeout
{
    /**
     * Session timeout dalam detik (10 menit = 600 detik)
     */
    protected $timeout = 600;

    /**
     * Handle an incoming request.
     * Check if session has expired due to inactivity
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            if ($user && $user->is_active === false) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect('/login')->with('warning', 'Akun Anda sedang dinonaktifkan. Silakan hubungi admin.');
            }

            $lastActivity = session('last_activity_time');

            if ($lastActivity && (time() - $lastActivity > $this->timeout)) {
                // Session expired, logout user
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return redirect('/login')->with('warning', 'Sesi Anda telah berakhir karena tidak ada aktivitas selama 10 menit. Silakan login kembali.');
            }

            // Update last activity time
            session(['last_activity_time' => time()]);
        }

        return $next($request);
    }
}
