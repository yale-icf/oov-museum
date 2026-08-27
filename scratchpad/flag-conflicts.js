#!/usr/bin/env node
/**
 * flag-conflicts.js
 *
 * Two jobs, both read-only.
 *
 * 1. CONFLICTS — where the transcription disagrees with the description on a hard fact
 *    (interest rate, headline amount, key year), or where the transcription flags its own
 *    uncertainty. goetzmann0378 is the worked case: the transcription says "5 per cent" and
 *    "quinquennial instalments" where the description says 4 percent and ten annual
 *    installments, and reads the signature as "B. W. Smith" rather than Kossuth. The
 *    description won every time. These are for the user to rule on, never to resolve silently.
 *
 * 2. YIELD — how much survives the delete-and-modernize operation. Sentences carrying
 *    interpretation or imagery are cut; what remains is the label. If too little remains,
 *    the record needs writing from the transcription rather than editing down.
 *
 *   node scratchpad/flag-conflicts.js
 */

const fs = require('fs');

const recs = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));
const queue = JSON.parse(fs.readFileSync('scratchpad/rewrite-queue.json', 'utf8'));
const inQueue = new Map(queue.map(q => [q.id, q]));

// A sentence goes if it interprets, or if it is about the engraving rather than the terms.
const INTERPRET = /\b(reveals?|speaks? to|evokes?|embod|captures?|testif|bespeak|underscore|reflects?|signals?|registers? (?:the|how)|marks? it as|belongs to the|exemplif|illustrat(?:es|ing) how|suggests? that|reminds?|attests? to the|stands? as|serves? as a|encapsulat|the .* moment|hints? at|advertis|lends?|asserts?|projects?|binds? together|casts? the)\b/i;
const IMAGERY = /\b(vignette|engraved (?:face|frame|imagery|border)|scrollwork|guilloche|guilloché|allegor|ornamental|ornament\b|foliate|medallion|motifs?|iconograph|filigree|cartouche|arabesque|floral|decorative border|emblem of|crowns? the sheet|border of)\b/i;

const RATE   = /(\d+(?:[.,]\d+)?|\d+\s*[½¼¾])\s*(?:per\s*cent|percent|%)/gi;
const BIGNUM = /\b\d{1,3}(?:[.,]\d{3}){2,}\b/g;                  // 181,950,000 style
const YEAR   = /\b(1[3-9]\d{2}|20[0-2]\d)\b/g;
const HEDGE  = /\[unclear\]|appears to read|illegible|partially visible|unreadable|\[\?\]|uncertain/i;

const norm = s => (s || '').replace(/½/g, '.5').replace(/¼/g, '.25').replace(/¾/g, '.75');
const setOf = (s, re) => new Set((norm(s).match(re) || [])
  .map(x => x.replace(/\s+/g, '').replace(/per\s*cent|percent|%/gi, '').replace(/[.,]/g, m => m)));

function sentences(t) {
  return (t || '').split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
}

const conflicts = [];
const yields = [];

for (const rec of recs) {
  const q = inQueue.get(rec.id);
  if (!q) continue;
  const desc = q.desc || '';
  const tr = rec.transcription || '';

  // ---- 1. conflicts ----
  const flags = [];
  const dRates = [...new Set((norm(desc).match(RATE) || []).map(s => s.replace(/\s+/g, ' ').trim()))];
  const tRates = [...new Set((norm(tr).match(RATE) || []).map(s => s.replace(/\s+/g, ' ').trim()))];
  const numOf = s => parseFloat(String(s).replace(/[^\d.]/g, ''));
  if (dRates.length && tRates.length) {
    const tset = new Set(tRates.map(numOf));
    const missing = dRates.filter(r => !tset.has(numOf(r)));
    if (missing.length === dRates.length) flags.push(`rate: description says ${dRates.join(' / ')}, transcription says ${tRates.join(' / ')}`);
  }
  const dBig = [...new Set(desc.match(BIGNUM) || [])];
  const tBig = new Set((tr.match(BIGNUM) || []).map(x => x.replace(/[.,]/g, '')));
  const bigMiss = dBig.filter(x => !tBig.has(x.replace(/[.,]/g, '')));
  if (dBig.length && tBig.size && bigMiss.length === dBig.length) {
    flags.push(`amount: description's ${dBig.join(' / ')} not found in the transcription`);
  }
  const dYears = [...new Set(desc.match(YEAR) || [])];
  const tYears = new Set(tr.match(YEAR) || []);
  const issue = (rec.issueYear || [])[0];
  if (issue && tYears.size && !tYears.has(issue)) {
    flags.push(`year: issueYear ${issue} does not appear in the transcription (transcription has ${[...tYears].slice(0, 6).join(', ')})`);
  }
  if (HEDGE.test(tr)) flags.push('transcription hedges its own reading (unclear / appears to read / illegible)');
  if (!tr.trim()) flags.push('NO transcription at all');

  if (flags.length) conflicts.push({ id: rec.id, row: q.row, title: q.title, flags });

  // ---- 2. yield ----
  const ss = sentences(desc);
  const keep = ss.filter(s => !INTERPRET.test(s) && !IMAGERY.test(s));
  const kw = keep.join(' ').split(/\s+/).filter(Boolean).length;
  yields.push({ id: rec.id, row: q.row, title: q.title, before: q.words, kept: kw,
                cut: ss.length - keep.length, of: ss.length, tr: tr.length });
}

fs.writeFileSync('scratchpad/transcription-conflicts.json', JSON.stringify(conflicts, null, 1), 'utf8');
fs.writeFileSync('scratchpad/yield-analysis.json', JSON.stringify(yields, null, 1), 'utf8');

// ---- report ----
console.log(`queue: ${yields.length} records\n`);
console.log(`RECORDS WITH A TRANSCRIPTION CONFLICT OR CAVEAT: ${conflicts.length}`);
const tally = {};
conflicts.forEach(c => c.flags.forEach(f => { const k = f.split(':')[0]; tally[k] = (tally[k] || 0) + 1; }));
Object.entries(tally).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`   ${v.toString().padStart(4)}  ${k}`));

const k = yields.map(y => y.kept).sort((a, b) => a - b);
console.log(`\nYIELD of delete-and-modernize (words surviving the cut):`);
console.log(`   median ${k[k.length >> 1]}w   quartiles ${k[k.length >> 2]} / ${k[(k.length * 3) >> 2]}   range ${k[0]}-${k[k.length - 1]}`);
for (const [lbl, lo, hi] of [['under 40w (too thin, must write from transcription)', 0, 39],
                             ['40-59w (thin, needs supplementing)', 40, 59],
                             ['60-110w (lands in range by deletion alone)', 60, 110],
                             ['over 110w (still needs trimming)', 111, 1e9]]) {
  const n = yields.filter(y => y.kept >= lo && y.kept <= hi).length;
  console.log(`   ${n.toString().padStart(4)}  ${(100 * n / yields.length).toFixed(0).padStart(3)}%  ${lbl}`);
}
console.log(`\n-> scratchpad/transcription-conflicts.json, scratchpad/yield-analysis.json`);
