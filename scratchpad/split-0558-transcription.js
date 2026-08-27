#!/usr/bin/env node
/**
 * split-0558-transcription.js
 *
 * The July 2026 split of a mixed record into goetzmann0558 (Mexican consolidated
 * debt bond) and goetzmann0560 (Ethiopian railway share) moved the description but
 * not the transcription. 0558 kept the combined text of both documents; 0560 was
 * left with none — which is why it is the only record in the collection with an
 * empty transcription.
 *
 * The combined text falls into four sections, each opening with a "# Transcription"
 * or "# Document Transcription" heading:
 *   1  Spanish  — Mexican bond certificate      -> 0558
 *   2  French   — Ethiopian railway share       -> 0560
 *   3  Spanish  — Mexican decree text, Art. 1-14 -> 0558
 *   4  French   — Ethiopian railway share       -> 0560
 *
 * `transcription` is NOT Excel-backed — excel_to_json.py preserves it — so this
 * repair survives the next import.
 *
 *   node scratchpad/split-0558-transcription.js            # dry run
 *   node scratchpad/split-0558-transcription.js --write
 */

const fs = require('fs');
const P = 'data/museum-data.json';
const WRITE = process.argv.includes('--write');

const recs = JSON.parse(fs.readFileSync(P, 'utf8'));
const mex = recs.find(r => r.id === 'goetzmann0558');
const eth = recs.find(r => r.id === 'goetzmann0560');
if (!mex || !eth) throw new Error('record not found');

const t = mex.transcription || '';
const idx = [...t.matchAll(/^#\s+(?:Document\s+)?Transcription/gm)].map(m => m.index);
if (idx.length !== 4) throw new Error('expected 4 sections, found ' + idx.length);
idx.push(t.length);

const sections = [];
for (let i = 0; i < 4; i++) sections.push(t.slice(idx[i], idx[i + 1]).trim());

// Classify by language marker rather than by position, so a reordering is caught.
const isFrench = s => /Original \(French\)/.test(s);
const toMex = sections.filter(s => !isFrench(s));
const toEth = sections.filter(s => isFrench(s));
if (toMex.length !== 2 || toEth.length !== 2) {
  throw new Error('unexpected split: ' + toMex.length + ' Spanish, ' + toEth.length + ' French');
}

const mexText = toMex.join('\n\n---\n\n');
const ethText = toEth.join('\n\n---\n\n');

console.log('goetzmann0558  ' + t.length + ' chars -> ' + mexText.length + ' (Mexican, 2 sections)');
console.log('goetzmann0560  ' + (eth.transcription || '').length + ' chars -> ' + ethText.length + ' (Ethiopian, 2 sections)');
console.log('  nothing dropped: ' + (mexText.length + ethText.length >= t.length - 20));

if (WRITE) {
  mex.transcription = mexText;
  eth.transcription = ethText;
  fs.writeFileSync(P, JSON.stringify(recs, null, 2) + '\n', 'utf8');
  console.log('WRITTEN');
} else {
  console.log('dry run -- pass --write to apply');
}
