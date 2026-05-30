<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disc_results', function (Blueprint $table) {
            // Primary Key
            $table->id();

            // Foreign Key
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Raw Scores (ganti json -> text)
            $table->text('raw_scores_most');
            $table->text('raw_scores_least');
            $table->text('raw_scores_change');

            // Graph Scores (ganti json -> text)
            $table->text('graph_scores_most');
            $table->text('graph_scores_least');
            $table->text('graph_scores_change');

            // Personality Profile
            $table->string('primary_type', 5);
            $table->string('personality_profile', 50);
            $table->text('summary')->nullable();

            // Processing Metadata
            $table->integer('total_questions')->default(24);
            $table->decimal('completion_percentage', 5, 2)->default(100);
            $table->integer('time_spent_seconds')->nullable();

            // Timestamps
            $table->timestamp('test_date')->useCurrent();
            $table->timestamps();

            // Indexes
            $table->index('user_id');
            $table->index('primary_type');
            $table->index('test_date');
            $table->index(['user_id', 'test_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disc_results');
    }
};
