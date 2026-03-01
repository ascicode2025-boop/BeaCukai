<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah user sudah login
        if (!Auth::check()) {
            return redirect('/login?auth_required=1');
        }

        // Cek apakah user adalah admin
        /** @var User $user */
        $user = Auth::user();
        if (!$user->isAdmin()) {
            return redirect('/perserta-tes/dashboard')->with('warning', 'Anda tidak memiliki akses ke halaman admin');
        }

        return $next($request);
    }
}
