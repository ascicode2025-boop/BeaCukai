<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\JobStandard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class KelolaJabatanController extends Controller
{
    public function index(): Response
    {
        $admin = Auth::user();

        $jobStandards = JobStandard::query()
            ->orderBy('job_title')
            ->get([
                'id',
                'job_code',
                'job_title',
                'd',
                'i',
                's',
                'c',
            ]);

        return Inertia::render('admin/KelolaJabatan', [
            'admin' => $admin,
            'jobStandards' => $jobStandards,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Paksakan uppercase sebelum divalidasi
        $request->merge([
            'job_code' => strtoupper($request->job_code)
        ]);

        $validated = $request->validate([
            'job_code' => 'required|string|max:50|unique:job_standards,job_code',
            'job_title' => 'required|string|max:255',
            'd' => 'required|integer|min:-12|max:12',
            'i' => 'required|integer|min:-12|max:12',
            's' => 'required|integer|min:-12|max:12',
            'c' => 'required|integer|min:-12|max:12',
        ]);

        JobStandard::create($validated);

        return back()->with('success', 'Jabatan berhasil ditambahkan.');
    }

    public function update(Request $request, JobStandard $jobStandard): RedirectResponse
    {
        // Paksakan uppercase sebelum divalidasi
        $request->merge([
            'job_code' => strtoupper($request->job_code)
        ]);

        $validated = $request->validate([
            'job_code' => 'required|string|max:50|unique:job_standards,job_code,' . $jobStandard->id,
            'job_title' => 'required|string|max:255',
            'd' => 'required|integer|min:-12|max:12',
            'i' => 'required|integer|min:-12|max:12',
            's' => 'required|integer|min:-12|max:12',
            'c' => 'required|integer|min:-12|max:12',
        ]);

        $jobStandard->update($validated);

        return back()->with('success', 'Standar jabatan berhasil diperbarui.');
    }

    public function destroy(JobStandard $jobStandard): RedirectResponse
    {
        $jobStandard->delete();

        return back()->with('success', 'Jabatan berhasil dihapus.');
    }
}
