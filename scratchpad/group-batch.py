"""Work out which of the new rows are leaves of one document.

Signal: consecutive ids sharing an identical Document Title. goetzmann1100 and 1101 do
exactly that, and the images confirm it — recto, then the verso carrying eleven annual
interest endorsements. Report only; writes a plan for review.
"""
import json, re
from collections import Counter

rows = json.load(open('scratchpad/toadd-rows.json', encoding='utf-8'))
hdr = json.load(open('scratchpad/toadd-header.json', encoding='utf-8'))
idx = {h: i for i, h in enumerate(hdr) if h}
src = json.load(open('scratchpad/new-batch-paths.json', encoding='utf-8'))
tiled = {'goetzmann' + n for n in src}

get = lambda rid, k: (rows[rid][idx[k]] if k in idx and idx[k] < len(rows[rid]) else None)
norm = lambda s: re.sub(r'\s+', ' ', (s or '')).strip()

ids = sorted(r for r in rows if r in tiled)          # 1170 has a row but no image
groups, cur = [], [ids[0]]
for prev, this in zip(ids, ids[1:]):
    same_title = norm(get(prev, 'Document Title')) == norm(get(this, 'Document Title'))
    consecutive = int(this[-4:]) == int(prev[-4:]) + 1
    if same_title and consecutive:
        cur.append(this)
    else:
        groups.append(cur); cur = [this]
groups.append(cur)

multi = [g for g in groups if len(g) > 1]
print('%d images -> %d documents (%d single, %d multi-leaf)'
      % (len(ids), len(groups), len(groups) - len(multi), len(multi)))
print('\nmulti-leaf groups:')
for g in multi:
    print('   %s .. %s  (%d leaves)  %s'
          % (g[0], g[-1], len(g), norm(get(g[0], 'Document Title'))[:66]))
print('\nleaf-count distribution: %s'
      % dict(Counter(len(g) for g in groups)))

# titles that repeat but are NOT consecutive — worth an eye, could be true multiples
by_title = {}
for i in ids:
    by_title.setdefault(norm(get(i, 'Document Title')), []).append(i)
scattered = {t: v for t, v in by_title.items()
             if len(v) > 1 and not any(v == g for g in groups)}
print('\nrepeated titles that did NOT group consecutively: %d' % len(scattered))
for t, v in list(scattered.items())[:6]:
    print('   %s  %s' % (' '.join(v), t[:60]))

json.dump([g for g in groups], open('scratchpad/batch-groups.json', 'w'), indent=1)
print('\n-> scratchpad/batch-groups.json')
