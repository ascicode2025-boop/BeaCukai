<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use App\Mail\RegistrationMail;
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
     * Store a newly created account.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nip' => ['required', 'string', 'max:50', 'unique:users,nip'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in(['peserta', 'admin'])],
            'unit_kerja' => ['nullable', 'string', 'max:255'],
            'telepon' => ['nullable', 'string', 'max:50'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'nip' => $validated['nip'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'unit_kerja' => $validated['unit_kerja'] ?? null,
            'telepon' => $validated['telepon'] ?? null,
            'password' => Hash::make($validated['password']),
            'is_active' => true,
        ]);

        if (config('mail.default') === 'log') {
            return back()->with(
                'warning',
                'Akun berhasil ditambahkan, tetapi MAIL_MAILER masih log sehingga email tidak terkirim.',
            );
        }

        try {
            Mail::to($validated['email'])->send(
                new RegistrationMail($user, $validated['password'])
            );
        } catch (\Throwable $exception) {
            Log::error('Gagal mengirim email registrasi: ' . $exception->getMessage());
            return back()->with('warning', 'Akun berhasil ditambahkan, tetapi email gagal dikirim.');
        }

        return back()->with('success', 'Akun berhasil ditambahkan dan email sudah dikirim.');
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
