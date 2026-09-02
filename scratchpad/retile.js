/* retile.js <recordId> <sourceJpeg>
 * Regenerate a record's DZI tiles and thumbnail from a different source image, keeping the
 * record's own id. Used when a collection holds two scans of ONE object and the better scan
 * was catalogued under the id being retired.
 * Matches the existing layout exactly: TileSize 512, Overlap 2, jpeg; thumbnail 400px wide, q82.
 */
const fs = require('fs'), path = require('path'), sharp = require('sharp');
const [, , id, src] = process.argv;
if (!id || !src) { console.error('usage: retile.js goetzmann1027 path/to/source.jpg'); process.exit(1); }
const dir = path.join('tiles', id);
(async () => {
  const m = await sharp(src).metadata();
  const old = fs.existsSync(path.join(dir, id + '.dzi'))
    ? fs.readFileSync(path.join(dir, id + '.dzi'), 'utf8').match(/Width="(\d+)"[\s\S]*?/) : null;
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  await sharp(src).rotate()
    .tile({ size: 512, overlap: 2, layout: 'dz' })
    .toFile(path.join(dir, id));
  // sharp writes <id>.dzi + <id>_files/
  const levels = fs.readdirSync(path.join(dir, id + '_files')).map(Number).sort((a, b) => a - b);
  console.log(id + ': tiled ' + m.width + 'x' + m.height + ', levels ' + levels[0] + '-' + levels[levels.length - 1]);
  await sharp(src).rotate().resize({ width: 400 }).jpeg({ quality: 82 })
    .toFile(path.join('thumbnails', id + '.jpg'));
  const t = await sharp(path.join('thumbnails', id + '.jpg')).metadata();
  console.log(id + ': thumbnail ' + t.width + 'x' + t.height);
})();
