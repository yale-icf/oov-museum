/* fix-transcription-years.js
 *
 * Correct the wrong years in the transcriptions of records whose DESCRIPTION was
 * verified right from the image, 2026-08-27. Transcriptions are internal now -- the
 * panel was removed from the site -- but they are the second source the conflict
 * audit depends on, so a wrong year there keeps re-flagging a settled record.
 *
 * Only unambiguous substitutions. goetzmann0232 is deliberately NOT here: its
 * transcription's "1919" is genuine printed boilerplate ("September 15th, 1919"),
 * and only its summary line wrongly called that the issue date -- a global replace
 * would corrupt real text.
 *
 *   node scratchpad/fix-transcription-years.js [--write]
 */
const fs = require('fs');
const WRITE = process.argv.includes('--write');
const P = 'data/museum-data.json';
const recs = JSON.parse(fs.readFileSync(P, 'utf8'));

const FIX = {
  goetzmann0392: [['1896', '1886']],   // seal "20th March 1886"; postmark 25·3·86
  goetzmann0529: [['1776', '1778']],   // "9th Day of October 1778" in letterpress
  goetzmann0495: [['1778', '1798']],   // "Seventien Honderd Acht en negentig"
  goetzmann0220: [['1795', '1790']],   // "Treasury Department Oct. 13. 1790"
  goetzmann0293: [['1863', '1875']],   // "Baltimore, Sept 7th 1875"
  goetzmann0346: [['1925', '1929']],   // "Dated JAN. 19, 1929"
  goetzmann0984: [['1910', '1904'], ['1930', '1954']],  // dated 19 Oct 1904, redeemable 1 Jul 1954
  goetzmann0351: [['1895', '1903']],   // "day of April 1903"
  goetzmann0377: [['1974', '1972']],   // stamp "JAN 24 1972"
  goetzmann0404: [['1912', '1904']],   // "30th day of Nov 1904"
  goetzmann0506: [['1824', '1834']],   // "Edinburgh, April 5th, 1834"
  goetzmann0900: [['1925', '1923']],   // "Hagenow, den 20. Juli 1923"
};

let total = 0;
for (const [id, pairs] of Object.entries(FIX)) {
  const r = recs.find(x => x.id === id);
  if (!r) { console.log('  MISSING ' + id); continue; }
  let t = r.transcription || '', n = 0;
  for (const [a, b] of pairs) {
    const hits = (t.match(new RegExp('\\b' + a + '\\b', 'g')) || []).length;
    t = t.replace(new RegExp('\\b' + a + '\\b', 'g'), b);
    n += hits;
  }
  console.log('  ' + id + '  ' + n + ' replacement(s)  ' +
    pairs.map(p => p[0] + '->' + p[1]).join(', '));
  total += n;
  if (WRITE) r.transcription = t;
}
console.log('\n' + total + ' year tokens across ' + Object.keys(FIX).length + ' transcriptions');
if (WRITE) {
  fs.writeFileSync(P, JSON.stringify(recs, null, 2) + '\n', 'utf8');
  console.log('written to ' + P);
} else {
  console.log('dry run -- pass --write to apply');
}
