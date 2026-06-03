// Title cleanup: plain-space separator, remove dates, keep foreign names,
// standardize (Verso)->(Reverse). DUMP-ONLY unless --write passed.
const fs = require('fs');
const JSONP = 'data/museum-data.json';
const data = JSON.parse(fs.readFileSync(JSONP, 'utf8'));

const months = 'January|February|March|April|May|June|July|August|September|October|November|December';
const Y = '(?:1[5-9]\\d{2}|20\\d{2})';
const SOH = String.fromCharCode(1), STX = String.fromCharCode(2);

function cleanTitle(orig) {
  let s = orig;

  // Protect serials with non-digit sentinels so real numbers are never touched
  const masks = [];
  s = s.replace(/No\.\s*(?:[A-Za-z]{1,3}\s*)?[\dA-Za-z][\d,.\/]*/g, m => {
    masks.push(m); return SOH + (masks.length - 1) + STX;
  });

  // Drop "Act of <Month> <Day>[, Year]" clauses entirely (date IS the clause)
  s = s.replace(new RegExp(`,?\\s*Act of\\s+(?:${months})\\s+\\d{1,2}(?:st|nd|rd|th)?(?:,?\\s*${Y})?`, 'g'), '');

  // DATE REMOVAL
  s = s.replace(new RegExp(`\\b(?:${months})\\s+\\d{1,2}(?:st|nd|rd|th)?,?\\s*${Y}`, 'g'), '');
  s = s.replace(new RegExp(`\\b(?:${months})\\s+${Y}`, 'g'), '');
  s = s.replace(new RegExp(`\\b(?:${months})\\s+\\d{1,2}(?:st|nd|rd|th)?\\b`, 'g'), '');
  s = s.replace(new RegExp(`\\bof\\s+${Y}\\b`, 'g'), '');
  s = s.replace(new RegExp(`\\b${Y}\\b`, 'g'), '');

  // restore serials
  s = s.replace(new RegExp(`${SOH}(\\d+)${STX}`, 'g'), (_, i) => masks[+i]);

  // tidy punctuation/dash remnants left by date removal
  s = s.replace(/\(\s*[–—-]\s*\)/g, '');
  s = s.replace(/\(\s*[–—-]\s*/g, '(');
  s = s.replace(/\s*[–—-]\s*\)/g, ')');
  s = s.replace(/\(\s*[,;]\s*/g, '(');
  s = s.replace(/\s*[,;]\s*\)/g, ')');
  s = s.replace(/\(\s*\)/g, '');
  s = s.replace(/,\s*,/g, ',');
  s = s.replace(/\s{2,}/g, ' ');
  s = s.replace(/\s+([),])/g, '$1');
  s = s.replace(/\(\s+/g, '(');
  s = s.replace(/[\s,:;]+$/, '').trim();
  s = s.replace(/\(\s*$/, '').trim();
  s = s.replace(/\s+of$/i, '').trim();

  // SEPARATOR: colon -> space; comma -> space before an instrument word
  s = s.replace(/\s*:\s*/g, ' ');
  const instr = '(?:Shares?|Certificate|Stock|Debenture|Obligation|Receipt|Bond|Bearer|Common|Preferred|Capital|Ordinary|Registered|Cumulative|Coupon|Subscription|Promissory|Treasury|Bill|Warrant|Note|Annuity|Annuities|Policy|Mortgage|Loan|Action|Prospectus|Scheme)';
  s = s.replace(new RegExp(`,\\s*(?=${instr}\\b)`, 'g'), ' ');

  // qualifier standardization
  s = s.replace(/\(Verso\)/g, '(Reverse)');

  s = s.replace(/\s{2,}/g, ' ').trim();
  return s;
}

const changed = [];
for (const d of data) {
  const nt = cleanTitle(d.title || '');
  if (nt !== (d.title || '')) changed.push([d.id.replace('goetzmann', ''), d.title, nt]);
}

if (process.argv.includes('--write')) {
  for (const d of data) d.title = cleanTitle(d.title || '');
  fs.writeFileSync(JSONP, JSON.stringify(data, null, 2));
  console.log('WROTE', changed.length, 'changed titles to', JSONP);
} else {
  console.log('Changed:', changed.length, 'of', data.length, '\n');
  for (const [id, a, b] of changed) console.log(`${id}: ${a}\n     -> ${b}`);
}
