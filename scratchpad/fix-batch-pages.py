"""
fix-batch-pages.py — stop the new multi-page records repeating one paragraph on every leaf.

The source gives each leaf the SAME description, differing only in the "Page N" marker
that was stripped on import. So every leaf of an 18-leaf document rendered identical
text. 18 of the 21 multi-leaf documents are like this.

Under the current viewer rule, page 1 shows `record.description` and later leaves show
their own, falling back to the record's when empty. So the honest model is:

  leaf with a real qualifier   ->  that qualifier as its caption. Only 6 leaves have
                                   one, the tontine inserts: "Insert 1 front side" etc.
  every other leaf             ->  EMPTY, so it falls back to the record description

Same thing on screen either way, but the data no longer asserts twelve copies of one
paragraph, and a future per-leaf description has an empty field to go into rather than
duplicated text to notice and clear.

The workbook's leaf rows keep their text: they are per-image reference for the user and
excel_to_json.py does not read them (pages[] is preserved from the JSON, never the sheet).

  py scratchpad/fix-batch-pages.py                 # dry run
  py scratchpad/fix-batch-pages.py --write
"""
import io, json, re, sys

WRITE = '--write' in sys.argv
rows = json.load(open('scratchpad/toadd-rows.json', encoding='utf-8'))
hdr = json.load(open('scratchpad/toadd-header.json', encoding='utf-8'))
idx = {h: i for i, h in enumerate(hdr) if h}
HEAD = re.compile(r'^\s*Page\s*(\d+)\s*(?:of\s*(\d+))?\s*(\([^)]*\))?\s*[-–:]?\s*', re.I)
norm = lambda s: re.sub(r'\s+', ' ', (s or '')).strip()

def qualifier(rid):
    if rid not in rows:
        return ''
    raw = rows[rid][idx['Description']] if 'Description' in idx else ''
    m = HEAD.match(norm('' if raw in (None, 'None') else str(raw)))
    q = m.group(3) if m else None
    return q.strip('()').strip() if q else ''

recs = json.load(open('data/museum-data.json', encoding='utf-8'))
changed, kept = 0, []
for r in recs:
    if r['id'] < 'goetzmann1100' or not r.get('pages'):
        continue
    for p in r['pages']:
        q = qualifier(p['id'])
        want = q[0].upper() + q[1:] if q else ''
        if norm(p.get('description')) != want:
            p['description'] = want
            changed += 1
        if want:
            kept.append((p['id'], want))

print('%d leaf description(s) rewritten' % changed)
print('%d leaves keep a caption:' % len(kept))
for i, w in kept:
    print('   %s  %s' % (i, w))
print('all other leaves now fall back to their record description')
if not WRITE:
    print('\ndry run -- pass --write to apply')
    sys.exit(0)
io.open('data/museum-data.json', 'w', encoding='utf-8', newline='\n').write(
    json.dumps(recs, ensure_ascii=False, indent=2) + '\n')
print('\nwritten to data/museum-data.json')
