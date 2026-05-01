<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('disc_results', function (Blueprint $table) {
            // Primary Key
            $table->id();

            // Foreign Key
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade')
                  ->comment('Reference ke user yang mengerjakan tes');

            // Raw Scores
            $table->json('raw_scores_most')
                  ->comment('Skor mentah dari jawaban Most (D, I, S, C)');
            $table->json('raw_scores_least')
                  ->comment('Skor mentah dari jawaban Least (D, I, S, C)');
            $table->json('raw_scores_change')
                  ->comment('Skor perubahan Most - Least');

            // Graph Scores (Converted)
            $table->json('graph_scores_most')
                  ->comment('Skor Graph 1 (Most) setelah konversi');
            $table->json('graph_scores_least')
                  ->comment('Skor Graph 2 (Least) setelah konversi');
            $table->json('graph_scores_change')
                  ->comment('Skor Graph 3 (Change) setelah konversi');

            // Personality Profile
            $table->string('primary_type', 5)
                  ->comment('Tipe kepribadian utama (D, I, S, atau C)');
            $table->string('personality_profile', 50)
                  ->comment('Deskripsi profil kepribadian utama');
            $table->text('summary')
                  ->nullable()
                  ->comment('Ringkasan profil/summary dari controller');

            // Processing Metadata
            $table->integer('total_questions')
                  ->default(24)
                  ->comment('Jumlah soal yang dijawab');
            $table->decimal('completion_percentage', 5, 2)
                  ->default(100)
                  ->comment('Persentase penyelesaian tes');
            $table->integer('time_spent_seconds')
                  ->nullable()
                  ->comment('Waktu pengerjaan dalam detik');

            // Timestamps
            $table->timestamp('test_date')
                  ->useCurrent()
                  ->comment('Tanggal & waktu tes dilakukan');
            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('primary_type');
            $table->index('test_date');
            $table->index(['user_id', 'test_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disc_results');
    }
};
