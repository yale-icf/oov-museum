// Drop one record from museum-data.json and rebuild the filter index.
//   node scratchpad/drop-record.js goetzmann0294 --dry-run   <- report only, writes nothing
//   node scratchpad/drop-record.js goetzmann0294 --write     <- actually drop it
// Refuses if the id is referenced by an exhibit or is an inner page of another record.
// --write is required: this deletes catalogue data, so it should never happen by reflex.
const fs = require('fs');

const JSON_PATH = 'data/museum-data.json';
const FILTER_PATH = 'data/filter-index.json';
const FACETS = ['type', 'location', 'issuingCountry', 'currency', 'language', 'period', 'namedIndividuals'];

const target = process.argv[2];
const write = process.argv.includes('--write');
if (!/^goetzmann\d{4}$/.test(target || '')) throw new Error('usage: drop-record.js goetzmann0294 [--write|--dry-run]');

const recs = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const doomed = recs.find(r => r.id === target);
if (!doomed) throw new Error(target + ' is not a record');

// an id that is someone else's leaf must not be dropped -- that would orphan the parent's page
for (const r of recs) {
  if (r.id === target) continue;
  if ((r.pages || []).some(p => p.id === target)) throw new Error(target + ' is a page of ' + r.id);
}

// exhibits name their objects by id in the page HTML and in js-src/museum-record.js
const refs = [];
for (const f of fs.readdirSync('.').filter(x => /^exhibit-.*\.html$/.test(x)).concat(['js-src/museum-record.js'])) {
  if (fs.readFileSync(f, 'utf8').includes(target)) refs.push(f);
}
if (refs.length) throw new Error(target + ' is referenced by: ' + refs.join(', '));

const out = recs.filter(r => r.id !== target);

if (!write) {
  console.log('DRY RUN -- nothing written. Re-run with --write to drop it.');
  console.log('would drop ' + target + ' (' + doomed.title + ')');
  console.log('records: ' + recs.length + ' -> ' + out.length);
  console.log('checks passed: not an exhibit object, not another record\'s page');
  process.exit(0);
}

fs.writeFileSync(JSON_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');

const index = {};
for (const field of FACETS) {
  const counts = new Map();
  for (const item of out) {
    if (!Array.isArray(item[field])) continue;
    for (const v of item[field]) counts.set(v, (counts.get(v) || 0) + 1);
  }
  index[field] = [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count);
}
fs.writeFileSync(FILTER_PATH, JSON.stringify(index), 'utf8');

console.log('dropped ' + target + ' (' + doomed.title + ')');
console.log('records: ' + recs.length + ' -> ' + out.length);
