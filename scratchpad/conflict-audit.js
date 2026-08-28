/* conflict-audit.js — where the description and the transcription state DIFFERENT values.
 *
 * detail-audit.js asks "does the transcription corroborate this?", which over-flags:
 * a transcription that simply never recorded the printer's imprint looks the same as
 * a real error. goetzmann0416 proves it -- flagged there, yet verified correct.
 *
 * This asks the sharper question: does the transcription state a value of the same
 * KIND but different? That is the shape of the errors actually found -- 0295 said
 * No. 011666 where the plate reads 011648, 0345 said July 1876 where the docket
 * reads JULY 1893. Both readings cannot be right, so one is wrong and the record
 * needs an eye either way.
 *
 *   node scratchpad/conflict-audit.js
 */
const fs = require('fs');
const recs = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));

const clean = s => (s || '').replace(/[‘’]/g, "'");
const setOf = (s, re, map = x => x) => new Set([...(clean(s).match(re) || [])].map(map));

const SERIAL = /\bNo\.?\s?([\dOo][\d,.']{2,})/g;
const BIGNUM = /\b\d{1,3}(?:[.,]\d{3}){2,}\b/g;
const YEAR = /\b(1[5-9]\d{2}|20[0-2]\d)\b/g;

function nums(s, re) {
  const out = new Set();
  for (const m of clean(s).matchAll(re)) out.add((m[1] || m[0]).replace(/\D/g, ''));
  out.delete('');
  return out;
}

const rows = [];
for (const r of recs) {
  const d = r.description || '', t = r.transcription || '';
  if (t.length < 400) continue;

  // serials: both sides name one, and they share no value
  const ds = nums(d, SERIAL), ts = nums(t, SERIAL);
  if (ds.size && ts.size && ![...ds].some(x => ts.has(x))) {
    rows.push([r.id, 'serial', [...ds].join(' / '), [...ts].slice(0, 4).join(' / ')]);
  }
  // headline totals: both sides give 6+ digit figures, none shared
  const db = nums(d, BIGNUM), tb = nums(t, BIGNUM);
  const dbig = [...db].filter(x => x.length >= 6), tbig = [...tb].filter(x => x.length >= 6);
  if (dbig.length && tbig.length && !dbig.some(x => tbig.includes(x))) {
    rows.push([r.id, 'total', dbig.join(' / '), tbig.slice(0, 4).join(' / ')]);
  }
  // years: a year in the description that appears nowhere in the transcription,
  // while the transcription does carry years of its own
  const dy = [...setOf(d, YEAR)], ty = [...setOf(t, YEAR)];
  if (dy.length && ty.length) {
    const orphan = dy.filter(y => !ty.includes(y));
    if (orphan.length && orphan.length === dy.length) {
      rows.push([r.id, 'year', dy.join(' / '), ty.slice(0, 5).join(' / ')]);
    }
  }
}

const byKind = {};
rows.forEach(x => (byKind[x[1]] = (byKind[x[1]] || []).concat([x])));   // concat([x]), not concat(x)
for (const [kind, list] of Object.entries(byKind)) {
  console.log('=== ' + kind + ' conflicts — ' + list.length + ' ===');
  list.slice(0, 14).forEach(x =>
    console.log('  ' + x[0] + '  description: ' + x[2] + '   |   transcription: ' + x[3]));
  if (list.length > 14) console.log('  … ' + (list.length - 14) + ' more');
  console.log('');
}
const ids = new Set(rows.map(x => x[0]));
console.log(rows.length + ' conflicts across ' + ids.size + ' records, of ' + recs.length + '.');
fs.writeFileSync('scratchpad/conflict-flags.tsv',
  'id\tkind\tdescription\ttranscription\n' + rows.map(x => x.join('\t')).join('\n') + '\n');
console.log('-> scratchpad/conflict-flags.tsv');
