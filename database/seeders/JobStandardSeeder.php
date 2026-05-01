<?php

namespace Database\Seeders;

use App\Models\JobStandard;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class JobStandardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = database_path('seeders/data/job_standards.json');

        if (!File::exists($path)) {
            $this->command?->warn('job_standards.json not found.');
            return;
        }

        $items = json_decode(File::get($path), true);

        if (!is_array($items)) {
            $this->command?->warn('job_standards.json is invalid.');
            return;
        }

        foreach ($items as $item) {
            JobStandard::updateOrCreate(
                ['job_code' => $item['job_code']],
                [
                    'job_title' => $item['job_title'],
                    'd' => $item['d'],
                    'i' => $item['i'],
                    's' => $item['s'],
                    'c' => $item['c'],
                ]
            );
        }
    }
}
