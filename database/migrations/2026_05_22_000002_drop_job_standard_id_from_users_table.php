<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\JobStandard;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop foreign key first if it exists
            try {
                $table->dropForeign(['job_standard_id']);
            } catch (\Exception $e) {
                // Constraint might not exist, continue
            }
            $table->dropColumn('job_standard_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('job_standard_id')
                ->nullable()
                ->after('telepon')
                ->constrained('job_standards')
                ->onDelete('set null');
        });
    }
};
