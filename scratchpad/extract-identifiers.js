#!/usr/bin/env node
/**
 * extract-identifiers.js
 *
 * Seeds the internal `identifiers` field on data/museum-data.json by pulling
 * serial / certificate / series / loan designations out of text we already have:
 * notes (the internal catalogue field), description, and pages[].description.
 *
 * The field is search-only. viewer.js renders an explicit field list and this is
 * not on it, so nothing here becomes visible to site visitors.
 *
 * Bare form is a DRY RUN. Pass --write to touch museum-data.json.
 * Always emits a review list to scratchpad/identifiers-review.tsv.
 *
 *   node scratchpad/extract-identifiers.js            # dry run + review file
 *   node scratchpad/extract-identifiers.js --write    # apply
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const JSON_PATH = path.join(ROOT, 'data', 'museum-data.json');
const REVIEW_PATH = path.join(__dirname, 'identifiers-review.tsv');
const WRITE = process.argv.includes('--write');

// ---- patterns -------------------------------------------------------------
// A serial value: optional 1-4 letter prefix (possibly space-separated, as in
// "No. CC 04238717" / "No. A 024,487"), then digits carrying the thousands and
// range separators these catalogues actually use, then an optional suffix
// letter ("No. 224S"). The prefix is re-checked below -- it must be uppercase
// in the source, or "near 59" reads as serial "ear 59".
const VALUE = String.raw`[A-Za-z]{0,4}[ .-]?\d[\d.,'’/–—-]*[A-Za-z]?`;

// Markers must be followed by punctuation, a degree sign, or whitespace before
// the value. Allowing a bare "n" turned "near 59" into "No. ear 59".
const SERIAL_MARK = String.raw`(?:\bn(?:o|r|ro)s?\.\s*|\bn(?:o|r)s?\s+|\bn[º°]\s*|\bnumbers?\s+|\bnumbered\s+|\bserial\s+(?:n(?:o|r)s?\.?\s*)?)`;
const SERIES_MARK = String.raw`(?:\bs[eé]rie?s?\.?\s*|\bser\.\s*)`;

const PATTERNS = [
  // No. 008,255 / Nr. 5678 / N. 1234 / number 524 / numbered 000
  { label: 'No.',   re: new RegExp(SERIAL_MARK + String.raw`[:#]?\s*(` + VALUE + ')', 'gi') },
  // Serie 1920b / Serie A 1928 / Series 15871 / series 1898-1900
  { label: 'Serie', re: new RegExp(SERIES_MARK + String.raw`[:#]?\s*(` + VALUE + ')', 'gi') },
];

// "Loan of 1872" / "Loan 1911" -- the issue designation, not an amount. Held to a
// bare 4-digit year so "loan 26,999,973" (an amount, goetzmann0634) does not match.
const LOAN_RE = /\bloan\s+(?:of\s+)?((?:1[5-9]|20)\d{2})\b(?!\s*[,.]?\d)/gi;

// Junk the serial pattern will otherwise happily swallow.
const ALL_ZERO = /^0+$/;                 // "numbered 000"

// ---- helpers --------------------------------------------------------------
function cleanValue(v) {
  return v
    .replace(/[\s.,;:]+$/, '')       // trailing sentence punctuation
    .replace(/^[\s.-]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// A letter prefix is only a real prefix if it was capitalised in the source.
// Rejects "near 59" -> "ear 59", "next 30" -> "ext 30".
function prefixOk(v) {
  const m = v.match(/^([A-Za-z]{1,4})[ .-]?\d/);
  if (!m) return true;
  return m[1] === m[1].toUpperCase();
}

function digitsOf(v) { return v.replace(/\D/g, ''); }

function looksLikeYear(v) {
  return !/[A-Za-z]/.test(v) && /^(?:1[5-9]|20)\d{2}$/.test(digitsOf(v));
}

function extract(text, out, why) {
  if (!text) return;

  for (const { label, re } of PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      const raw = cleanValue(m[1]);
      if (!raw || ALL_ZERO.test(digitsOf(raw)) || !prefixOk(raw)) continue;
      push(out, why, label + ' ' + raw, m[0].trim());
    }
  }

  LOAN_RE.lastIndex = 0;
  let m;
  while ((m = LOAN_RE.exec(text)) !== null) {
    push(out, why, 'Loan of ' + m[1], m[0].trim());
  }
}

function push(out, why, value, matched) {
  const key = value.toLowerCase();
  if (out.seen.has(key)) return;
  out.seen.add(key);
  out.values.push(value);
  out.trace.push({ value: value, matched: matched, source: why });
}

// ---- run ------------------------------------------------------------------
const records = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

const review = ['id\ttitle\tidentifiers\tflags\tsource_snippets'];
let withIds = 0, totalIds = 0, flagged = 0;

for (const rec of records) {
  const out = { values: [], trace: [], seen: new Set() };

  extract(rec.notes, out, 'notes');
  extract(rec.description, out, 'description');
  for (const p of rec.pages || []) extract(p.description, out, 'page:' + p.id);

  rec.identifiers = out.values;
  if (!out.values.length) continue;

  withIds++;
  totalIds += out.values.length;

  // Flags: a "No." or "Serie" whose value is a plain 4-digit year is the classic
  // ambiguity ("No. 1890." -- serial, or the date leaking in?).
  const flags = out.values
    .filter(function (v) { return !/^Loan of /.test(v) && looksLikeYear(v.replace(/^\S+\.?\s*/, '')); })
    .map(function (v) { return 'year-like:' + v; });
  if (flags.length) flagged++;

  review.push([
    rec.id,
    (rec.title || '').replace(/\t/g, ' '),
    out.values.join(' | '),
    flags.join(' '),
    out.trace.map(function (t) { return t.source + ':"' + t.matched + '"'; }).join(' · ').replace(/\t/g, ' ')
  ].join('\t'));
}

fs.writeFileSync(REVIEW_PATH, review.join('\n') + '\n', 'utf8');
if (WRITE) fs.writeFileSync(JSON_PATH, JSON.stringify(records, null, 2) + '\n', 'utf8');

console.log(records.length + ' records scanned');
console.log(withIds + ' records got at least one identifier (' + totalIds + ' values total)');
console.log(flagged + ' records carry a year-like value worth eyeballing');
console.log('review list -> ' + path.relative(ROOT, REVIEW_PATH));
console.log(WRITE ? 'museum-data.json WRITTEN' : 'dry run -- pass --write to apply');
