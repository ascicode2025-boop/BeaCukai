<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;

class ImportDiscMapping extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'disc:import-mapping {file : Path to XLSX/CSV file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import DISC conversion mapping (Most/Least/Change) from XLSX or CSV into storage/app/disc_conversion.json';

    public function handle()
    {
        $path = $this->argument('file');
        $fs = new Filesystem();

        if (!$fs->exists($path)) {
            $this->error("File not found: {$path}");
            return 1;
        }

        // Try to use PhpSpreadsheet if available
        if (!class_exists('\PhpOffice\PhpSpreadsheet\IOFactory')) {
            $this->error("PhpSpreadsheet not installed. Run: composer require phpoffice/phpspreadsheet");
            return 1;
        }

        try {
            // Increase memory limit for large spreadsheets (best-effort)
            @ini_set('memory_limit', '512M');

            $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReaderForFile($path);
            // Read data only (skip images/drawings) to reduce memory usage
            if (method_exists($reader, 'setReadDataOnly')) {
                $reader->setReadDataOnly(true);
            }

            $spreadsheet = $reader->load($path);
        } catch (\Exception $e) {
            $this->error('Failed to read spreadsheet: ' . $e->getMessage());
            $this->error('Tip: try running with higher memory: php -d memory_limit=1G artisan disc:import-mapping "path/to/file.xlsx"');
            return 1;
        }

        // Helper to find sheet by name or index
        $getSheet = function($nameOrIndex) use ($spreadsheet) {
            if (is_int($nameOrIndex)) {
                return $spreadsheet->getSheet($nameOrIndex);
            }
            foreach ($spreadsheet->getAllSheets() as $sheet) {
                if (Str::lower(trim($sheet->getTitle())) === Str::lower(trim($nameOrIndex))) return $sheet;
            }
            return null;
        };

        $mostSheet = $getSheet('Most') ?? $getSheet(0);
        $leastSheet = $getSheet('Least') ?? $getSheet(1) ?? $mostSheet;
        $changeSheet = $getSheet('Change') ?? $getSheet(2) ?? $mostSheet;

        $parseTraitMatrix = function($sheet) {
            // Do NOT calculate formulas to avoid Formula evaluation errors
            $rows = $sheet->toArray(null, false, true, true);
            $traits = ['D','I','S','C'];
            $result = [];

            // Try find rows where first column equals trait letter
            foreach ($traits as $trait) {
                $found = false;
                foreach ($rows as $r) {
                    $first = trim((string) ($r['A'] ?? ''));
                    if (strtoupper($first) === $trait) {
                        // read subsequent 21 cells from B..V
                        $vals = [];
                        $col = 'B';
                        for ($i=0;$i<21;$i++) {
                            $vals[] = is_numeric($r[$col]) ? (float) $r[$col] : floatval(str_replace(',', '.', ($r[$col] ?? 0)));
                            $col++;
                        }
                        $result[$trait] = $vals;
                        $found = true;
                        break;
                    }
                }
                if (!$found) break;
            }

            // If not found by rows, try header row with D,I,S,C as headers and values down columns
            if (count($result) !== 4) {
                // find header row
                $headerRowIndex = null;
                foreach ($rows as $ri => $r) {
                    $cells = array_map(fn($c)=>strtoupper(trim((string)$c)), array_values($r));
                    if (in_array('D',$cells) && in_array('I',$cells) && in_array('S',$cells) && in_array('C',$cells)) { $headerRowIndex = $ri; break; }
                }
                if ($headerRowIndex) {
                    $header = $rows[$headerRowIndex];
                    // find columns for D I S C
                    $colMap = [];
                    foreach ($header as $col => $val) {
                        $label = strtoupper(trim((string)$val));
                        if (in_array($label, ['D','I','S','C'])) $colMap[$label] = $col;
                    }
                    // read 21 values downwards from next rows
                    foreach (['D','I','S','C'] as $trait) {
                        $col = $colMap[$trait] ?? null;
                        if (!$col) continue;
                        $vals = [];
                        foreach ($rows as $ri => $r) {
                            if ($ri <= $headerRowIndex) continue;
                            if (count($vals) >= 21) break;
                            $cell = $r[$col] ?? null;
                            if ($cell === null || $cell === '') break;
                            $vals[] = is_numeric($cell) ? (float)$cell : floatval(str_replace(',', '.', $cell));
                        }
                        if (count($vals) > 0) $result[$trait] = $vals;
                    }
                }
            }

            return $result;
        };

        $most = $parseTraitMatrix($mostSheet);
        $least = $parseTraitMatrix($leastSheet);

        // parse change sheet (expect rows like: key | D | I | S | C)
        $parseChange = function($sheet) {
            // Do NOT calculate formulas to avoid Formula evaluation errors
            $rows = $sheet->toArray(null, false, true, true);
            $map = ['D'=>[], 'I'=>[], 'S'=>[], 'C'=>[]];
            foreach ($rows as $r) {
                $first = trim((string)($r['A'] ?? ''));
                if ($first === '' ) continue;
                // if first cell is numeric key
                if (is_numeric($first) || preg_match('/^-?\d+$/', $first)) {
                    $key = (int)$first;
                    $map['D'][$key] = isset($r['B']) ? floatval(str_replace(',', '.', $r['B'])) : 0;
                    $map['I'][$key] = isset($r['C']) ? floatval(str_replace(',', '.', $r['C'])) : 0;
                    $map['S'][$key] = isset($r['D']) ? floatval(str_replace(',', '.', $r['D'])) : 0;
                    $map['C'][$key] = isset($r['E']) ? floatval(str_replace(',', '.', $r['E'])) : 0;
                }
            }
            // if map is sparse, try alternative: first row header D I S C
            if (count($map['D']) < 10) {
                // try find header row index
                foreach ($rows as $ri => $r) {
                    $cells = array_map(fn($c)=>strtoupper(trim((string)$c)), array_values($r));
                    if (in_array('D',$cells) && in_array('I',$cells) && in_array('S',$cells) && in_array('C',$cells)) {
                        // header found
                        $header = $rows[$ri];
                        $colIdx = [];
                        foreach ($header as $col => $val) {
                            $label = strtoupper(trim((string)$val));
                            if (in_array($label,['D','I','S','C'])) $colIdx[$label]=$col;
                        }
                        // read subsequent rows until keys exhausted
                        foreach ($rows as $rj => $r2) {
                            if ($rj <= $ri) continue;
                            $key = $r2['A'] ?? null;
                            if (!is_numeric($key) && !preg_match('/^-?\d+$/', (string)$key)) continue;
                            $key = (int)$key;
                            foreach (['D','I','S','C'] as $t) {
                                $col = $colIdx[$t] ?? null;
                                $map[$t][$key] = $col ? floatval(str_replace(',', '.', ($r2[$col] ?? 0))) : ($r2[$t] ?? 0);
                            }
                        }
                        break;
                    }
                }
            }
            return $map;
        };

        $change = $parseChange($changeSheet);

        $out = [
            'Most' => $most,
            'Least' => $least,
            'Change' => $change,
        ];

        $outPath = storage_path('app/disc_conversion.json');
        file_put_contents($outPath, json_encode($out, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));

        $this->info("Imported mapping written to: {$outPath}");
        return 0;
    }
}
