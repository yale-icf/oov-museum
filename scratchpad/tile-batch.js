/* tile-batch.js — generate DZI tiles and thumbnails for a batch of masters.
 *
 * Matches the layout every other record uses: TileSize 512, Overlap 2, jpeg,
 * thumbnail 400px wide at quality 82, EXIF orientation applied via .rotate().
 *
 * Idempotent: a record that already has a .dzi and a thumbnail is skipped, so the
 * run can be interrupted and resumed without redoing work.
 *
 *   node scratchpad/tile-batch.js scratchpad/new-batch-paths.json
 */
const fs = require('fs'), path = require('path'), sharp = require('sharp');

const src = JSON.parse(fs.readFileSync(process.argv[2] || 'scratchpad/new-batch-paths.json', 'utf8'));
const ids = Object.keys(src).sort();
let done = 0, skipped = 0, failed = [];
const t0 = Date.now();

(async () => {
  for (const n of ids) {
    const id = 'goetzmann' + n;
    const dir = path.join('tiles', id);
    const dzi = path.join(dir, id + '.dzi');
    const thumb = path.join('thumbnails', id + '.jpg');
    if (fs.existsSync(dzi) && fs.existsSync(thumb)) { skipped++; continue; }
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      fs.mkdirSync(dir, { recursive: true });
      await sharp(src[n]).rotate()
        .tile({ size: 512, overlap: 2, layout: 'dz' })
        .toFile(path.join(dir, id));
      await sharp(src[n]).rotate().resize({ width: 400 }).jpeg({ quality: 82 }).toFile(thumb);
      done++;
      if (done % 10 === 0 || done === 1) {
        const el = (Date.now() - t0) / 1000;
        console.log('  ' + done + '/' + (ids.length - skipped) + '  ' + id +
                    '  (' + el.toFixed(0) + 's elapsed, ' + (el / done).toFixed(1) + 's each)');
      }
    } catch (e) {
      failed.push(id + ': ' + String(e.message).slice(0, 80));
    }
  }
  console.log('\ntiled ' + done + ', skipped ' + skipped + ' already done, failed ' + failed.length);
  failed.forEach(f => console.log('  FAIL ' + f));
  console.log('total ' + ((Date.now() - t0) / 1000).toFixed(0) + 's');
})();
