<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        return inertia('perserta-tes/Profile', [
            'user' => $user,
        ]);
    }

    public function update(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'nip' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'unit_kerja' => 'nullable|string|max:255',
            'nomor_telepon' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user->name = $validated['nama'];
        $user->nip = $validated['nip'];
        $user->email = $validated['email'];
        $user->unit_kerja = $validated['unit_kerja'];
        $user->telepon = $validated['nomor_telepon'];

        if ($request->filled('password')) {
            $user->password = bcrypt($validated['password']);
        }

        $user->save();

        return redirect()->back()->with('success', 'Profil berhasil diperbarui');
    }
}
