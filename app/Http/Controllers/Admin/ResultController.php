<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Models\DiscResult;

class ResultController extends Controller
{
    /**
     * Show list of peserta or specific peserta DISC result if user_id query provided
     */
    public function hasil(Request $request)
    {
        $admin = Auth::user();
        $userId = $request->query('user_id');

        // Build peserta list with latest result summary
        $pesertaData = User::where('role', 'peserta')
            ->with(['discResults' => function ($query) {
                // Deterministic latest: prioritize test_date, then id
                $query->orderByDesc('test_date')->orderByDesc('id');
            }])
            ->orderBy('name')
            ->get(['id', 'name', 'nip', 'unit_kerja'])
            ->map(function ($user, $index) {
                $latestResult = $user->discResults->first();
                $jpm = $latestResult?->completion_percentage;
                $status = 'Belum Tes';

                if ($latestResult) {
                    if ($jpm >= 85) {
                        $status = 'Sangat Cocok';
                    } elseif ($jpm >= 70) {
                        $status = 'Cocok';
                    } elseif ($jpm >= 55) {
                        $status = 'Cukup Cocok';
                    } else {
                        $status = 'Kurang Cocok';
                    }
                }

                return [
                    'id' => $user->id,
                    'no' => $index + 1,
                    'nama' => $user->name,
                    'nip' => $user->nip,
                    'jabatan' => $user->unit_kerja ?? 'Belum diisi',
                    'tanggalTes' => $latestResult?->test_date?->format('d-m-Y') ?? '-',
                    'skorDominan' => $latestResult?->primary_type ?? '-',
                    'jpm' => $jpm !== null ? round($jpm) : '-',
                    'status' => $status,
                ];
            })
            ->values()
            ->all();

        // If user_id provided, get detailed result
        $peserta = null;
        $discResult = null;
        if ($userId) {
            $peserta = User::find($userId);
            if ($peserta && $peserta->role === 'peserta') {
                // Deterministic latest: avoids wrong row when test_date is identical
                $discResult = DiscResult::where('user_id', $userId)
                    ->orderByDesc('test_date')
                    ->orderByDesc('id')
                    ->first();
            }
        }

        return Inertia::render('admin/LihatHasilAdmin', [
            'admin' => $admin,
            'pesertaData' => $pesertaData,
            'peserta' => $peserta,
            'discResult' => $discResult,
        ]);
    }
}
