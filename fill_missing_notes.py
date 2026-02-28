"""
Generate notes from existing metadata for the 164 rows that have no notes.
Strategy:
  - Flag SPECIMEN if found in title/keywords
  - For multi-page docs: build companion-page cross-references
  - Extract serial No. from title
  - Flag notable keywords (consecutive pair, talon, etc.)
  - Fall back to condensed title if nothing else applies
"""
import zipfile, re, shutil, os, pandas as pd

src = r'C:\Users\ks2479\Documents\GitHub\oov-virtual-museum02\oov_data_new.xlsx'
repair_copy = src + '.bak'
fixed = src + '.fixed.xlsx'

shutil.copy(src, repair_copy)
with zipfile.ZipFile(repair_copy, 'r') as zin:
    with zipfile.ZipFile(fixed, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename.startswith('xl/worksheets/sheet'):
                text = data.decode('utf-8')
                data = re.sub(r'<v>NaN</v>', '', text).encode('utf-8')
            zout.writestr(item, data)

df = pd.read_excel(fixed, dtype=str)


def generate_note(row, df):
    title       = str(row.get('title',       '') or '').strip()
    keywords_s  = str(row.get('keywords',    '') or '').strip()
    num_pages_s = str(row.get('numberPages', '') or '1').strip()
    filename    = str(row.get('filename',    '') or '').strip()

    try:
        num_pages = int(float(num_pages_s))
    except Exception:
        num_pages = 1

    parts = []

    # 1. SPECIMEN flag
    if 'specimen' in title.lower() or 'specimen' in keywords_s.lower():
        parts.append('SPECIMEN')

    # 2. Multi-page cross-reference
    if num_pages > 1:
        fm = re.search(r'goetzmann(\d+)', filename)
        pm = re.search(r'[Pp]\.?\s*(\d+)\s*of\s*(\d+)', title)
        if fm and pm:
            # Title has explicit "(p.X of Y)" — compute exact companion filenames
            file_num     = int(fm.group(1))
            current_page = int(pm.group(1))
            total_pages  = int(pm.group(2))
            companions = []
            for p in range(1, total_pages + 1):
                if p != current_page:
                    other = file_num - current_page + p
                    companions.append(f'goetzmann{other:04d}.jpg (p.{p}/{total_pages})')
            parts.append(f'{total_pages}-page document; see {", ".join(companions)}')
        else:
            # No explicit page marker — just note the page count without guessing companions
            # (avoids mis-attributing records from adjacent document groups)
            parts.append(f'{num_pages}-page document')

    # 3. Notable keyword flags
    kw_lower = keywords_s.lower()
    if 'consecutive pair' in kw_lower:
        parts.append('consecutive serial numbers')
    if 'talon' in kw_lower and 'talon' not in title.lower():
        parts.append('talon (coupon renewal receipt)')
    if 'watermark' in kw_lower:
        parts.append('watermark present')
    if 'overprint' in kw_lower:
        parts.append('overprint')

    # 4. Serial number(s) from title — only capture the numeric/alphanumeric id, not following text
    no_match = re.search(
        r'Nos?\.\s*[A-Za-z]{0,2}\d[\d,]*(?:\s*[-–]\s*[A-Za-z]{0,2}\d[\d,]*)?',
        title
    )
    if no_match:
        parts.append(no_match.group(0).strip().rstrip(','))

    # 5. Fallback: condensed title
    if not parts:
        parts.append(title[:120] if len(title) > 120 else title)

    return '; '.join(dict.fromkeys(parts))   # deduplicate while preserving order


# Originally-empty filenames (captured from initial audit)
ORIGINALLY_EMPTY = {
    'goetzmann0001.jpg',
    *[f'goetzmann0{n:03d}.jpg' for n in range(655, 733)],
    'goetzmann0734.jpg','goetzmann0736.jpg','goetzmann0737.jpg',
    'goetzmann0900.jpg','goetzmann0902.jpg',
    'goetzmann0908.jpg','goetzmann0909.jpg','goetzmann0914.jpg',
    # uppercase-G variants as stored in the spreadsheet
    'Goetzmann0900.jpg','Goetzmann0902.jpg',
    'Goetzmann0908.jpg','Goetzmann0909.jpg',
    *[f'goetzmann0{n:03d}.jpg' for n in range(936, 956)],
    *[f'goetzmann0{n:03d}.jpg' for n in range(956, 972)],
    'goetzmann0974.jpg','goetzmann0975.jpg',
    'goetzmann0982.jpg','goetzmann0983.jpg',
    *[f'goetzmann0{n:03d}.jpg' for n in range(984, 994)],
    'goetzmann0996.jpg','goetzmann0997.jpg','goetzmann0998.jpg','goetzmann0999.jpg',
    *[f'goetzmann1{n:03d}.jpg' for n in range(0, 23)],
}

# Re-generate for all originally-empty rows (overwrite even if already set)
needs_note = df['filename'].isin(ORIGINALLY_EMPTY)
targets = df[needs_note].copy()
print(f'Generating notes for {len(targets)} rows...')

count = 0
for idx, row in targets.iterrows():
    note = generate_note(row.to_dict(), df)
    df.at[idx, 'notes'] = note
    count += 1

print(f'Generated {count} notes.')

df.to_excel(fixed, index=False)
shutil.copy(fixed, src)
os.remove(fixed)
print(f'Saved -> {src}')

# Spot-check a few
sample_indices = list(targets.index[:5]) + list(targets.index[40:45]) + list(targets.index[-5:])
print('\n=== Spot check ===')
for i in sample_indices:
    print(f'  [{df.at[i, "filename"]}] {df.at[i, "notes"][:120]}')
