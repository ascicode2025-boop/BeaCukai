<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('disc_results', function (Blueprint $table) {
            $table->text('report_data')->nullable()->after('summary');
        });
    }

    public function down(): void
    {
        Schema::table('disc_results', function (Blueprint $table) {
            $table->dropColumn('report_data');
        });
    }
};
