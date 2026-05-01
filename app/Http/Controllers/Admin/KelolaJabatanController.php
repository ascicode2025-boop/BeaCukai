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
        $validated = $request->validate([
            'job_title' => 'required|string|max:255',
            'd' => 'required|integer|min:-12|max:12',
            'i' => 'required|integer|min:-12|max:12',
            's' => 'required|integer|min:-12|max:12',
            'c' => 'required|integer|min:-12|max:12',
        ]);

        $jobCode = $this->buildJobCode(
            $validated['job_title'],
            $validated['d'],
            $validated['i'],
            $validated['s'],
            $validated['c'],
        );

        $validated['job_code'] = $jobCode;

        $jobStandard->update($validated);

        return back()->with('success', 'Standar jabatan berhasil diperbarui.');
    }

    public function destroy(JobStandard $jobStandard): RedirectResponse
    {
        $jobStandard->delete();

        return back()->with('success', 'Jabatan berhasil dihapus.');
    }

    private function buildJobCode(string $title, int $d, int $i, int $s, int $c): string
    {
        $title = trim($title);

        if ($title === '') {
            return '';
        }

        $first = mb_substr($title, 0, 1);
        $last = mb_substr($title, mb_strlen($title) - 1, 1);

        return strtoupper($first . $last . abs($d) . abs($i) . abs($s) . abs($c));
    }
}
