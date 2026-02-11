import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const JPEG_DIR = path.join(ROOT, 'JPEG Files');
const TILES_DIR = path.join(ROOT, 'site', 'tiles');
const CONCURRENCY = 4;

fs.mkdirSync(TILES_DIR, { recursive: true });

// Get all JPEG files
const diskOutput = execSync(`find "${JPEG_DIR}" -type f -iname "*.jpg" -o -iname "*.jpeg"`)
  .toString().trim();
const files = diskOutput.split('\n').filter(Boolean);

console.log(`Generating DZI tiles for ${files.length} images (${CONCURRENCY} concurrent)...`);

let done = 0;
let skipped = 0;
let errors = 0;

async function processFile(filePath) {
  const fname = path.basename(filePath).toLowerCase();
  const id = fname.replace(/\.jpe?g$/i, '');
  const outDir = path.join(TILES_DIR, id);
  const dziFile = path.join(outDir, `${id}.dzi`);

  // Resume: skip if .dzi already exists
  if (fs.existsSync(dziFile)) {
    skipped++;
    done++;
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });

  try {
    await sharp(filePath)
      .tile({
        size: 512,
        overlap: 2,
        layout: 'dz',
        quality: 90
      })
      .toFile(path.join(outDir, id));
    done++;
  } catch (err) {
    errors++;
    done++;
    console.error(`  Error: ${fname}: ${err.message}`);
  }

  if (done % 50 === 0) {
    console.log(`  ${done}/${files.length} processed (${skipped} skipped)`);
  }
}

// Process in batches of CONCURRENCY
for (let i = 0; i < files.length; i += CONCURRENCY) {
  const batch = files.slice(i, i + CONCURRENCY);
  await Promise.all(batch.map(processFile));
}

console.log(`\nDone! ${done} processed, ${skipped} skipped, ${errors} errors`);
