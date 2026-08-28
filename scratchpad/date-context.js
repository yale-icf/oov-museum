/* date-context.js — for each date conflict, show the sentence on each side.
 * Many will be explicable without an image: a maturity year against an issue year,
 * a loan's name against its printing date. Those should be triaged out before any
 * image is opened, so the image work goes only where it is actually needed.
 *
 *   node scratchpad/date-context.js
 */
const fs = require('fs');
const recs = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));
const rows = fs.readFileSync('scratchpad/conflict-flags.tsv', 'utf8')
  .split(/\r?\n/).slice(1).filter(Boolean).map(l => l.split('\t'))
  .filter(r => r[1] === 'year');

const YEAR = /\b(1[5-9]\d{2}|20[0-2]\d)\b/;
const sentences = s => (s || '').split(/(?<=[.;])\s+/);

for (const [id, , dYears, tYears] of rows) {
  const r = recs.find(x => x.id === id);
  console.log('\n──────── ' + id + '   issueYear ' + ((r.issueYear || [])[0] || '—') +
    '   |  ' + (r.title || '').slice(0, 62));
  console.log('   desc years: ' + dYears + '      transcription years: ' + tYears);
  for (const s of sentences(r.description || '')) {
    if (YEAR.test(s)) console.log('   D: ' + s.trim().replace(/\s+/g, ' ').slice(0, 190));
  }
  const tl = (r.transcription || '').split(/\r?\n/)
    .filter(l => YEAR.test(l) && l.trim().length > 3).slice(0, 6);
  for (const l of tl) console.log('   T: ' + l.trim().replace(/\s+/g, ' ').slice(0, 190));
}
console.log('\n' + rows.length + ' date conflicts.');
