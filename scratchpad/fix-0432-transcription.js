// goetzmann0432: the liquidator's stamp reads "special resolution passed on 27th
// April 1949" and "On 23th May 1952 a Winding-up Order was made". The transcription's
// summary line says 1940 and 1953. The description was right on both, and on the
// 1 October 1912 seal date.
const fs = require('fs');
const P = 'data/museum-data.json';
const recs = JSON.parse(fs.readFileSync(P, 'utf8'));
const r = recs.find(x => x.id === 'goetzmann0432');
const before = r.transcription;
r.transcription = before.replace(/\b1940\b/g, '1949').replace(/\b1953\b/g, '1952');
if (r.transcription === before) { console.log('no change'); process.exit(0); }
fs.writeFileSync(P, JSON.stringify(recs, null, 2) + '\n', 'utf8');
console.log('0432 transcription: 1940 -> 1949, 1953 -> 1952');
console.log('  ' + (r.transcription.match(/.{50}1949.{60}/) || [''])[0].replace(/\s+/g, ' '));
