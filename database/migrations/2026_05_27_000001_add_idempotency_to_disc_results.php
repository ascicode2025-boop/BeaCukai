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
        Schema::table('disc_results', function (Blueprint $table) {
            $table->string('idempotency_key', 191)->nullable()->after('test_date')->comment('Optional idempotency key to dedupe duplicate submissions');
            $table->index(['user_id', 'idempotency_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('disc_results', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'idempotency_key']);
            $table->dropColumn('idempotency_key');
        });
    }
};
