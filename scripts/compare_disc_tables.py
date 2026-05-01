import re
import csv
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
PHP_FILE = BASE / 'app' / 'Http' / 'Controllers' / 'DiscController.php'
CSV_FILE = BASE / 'exports' / 'disc_penghubung' / '02_TABEL.csv'

def parse_php_change_map(php_text):
    # find the Change array block
    m = re.search(r"'Change'\s*=>\s*\[([\s\S]*?)\]\s*\]", php_text)
    if not m:
        # alternate: find 'Change' => [ ... ], inside conversionTable
        m = re.search(r"'Change'\s*=>\s*\[([\s\S]*?)\],", php_text)
    block = m.group(1) if m else None
    if not block:
        print('Could not find Change block in PHP file')
        return None
    # For each trait, find e.g. 'D' => [ -10 => -15, -9 => -13, ... ],
    traits = {}
    trait_blocks = re.findall(r"'([A-Z])'\s*=>\s*\[([^\]]*)\]", block)
    for trait, tb in trait_blocks:
        # find pairs like -10 => -15
        pairs = re.findall(r"(-?\d+)\s*=>\s*(-?\d+)", tb)
        d = {int(k): int(v) for k,v in pairs}
        traits[trait] = d
    return traits


def parse_csv_change(csv_path):
    # Read CSV and find section starting with a row containing '3.0' then header 'D,I,S,C'
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)
    # Prefer the D,I,S,C header that follows a row containing '3.0'
    start_idx = None
    for i,row in enumerate(rows):
        if any(cell.strip() == '3.0' for cell in row):
            # candidate header is next non-empty row
            for j in range(i+1, min(i+4, len(rows))):
                cells = [c.strip() for c in rows[j] if c is not None]
                if len(cells) >= 4 and cells[-4:] == ['D','I','S','C']:
                    start_idx = j
                    break
            if start_idx is not None:
                break
    # fallback: find any row that contains contiguous D,I,S,C
    if start_idx is None:
        for i,row in enumerate(rows):
            cells = [c.strip() for c in row if c is not None]
            # look for contiguous D,I,S,C in the row
            for j in range(len(cells)-3):
                if cells[j] == 'D' and cells[j+1] == 'I' and cells[j+2] == 'S' and cells[j+3] == 'C':
                    start_idx = i
                    break
            if start_idx is not None:
                break
    if start_idx is None:
        print('Could not locate Change header in CSV')
        return None
    # rows after start_idx contain lines like ,-22.0,-8.0,-8.0,-8.0,-7.5
    mapping = {'D':{}, 'I':{}, 'S':{}, 'C':{}}
    for r in rows[start_idx+1:]:
        if not any(cell.strip() for cell in r):
            break
        # first non-empty numeric cell as index
        # find all numeric tokens
        nums = []
        for cell in r:
            cells = cell.strip()
            if not cells:
                continue
            # try parse float
            try:
                val = float(cells)
                nums.append(val)
            except:
                # maybe contains -6.75 etc with formatting
                cleaned = cells.replace('�','')
                try:
                    val = float(cleaned)
                    nums.append(val)
                except:
                    pass
        if len(nums) >= 5:
            idx = int(round(nums[0]))
            # next four columns are D,I,S,C
            mapping['D'][idx] = int(round(nums[1]))
            mapping['I'][idx] = int(round(nums[2]))
            mapping['S'][idx] = int(round(nums[3]))
            mapping['C'][idx] = int(round(nums[4]))
        else:
            # skip lines that don't have enough numbers
            continue
    return mapping


def main():
    php_text = PHP_FILE.read_text(encoding='utf-8')
    php_change = parse_php_change_map(php_text)
    if php_change is None:
        print('No php change parsed')
        return
    csv_change = parse_csv_change(CSV_FILE)
    if csv_change is None:
        print('No csv change parsed')
        return

    # also load raw CSV rows for Most/Least parsing later
    with open(CSV_FILE, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)

    # debug: print available CSV keys range
    for trait in ['D','I','S','C']:
        keys_csv = sorted(csv_change[trait].keys())
        print(f'CSV {trait} keys: {keys_csv[:5]} ... {keys_csv[-5:]}' if keys_csv else f'CSV {trait} keys: NONE')

    print('Comparing PHP Change map vs CSV Change table for keys -10..3')
    keys = list(range(-10,4))
    diffs = []
    for k in keys:
        for trait in ['D','I','S','C']:
            php_val = php_change.get(trait, {}).get(k)
            csv_val = csv_change.get(trait, {}).get(k)
            if php_val is None:
                diffs.append(f"PHP missing {trait}[{k}]")
            elif csv_val is None:
                diffs.append(f"CSV missing {trait}[{k}]")
            else:
                if php_val != csv_val:
                    diffs.append(f"Mismatch {trait}[{k}]: PHP={php_val} CSV={csv_val}")
    if not diffs:
        print('No differences found for Change keys -10..3 — tables match')
    else:
        print('Found differences:')
        for d in diffs:
            print(' -', d)

    # Also parse Most/Least block (first section)
    # find header row with 'D,I,S,C,D,I,S,C'
    most_least = {'Most':{'D':{},'I':{},'S':{},'C':{}}, 'Least':{'D':{},'I':{},'S':{},'C':{}}}
    # locate start where header contains D,I,S,C,D,I,S,C
    start_ml = None
    for i,row in enumerate(rows):
        joined = ','.join([c.strip() for c in row if c is not None])
        if re.search(r"\bD\b,\s*\bI\b,\s*\bS\b,\s*\bC\b,\s*\bD\b,\s*\bI\b,\s*\bS\b,\s*\bC\b", joined):
            start_ml = i
            break
    if start_ml is not None:
        for r in rows[start_ml+1:]:
            if not any(cell.strip() for cell in r):
                break
            nums = []
            for cell in r:
                c = (cell or '').strip()
                try:
                    nums.append(float(c))
                except:
                    pass
            if len(nums) >= 9:
                # first is maybe empty, second is index
                idx = int(round(nums[0])) if len(nums) >= 9 else None
                # assume layout: index, D,I,S,C, D,I,S,C
                idx = int(round(nums[0]))
                most_least['Most']['D'][idx] = int(round(nums[1]))
                most_least['Most']['I'][idx] = int(round(nums[2]))
                most_least['Most']['S'][idx] = int(round(nums[3]))
                most_least['Most']['C'][idx] = int(round(nums[4]))
                most_least['Least']['D'][idx] = int(round(nums[5]))
                most_least['Least']['I'][idx] = int(round(nums[6]))
                most_least['Least']['S'][idx] = int(round(nums[7]))
                most_least['Least']['C'][idx] = int(round(nums[8]))

    # Print summary and PHP literal for conversionTable
    print('\nSummary: Most/Least parsed index ranges:')
    for trait in ['D','I','S','C']:
        keys_m = sorted(most_least['Most'][trait].keys())
        keys_l = sorted(most_least['Least'][trait].keys())
        print(f'Most {trait}: {keys_m[:3]} ... {keys_m[-3:]}' if keys_m else f'Most {trait}: NONE')
        print(f'Least {trait}: {keys_l[:3]} ... {keys_l[-3:]}' if keys_l else f'Least {trait}: NONE')

    # build PHP array literals using indices 0..18 where available (matching PHP expected length 19)
    def build_php_list(mapping):
        arr = []
        for i in range(0,19):
            v = mapping.get(i)
            if v is None:
                # fallback: try nearest available by clamping
                keys = sorted(mapping.keys())
                if not keys:
                    arr.append(0)
                    continue
                # find nearest
                nearest = min(keys, key=lambda k: abs(k - i))
                v = mapping[nearest]
            arr.append(int(v))
        return arr

    php_table = {'Most':{}, 'Least':{}}
    for trait in ['D','I','S','C']:
        php_table['Most'][trait] = build_php_list(most_least['Most'][trait])
        php_table['Least'][trait] = build_php_list(most_least['Least'][trait])

    # print PHP-ready arrays
    def php_array_literal(lst):
        return '[' + ', '.join(str(x) for x in lst) + ']'

    print('\n--- PHP conversionTable candidate from CSV ---')
    print("'Most' => [")
    for trait in ['D','I','S','C']:
        print(f"    '{trait}' => {php_array_literal(php_table['Most'][trait])},")
    print('],')
    print("'Least' => [")
    for trait in ['D','I','S','C']:
        print(f"    '{trait}' => {php_array_literal(php_table['Least'][trait])},")
    print('],')

    # print Change full mapping from CSV
    print('\n--- PHP Change mapping candidate (from CSV) ---')
    for trait in ['D','I','S','C']:
        items = csv_change[trait]
        keys_sorted = sorted(items.keys())
        print(f"// {trait} keys: {keys_sorted[0]}..{keys_sorted[-1]}")
        print("'{}' => [".format(trait))
        for k in keys_sorted:
            print(f"    {k} => {int(round(items[k]))},")
        print('],')

    # SCORING KEY: parse PHP scoringKey and validate completeness (1A..24D)
    mk = re.search(r"// 2\. SCORING KEY - Mapping jawaban ke skor DISC \(LENGKAP 1 - 24\)\n(.*?)\n\n\s*// 3\. TABEL", php_text, flags=re.S)
    scoring_block = mk.group(1) if mk else None
    scoring = {}
    if scoring_block:
        pairs = re.findall(r"'([0-9]{1,2}[A-D])'\s*=>\s*\[([^\]]*)\]", scoring_block)
        for key, inner in pairs:
            m = re.findall(r"'M'\s*=>\s*'([A-Z\*])'|\'L\'\s*=>\s*'([A-Z\*])'", inner)
            # simpler: find letters after M and L
            mm = re.search(r"'M'\s*=>\s*'([^']+)'", inner)
            ll = re.search(r"'L'\s*=>\s*'([^']+)'", inner)
            scoring[key] = {'M': mm.group(1) if mm else None, 'L': ll.group(1) if ll else None}
    else:
        print('Could not parse scoringKey block from PHP')

    # validate presence of 1A..24D
    missing = []
    unexpected = []
    for i in range(1,25):
        for opt in ['A','B','C','D']:
            k = f"{i}{opt}"
            if k not in scoring:
                missing.append(k)
    print('\nScoringKey check:')
    if missing:
        print(' Missing keys:', missing)
    else:
        print(' All 96 keys present in PHP scoringKey')

    # quick distribution check of mapped letters
    distM = {'D':0,'I':0,'S':0,'C':0,'*':0}
    distL = {'D':0,'I':0,'S':0,'C':0,'*':0}
    for k,v in scoring.items():
        if v['M'] in distM: distM[v['M']] += 1
        else: unexpected.append((k,'M',v['M']))
        if v['L'] in distL: distL[v['L']] += 1
        else: unexpected.append((k,'L',v['L']))
    print(' Distribution M:', distM)
    print(' Distribution L:', distL)
    if unexpected:
        print(' Unexpected mapping values:', unexpected)

if __name__ == '__main__':
    main()
