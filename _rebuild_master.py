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

items = json.load(open('data/museum-data.json', encoding='utf-8'))
prim = {it['id'].lower(): it for it in items}
pageparent = {}
for it in items:
    for p in (it.get('pages') or []):
        pid = p.get('id')
        if pid: pageparent[pid.lower()] = it['id'].lower()

wb = openpyxl.load_workbook('oov_data_new.xlsx')
ws = wb.active
hdr = [c.value for c in ws[1]]
C = {n: i+1 for i, n in enumerate(hdr)}

fn_low = tchg = dchg = 0
orphans = []
for r in range(2, ws.max_row+1):
    fn = sv(ws.cell(row=r, column=C['filename']).value)
    if not fn.endswith('.jpg'):
        continue
    low = fn.lower()
    if low != fn:
        ws.cell(row=r, column=C['filename']).value = low; fn_low += 1
    iid = low[:-4]
    cur_t = sv(ws.cell(row=r, column=C['title']).value)
    if iid in prim:
        nt = prim[iid]['title']
    else:
        nt = clean_title(cur_t); orphans.append((iid, cur_t, nt))
    if nt != cur_t:
        ws.cell(row=r, column=C['title']).value = nt; tchg += 1
    if iid in prim:
        jd = sv(prim[iid].get('description', ''))
        if jd and jd != sv(ws.cell(row=r, column=C['description']).value):
            ws.cell(row=r, column=C['description']).value = jd; dchg += 1

print(f'rows={ws.max_row-1} filenames_lowercased={fn_low} title_changes={tchg} desc_changes={dchg} orphans={len(orphans)}')
print('\nORPHANS (no JSON record / not a known page -> cleaned from original):')
for iid, a, b in orphans:
    print(f'  {iid}: {a[:60]!r} -> {b[:60]!r}')

if '--write' in sys.argv:
    # oov_data_master.xlsx was removed as redundant; oov_data_new.xlsx is the single workbook.
    wb.save('oov_data_new.xlsx')
    print('\nWROTE oov_data_new.xlsx')
