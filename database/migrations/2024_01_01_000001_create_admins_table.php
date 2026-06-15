<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('profile_photo')->nullable();
            $table->enum('role', ['super_admin', 'admin'])->default('admin');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // Insert default admin account
        DB::table('admins')->insert([
            'name' => 'Administrator',
            'username' => 'admin',
            'email' => 'adibedil542@gmail.com',
            'password' => Hash::make('admin123'),
            'profile_photo' => 'profile-photos/GyeUlQtkIL3TTNNVoS2fmq1XbAb9urBBd8DKGOyS.jpg',
            'role' => 'super_admin',
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
