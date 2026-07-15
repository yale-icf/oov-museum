/* Regenerate every derivative of an edited master original.
   Usage: node regen-image.js <goetzmannNNNN> [more ids...]

   Reads the (possibly rotated/cropped) original from the JPEG Files tree,
   bakes in any EXIF orientation, and rewrites:
     - thumbnails/<id>.jpg            (400px wide)
     - images/exhibits/<id>.jpg       (900px)   only if that file already exists
     - images/hero-<id>.jpg           (1800px)  only if that file already exists
     - tiles/<id>/<id>.dzi (+ _files) (512px tiles, overlap 2, jpeg)  to match the set

   Tiles live only on R2 (gitignored locally); upload is a separate step. */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ORIG_ROOT = 'C:/Users/ks2479/Documents/my-project/origins-of-value/JPEG Files';

function findOriginal(id) {
  for (const dir of fs.readdirSync(ORIG_ROOT)) {
    for (const name of [id + '.jpg', id[0].toUpperCase() + id.slice(1) + '.jpg']) {
      const p = path.join(ORIG_ROOT, dir, name);
      if (fs.existsSync(p)) return p;
    }
  }
  throw new Error('original not found for ' + id);
}

// .rotate() with no args auto-orients from EXIF and drops the orientation tag,
// so the rotation the editor recorded is baked into real pixels.
const oriented = (src) => sharp(src).rotate();

async function regen(id) {
  const src = findOriginal(id);
  const meta = await oriented(src).metadata();
  console.log(`\n${id}  <- ${path.relative(ORIG_ROOT, src)}  (${meta.width}x${meta.height} after orientation)`);

  // thumbnail (400px wide)
  await oriented(src).resize({ width: 400 }).jpeg({ quality: 82 })
    .toFile('thumbnails/' + id + '.jpg');
  console.log('  thumbnails/' + id + '.jpg');

  // exhibit / hero, only if they already exist for this id
  const ex = 'images/exhibits/' + id + '.jpg';
  if (fs.existsSync(ex)) {
    await oriented(src).resize({ width: 900 }).jpeg({ quality: 82 }).toFile(ex);
    console.log('  ' + ex);
  }
  const hero = 'images/hero-' + id + '.jpg';
  if (fs.existsSync(hero)) {
    await oriented(src).resize({ width: 1800 }).jpeg({ quality: 84 }).toFile(hero);
    console.log('  ' + hero);
  }

  // DZI tiles — match the existing set (512px, overlap 2, jpeg)
  const tdir = 'tiles/' + id;
  fs.rmSync(tdir, { recursive: true, force: true });
  fs.mkdirSync(tdir, { recursive: true });
  await oriented(src)
    .jpeg({ quality: 85 })
    .tile({ size: 512, overlap: 2, layout: 'dz' })
    .toFile(path.join(tdir, id));           // sharp appends .dzi and _files itself
  console.log('  ' + tdir + '/' + id + '.dzi (+ _files)');
}

(async () => {
  const ids = process.argv.slice(2);
  if (!ids.length) { console.error('usage: node regen-image.js <goetzmannNNNN> [...]'); process.exit(1); }
  for (const id of ids) await regen(id);
  console.log('\nDone. Next: upload the regenerated tiles/<id>/ to R2, then commit the repo-side images.');
})();
