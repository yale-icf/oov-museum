// Record dropped-duplicate relationships on the records that survived them.
// Convention already in the collection (goetzmann1027, goetzmann0729): the KEPT record's
// notes name the dropped id and say what the relationship was.
const fs = require('fs');
const p = 'data/museum-data.json';
const d = JSON.parse(fs.readFileSync(p, 'utf8'));

const r295 = d.find(x => x.id === 'goetzmann0295');
r295.notes =
  'Banca Românească, 500 lei share No. 011648, Capital 160,000,000 lei, Bucharest 1920. ' +
  'A 1938 share from the same engraved plate — Emisiunea VIII-A, capital 350,000,000 lei — was ' +
  'catalogued as goetzmann0294 and dropped as a design variant on 2026-08-23; its scan, tiles ' +
  'and OCR text remain on disk.';

// 0494 carried the DROPPED row's marker verbatim, so its notes claimed it was
// "a poorer, faded copy of goetzmann0494" -- a copy of itself. Bleed from the
// 2026-07-17 notes-offset repair, which recovered 0494 from the retained 0493 row.
const r494 = d.find(x => x.id === 'goetzmann0494');
r494.notes = r494.notes.replace(/\s*\[FADED DUPLICATE[^\]]*\]/, '').trim() +
  ' A poorer, faded copy of this same debenture was catalogued as goetzmann0493 and dropped ' +
  'from the website collection on 2026-07-15; its row is kept in the workbook to preserve numbering.';

fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n', 'utf8');
console.log('0295:\n  ' + r295.notes + '\n');
console.log('0494:\n  ' + r494.notes);
