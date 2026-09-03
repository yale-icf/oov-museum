"""
Group the new batch into documents using the "Page N" marker the descriptions carry.

⚠️ Shared Document Title is NOT a safe signal here: the four EVA Airways rows share
titles in pairs but are four separate specimen certificates, each with its own ID
number and denomination (85-NF 100,000 shares, 86-ND 1,000, 86-NX variable, 85-NX
variable). Grouping on title merged two of them wrongly.

The descriptions of genuine leaves open with "Page 1 -", "Page 2-" and so on. A row
with no such marker is a single-page document.

Validates that every group is consecutive and its page numbers run 1..N in order.
"""
import json, re

rows = json.load(open('scratchpad/toadd-rows.json', encoding='utf-8'))
hdr = json.load(open('scratchpad/toadd-header.json', encoding='utf-8'))
idx = {h: i for i, h in enumerate(hdr) if h}
src = json.load(open('scratchpad/new-batch-paths.json', encoding='utf-8'))
tiled = {'goetzmann' + n for n in src}

get = lambda rid, k: (rows[rid][idx[k]] if k in idx and idx[k] < len(rows[rid]) else None)
norm = lambda s: re.sub(r'\s+', ' ', (s or '')).strip()
# ⚠️ allow a parenthetical between the number and the dash — the tontine inserts read
# "Page 5 (Insert 1 front side) -", and a stricter pattern split that document in two
# ⚠️ and the separator itself is optional: goetzmann1121 reads "Page 10 (Insert 3 back
# side) 1761 PARIS" with no dash at all. Safe to relax, because these descriptions begin
# with "Page N" or they are not leaves — the match is anchored to the start of the string.
PAGE = re.compile(r'^\s*Page\s*(\d+)\s*(?:of\s*(\d+))?\s*(?:\([^)]*\))?\s*[-–:]?\s', re.I)

ids = sorted(r for r in rows if r in tiled)
page = {}
for rid in ids:
    m = PAGE.match(norm(get(rid, 'Description')) or '')
    if m:
        page[rid] = int(m.group(1))

groups, cur = [], []
for rid in ids:
    p = page.get(rid)
    if p == 1 or p is None:
        if cur:
            groups.append(cur)
        cur = [rid]
    else:
        cur.append(rid)
if cur:
    groups.append(cur)

problems = []
for g in groups:
    nums = [int(x[-4:]) for x in g]
    if nums != list(range(nums[0], nums[0] + len(nums))):
        problems.append('non-consecutive: ' + ' '.join(g))
    if len(g) > 1:
        seq = [page.get(x) for x in g]
        if seq != list(range(1, len(g) + 1)):
            problems.append('page sequence %s for %s' % (seq, ' '.join(g)))
        # every leaf of a group should share the group's title
        titles = {norm(get(x, 'Document Title')) for x in g}
        if len(titles) > 1:
            problems.append('mixed titles in ' + ' '.join(g))

multi = [g for g in groups if len(g) > 1]
print('%d images -> %d documents (%d single, %d multi-leaf)'
      % (len(ids), len(groups), len(groups) - len(multi), len(multi)))
print('validation problems: %d' % len(problems))
for p in problems[:10]:
    print('   ' + p)
print('\nmulti-leaf documents:')
for g in multi:
    print('   %s..%s  %2d leaves  %s' % (g[0][-4:], g[-1][-4:], len(g),
                                         norm(get(g[0], 'Document Title'))[:60]))
json.dump(groups, open('scratchpad/batch-groups.json', 'w'), indent=1)
print('\n-> scratchpad/batch-groups.json  (%d documents)' % len(groups))
