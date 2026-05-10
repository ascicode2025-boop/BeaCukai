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
        Schema::create('disc_answers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade')
                ->comment('Reference ke user yang mengerjakan tes');

            $table->foreignId('disc_result_id')
                ->constrained('disc_results')
                ->onDelete('cascade')
                ->comment('Reference ke hasil DISC');

            $table->unsignedTinyInteger('question_number')
                ->comment('Nomor pertanyaan (1-24)');

            $table->string('most_choice', 4)
                ->comment('Pilihan Most (contoh: 1A)');

            $table->string('least_choice', 4)
                ->comment('Pilihan Least (contoh: 1B)');

            $table->string('most_score', 2)
                ->nullable()
                ->comment('Hasil mapping Most ke trait (D/I/S/C/*)');

            $table->string('least_score', 2)
                ->nullable()
                ->comment('Hasil mapping Least ke trait (D/I/S/C/*)');

            $table->timestamps();

            $table->index(['user_id', 'disc_result_id']);
            $table->index('question_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disc_answers');
    }
};
