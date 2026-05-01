<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class KelolaAkunController extends Controller
{
    /**
     * Display the account management page.
     */
    public function index(): Response
    {
        $admin = Auth::user();

        $accounts = User::query()
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'nip',
                'email',
                'role',
                'unit_kerja',
                'telepon',
                'is_active',
                'created_at',
            ]);

        return Inertia::render('admin/KelolaAkun', [
            'admin' => $admin,
            'accounts' => $accounts,
        ]);
    }

    /**
     * Toggle active status for a user.
     */
    public function toggleStatus(Request $request, User $user): RedirectResponse
    {
        if ($user->id === Auth::id()) {
            return back()->with('error', 'Tidak dapat menonaktifkan akun sendiri.');
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $message = $user->is_active
            ? 'Akun berhasil diaktifkan.'
            : 'Akun berhasil dinonaktifkan.';

        return back()->with('success', $message);
    }
}
