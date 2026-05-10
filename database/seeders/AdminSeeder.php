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
                'email' => 'admin@beacukai.go.id',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
                'unit_kerja' => 'Super Admin',
                'telepon' => '021-1234567',
                // Default admin profile photo stored in storage/app/public/profile-photos
                'profile_photo' => 'profile-photos/GyeUlQtkIL3TTNNVoS2fmq1XbAb9urBBd8DKGOyS.jpg',
            ]
        );

        $this->command->info('Admin account created successfully!');
        $this->command->info('NIP: 123456789');
        $this->command->info('Password: admin123');
    }
}
