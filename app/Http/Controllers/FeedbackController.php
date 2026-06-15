<?php

namespace App\Http\Controllers;

use App\Models\UserFeedback;
use App\Models\DiscResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    /**
     * Simpan Feedback dari user setelah test
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|min:10|max:1000',
            'rating' => 'nullable|integer|min:1|max:5',
            'category' => 'nullable|in:Feedback,bug,feature,other',
            'disc_result_id' => 'nullable|exists:disc_results,id',
        ]);

        $user = Auth::user();

        UserFeedback::create([
            'user_id' => $user->id,
            'disc_result_id' => $validated['disc_result_id'] ?? null,
            'message' => $validated['message'],
            'rating' => $validated['rating'] ?? null,
            'category' => $validated['category'] ?? 'Feedback',
            'email' => $user->email,
            'phone' => $user->telepon ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Terima kasih atas Feedback Anda!',
        ]);
    }

    /**
     * Admin view: lihat semua Feedback
     */
    public function index()
    {
        $Feedbacks = UserFeedback::with(['user', 'discResult'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return $Feedbacks;
    }

    /**
     * Admin: lihat detail Feedback satu user
     */
    public function show($id)
    {
        $Feedback = UserFeedback::with(['user', 'discResult'])->findOrFail($id);
        return $Feedback;
    }

    /**
     * Admin: delete Feedback
     */
    public function destroy($id)
    {
        $Feedback = UserFeedback::findOrFail($id);
        $Feedback->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Feedback berhasil dihapus',
        ]);
    }
}
