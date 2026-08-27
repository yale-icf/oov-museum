#!/usr/bin/env node
/**
 * find-asides.js
 *
 * Cataloguer notes sitting in the visitor-facing `description` field. Two turned up
 * during the rewrite: goetzmann0595 ended "not the Japanese yen instrument of earlier
 * cataloguing," and goetzmann0933 ended "here catalogued as a separate item." Both
 * address a colleague, not a visitor.
 *
 * Checks all 483 descriptions, using the best text available for each:
 *   rewritten label -> user's edit_2 description -> data/museum-data.json
 *
 * Grouped by confidence, because some patterns are legitimate. "Shown here with its
 * reverse" describes how the object was photographed and belongs on the label;
 * "here catalogued as a separate item" does not.
 *
 *   node scratchpad/find-asides.js
 */

const fs = require('fs');

const recs = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));
const rewrites = JSON.parse(fs.readFileSync('scratchpad/rewrites.json', 'utf8'));
const queue = new Map(
  JSON.parse(fs.readFileSync('scratchpad/rewrite-queue.json', 'utf8')).map(q => [q.id, q.desc]));

const GROUPS = [
  ['CERTAIN — speaks about the cataloguing, not the object', [
    /\bcatalogu?(?:ed|ing)\b/i,
    /\bearlier (?:record|entry|cataloguing|attribution)\b/i,
    /\bprior (?:record|entry|cataloguing)\b/i,
    /\b(?:mis|in)correct(?:ly)?\s+(?:catalogu|identif|attribut|dated)/i,
    /\b(?:formerly|previously)\s+(?:bound|filed|listed|recorded)\b/i,
    /\bthis (?:record|entry|catalogue)\b/i,
    /\bmuseum record\b/i,
  ]],
  ['CERTAIN — cross-references another record by id', [
    /goetzmann\s?\d{3,4}/i,
  ]],
  ['LIKELY — a claim about the collection rather than the document', [
    /\b(?:in|of) (?:the|this) collection\b/i,
    /\boldest item\b/i,
    /\bonly (?:item|example|record) (?:in|of)\b/i,
  ]],
  ['REVIEW — unresolved reading markers meant for staff', [
    /\[illegible\]|\[unclear\]|\[\?\]|\[sic\]/i,
    /\b\w+\[\?\]/,
    /\bTODO\b|\bFIXME\b|\bcheck this\b|\bneeds? verif/i,
  ]],
  ['REVIEW — describes the photograph rather than the object', [
    /\bphotographed together\b/i,
    /\bthis (?:scan|image|photograph)\b/i,
    /\bat this resolution\b/i,
  ]],
];

const text = r => rewrites[r.id] || queue.get(r.id) || r.description || '';
const source = r => rewrites[r.id] ? 'rewritten' : (queue.get(r.id) ? 'edit_2' : 'json');

let total = 0;
const rows = [];
for (const [label, pats] of GROUPS) {
  const found = [];
  for (const r of recs) {
    const t = text(r);
    for (const p of pats) {
      const m = t.match(p);
      if (m) {
        const i = Math.max(0, t.indexOf(m[0]) - 55);
        found.push({ id: r.id, src: source(r), snip: (i ? '…' : '') + t.slice(i, i + 150).replace(/\s+/g, ' ') + '…' });
        break;
      }
    }
  }
  console.log('\n### ' + label + '  (' + found.length + ')');
  for (const f of found) {
    console.log('  ' + f.id + '  [' + f.src + ']');
    console.log('      ' + f.snip);
    rows.push([label.split(' —')[0], f.id, f.src, f.snip].join('\t'));
  }
  total += found.length;
}

console.log('\n' + total + ' hits across ' + recs.length + ' descriptions.');
fs.writeFileSync('scratchpad/editorial-asides.tsv',
  'confidence\tid\tsource\tsnippet\n' + rows.join('\n') + '\n');
console.log('-> scratchpad/editorial-asides.tsv');
