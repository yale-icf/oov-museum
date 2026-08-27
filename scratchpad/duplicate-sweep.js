#!/usr/bin/env node
/**
 * duplicate-sweep.js
 *
 * Systematic search for records that describe the same instrument, across all 483.
 * Catching these by eye found five pairs while rewriting; this looks for the rest,
 * including in the 121 descriptions the user rewrote.
 *
 * Text source per record, best available first:
 *   1. the rewritten label            (scratchpad/rewrites.json)
 *   2. the user's edit_2 description  (rewrite-queue.json carries it)
 *   3. data/museum-data.json
 *
 * Scoring. Records are only compared when they share an issue year (or are one year
 * apart, since issue and dating often differ). Points:
 *
 *   +4  a shared "headline total" — a number of 6+ digits, e.g. 142,780,000. Two
 *       records citing the same total almost always describe the same loan.
 *   +3  a shared denomination phrase, e.g. "500 francs", "£100", "1,000 guilders"
 *   +2  shared distinctive title words (rare tokens, stopwords and generic
 *       instrument words removed)
 *   +2  same type AND same issuing country
 *   -5  serials present on both AND far apart (>50). Different pieces of one issue,
 *       not a duplicate — this is what cleared the Bulgarian 1892 and Russian 1902
 *       clusters.
 *   +3  serials present on both AND within 50 of each other, or one contains the
 *       other's number. Consecutive numbers off one sheet.
 *
 * Anything scoring 7+ is reported. The script decides nothing; it ranks candidates.
 *
 *   node scratchpad/duplicate-sweep.js
 */

const fs = require('fs');

const recs = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));
const rewrites = JSON.parse(fs.readFileSync('scratchpad/rewrites.json', 'utf8'));
const queue = new Map(
  JSON.parse(fs.readFileSync('scratchpad/rewrite-queue.json', 'utf8')).map(q => [q.id, q.desc]));

const STOP = new Set(('the a an of and for to in on at by with company limited ltd co inc bond bonds ' +
  'share shares certificate certificates loan state government national bearer gold per cent percent ' +
  'stock obligation obligations note notes public debt du de la le les des el and société societe ' +
  'anonyme first second third series issue new royal imperial republic kingdom city province').split(' '));

function textOf(r) {
  return rewrites[r.id] || queue.get(r.id) || r.description || '';
}

function bigNumbers(s) {
  // 6+ significant digits, separators optional: 142,780,000 / 16667000 / 1.025.000
  return new Set((s.match(/\b\d{1,3}(?:[.,]\d{3}){2,}\b|\b\d{6,}\b/g) || [])
    .map(x => x.replace(/[.,]/g, '')).filter(x => x.length >= 6));
}

function denoms(s) {
  const out = new Set();
  const re = /(?:£|\$)\s?\d[\d.,]*|\b\d[\d.,]*\s*(?:francs?|guilders?|florins?|kronen|korona|krooni|kronor|leva|lei|lire|livres|marks?|reichsmark|roubles?|rubles?|pesos?|dinars?|yen|yuan|schillings?|gulden|escudos?|piastres?|taels?|dollars?|sterling|pounds?)\b/gi;
  for (const m of s.match(re) || []) out.add(m.replace(/\s+/g, ' ').toLowerCase().replace(/[.,]/g, ''));
  return out;
}

function titleTokens(t) {
  return new Set((t || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/)
    .filter(w => w.length > 3 && !STOP.has(w)));
}

function serials(r) {
  return (r.identifiers || [])
    .filter(v => /^No\./i.test(v))
    .map(v => parseInt(v.replace(/^No\.\s*/i, '').replace(/\D/g, ''), 10))
    .filter(n => Number.isFinite(n) && n > 0);
}

const inter = (a, b) => [...a].filter(x => b.has(x));

const items = recs.map(r => ({
  id: r.id, title: r.title || '', type: (r.type || []).join('/'),
  country: (r.issuingCountry || []).join('/'), year: parseInt((r.issueYear || [])[0], 10),
  big: bigNumbers(textOf(r)), den: denoms(textOf(r)), tok: titleTokens(r.title), ser: serials(r)
}));

const hits = [];
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    const A = items[i], B = items[j];
    if (!Number.isFinite(A.year) || !Number.isFinite(B.year)) continue;
    if (Math.abs(A.year - B.year) > 1) continue;

    const sharedBig = inter(A.big, B.big);
    const sharedDen = inter(A.den, B.den);
    const sharedTok = inter(A.tok, B.tok);

    let score = 0, why = [];
    if (sharedBig.length) { score += 4 * Math.min(sharedBig.length, 2); why.push('total ' + sharedBig.slice(0, 2).join('/')); }
    if (sharedDen.length) { score += 3; why.push('denom ' + sharedDen.slice(0, 2).join('/')); }
    if (sharedTok.length >= 2) { score += 2 * Math.min(sharedTok.length - 1, 3); why.push('title ' + sharedTok.slice(0, 4).join(' ')); }
    if (A.type && A.type === B.type && A.country && A.country === B.country) { score += 2; why.push('same type+country'); }

    if (A.ser.length && B.ser.length) {
      const close = A.ser.some(x => B.ser.some(y => Math.abs(x - y) <= 50));
      if (close) { score += 3; why.push('SERIALS ADJACENT'); }
      else { score -= 5; why.push('serials far apart — distinct pieces'); }
    }

    if (score >= 7) hits.push({ score, a: A, b: B, why });
  }
}

hits.sort((x, y) => y.score - x.score);

const KNOWN = new Set(['goetzmann0389|goetzmann0490', 'goetzmann0395|goetzmann0508',
  'goetzmann0516|goetzmann1036', 'goetzmann0534|goetzmann0549', 'goetzmann0544|goetzmann0545',
  'goetzmann0485|goetzmann0943', 'goetzmann0734|goetzmann0735']);

console.log(items.length + ' records compared, ' + hits.length + ' candidate pairs scoring 7+\n');
let fresh = 0;
for (const h of hits) {
  const key = [h.a.id, h.b.id].sort().join('|');
  const known = KNOWN.has(key);
  if (!known) fresh++;
  console.log((known ? '  [known] ' : '  * NEW  ') + 'score ' + h.score + '  ' + h.a.id + ' / ' + h.b.id);
  console.log('           ' + h.a.title.slice(0, 68));
  console.log('           ' + h.b.title.slice(0, 68));
  console.log('           ' + h.why.join(' · '));
}
console.log('\n' + fresh + ' not already known; ' + (hits.length - fresh) + ' of the 7 known pairs re-found.');
fs.writeFileSync('scratchpad/duplicate-candidates.tsv',
  'score\tid_a\tid_b\ttitle_a\ttitle_b\tsignals\n' +
  hits.map(h => [h.score, h.a.id, h.b.id, h.a.title.replace(/\t/g, ' '), h.b.title.replace(/\t/g, ' '), h.why.join(' · ')].join('\t')).join('\n') + '\n');
console.log('-> scratchpad/duplicate-candidates.tsv');
