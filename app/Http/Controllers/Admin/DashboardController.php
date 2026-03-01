<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show admin dashboard
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $admin = Auth::user();

        // Get statistics
        $stats = [
            'total_peserta' => User::where('role', 'peserta')->count(),
            'total_admins' => User::whereIn('role', ['admin', 'super_admin'])->count(),
            'recent_users' => User::where('role', 'peserta')->latest()->take(5)->get(['id', 'name', 'nip', 'email', 'created_at']),
        ];

        return Inertia::render('admin/Dashboard', [
            'admin' => $admin,
            'stats' => $stats,
        ]);
    }
}
