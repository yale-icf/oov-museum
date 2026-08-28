/* detail-audit.js — find description details the transcription does not support.
 *
 * Every error this session has turned up shares a shape: a small checkable detail,
 * transcribed once and never re-checked. 0416 said "1, Allées Paul Riquet" and
 * "Cadenet Frères" where the plate reads 5 and Cadenat; 0345 said "No. DP 1602"
 * and "July 1876" where it reads 1602 and JULY 1893; 0295 said No. 011666 and
 * 100,000,000 lei where it reads 011648 and 160,000,000.
 *
 * The transcription is an independent reading of the same object, so where the
 * description asserts a detail the transcription contradicts, one of them is wrong.
 * This does NOT prove the description wrong -- transcriptions have their own errors,
 * which is why 0560's was regenerated -- it ranks records worth putting an eye on.
 *
 * Four detail classes, chosen because each has already produced a real error:
 *   street address     "5, Allées Paul-Riquet"
 *   printer / notary   "Imprimerie Chaix", "Lith. Cadenat Frères", "chez Me Vidal"
 *   serial number      "No. 011648"
 *   large money figure  6+ digits, the loan totals
 *
 * A hit means: the description states it, the transcription runs to some length,
 * and the transcription does not contain it in any spelling-tolerant form.
 *
 *   node scratchpad/detail-audit.js
 */
const fs = require('fs');
const recs = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));

const norm = s => (s || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')      // strip diacritics
  .replace(/[‘’“”]/g, "'")
  .toLowerCase();
const digits = s => (s || '').replace(/\D/g, '');

const CLASSES = [
  ['street address', /\b\d{1,3},?\s+(?:rue|allées?|allees?|boulevard|avenue|quai|strasse|straße|street|place)\s+[A-ZÉÈÀÜÖ][\w'’\-\.]*(?:\s+[A-ZÉÈÀÜÖ][\w'’\-\.]*){0,2}/g],
  ['printer / notary', /\b(?:Imprimerie|Imp\.|Lith\.|Lithographed by|printed by|Printed by|notary|notaire)\s+[A-ZÉÈÀÜÖ][\w'’\-\.]*(?:\s+(?:&|et)?\s*[A-ZÉÈÀÜÖ][\w'’\-\.]*){0,2}/g],
  ['serial number', /\bNo\.\s?[\dOo][\d,.']{2,}/g],
  ['large figure', /\b\d{1,3}(?:[.,]\d{3}){2,}\b/g],
];

// tolerant containment: exact, then digits-only, then a fuzzy last-word match
function supported(needle, hay, hayDigits) {
  const n = norm(needle);
  if (hay.includes(n)) return true;
  const d = digits(needle);
  if (d.length >= 3 && hayDigits.includes(d)) return true;
  // a proper name may be split or abbreviated in the transcription; accept the
  // longest word of 5+ letters appearing there
  const words = n.match(/[a-z]{5,}/g) || [];
  const key = words.sort((a, b) => b.length - a.length)[0];
  if (key && hay.includes(key)) return true;
  return false;
}

const rows = [];
let checked = 0;
for (const r of recs) {
  const desc = r.description || '';
  const tr = r.transcription || '';
  if (tr.length < 400) continue;              // too thin to contradict anything
  checked++;
  const hay = norm(tr + ' ' + (r.notes || ''));
  const hayDigits = digits(tr + ' ' + (r.notes || ''));
  for (const [cls, re] of CLASSES) {
    for (const m of new Set(desc.match(re) || [])) {
      if (!supported(m, hay, hayDigits)) {
        rows.push({ id: r.id, cls, detail: m.trim(), title: (r.title || '').slice(0, 50) });
      }
    }
  }
}

const byClass = {};
rows.forEach(x => (byClass[x.cls] = (byClass[x.cls] || []).concat(x)));
console.log(checked + ' records have a transcription long enough to check against.\n');
for (const [cls, list] of Object.entries(byClass)) {
  console.log('=== ' + cls + ' — ' + list.length + ' unsupported ===');
  list.slice(0, 12).forEach(x => console.log('  ' + x.id + '  ' + JSON.stringify(x.detail) + '   [' + x.title + ']'));
  if (list.length > 12) console.log('  … ' + (list.length - 12) + ' more');
  console.log('');
}
const ids = new Set(rows.map(x => x.id));
console.log(rows.length + ' unsupported details across ' + ids.size + ' records.');
fs.writeFileSync('scratchpad/detail-flags.tsv',
  'id\tclass\tdetail\ttitle\n' + rows.map(x => [x.id, x.cls, x.detail, x.title].join('\t')).join('\n') + '\n');
console.log('-> scratchpad/detail-flags.tsv');
