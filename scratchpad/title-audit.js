// Measure the titles against the §8 rule: issuer/instrument + place + date,
// cutting denomination, rate, serial, series/class, and page markers.
const fs = require('fs');
const recs = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));
const T = recs.map(r => ({ id: r.id, t: (r.title || '').trim(), y: (r.issueYear || [])[0] || '' }));

const RULES = [
  ['serial number', /\bNo\.?\s?\d|№\s?\d|\bNr\.?\s?\d|#\s?\d/i],
  ['denomination', /[£$€¥]\s?[\d,.]+|\b[\d,.]+\s?(francs?|guilders?|florins?|rubles?|roubles?|marks?|lire|lei|leva|kronen|kronor|korona|pesos?|dollars?|pounds?|yen|yuan|taels?|escudos?|piastres?|dinars?|reales?|scudi|thalers?|gulden|zlotych|drachmae?|shillings?|livres?|ducats?)\b/i],
  ['interest rate', /\b\d+(?:[.,½¼¾]\d*)?\s?(?:%|per\s?cent)/i],
  ['series or class', /\b(?:seri[ea]s?|littera|klasse|class)\b\s*[A-Z0-9IVX]/i],
  ['page marker', /\(page \d+ of \d+\)/i],
  ['count in parentheses', /\(\s*(?:deck|set|sheet)\s+of\s+\d+\s*\)|\bof\s+\d+\s*\)/i],
];

console.log('=== violations of the existing §8 title rule ===');
const flagged = new Map();
for (const [name, re] of RULES) {
  const hits = T.filter(x => re.test(x.t));
  hits.forEach(h => flagged.set(h.id, (flagged.get(h.id) || []).concat(name)));
  console.log('  ' + String(hits.length).padStart(3) + '  ' + name);
  hits.slice(0, 3).forEach(h => console.log('         ' + h.id + '  ' + h.t.slice(0, 76)));
}
console.log('  ' + String(flagged.size).padStart(3) + '  distinct titles affected\n');

console.log('=== date in the title ===');
const yr = /\b1[0-9]{3}\b|\b20[0-2][0-9]\b/;
const withYear = T.filter(x => yr.test(x.t));
console.log('  ' + withYear.length + ' of ' + T.length + ' carry a year; ' + (T.length - withYear.length) + ' do not');
const forms = [
  ['trailing ", 1899"', /,\s*(?:ca\.\s*)?1[0-9]{3}\.?$/],
  ['trailing " (1899)"', /\((?:ca\.\s*)?1[0-9]{3}\)\.?$/],
  ['trailing bare " 1899"', /[^,(]\s1[0-9]{3}$/],
  ['year not at the end', /\b1[0-9]{3}\b(?![\s)\.]*$)/],
];
for (const [n, re] of forms) console.log('  ' + String(T.filter(x => re.test(x.t)).length).padStart(3) + '  ' + n);

console.log('\n=== shape and punctuation ===');
const w = T.map(x => x.t.split(/\s+/).length).sort((a, b) => a - b);
console.log('  words: min ' + w[0] + '  median ' + w[Math.floor(w.length / 2)] +
  '  p90 ' + w[Math.floor(w.length * 0.9)] + '  max ' + w[w.length - 1]);
const count = (re) => String(T.filter(x => re.test(x.t)).length).padStart(3);
console.log('  ' + count(/\.$/) + '  end with a period');
console.log('  ' + count(/:/) + '  contain a colon');
console.log('  ' + count(/;/) + '  contain a semicolon');
console.log('  ' + count(/"/) + '  contain straight quotes');
console.log('  ' + count(/[“”]/) + '  contain curly quotes');
console.log('  ' + count(/—/) + '  contain an em dash');
console.log('  ' + count(/–/) + '  contain an en dash');
console.log('  ' + count(/\(/) + '  contain parentheses');
console.log('  ' + count(/^The\s/) + '  begin with "The"');
console.log('  ' + count(/[Ѐ-ӿͰ-Ͽ֐-׿؀-ۿ一-鿿぀-ヿሀ-፿]/) + '  contain non-Latin script');
console.log('  ' + count(/\b[A-Z]{4,}\b/) + '  contain an ALL-CAPS word of 4+ letters');

console.log('\n=== longest 8 ===');
[...T].sort((a, b) => b.t.length - a.t.length).slice(0, 8).forEach(x => console.log('  ' + x.id + '  ' + x.t));
console.log('\n=== shortest 8 ===');
[...T].sort((a, b) => a.t.length - b.t.length).slice(0, 8).forEach(x => console.log('  ' + x.id + '  ' + x.t));

fs.writeFileSync('scratchpad/title-flags.tsv', 'id\tissues\ttitle\n' +
  [...flagged].map(([id, v]) => [id, v.join('; '), T.find(x => x.id === id).t].join('\t')).join('\n') + '\n');
console.log('\n-> scratchpad/title-flags.tsv');
