<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buat akun admin
        User::updateOrCreate(
            ['nip' => '123456789'],
            [
                'name' => 'Administrator',
                'nip' => '123456789',
                'email' => 'adibedil542@gmail.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin', // Diubah dari super_admin menjadi admin
                'unit_kerja' => 'Admin',
                'telepon' => '021-1234567',
                'is_verified' => true, // Bypass OTP untuk seed admin
                'profile_photo' => null, // Set null agar fallback ke inisial bekerja
            ]
        );

        $this->command->info('Admin account created successfully!');
        $this->command->info('NIP: 123456789');
        $this->command->info('Password: admin123');
    }
}
