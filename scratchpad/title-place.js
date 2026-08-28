// How many titles carry a place, and how reliable is issueYear for the titles that
// carry no date? (A year can only be added to a title if the year is trustworthy.)
const fs = require('fs');
const recs = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));
const yr = /\b1[0-9]{3}\b|\b20[0-2][0-9]\b/;

const CITIES = ['London', 'Paris', 'Amsterdam', 'Berlin', 'Vienna', 'Brussels', 'New York', 'Boston',
  'Philadelphia', 'Rotterdam', 'Middelburg', 'Utrecht', 'Antwerp', 'Petrograd', 'St. Petersburg',
  'Moscow', 'Rome', 'Florence', 'Madrid', 'Lisbon', 'Constantinople', 'Istanbul', 'Sarajevo',
  'Belgrade', 'Sofia', 'Bucharest', 'Warsaw', 'Budapest', 'Prague', 'Copenhagen', 'Stockholm',
  'Shanghai', 'Tokyo', 'Mexico City', 'Buenos Aires', 'Rio de Janeiro', 'Havana', 'Cairo', 'Geneva',
  'Zurich', 'Hamburg', 'Frankfurt', 'Chicago', 'Baltimore', 'Pittsburgh', 'Bad Homburg'];

let place = 0, both = 0, neither = 0;
const noDate = [];
for (const r of recs) {
  const t = r.title || '';
  const hasP = CITIES.some(c => t.includes(c)) ||
    (r.issuingCountry || []).some(c => t.includes(c)) ||
    (r.subjectCountry || []).some(c => t.includes(c));
  const hasY = yr.test(t);
  if (hasP) place++;
  if (hasP && hasY) both++;
  if (!hasP && !hasY) neither++;
  if (!hasY) noDate.push(r);
}
console.log('of ' + recs.length + ' titles:');
console.log('  ' + place + ' name a place (city or the record\'s own country)');
console.log('  ' + both + ' carry both place and year');
console.log('  ' + neither + ' carry neither\n');

// is issueYear good enough to paste into a title?
const sheet = { estimated: 0, firm: 0, missing: 0 };
const est = [];
for (const r of noDate) {
  const y = (r.issueYear || [])[0];
  if (!y) { sheet.missing++; continue; }
  // an estimate shows up as a hedge in the description or a range/ca. in the notes
  const hedged = /\bca\.|\bcirca\b|\bprobably\b|\blikely\b|\bundated\b|\bestimated\b/i
    .test((r.description || '') + ' ' + (r.notes || ''));
  if (hedged) { sheet.estimated++; est.push(r.id + ' ' + y); } else sheet.firm++;
}
console.log('the ' + noDate.length + ' titles with no year — how good is their issueYear?');
console.log('  ' + sheet.firm + ' firm');
console.log('  ' + sheet.estimated + ' hedged somewhere in description/notes (ca., probably, undated)');
console.log('  ' + sheet.missing + ' have no issueYear at all');
console.log('  sample hedged: ' + est.slice(0, 6).join(' | '));
