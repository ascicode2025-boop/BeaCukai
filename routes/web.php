<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\VerifyOtpController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\KelolaAkunController;
use App\Http\Controllers\Admin\KelolaJabatanController;
use App\Http\Controllers\Admin\ResultController;
use App\Http\Controllers\DiscController;
use App\Http\Controllers\FeedbackController;
use Illuminate\Support\Facades\Auth;
use App\Models\DiscResult;
use App\Models\User;
use App\Models\JobStandard;
use App\Models\UserFeedback;

// ─────────────────────────────────────────────────────────────────────────────

Route::get('/', function () {
    return Inertia::render('landingPage');
});

// Login route
Route::get('/login', function () {
    return Inertia::render('LoginPage', [
        'success' => session('success'),
        'warning' => session('warning'),
        'info'    => session('info'),
        'errors'  => session('errors')
            ? session('errors')->getBag('default')->getMessages()
            : [],
    ]);
})->middleware('guest.custom')->name('login');

// Guest routes
Route::middleware('guest.custom')->group(function () {
    Route::get('/register', function () {
        return Inertia::render('RegisterPage', [
            'errors'       => session('errors')
                ? session('errors')->getBag('default')->getMessages()
                : [],
            'jobStandards' => JobStandard::all(),
        ]);
    });

    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
    Route::post('/login',    [LoginController::class,    'store'])->name('login.store');

    Route::get('/forgot-password',              [ForgotPasswordController::class, 'showForm'])->name('forgot-password');
    Route::post('/forgot-password/send-code',   [ForgotPasswordController::class, 'sendCode'])->name('forgot-password.send-code');
    Route::post('/forgot-password/verify-code', [ForgotPasswordController::class, 'verifyCode'])->name('forgot-password.verify-code');
    Route::post('/forgot-password/reset',       [ForgotPasswordController::class, 'resetPassword'])->name('forgot-password.reset');
});

// Verifikasi OTP Route (butuh auth tapi sebelum dicegah middleware full)
Route::middleware(['auth'])->group(function () {
    Route::get('/verify-otp', [VerifyOtpController::class, 'show'])->name('verify-otp.show');
    Route::post('/verify-otp', [VerifyOtpController::class, 'verify'])->name('verify-otp.verify');
    Route::post('/verify-otp/resend', [VerifyOtpController::class, 'resend'])->name('verify-otp.resend');
});

// Protected routes
Route::middleware(['auth', 'verified.custom', 'session.timeout'])->group(function () {

    Route::get('/perserta-tes/dashboard', function () {
        $user = Auth::user();
        $result = DiscResult::where('user_id', $user->id)->latest('test_date')->first();
        return Inertia::render('perserta-tes/Dashboard', [
            'user' => $user,
            'discResultData' => transformDiscResult($result),
        ]);
    });

    Route::get('/perserta-tes/soal', function () {
        return Inertia::render('perserta-tes/PengerjaanSoal', ['user' => Auth::user()]);
    })->name('pengerjaan-soal');

    // Generate Hasil
    Route::get('/perserta-tes/hasil', function (Request $request) {
        $user   = Auth::user();
        $testId = $request->query('id');

        $result = $testId
            ? DiscResult::where('id', $testId)->where('user_id', $user->id)->first()
            : DiscResult::where('user_id', $user->id)->latest('test_date')->first();

        return Inertia::render('perserta-tes/GenerateHasil', [
            'user'          => $user,
            'jobStandards'  => JobStandard::all(),
            'discResultData' => transformDiscResult($result),
        ]);
    })->name('generate-hasil');

    // Ringkasan Hasil
    Route::get('/perserta-tes/hasil-ringkas', function (Request $request) {
        $user   = Auth::user();
        $testId = $request->query('id');

        $result = $testId
            ? DiscResult::where('id', $testId)->where('user_id', $user->id)->first()
            : DiscResult::where('user_id', $user->id)->latest('test_date')->first();

        return Inertia::render('perserta-tes/HasilRingkas', [
            'user'           => $user,
            'jobStandards'   => JobStandard::all(),
            'discResultData' => transformDiscResult($result),
        ]);
    })->name('hasil-ringkas');

    // Debug endpoint
    Route::get('/api/debug/hasil-data', function () {
        $user = Auth::user();
        if (!$user) return response()->json(['error' => 'Not authenticated'], 401);

        $result = DiscResult::where('user_id', $user->id)->latest('test_date')->first();
        if (!$result) return response()->json(['error' => 'No DISC result found'], 404);

        return response()->json([
            'user'          => $user,
            'discResultData' => transformDiscResult($result),
        ]);
    });

    // Riwayat Tes
    Route::get('/perserta-tes/riwayat', function () {
        $user = Auth::user();
        $result = DiscResult::where('user_id', $user->id)->latest('test_date')->first();
        return Inertia::render('perserta-tes/RiwayatTest', [
            'user' => $user,
            'discResultData' => transformDiscResult($result),
        ]);
    })->name('riwayat-tes');

    // DISC Test API (security headers + rate limit)
    Route::post('/api/submit-disc', [DiscController::class, 'calculateScore'])
        ->middleware([\App\Http\Middleware\SecurityHeaders::class, 'throttle:5,1'])
        ->name('submit.disc');

    // Heartbeat: keep session alive while user is taking the test
    Route::get('/heartbeat', function (Request $request) {
        // touch session so session timeout middleware sees activity
        $request->session()->put('last_heartbeat', now());
        return response()->json(['ok' => true]);
    })->name('heartbeat');

    // Riwayat List
    Route::get('/perserta-tes/riwayat-list', function () {
        $user = Auth::user();

        $generateDynamicDescription = function ($primaryType, $secondaryType, $graph3, $baseDescription) {
            if (!$primaryType) return $baseDescription;

            $combos = [
                'DI' => 'Tipe Dominance dengan Influencing: Pemimpin yang karismatik dan persuasif.',
                'DS' => 'Tipe Dominance dengan Steadiness: Pemimpin yang tegas namun stabil.',
                'DC' => 'Tipe Dominance dengan Compliance: Pemimpin yang sistematis dan efisien.',
                'ID' => 'Tipe Influencing dengan Dominance: Diplomat yang ambisius.',
                'IS' => 'Tipe Influencing dengan Steadiness: Diplomat yang hangat dan konsisten.',
                'IC' => 'Tipe Influencing dengan Compliance: Diplomat yang terstruktur.',
                'SI' => 'Tipe Steadiness dengan Influencing: Mitra yang menyenangkan dan dapat diandalkan.',
                'SD' => 'Tipe Steadiness dengan Dominance: Mitra yang stabil namun tegas.',
                'SC' => 'Tipe Steadiness dengan Compliance: Mitra yang metodis dan teliti.',
                'CI' => 'Tipe Compliance dengan Influencing: Ahli yang komunikatif.',
                'CS' => 'Tipe Compliance dengan Steadiness: Ahli yang dapat diandalkan.',
                'CD' => 'Tipe Compliance dengan Dominance: Ahli yang berdeterminasi.',
            ];

            $comboKey    = $primaryType . ($secondaryType ?: '');
            $comboDesc   = $combos[$comboKey] ?? null;
            $primaryScore = $graph3[$primaryType] ?? 0;
            $intensity   = $primaryScore > 4 ? 'sangat kuat' : ($primaryScore > 0 ? 'cukup dominan' : 'moderat');

            return $comboDesc
                ? "{$comboDesc} Karakteristik ini ditunjukkan dengan intensitas {$intensity} dalam profil Anda."
                : $baseDescription;
        };

        $testHistory = DiscResult::where('user_id', $user->id)
            ->orderBy('test_date', 'desc')
            ->get()
            ->map(function ($result) use ($generateDynamicDescription) {
                $graph3        = $result->graph_scores_change;
                $sorted        = collect($graph3)->sort()->reverse();
                $sortedTraits  = $sorted->keys()->toArray();
                $primaryTrait  = $sortedTraits[0] ?? null;
                $secondaryTrait = $sortedTraits[1] ?? null;

                return [
                    'id'                 => $result->id,
                    'submitted_at'       => $result->test_date,
                    'test_date'          => $result->test_date,
                    'graph_scores'       => [
                        'Graph_1' => $result->graph_scores_most,
                        'Graph_2' => $result->graph_scores_least,
                        'Graph_3' => $graph3,
                    ],
                    'report_data'        => $result->report_data,
                    'primary_type'       => $result->primary_type,
                    'secondary_type'     => $secondaryTrait,
                    'summary'            => $result->summary,
                    'dynamicDescription' => $generateDynamicDescription(
                        $primaryTrait, $secondaryTrait, $graph3, $result->summary
                    ),
                    'user_id'            => $result->user_id,
                ];
            });

        return Inertia::render('perserta-tes/RiwayatTestList', [
            'user'        => $user,
            'testHistory' => $testHistory,
        ]);
    })->name('riwayat-tes-list');

    Route::get('/profile',         [ProfileController::class, 'show'])->name('profile.show');
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('/profile/photo/{id}', [ProfileController::class, 'photo'])->name('profile.photo');
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    // Feedback routes
    Route::post('/api/Feedback', [FeedbackController::class, 'store'])->name('Feedback.store');
});

// Admin routes
Route::prefix('admin')->middleware(['admin', 'verified.custom', 'session.timeout'])->group(function () {

    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/data-peserta', [ResultController::class, 'hasil'])->name('admin.data-peserta');

    Route::get('/manage-positions', [KelolaJabatanController::class, 'index'])->name('admin.manage-positions');
    Route::post('/manage-positions', [KelolaJabatanController::class, 'store'])->name('admin.manage-positions.store');
    Route::put('/manage-positions/{jobStandard}', [KelolaJabatanController::class, 'update'])->name('admin.manage-positions.update');
    Route::delete('/manage-positions/{jobStandard}', [KelolaJabatanController::class, 'destroy'])->name('admin.manage-positions.destroy');

    Route::get('/add-jabatan', function () {
        return Inertia::render('admin/AddJabatan');
    })->name('admin.add-jabatan');

    Route::get('/kelola-akun', [KelolaAkunController::class, 'index'])->name('admin.kelola-akun');
    Route::post('/kelola-akun', [KelolaAkunController::class, 'store'])->name('admin.kelola-akun.store');
    Route::post('/kelola-akun/{user}/toggle-status', [KelolaAkunController::class, 'toggleStatus'])->name('admin.kelola-akun.toggle-status');

    // Admin lihat hasil ringkas peserta — struktur sama persis dengan route peserta
    Route::get('/hasil-ringkas', function (Request $request) {
        $userId = $request->query('user_id');

        if (!$userId) {
            return redirect('/admin/data-peserta')->with('error', 'Peserta tidak dipilih');
        }

        $peserta = User::find($userId);
        if (!$peserta || $peserta->role !== 'peserta') {
            return redirect('/admin/data-peserta')->with('error', 'Peserta tidak ditemukan');
        }

        $result = DiscResult::where('user_id', $userId)
            ->latest('test_date')
            ->first();

        return Inertia::render('perserta-tes/HasilRingkas', [
            'user'           => $peserta,
            'jobStandards'   => JobStandard::all(),
            'discResultData' => transformDiscResult($result),
        ]);
    })->name('admin.hasil-ringkas');

    // Feedback Admin Routes
    Route::get('/Feedback', function () {
        $Feedbacks = \App\Models\UserFeedback::with(['user', 'discResult'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('admin/FeedbackList', [
            'Feedbacks' => $Feedbacks,
        ]);
    })->name('admin.Feedback');

    Route::delete('/Feedback/{id}', [FeedbackController::class, 'destroy'])->name('admin.Feedback.destroy');
});
