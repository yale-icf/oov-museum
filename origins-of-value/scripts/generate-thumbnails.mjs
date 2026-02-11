import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const JPEG_DIR = path.join(ROOT, 'JPEG Files');
const THUMB_DIR = path.join(ROOT, 'site', 'thumbnails');
const CONCURRENCY = 8;

fs.mkdirSync(THUMB_DIR, { recursive: true });

// Get all JPEG files
const diskOutput = execSync(`find "${JPEG_DIR}" -type f -iname "*.jpg" -o -iname "*.jpeg"`)
  .toString().trim();
const files = diskOutput.split('\n').filter(Boolean);

console.log(`Generating thumbnails for ${files.length} images...`);

let done = 0;
let skipped = 0;
let errors = 0;

async function processBatch(batch) {
  await Promise.all(batch.map(async (filePath) => {
    const fname = path.basename(filePath).toLowerCase();
    const outPath = path.join(THUMB_DIR, fname);

    // Skip if already exists
    if (fs.existsSync(outPath)) {
      skipped++;
      done++;
      return;
    }

    try {
      await sharp(filePath)
        .resize({ width: 400, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(outPath);
      done++;
    } catch (err) {
      errors++;
      done++;
      console.error(`  Error: ${fname}: ${err.message}`);
    }

    if (done % 100 === 0) {
      console.log(`  ${done}/${files.length} processed`);
    }
  }));
}

// Process in batches
for (let i = 0; i < files.length; i += CONCURRENCY) {
  const batch = files.slice(i, i + CONCURRENCY);
  await processBatch(batch);
}

console.log(`\nDone! ${done} processed, ${skipped} skipped, ${errors} errors`);
