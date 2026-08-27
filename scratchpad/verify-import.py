"""Post-import verification: what changed, what survived, what the site now says."""
import json, re
old = {r['id']: r for r in json.load(open('scratchpad/museum-data.json.bak-preimport', encoding='utf-8'))}
new = {r['id']: r for r in json.load(open('data/museum-data.json', encoding='utf-8'))}
rew = json.load(open('scratchpad/rewrites.json', encoding='utf-8'))
norm = lambda s: re.sub(r'\s+', ' ', (s or '')).strip()

print('records: %d -> %d' % (len(old), len(new)))
assert set(old) == set(new), 'id set changed!'

print('\n-- structure preserved (import must not touch these) --')
for f in ['pages', 'transcription', 'namedIndividuals']:
    lost = [i for i in new if json.dumps(old[i].get(f), sort_keys=True, ensure_ascii=False)
                            != json.dumps(new[i].get(f), sort_keys=True, ensure_ascii=False)]
    print('  %-16s %d changed %s' % (f, len(lost), lost[:6]))

print('\n-- the 356 labels --')
bad = [i for i, t in rew.items() if norm(new[i].get('description')) != norm(t)]
print('  %d/%d now in the JSON%s' % (len(rew) - len(bad), len(rew), '' if not bad else '  MISSING ' + str(bad)))
w = lambda d, f: sum(len((r.get(f) or '').split()) for r in d.values())
print('  description corpus: %d -> %d words' % (w(old, 'description'), w(new, 'description')))

print('\n-- descriptions changed outside the 356 (the user\'s own edits landing) --')
u = [i for i in new if norm(old[i].get('description')) != norm(new[i].get('description')) and i not in rew]
print('  %d records: %s%s' % (len(u), ', '.join(sorted(u)[:12]), ' …' if len(u) > 12 else ''))

print('\n-- notes that had to survive --')
for i in ['goetzmann0494', 'goetzmann0595', 'goetzmann0345', 'goetzmann0295', 'goetzmann0631', 'goetzmann0933']:
    print('  %s  %s' % (i, norm(new[i].get('notes'))[:104]))

print('\n-- issueYear --')
for i in ['goetzmann0640', 'goetzmann0641', 'goetzmann0638', 'goetzmann0646', 'goetzmann0631', 'goetzmann0343']:
    print('  %s  %s -> %s' % (i, (old[i].get('issueYear') or [''])[0], (new[i].get('issueYear') or [''])[0]))

print('\n-- identifiers --')
oi = sum(1 for r in old.values() if r.get('identifiers'))
ni = sum(1 for r in new.values() if r.get('identifiers'))
diff = [i for i in new if (old[i].get('identifiers') or []) != (new[i].get('identifiers') or [])]
print('  %d -> %d records carry identifiers; %d changed %s' % (oi, ni, len(diff), diff[:8]))

print('\n-- location repair (the phantom facets) --')
loc = [i for i in new if (old[i].get('location') or []) != (new[i].get('location') or [])]
print('  %d records re-derived: %s' % (len(loc), ', '.join(sorted(loc))))
for i in sorted(loc)[:14]:
    print('    %s  %s -> %s' % (i, old[i].get('location'), new[i].get('location')))

print('\n-- about.html stats, recomputed --')
fi = json.load(open('data/filter-index.json', encoding='utf-8'))
countries = set()
for r in new.values():
    countries |= set(r.get('subjectCountry') or []) | set(r.get('issuingCountry') or [])
print('  records %d | countries %d | languages %d | currencies %d'
      % (len(new), len(countries), len(fi.get('language', {})), len(fi.get('currency', {}))))
yrs = sorted(int(y) for r in new.values() for y in (r.get('issueYear') or []) if str(y).isdigit())
print('  earliest %s | latest %s' % (yrs[0], yrs[-1]))
print('  facets in index: %s' % ', '.join(fi))
if 'Slovakia' in (fi.get('location') or {}):
    print('  ⚠️ Slovakia still present: %s' % fi['location']['Slovakia'])
else:
    print('  Slovakia facet: gone')
