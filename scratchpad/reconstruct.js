#!/usr/bin/env node
/**
 * reconstruct.js <id> [outPath]
 *
 * Rebuild a full-resolution image from its local DeepZoom tiles, for reading detail
 * the thumbnails cannot show. Composites the top pyramid level, accounting for the
 * 2px tile overlap.
 *
 *   node scratchpad/reconstruct.js goetzmann0340 scratchpad/0340.jpg
 */
const sharp = require('sharp'), fs = require('fs');
const id = process.argv[2];
const out = process.argv[3] || ('scratchpad/' + id + '.jpg');
if (!id) { console.error('usage: reconstruct.js <id> [outPath]'); process.exit(1); }

const dzi = fs.readFileSync(`tiles/${id}/${id}.dzi`, 'utf8');
const W = +dzi.match(/Width="(\d+)"/)[1], H = +dzi.match(/Height="(\d+)"/)[1];
const TS = +dzi.match(/TileSize="(\d+)"/)[1], OV = +dzi.match(/Overlap="(\d+)"/)[1];
const dir = `tiles/${id}/${id}_files/`;
const level = fs.readdirSync(dir).filter(d => /^\d+$/.test(d)).map(Number).sort((a, b) => b - a)[0];

const comp = [];
for (let c = 0; c < Math.ceil(W / TS); c++)
  for (let r = 0; r < Math.ceil(H / TS); r++) {
    const f = `${dir}${level}/${c}_${r}.jpeg`;
    if (fs.existsSync(f)) comp.push({ input: f, left: c * TS - (c > 0 ? OV : 0), top: r * TS - (r > 0 ? OV : 0) });
  }

sharp({ create: { width: W, height: H, channels: 3, background: '#fff' } })
  .composite(comp).jpeg({ quality: 92 }).toFile(out)
  .then(() => console.log(`${id}  ${W}x${H}  level ${level}  ${comp.length} tiles -> ${out}`))
  .catch(e => { console.error('ERR ' + e.message); process.exit(1); });
