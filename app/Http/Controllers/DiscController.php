<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\DiscResult;

class DiscController extends Controller
{
    /**
     * Hitung skor DISC dari jawaban user
     *
     * Format input dari React:
     * {
     * "1": { "M": "1A", "L": "1C" },
     * "2": { "M": "2B", "L": "2D" },
     * ...
     * "24": { "M": "24A", "L": "24B" }
     * }
     */
    public function calculateScore(Request $request)
    {
        // 1. Validasi input
        $validated = $request->validate([
            'answers' => 'required|array|min:24',
            'answers.*' => 'array',
            'answers.*.M' => 'required|string',
            'answers.*.L' => 'required|string|different:answers.*.M',
        ]);

        $answers = $validated['answers'];

        // Cek secara manual kalau-kalau validasi array Laravel lolos 
        // karena cara pengiriman key-value dari frontend (M dan L harus beda karakter terakhir)
        foreach ($answers as $qNum => $choices) {
            $mostLetter = substr($choices['M'], -1);
            $leastLetter = substr($choices['L'], -1);

            if ($mostLetter === $leastLetter) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Validasi Gagal: Pilihan 'Most' dan 'Least' tidak boleh sama pada soal nomor {$qNum}.",
                ], 422);
            }
        }

        // Idempotency: check optional Idempotency-Key header to avoid duplicate submissions
        $idempotencyKey = $request->header('Idempotency-Key') ?? $request->header('Idempotency_key') ?? null;
        if ($idempotencyKey) {
            try {
                $existing = DiscResult::where('user_id', Auth::id())
                    ->where('idempotency_key', $idempotencyKey)
                    ->first();

                if ($existing) {
                    // Return existing saved result to client — do not create duplicate
                    return response()->json([
                        'status' => 'success',
                        'message' => 'Duplicate submission suppressed (idempotent)',
                        'data' => null,
                        'saved_result' => $existing->toArray(),
                    ], 200);
                }
            } catch (\Exception $e) {
                // log but don't block processing
                Log::warning('Idempotency lookup failed: ' . $e->getMessage());
            }
        }

        // 2. SCORING KEY - Mapping jawaban ke skor DISC (LENGKAP 1 - 24)
        $scoringKey = [
            // SOAL 1 - 5
            '1A' => ['M' => 'I', 'L' => 'I'], '1B' => ['M' => 'S', 'L' => '*'], '1C' => ['M' => 'D', 'L' => 'D'], '1D' => ['M' => 'C', 'L' => 'C'],
            '2A' => ['M' => 'C', 'L' => 'C'], '2B' => ['M' => '*', 'L' => 'I'], '2C' => ['M' => 'I', 'L' => 'I'], '2D' => ['M' => 'S', 'L' => 'S'],
            '3A' => ['M' => 'I', 'L' => 'C'], '3B' => ['M' => 'C', 'L' => '*'], '3C' => ['M' => 'S', 'L' => 'S'], '3D' => ['M' => 'D', 'L' => 'D'],
            '4A' => ['M' => 'C', 'L' => 'C'], '4B' => ['M' => 'S', 'L' => '*'], '4C' => ['M' => 'I', 'L' => 'I'], '4D' => ['M' => 'D', 'L' => 'D'],
            '5A' => ['M' => 'I', 'L' => 'I'], '5B' => ['M' => 'D', 'L' => 'D'], '5C' => ['M' => 'S', 'L' => 'S'], '5D' => ['M' => 'C', 'L' => 'C'],

            // SOAL 6 - 10
            '6A' => ['M' => 'C', 'L' => 'C'], '6B' => ['M' => 'D', 'L' => 'D'], '6C' => ['M' => 'I', 'L' => 'I'], '6D' => ['M' => 'S', 'L' => 'S'],
            '7A' => ['M' => 'S', 'L' => 'S'], '7B' => ['M' => 'I', 'L' => 'C'], '7C' => ['M' => 'C', 'L' => '*'], '7D' => ['M' => 'D', 'L' => 'D'],
            '8A' => ['M' => 'I', 'L' => 'I'], '8B' => ['M' => 'S', 'L' => 'S'], '8C' => ['M' => 'C', 'L' => 'C'], '8D' => ['M' => 'D', 'L' => 'D'],
            '9A' => ['M' => 'D', 'L' => 'D'], '9B' => ['M' => 'C', 'L' => 'C'], '9C' => ['M' => 'I', 'L' => 'I'], '9D' => ['M' => 'S', 'L' => '*'],
            '10A'=> ['M' => 'D', 'L' => 'D'], '10B'=> ['M' => 'I', 'L' => 'C'], '10C'=> ['M' => 'S', 'L' => 'S'], '10D'=> ['M' => 'C', 'L' => '*'],

            // SOAL 11 - 15
            '11A'=> ['M' => 'I', 'L' => 'I'], '11B'=> ['M' => 'D', 'L' => 'D'], '11C'=> ['M' => 'S', 'L' => '*'], '11D'=> ['M' => 'C', 'L' => 'C'],
            '12A'=> ['M' => 'S', 'L' => 'S'], '12B'=> ['M' => 'C', 'L' => 'C'], '12C'=> ['M' => 'I', 'L' => 'I'], '12D'=> ['M' => 'D', 'L' => 'D'],
            '13A'=> ['M' => 'D', 'L' => 'D'], '13B'=> ['M' => 'S', 'L' => 'S'], '13C'=> ['M' => 'I', 'L' => 'I'], '13D'=> ['M' => 'C', 'L' => 'C'],
            '14A'=> ['M' => 'C', 'L' => 'C'], '14B'=> ['M' => 'I', 'L' => 'I'], '14C'=> ['M' => 'S', 'L' => 'S'], '14D'=> ['M' => 'D', 'L' => 'D'],
            '15A'=> ['M' => 'I', 'L' => 'I'], '15B'=> ['M' => 'C', 'L' => 'C'], '15C'=> ['M' => 'D', 'L' => 'D'], '15D'=> ['M' => 'S', 'L' => 'S'],

            // SOAL 16 - 20
            '16A'=> ['M' => 'D', 'L' => 'D'], '16B'=> ['M' => 'C', 'L' => 'C'], '16C'=> ['M' => 'I', 'L' => 'I'], '16D'=> ['M' => 'S', 'L' => 'S'],
            '17A'=> ['M' => 'C', 'L' => 'C'], '17B'=> ['M' => 'D', 'L' => 'D'], '17C'=> ['M' => 'S', 'L' => 'S'], '17D'=> ['M' => 'I', 'L' => 'I'],
            '18A'=> ['M' => 'D', 'L' => 'D'], '18B'=> ['M' => 'I', 'L' => 'I'], '18C'=> ['M' => 'S', 'L' => 'S'], '18D'=> ['M' => 'C', 'L' => 'C'],
            '19A'=> ['M' => 'D', 'L' => 'D'], '19B'=> ['M' => 'S', 'L' => '*'], '19C'=> ['M' => 'I', 'L' => 'I'], '19D'=> ['M' => 'C', 'L' => 'C'],
            '20A'=> ['M' => 'D', 'L' => 'D'], '20B'=> ['M' => 'S', 'L' => 'S'], '20C'=> ['M' => 'I', 'L' => 'I'], '20D'=> ['M' => 'C', 'L' => 'C'],

            // SOAL 21 - 24
            '21A'=> ['M' => 'S', 'L' => 'S'], '21B'=> ['M' => 'D', 'L' => 'D'], '21C'=> ['M' => 'I', 'L' => 'I'], '21D'=> ['M' => 'C', 'L' => 'C'],
            '22A'=> ['M' => 'S', 'L' => 'S'], '22B'=> ['M' => 'I', 'L' => 'I'], '22C'=> ['M' => 'D', 'L' => 'D'], '22D'=> ['M' => 'C', 'L' => 'C'],
            '23A'=> ['M' => 'D', 'L' => 'D'], '23B'=> ['M' => 'I', 'L' => 'I'], '23C'=> ['M' => 'S', 'L' => 'S'], '23D'=> ['M' => 'C', 'L' => 'C'],
            '24A'=> ['M' => 'S', 'L' => 'S'], '24B'=> ['M' => 'I', 'L' => 'I'], '24C'=> ['M' => 'D', 'L' => 'D'], '24D'=> ['M' => 'C', 'L' => 'C'],
        ];

        // 3. TABEL KONVERSI GRAFIK (diambil dari referensi CSV)
        $conversionTable = [
            'Most' => [ // Untuk Graph 1 — values mapped for raw scores 0..20
                'D' => [-6.0, -5.3, -4.0, -2.5, -1.7, -1.3, 0.0, 0.5, 1.0, 2.0, 3.0, 3.5, 4.0, 4.7, 5.3, 6.5, 7.0, 7.0, 7.0, 7.5, 7.5],
                'I' => [-7.0, -4.6, -2.5, -1.3, 1.0, 3.0, 3.5, 5.3, 5.7, 6.0, 6.5, 7.0, 7.0, 7.0, 7.0, 7.0, 7.5, 7.5, 7.5, 7.5, 8.0],
                'S' => [-5.7, -4.3, -3.5, -1.5, -0.7, 0.5, 1.0, 2.5, 3.0, 4.0, 4.6, 5.0, 5.7, 6.0, 6.5, 6.5, 7.0, 7.0, 7.0, 7.5, 7.5],
                'C' => [-6.0, -4.7, -3.5, -1.5, 0.5, 2.0, 3.0, 5.3, 5.7, 6.0, 6.3, 6.5, 6.7, 7.0, 7.3, 7.3, 7.3, 7.5, 8.0, 8.0, 8.0]
            ],
            'Least' => [ // Untuk Graph 2 — values mapped for raw scores 0..20
                'D' => [7.5, 6.5, 4.3, 2.5, 1.5, 0.5, 0.0, -1.3, -1.5, -2.5, -3.0, -3.5, -4.3, -5.3, -5.7, -6.0, -6.5, 6.7, 7.0, -7.3, -7.5],
                'I' => [7.0, 6.0, 4.0, 2.5, 0.5, 0.0, -2.0, -3.5, -4.3, -5.3, -6.0, -6.5, -7.0, -7.2, -7.2, -7.2, -7.3, -7.3, -7.3, -7.5, -8.0],
                'S' => [7.5, 7.0, 6.0, 4.0, 2.5, 1.5, 0.5, -1.3, -2.0, -3.0, -4.3, -5.3, -6.0, -6.5, -6.7, -6.7, -7.0, -7.2, -7.3, -7.5, -8.0],
                'C' => [7.5, 7.0, 5.6, 4.0, 2.5, 1.5, 0.5, 0.0, -1.3, -2.5, -3.5, -5.3, -5.7, -6.0, -6.5, -7.0, -7.3, -7.5, -7.7, -7.9, -8.0]
            ],
            'Change' => [ // Untuk Graph 3 — full mapping (from CSV)
                'D' => [
                    -22 => -8.0, -21 => -7.5, -20 => -7.0, -19 => -6.8, -18 => -6.75, -17 => -6.7, -16 => -6.5,
                    -15 => -6.3, -14 => -6.1, -13 => -5.9, -12 => -5.7, -11 => -5.3, -10 => -4.3, -9 => -3.5,
                    -8 => -3.25, -7 => -3.0, -6 => -2.75, -5 => -2.5, -4 => -1.5, -3 => -1.0, -2 => -0.5, -1 => -0.25,
                    0 => 0.0, 1 => 0.5, 2 => 0.7, 3 => 1.0, 4 => 1.3, 5 => 1.5, 6 => 2.0, 7 => 2.5, 8 => 3.5, 9 => 4.0,
                    10 => 4.7, 11 => 4.85, 12 => 5.0, 13 => 5.5, 14 => 6.0, 15 => 6.3, 16 => 6.5, 17 => 6.7, 18 => 7.0,
                    19 => 7.3, 20 => 7.3, 21 => 7.5, 22 => 8.0,
                ],
                'I' => [
                    -22 => -8.0, -21 => -8.0, -20 => -8.0, -19 => -8.0, -18 => -7.0, -17 => -6.7, -16 => -6.7,
                    -15 => -6.7, -14 => -6.7, -13 => -6.7, -12 => -6.7, -11 => -6.7, -10 => -6.5, -9 => -6.0,
                    -8 => -5.7, -7 => -4.7, -6 => -4.3, -5 => -3.5, -4 => -3.0, -3 => -2.0, -2 => -1.5, -1 => 0.0,
                    0 => 0.5, 1 => 1.0, 2 => 1.5, 3 => 3.0, 4 => 4.0, 5 => 4.3, 6 => 5.0, 7 => 5.5, 8 => 6.5, 9 => 6.7,
                    10 => 7.0, 11 => 7.3, 12 => 7.3, 13 => 7.3, 14 => 7.3, 15 => 7.3, 16 => 7.3, 17 => 7.3, 18 => 7.5,
                    19 => 8.0, 20 => 8.0, 21 => 8.0, 22 => 8.0,
                ],
                'S' => [
                    -22 => -8.0, -21 => -8.0, -20 => -8.0, -19 => -8.0, -18 => -7.5, -17 => -7.3, -16 => -7.3,
                    -15 => -7.0, -14 => -6.5, -13 => -6.5, -12 => -6.5, -11 => -6.5, -10 => -6.0, -9 => -4.7,
                    -8 => -4.3, -7 => -3.5, -6 => -3.0, -5 => -2.0, -4 => -1.5, -3 => -1.0, -2 => -0.5, -1 => 0.0,
                    0 => 1.0, 1 => 1.5, 2 => 2.0, 3 => 3.0, 4 => 3.5, 5 => 4.0, 7 => 4.7, 8 => 5.0, 9 => 5.5, 10 => 6.0,
                    11 => 6.2, 12 => 6.3, 13 => 6.5, 14 => 6.7, 15 => 7.0, 16 => 7.3, 17 => 7.3, 18 => 7.3, 19 => 7.3,
                    20 => 7.5, 21 => 8.0, 22 => 8.0,
                ],
                'C' => [
                    -22 => -7.5, -21 => -7.3, -20 => -7.3, -19 => -7.0, -18 => -6.7, -17 => -6.7, -16 => -6.7,
                    -15 => -6.5, -14 => -6.3, -13 => -6.0, -12 => -5.85, -11 => -5.85, -10 => -5.7, -9 => -4.7,
                    -8 => -4.3, -7 => -3.5, -6 => -3.0, -5 => -2.5, -4 => -0.5, -3 => 0.0, -2 => 0.3, -1 => 0.5,
                    0 => 1.5, 1 => 3.0, 2 => 4.0, 3 => 4.3, 4 => 5.5, 5 => 5.7, 6 => 6.0, 7 => 6.3, 8 => 6.5, 9 => 6.7,
                    10 => 7.0, 11 => 7.3, 12 => 7.3, 13 => 7.3, 14 => 7.3, 15 => 7.3, 16 => 7.3, 17 => 7.5, 18 => 8.0,
                    19 => 8.0, 20 => 8.0, 21 => 8.0, 22 => 8.0,
                ],
            ]
        ];

        // 3b. Jika tersedia, muat mapping canonical yang diimpor (storage/app/disc_conversion.json)
        try {
            static $cachedImported = null;
            static $cachedImportedMTime = 0;
            $importPath = storage_path('app/disc_conversion.json');
            if (file_exists($importPath)) {
                $mtime = @filemtime($importPath) ?: 0;
                if ($cachedImported === null || $mtime !== $cachedImportedMTime) {
                    $raw = @file_get_contents($importPath);
                    $decoded = @json_decode($raw, true);
                    if (is_array($decoded) && isset($decoded['Most'], $decoded['Least'], $decoded['Change'])) {
                        $cachedImported = $decoded;
                        $cachedImportedMTime = $mtime;
                    } else {
                        Log::warning('disc_conversion.json found but not in expected format');
                        $cachedImported = null;
                    }
                }

                if (is_array($cachedImported)) {
                    // Basic validation of structure
                    $valid = true;
                    foreach (['Most', 'Least'] as $type) {
                        foreach (['D','I','S','C'] as $trait) {
                            if (!isset($cachedImported[$type][$trait]) || !is_array($cachedImported[$type][$trait]) || count($cachedImported[$type][$trait]) < 21) {
                                $valid = false;
                                break 2;
                            }
                        }
                    }
                    foreach (['D','I','S','C'] as $trait) {
                        if (!isset($cachedImported['Change'][$trait]) || !is_array($cachedImported['Change'][$trait]) || count($cachedImported['Change'][$trait]) < 20) {
                            $valid = false;
                            break;
                        }
                    }
                    if ($valid) {
                        $conversionTable = $cachedImported;
                        Log::info('disc_conversion.json loaded and will be used for DISC conversion');
                    } else {
                        Log::warning('disc_conversion.json failed validation — using built-in conversion table');
                    }
                }
            }
        } catch (\Exception $e) {
            Log::warning('Failed to load disc_conversion.json: ' . $e->getMessage());
        }

        // --- Helper: safe lookup & validation for conversion tables ---
        $safe_index_lookup = function(array $arr, int $index) {
            // prefer exact index
            if (isset($arr[$index])) return $arr[$index];
            // clamp to valid 0..20 for Most/Least
            $clamped = max(0, min(20, $index));
            if (isset($arr[$clamped])) return $arr[$clamped];
            // fallback to nearest existing index
            $keys = array_keys($arr);
            sort($keys, SORT_NUMERIC);
            $nearest = $keys[0];
            $minDist = abs($index - $nearest);
            foreach ($keys as $k) {
                $d = abs($index - $k);
                if ($d < $minDist) { $minDist = $d; $nearest = $k; }
            }
            return $arr[$nearest];
        };

        $safe_change_lookup = function(array $map, int $key) {
            // prefer exact mapping
            if (isset($map[$key])) return $map[$key];
            // if not exact, find nearest numeric key available in the full map
            $keys = array_keys($map);
            // filter numeric keys
            $numKeys = array_filter($keys, function($k){ return is_numeric($k); });
            if (empty($numKeys)) {
                // fallback: return 0 to avoid breaking
                return 0;
            }
            // convert to ints for comparison
            $numKeys = array_map('intval', $numKeys);
            sort($numKeys, SORT_NUMERIC);
            $nearest = $numKeys[0];
            $minDist = abs($key - $nearest);
            foreach ($numKeys as $k) {
                $d = abs($key - $k);
                if ($d < $minDist) { $minDist = $d; $nearest = $k; }
            }
            $val = $map[$nearest];
            // ensure converted value sits within expected bounds
            if (is_numeric($val)) {
                if ($val > 8) $val = 8;
                if ($val < -8) $val = -8;
            }
            return $val;
        };

        // Basic sanity checks for conversion table completeness
        try {
            // Most/Least arrays should have indices 0..20
                foreach (['Most','Least'] as $type) {
                    foreach (['D','I','S','C'] as $trait) {
                        $arr = $conversionTable[$type][$trait] ?? null;
                        if (!is_array($arr) || count($arr) < 21) {
                            Log::warning("Conversion table '{$type}.{$trait}' incomplete (expected 21 entries)");
                    }
                }
            }
            // Change mapping should have some keys spanning -22..22; warn if missing many
            foreach (['D','I','S','C'] as $trait) {
                $map = $conversionTable['Change'][$trait] ?? [];
                    if (!is_array($map) || count($map) < 30) {
                    Log::warning("Conversion map Change.{$trait} may be incomplete (found " . count($map) . " entries)");
                }
            }
        } catch (\Exception $e) {
                Log::warning('Error validating conversionTable: ' . $e->getMessage());
        }

        // 4. Siapkan wadah untuk menghitung skor mentah
        $rawMost = ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0, '*' => 0];
        $rawLeast = ['D' => 0, 'I' => 0, 'S' => 0, 'C' => 0, '*' => 0];

        // 5. KALKULASI SKOR MENTAH
        foreach ($answers as $qNum => $choices) {
            $selM = $choices['M'];
            $selL = $choices['L'];

            // Proses jawaban MOST
            if (isset($scoringKey[$selM]['M'])) {
                $rawMost[$scoringKey[$selM]['M']]++;
            }

            // Proses jawaban LEAST
            if (isset($scoringKey[$selL]['L'])) {
                $rawLeast[$scoringKey[$selL]['L']]++;
            }
        }

        // 6. KONVERSI KE NILAI GRAFIK (Graph 1 & 2)
        // Gunakan min() & max() untuk menjaga index tidak out of bounds
        $graph1 = [
            'D' => $safe_index_lookup($conversionTable['Most']['D'], (int) ($rawMost['D'] ?? 0)),
            'I' => $safe_index_lookup($conversionTable['Most']['I'], (int) ($rawMost['I'] ?? 0)),
            'S' => $safe_index_lookup($conversionTable['Most']['S'], (int) ($rawMost['S'] ?? 0)),
            'C' => $safe_index_lookup($conversionTable['Most']['C'], (int) ($rawMost['C'] ?? 0))
        ];

        $graph2 = [
            'D' => $safe_index_lookup($conversionTable['Least']['D'], (int) ($rawLeast['D'] ?? 0)),
            'I' => $safe_index_lookup($conversionTable['Least']['I'], (int) ($rawLeast['I'] ?? 0)),
            'S' => $safe_index_lookup($conversionTable['Least']['S'], (int) ($rawLeast['S'] ?? 0)),
            'C' => $safe_index_lookup($conversionTable['Least']['C'], (int) ($rawLeast['C'] ?? 0))
        ];

        // 7. GRAPH 3: CHANGE (Raw dan Converted)
        $graph3_Raw = [
            'D' => $rawMost['D'] - $rawLeast['D'],
            'I' => $rawMost['I'] - $rawLeast['I'],
            'S' => $rawMost['S'] - $rawLeast['S'],
            'C' => $rawMost['C'] - $rawLeast['C'],
        ];

        // Fallback (??) digunakan agar jika nilai minus lebih dalam dari -10 (misal -12),
        // sistem tidak error dan mengembalikan nilai mentahnya.
        $graph3 = [
            'D' => $safe_change_lookup($conversionTable['Change']['D'], (int) ($graph3_Raw['D'] ?? 0)),
            'I' => $safe_change_lookup($conversionTable['Change']['I'], (int) ($graph3_Raw['I'] ?? 0)),
            'S' => $safe_change_lookup($conversionTable['Change']['S'], (int) ($graph3_Raw['S'] ?? 0)),
            'C' => $safe_change_lookup($conversionTable['Change']['C'], (int) ($graph3_Raw['C'] ?? 0)),
        ];

        // 8. DESKRIPSI LAPORAN (REPORT DATA)
        // Struktur ini disesuaikan untuk langsung dipanggil oleh React 'GenerateHasil.jsx'
        $profileDescriptions = [
            'D' => [
                'primaryType' => 'D - Dominance',
                'summary' => 'Anda adalah pribadi dengan dorongan hasil yang sangat kuat, percaya diri saat mengambil keputusan, dan cenderung nyaman berada di posisi yang memimpin arah. Dalam situasi kerja, Anda cepat membaca peluang, berani mengambil risiko terukur, serta mampu bergerak tegas saat tim membutuhkan kejelasan. Gaya Anda efektif untuk mencapai target menantang, terutama ketika dibutuhkan kecepatan eksekusi, ketegasan prioritas, dan keberanian menghadapi hambatan. Agar potensi Anda semakin optimal, keseimbangan antara ketegasan dan empati akan menjadi kunci penting dalam menjaga kolaborasi tim tetap sehat sekaligus produktif.',
                'strengths' => [
                    'Mampu mengatasi berbagai masalah dengan cepat',
                    'Berorientasi pada hasil dan tujuan yang tinggi',
                    'Berani mengambil tanggung jawab dan risiko',
                    'Pengambilan keputusan yang tegas dan efektif',
                    'Percaya diri dan mandiri'
                ],
                'weaknesses' => [
                    'Suka berargumen dan berpotensi terlihat agresif',
                    'Kurang menyukai rutinitas dan pekerjaan detail',
                    'Cenderung impulsif dan tidak sabaran',
                    'Terkadang kurang empati terhadap orang lain',
                    'Sulit menerima kritik'
                ],
                'workCharacteristics' => [
                    'Memimpin proyek dengan arah yang sangat jelas',
                    'Senang memberikan tantangan kepada tim',
                    'Fokus pada efisiensi pekerjaan',
                    'Gaya komunikasi langsung (direct)'
                ],
                'recommendations' => [
                    'Tingkatkan empati dalam kepemimpinan',
                    'Dengarkan perspektif dan masukan tim secara lebih aktif',
                    'Beri waktu untuk perencanaan yang lebih detail',
                    'Kembangkan kesabaran dalam proses bekerja'
                ]
            ],
            'I' => [
                'primaryType' => 'I - Influence',
                'summary' => 'Anda adalah individu yang komunikatif, ekspresif, dan mampu membangun energi positif di lingkungan kerja. Anda cenderung mudah terhubung dengan orang lain, menyampaikan ide dengan antusias, serta memengaruhi tim melalui pendekatan interpersonal yang hangat. Dalam kolaborasi, Anda sering menjadi penggerak suasana, pendorong motivasi, dan jembatan komunikasi antaranggota tim. Kekuatan ini sangat berharga pada peran yang membutuhkan persuasi, presentasi, dan koordinasi lintas fungsi. Untuk hasil yang lebih konsisten, kemampuan Anda akan semakin kuat jika dipadukan dengan pengelolaan fokus, ketelitian pada detail, dan disiplin eksekusi terhadap prioritas utama.',
                'strengths' => [
                    'Sangat mudah bergaul dan membangun relasi',
                    'Memiliki antusiasme dan energi yang menular',
                    'Kemampuan persuasi dan meyakinkan yang baik',
                    'Optimis dan mampu melihat sisi positif',
                    'Komunikator yang ulung'
                ],
                'weaknesses' => [
                    'Lebih mementingkan popularitas daripada hasil akhir',
                    'Kurang teliti pada hal-hal detail',
                    'Mudah terdistraksi dan kesulitan fokus',
                    'Cenderung mengandalkan intuisi daripada data analisis',
                    'Terkadang menjanjikan lebih dari yang bisa ditepati'
                ],
                'workCharacteristics' => [
                    'Menciptakan suasana kerja yang menyenangkan',
                    'Suka bekerja secara kolaboratif (teamwork)',
                    'Lebih suka tugas yang melibatkan interaksi dengan orang',
                    'Pendekatan kerja yang dinamis'
                ],
                'recommendations' => [
                    'Buat prioritas kerja dan taati jadwal',
                    'Fokus pada objektivitas hasil, bukan sekadar respons sosial',
                    'Latih ketelitian terhadap detail tugas',
                    'Tingkatkan kemampuan analitis sebelum bertindak'
                ]
            ],
            'S' => [
                'primaryType' => 'S - Steadiness',
                'summary' => 'Anda adalah fondasi tim yang tenang, konsisten, dan sangat dapat diandalkan. Anda menghargai keharmonisan, bekerja dengan stabil, dan selalu menjadi pendengar yang baik bagi rekan kerja.',
                'strengths' => [
                    'Pendengar yang sangat baik dan suportif',
                    'Sangat konsisten dan bekerja dengan ritme stabil',
                    'Dapat diandalkan dan berdedikasi tinggi',
                    'Sabar dan kooperatif dengan rekan setim',
                    'Pemersatu tim yang menjaga keharmonisan'
                ],
                'weaknesses' => [
                    'Cenderung menolak perubahan yang terjadi tiba-tiba',
                    'Sering kali menghindari konflik',
                    'Lambat dalam mengambil inisiatif baru',
                    'Menyimpan perasaan sendiri saat tidak setuju',
                    'Butuh waktu lama untuk menyesuaikan diri'
                ],
                'workCharacteristics' => [
                    'Bekerja dengan sangat baik dalam lingkungan yang terstruktur',
                    'Suka menyelesaikan tugas satu per satu hingga tuntas',
                    'Lebih menyukai instruksi yang jelas dan terarah',
                    'Mendukung dan membantu anggota tim lain'
                ],
                'recommendations' => [
                    'Belajar mengutarakan opini atau ketidaksetujuan secara asertif',
                    'Berlatih mengambil inisiatif mandiri tanpa harus menunggu arahan',
                    'Terbuka dan lebih adaptif terhadap perubahan sistem/kerja',
                    'Belajar menghadapi konflik secara konstruktif'
                ]
            ],
            'C' => [
                'primaryType' => 'C - Compliance',
                'summary' => 'Anda adalah pemikir yang logis, akurat, dan sangat sistematis. Anda selalu memastikan pekerjaan mematuhi standar yang tinggi dan selalu fokus pada kualitas serta analisis yang mendalam.',
                'strengths' => [
                    'Sangat sistematis dan analitis dalam bekerja',
                    'Memiliki standar kualitas yang sangat tinggi',
                    'Sangat akurat dan teliti terhadap detail',
                    'Pemikir yang logis dan objektif',
                    'Ahli dalam memecahkan masalah yang kompleks'
                ],
                'weaknesses' => [
                    'Terlalu perfeksionis dan kaku',
                    'Terlalu fokus pada detail hingga kehilangan gambaran besar',
                    'Kurang nyaman dengan situasi yang ambigu (tidak jelas)',
                    'Lambat mengambil keputusan karena butuh banyak data',
                    'Cenderung menghindari risiko'
                ],
                'workCharacteristics' => [
                    'Bekerja dengan mengacu pada fakta, data, dan aturan',
                    'Sangat terorganisir dalam merencanakan tugas',
                    'Mengevaluasi setiap kemungkinan sebelum bertindak',
                    'Suka bekerja dengan sistem yang terstruktur'
                ],
                'recommendations' => [
                    'Belajar untuk lebih fleksibel jika situasi membutuhkan adaptasi',
                    'Sadari bahwa tidak semua hal harus 100% sempurna',
                    'Beranikan diri untuk mengambil keputusan meskipun data belum sepenuhnya lengkap',
                    'Kurangi sifat terlalu kritis terhadap rekan kerja'
                ]
            ]
        ];

        // 9. PENENTUAN PROFIL BERDASARKAN GRAPH 3 TERTINGGI
        $sortedGraph3 = $graph3;
        arsort($sortedGraph3); // Mengurutkan Graph 3 dari yang paling tinggi ke rendah
        $sortedTraits = array_keys($sortedGraph3);
        $primaryTrait = $sortedTraits[0] ?? null; // Mendapatkan Tipe (D, I, S, C)
        $secondaryTrait = $sortedTraits[1] ?? null;
        $reportData = $profileDescriptions[$primaryTrait] ?? [];

        $reportDataFull = [
            'primaryType' => $reportData['primaryType'] ?? null,
            'summary' => $reportData['summary'] ?? null,
            'strengths' => $reportData['strengths'] ?? [],
            'weaknesses' => $reportData['weaknesses'] ?? [],
            'workCharacteristics' => $reportData['workCharacteristics'] ?? [],
            'recommendations' => $reportData['recommendations'] ?? [],
            'primary_trait' => $primaryTrait,
            'secondary_trait' => $secondaryTrait,
            'secondaryType' => $secondaryTrait ? ($profileDescriptions[$secondaryTrait]['primaryType'] ?? null) : null,
            'all_profiles' => $profileDescriptions,
        ];

        // 9b. Nilai JPM (dinormalisasi 0-100 dari skor Graph 3 MAKSIMAL - KONSISTEN dengan ResultController)
        // Formula: ((maxScore - (-8)) / 16) * 100, di mana 16 = 8 - (-8)
        $maxScore = max($graph3['D'] ?? 0, $graph3['I'] ?? 0, $graph3['S'] ?? 0, $graph3['C'] ?? 0);
        $jpmPercentage = (int) round(((($maxScore ?? 0) - (-8)) / 16) * 100);
        $jpmPercentage = max(0, min(100, $jpmPercentage));

        // 10. SIMPAN KE DATABASE — gunakan transaction; jika gagal, kembalikan error ke client
        try {
            $discResult = DB::transaction(function () use ($rawMost, $rawLeast, $graph3_Raw, $graph1, $graph2, $graph3, $primaryTrait, $reportData, $reportDataFull, $answers, $jpmPercentage, $idempotencyKey) {
                $discResult = DiscResult::create([
                    'user_id' => Auth::id(),
                    'raw_scores_most' => $rawMost,
                    'raw_scores_least' => $rawLeast,
                    'raw_scores_change' => $graph3_Raw,
                    'graph_scores_most' => $graph1,
                    'graph_scores_least' => $graph2,
                    'graph_scores_change' => $graph3,
                    'idempotency_key' => $idempotencyKey,
                    'primary_type' => $primaryTrait,
                    'personality_profile' => $primaryTrait . ' - ' . ($reportData['primaryType'] ?? ''),
                    'summary' => $reportData['summary'] ?? null,
                    'report_data' => $reportDataFull,
                    'total_questions' => count($answers),
                    'completion_percentage' => $jpmPercentage,
                    'jpm' => $jpmPercentage,
                    'test_date' => now(),
                ]);

                $answerRows = [];
                foreach ($answers as $qNum => $choices) {
                    $mostChoice = $choices['M'];
                    $leastChoice = $choices['L'];
                    $mostScore = $scoringKey[$mostChoice]['M'] ?? null;
                    $leastScore = $scoringKey[$leastChoice]['L'] ?? null;

                    $answerRows[] = [
                        'user_id' => Auth::id(),
                        'disc_result_id' => $discResult->id,
                        'question_number' => (int) $qNum,
                        'most_choice' => $mostChoice,
                        'least_choice' => $leastChoice,
                        'most_score' => $mostScore,
                        'least_score' => $leastScore,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                if (!empty($answerRows)) {
                    DB::table('disc_answers')->insert($answerRows);
                }

                return $discResult;
            });
        } catch (\Exception $e) {
            Log::error('Error saving DISC result: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan hasil ke database',
                'error' => $e->getMessage(),
            ], 500);
        }

        // 11. RETURN RESPONSE JSON (sertakan saved_result untuk keperluan sinkronisasi frontend)
        return response()->json([
            'status' => 'success',
            'message' => 'Skor DISC berhasil dihitung dengan konversi grafik dan profil',
            'data' => [
                'raw_scores' => [
                    'Most' => $rawMost,
                    'Least' => $rawLeast,
                    'Change' => $graph3_Raw
                ],
                'graph_scores' => [
                    'Graph_1' => $graph1,
                    'Graph_2' => $graph2,
                    'Graph_3' => $graph3
                ],
                'report' => $reportDataFull,
                'all_profiles' => $profileDescriptions,
                'sorted_traits' => $sortedTraits,
                'jpm' => [
                    'percentage' => $jpmPercentage,
                    'graph3_score' => $maxScore,
                    'primary_trait' => $primaryTrait,
                    'secondary_trait' => $secondaryTrait,
                ]
            ],
            'saved_result' => isset($discResult) ? $discResult->toArray() : null,
            'processing_info' => [
                'total_questions' => count($answers),
                'formula' => 'Change = Raw Most - Raw Least',
                'conversion_applied' => true
            ]
        ], 200);
    }
}
