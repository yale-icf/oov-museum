"""Full export of the curated JSON into oov_data_master.xlsx (page-level, 868 rows).

Builds fresh from pristine oov_data_new.xlsx, then overlays the live JSON:
  - standalone & multi-page PRIMARY rows: title, description, type, currency,
    language, issuingCountry, subjectCountry, creator from JSON; issueDate year
    corrected only where it differs (month/day precision preserved otherwise).
  - non-primary PAGE rows: per-page description from the parent's pages[]; title
    cleaned from the original (JSON carries no per-page title/metadata).
Run with --write to save. Reuses clean_title() from the original rebuild.
"""
import json, re, sys, openpyxl
sys.stdout.reconfigure(errors='replace')

MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December'
Y = r'(?:1[5-9]\d{2}|20\d{2})'
SOH, STX = chr(1), chr(2)

def clean_title(orig):
    s = orig or ''
    masks = []
    def mask(m):
        masks.append(m.group(0)); return SOH + str(len(masks)-1) + STX
    s = re.sub(r'No\.\s*(?:[A-Za-z]{1,3}\s*)?[\dA-Za-z][\d,./]*', mask, s)
    s = re.sub(r',?\s*Act of\s+(?:'+MONTHS+r')\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s*'+Y+r')?', '', s)
    s = re.sub(r'\b(?:'+MONTHS+r')\s+\d{1,2}(?:st|nd|rd|th)?,?\s*'+Y, '', s)
    s = re.sub(r'\b(?:'+MONTHS+r')\s+'+Y, '', s)
    s = re.sub(r'\b(?:'+MONTHS+r')\s+\d{1,2}(?:st|nd|rd|th)?\b', '', s)
    s = re.sub(r'\bof\s+'+Y+r'\b', '', s)
    s = re.sub(r'\b'+Y+r'\b', '', s)
    s = re.sub(SOH+r'(\d+)'+STX, lambda m: masks[int(m.group(1))], s)
    s = re.sub(r'\(\s*[–—-]\s*\)', '', s)
    s = re.sub(r'\(\s*[–—-]\s*', '(', s)
    s = re.sub(r'\s*[–—-]\s*\)', ')', s)
    s = re.sub(r'\(\s*[,;]\s*', '(', s)
    s = re.sub(r'\s*[,;]\s*\)', ')', s)
    s = re.sub(r',\s*\(', ' (', s)
    s = re.sub(r'\(\s*\)', '', s)
    s = re.sub(r',\s*,', ',', s)
    s = re.sub(r'\s{2,}', ' ', s)
    s = re.sub(r'\s+([),])', r'\1', s)
    s = re.sub(r'\(\s+', '(', s)
    s = re.sub(r'[\s,:;]+$', '', s).strip()
    s = re.sub(r'\(\s*$', '', s).strip()
    s = re.sub(r'\s+of$', '', s, flags=re.I).strip()
    s = re.sub(r'\s*:\s*', ' ', s)
    instr = r'(?:Shares?|Certificate|Stock|Debenture|Obligation|Receipt|Bond|Bearer|Common|Preferred|Capital|Ordinary|Registered|Cumulative|Coupon|Subscription|Promissory|Treasury|Bill|Warrant|Note|Annuity|Annuities|Policy|Mortgage|Loan|Action|Prospectus|Scheme)'
    s = re.sub(r',\s*(?='+instr+r'\b)', ' ', s)
    s = re.sub(r'\(Verso\)', '(Reverse)', s)
    s = re.sub(r'\s{2,}', ' ', s).strip()
    return s

def sv(v):
    if v is None or isinstance(v, float): return ''
    s = str(v).strip(); return '' if s.lower() == 'nan' else s

def joinlist(v):
    if v is None: return None
    if isinstance(v, list): return ', '.join(str(x) for x in v if x not in (None, ''))
    return str(v)

def year_of(s):
    m = re.search(r'(1[5-9]\d{2}|20\d{2})', s or '')
    return m.group(1) if m else ''

items = json.load(open('data/museum-data.json', encoding='utf-8'))
prim = {it['id'].lower(): it for it in items}
page_desc = {}   # non-primary page id -> per-page description
for it in items:
    pid0 = it['id'].lower()
    for p in (it.get('pages') or []):
        pid = (p.get('id') or '').lower()
        if pid and pid != pid0:
            page_desc[pid] = p.get('description', '')

INP = next((a[5:] for a in sys.argv if a.startswith('--in=')), 'oov_data_new.xlsx')
OUT = next((a[6:] for a in sys.argv if a.startswith('--out=')), 'oov_data_master.xlsx')
wb = openpyxl.load_workbook(INP)
ws = wb.active
hdr = [c.value for c in ws[1]]
C = {n: i+1 for i, n in enumerate(hdr)}

def setc(r, col, val):
    if val is None: return 0
    cell = ws.cell(row=r, column=C[col])
    if sv(cell.value) != sv(val):
        cell.value = val; return 1
    return 0

stat = {k: 0 for k in ['fn_low','title','desc','type','currency','language','issuingCountry','subjectCountry','creator','issueDate','page_desc']}
orphans = []
META = ['type','currency','language','issuingCountry','subjectCountry']
for r in range(2, ws.max_row+1):
    fn = sv(ws.cell(row=r, column=C['filename']).value)
    if not fn.endswith('.jpg'):
        continue
    low = fn.lower()
    if low != fn:
        ws.cell(row=r, column=C['filename']).value = low; stat['fn_low'] += 1
    iid = low[:-4]
    if iid in prim:
        it = prim[iid]
        stat['title'] += setc(r, 'title', it.get('title'))
        stat['desc'] += setc(r, 'description', sv(it.get('description','')) or None)
        for f in META:
            stat[f] += setc(r, f, joinlist(it.get(f)))
        stat['creator'] += setc(r, 'creator', it.get('creator'))
        jy = (it.get('issueYear') or [''])
        jy = jy[0] if isinstance(jy, list) else jy
        if jy:
            cur = sv(ws.cell(row=r, column=C['issueDate']).value)
            if year_of(cur) != str(jy):
                stat['issueDate'] += setc(r, 'issueDate', str(jy))
    elif iid in page_desc:
        stat['page_desc'] += setc(r, 'description', sv(page_desc[iid]) or None)
        cur_t = sv(ws.cell(row=r, column=C['title']).value)
        nt = clean_title(cur_t)
        if nt != cur_t:
            ws.cell(row=r, column=C['title']).value = nt; stat['title'] += 1
    else:
        cur_t = sv(ws.cell(row=r, column=C['title']).value)
        nt = clean_title(cur_t)
        orphans.append((iid, cur_t, nt))
        if nt != cur_t:
            ws.cell(row=r, column=C['title']).value = nt; stat['title'] += 1

print('rows=%d' % (ws.max_row-1))
for k in ['fn_low','title','desc','page_desc','type','currency','language','issuingCountry','subjectCountry','creator','issueDate']:
    print('  %-15s %d' % (k, stat[k]))
print('orphans (no JSON record / not a known page):', len(orphans))
for iid, a, b in orphans[:40]:
    print('   %s: %r -> %r' % (iid, a[:50], b[:50]))

if '--write' in sys.argv:
    wb.save(OUT)
    print('\nWROTE ' + OUT)
