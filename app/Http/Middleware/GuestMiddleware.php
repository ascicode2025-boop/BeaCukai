<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class GuestMiddleware
{
    /**
     * Handle an incoming request.
     * Redirect authenticated users away from guest-only pages (login, register)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            /** @var User $user */
            $user = Auth::user();

            // Redirect berdasarkan role
            if ($user->isAdmin()) {
                return redirect('/admin/dashboard')->with('info', 'Anda sudah login sebagai admin');
            }

            return redirect('/perserta-tes/dashboard')->with('info', 'Anda sudah login');
        }

        return $next($request);
    }
}
