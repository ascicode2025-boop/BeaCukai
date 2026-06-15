<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\JobStandard;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $profilePage = $user && $user->isAdmin()
            ? 'admin/Profile'
            : 'perserta-tes/Profile';

        return inertia($profilePage, [
            'user' => $user,
            'jobStandards' => JobStandard::all(['id', 'job_title']),
        ]);
    }

    public function update(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => 'required|string|max:255',
            'unit_kerja' => 'nullable|string|max:255',
            'nomor_telepon' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
            'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:7168',
            'remove_profile_photo' => 'nullable|boolean',
        ]);

        $user->name = $validated['nama'];
        $user->nip = $validated['nip'];
        $user->unit_kerja = $validated['unit_kerja'];
        $user->telepon = $validated['nomor_telepon'];

        $shouldRemovePhoto = (bool) ($validated['remove_profile_photo'] ?? false);

        if ($shouldRemovePhoto && $user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
            Storage::disk('public')->delete($user->profile_photo);
            $user->profile_photo = null;
        }

        if ($request->hasFile('profile_photo')) {
            if ($user->profile_photo && Storage::disk('public')->exists($user->profile_photo)) {
                Storage::disk('public')->delete($user->profile_photo);
            }

            $user->profile_photo = $request->file('profile_photo')->store('profile-photos', 'public');
        }

        if ($request->filled('password')) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()->back()->with('success', 'Profil berhasil diperbarui');
    }

    /**
     * Serve profile photo for a user. This avoids reliance on a storage symlink
     * being present in environments where `public/storage` is not available.
     */
    public function photo($id)
    {
        $currentUser = Auth::user();

        // Keamanan: Cek apakah user yang login berhak melihat foto ini
        // Jika dia BUKAN admin, DAN ID yang diminta BUKAN miliknya sendiri, tolak.
        if ($currentUser && $currentUser->role !== 'admin' && (string) $currentUser->id !== (string) $id) {
            abort(403, 'Unauthorized. Anda tidak memiliki izin melihat foto ini.');
        }

        $user = User::findOrFail($id);

        if ($user->profile_photo) {
            $relativePath = $user->profile_photo;
            if (!str_starts_with($relativePath, 'profile-photos/')) {
                $relativePath = 'profile-photos/' . $relativePath;
            }

            if (Storage::disk('public')->exists($relativePath)) {
                $path = Storage::disk('public')->path($relativePath);
                $mime = \Illuminate\Support\Facades\File::mimeType($path) ?? 'image/jpeg';
                return response()->file($path, ['Content-Type' => $mime]);
            }
        }

        // Return a simple SVG placeholder inline when no photo exists.
        $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#002366" d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.373 18.627 0 12 0zm0 6a3 3 0 110 6 3 3 0 010-6zm0 12c-2.67 0-5.04-1.34-6.5-3.36.01-2.33 4.66-3.61 6.5-3.61 1.83 0 6.49 1.28 6.5 3.61C17.04 16.66 14.67 18 12 18z"/></svg>';
        return response($svg, 200, ['Content-Type' => 'image/svg+xml']);
    }
}
