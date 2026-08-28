/* title-uniform.js — propose uniform titles. Writes nothing; emits a review file.
 *
 * Decisions taken 2026-08-27:
 *   - no issue date in any title (181 currently carry one)
 *   - no interest rate (55)
 *   - no denomination, serial number, series or class, per v1 style guide §8 (21)
 *
 * The trap is that not every year is an issue date. "Gold Loan of 1907", "German
 * External Loan 1924 (Dawes Loan)", "Negotiatie van Maart 1781", "8 George I (1722)"
 * and "the 1720 Windhandel" carry the year as part of a name, and must survive.
 * A year is PROTECTED only when the word immediately before it says so; every other
 * year is an issue date and goes, wherever it sits -- trailing, parenthesised, or
 * inside a "(Place, 1867)" parenthetical, which is where most of them hide.
 *
 *   node scratchpad/title-uniform.js
 */
const fs = require('fs');
const recs = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));

// the year is part of a name when directly preceded by one of these
const PROTECT = /(?:\bof|\bLoan|\bMaart|\bthe|\bAnno)\s*$/i;
// "8 George I (1722)" is a regnal citation of the Act, not an issue date
const REGNAL = /\b(?:George|Anne|William|Mary|Charles|James|Victoria|Edward|Elizabeth|Henry)\s+[IVX]+\s*$/;

function stripRate(t) {
  return t
    .replace(/\s*\b\d+(?:[.,]\d+)?[½¼¾]?\s*(?:%|per\s?cent\.?)\s*/gi, ' ')
    .replace(/\s*\b[½¼¾]\s*(?:%|per\s?cent\.?)\s*/gi, ' ');
}
function stripDenom(t) {
  return t
    .replace(/,\s*[£$€¥]\s?[\d,.]+(?=\s*[,)]|$)/g, '')
    .replace(/,\s*[\d,.]+\s*(?:francs?|guilders?|florins?|rubles?|roubles?|marks?|lire|lei|leva|kronen|kronor|korona|pesos?|dollars?|pounds?|yen|yuan|taels?|escudos?|piastres?|dinars?|reales?|scudi|thalers?|gulden|zlotych|shillings?|livres?|ducats?)(?=\s*[,)]|$)/gi, '')
    .replace(/\s*\b[£$€¥]\s?[\d,.]+\s*/g, ' ');
}
function stripSerial(t) {
  return t.replace(/,?\s*(?:No\.?|Nr\.?|№)\s?[\d,.]+/gi, '').replace(/,?\s*#\s?[\d,.]+/g, '');
}
function stripSeriesClass(t) {
  return t.replace(/,?\s*\b(?:First|Second|Third|Fourth|Fifth)\s+Series\b/gi, '')
          .replace(/,?\s*\bSeries\s+[A-Z0-9IVX]+\b/gi, '')
          .replace(/\s*\bClass\s+[A-Z]\b\s*/gi, ' ')
          .replace(/,?\s*\bLittera\s+[A-Z]+\b/gi, '');
}
function stripCount(t) {                       // "(Deck of 55)" — §8: no counts in a title
  return t.replace(/\s*\((?:deck|set|sheet|album)\s+of\s+\d+\)/gi, '');
}

/* Remove every unprotected year, plus a leading "c."/"ca." and any year range,
   taking the punctuation that held it. Works anywhere in the string, so it catches
   "(St. Petersburg, 1867)" and "(1774)" as well as a trailing ", 1933". */
function stripIssueDate(t) {
  let s = t, prev = null;
  while (s !== prev) {
    prev = s;
    s = s.replace(/(,?\s*)(\()?\s*(?:c\.|ca\.)?\s*(\d{4})(?:\s*[-–]\s*\d{4})?\s*(\))?/g,
      (m, lead, open, year, close, off, str) => {
        const before = str.slice(0, off) + (lead || '');
        if (PROTECT.test(before) || REGNAL.test(before)) return m;  // a name-year stays
        if (open && close) return '';        // "(1774)", "(ca. 1703)" — parentheses go too
        if (close) return ')';               // "(Amsterdam, 1785)" — keep the closing paren
        return '';
      });
  }
  return s;
}
function tidy(t) {
  return t
    .replace(/\(\s*[,;]?\s*\)/g, '')
    .replace(/\(\s*,\s*/g, '(')
    .replace(/,\s*\)/g, ')')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,)])/g, '$1')
    .replace(/([(])\s+/g, '$1')
    .replace(/,\s*,/g, ',')
    .replace(/[\s,]+$/, '')
    .replace(/^\s*[,\-–—]\s*/, '')
    .trim();
}

const out = {}, rows = [], review = [];
for (const r of recs) {
  const before = (r.title || '').trim();
  let t = before;
  t = stripSerial(t); t = stripSeriesClass(t); t = stripCount(t);
  t = stripRate(t); t = stripDenom(t); t = stripIssueDate(t); t = tidy(t);
  if (t !== before) {
    out[r.id] = t;
    rows.push([r.id, before, t].join('\t'));
  }
  const flags = [];
  if (/\b1[0-9]{3}\b/.test(t) && !PROTECT.test(t.slice(0, t.search(/\b1[0-9]{3}\b/)))) flags.push('unprotected year survives');
  if (t.split(/\s+/).length < 3) flags.push('very short');
  if (/\b(?:of|the|for|and|in|on|with)$/i.test(t)) flags.push('ends on a preposition');
  if (/[(]/.test(t) !== /[)]/.test(t)) flags.push('unbalanced parentheses');
  if (/^[a-z]/.test(t)) flags.push('starts lowercase');
  if (flags.length) review.push('  ' + r.id + '  [' + flags.join('; ') + ']\n      ' + before + '\n   -> ' + t);
}
fs.writeFileSync('scratchpad/title-rewrites.json', JSON.stringify(out, null, 2) + '\n');
fs.writeFileSync('scratchpad/title-diff.tsv', 'id\tbefore\tafter\n' + rows.join('\n') + '\n');

const stillYear = recs.map(r => out[r.id] || r.title || '').filter(t => /\b1[0-9]{3}\b/.test(t));
console.log(rows.length + ' of ' + recs.length + ' titles change');
console.log(stillYear.length + ' titles still contain a year, all protected name-years:');
stillYear.forEach(t => console.log('    ' + t));
console.log('\n=== needs a human look (' + review.length + ') ===');
console.log(review.join('\n') || '  none');
console.log('\n-> scratchpad/title-diff.tsv, scratchpad/title-rewrites.json');
