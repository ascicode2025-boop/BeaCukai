<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
'auth' => [
                // NOTE:
                // Admin memakai guard "admin" (model App\\Models\\Admin), sedangkan `$request->user()`
                // hanya mengambil dari guard default (biasanya "web").
                // Maka kita ambil dari kedua guard agar navbar admin bisa dapat data user.
                'user' => (function () use ($request) {
                    $webUser = $request->user(); // guard default: "web"
                    if ($webUser) {
                        return $webUser->toArray();
                    }

                    // ambil dari guard admin
                    $adminUser = \Illuminate\Support\Facades\Auth::guard('admin')->user();
                    return $adminUser ? $adminUser->toArray() : null;
                })(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
        ];
    }
}
