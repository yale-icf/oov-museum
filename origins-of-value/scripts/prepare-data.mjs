import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const JPEG_DIR = path.join(ROOT, 'JPEG Files');
const DB_PATH = path.join(ROOT, 'museum-database.json');
const OUT_DATA = path.join(ROOT, 'site', 'data', 'museum-data.json');
const OUT_FILTERS = path.join(ROOT, 'site', 'data', 'filter-index.json');

console.log('Reading museum database...');
const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const allRecords = db['All Files'];
console.log(`  ${allRecords.length} total DB records`);

// Build disk file index: lowercase filename -> full path
console.log('Scanning JPEG files on disk...');
const diskOutput = execSync(`find "${JPEG_DIR}" -type f -iname "*.jpg" -o -iname "*.jpeg"`)
  .toString().trim();
const diskPaths = diskOutput.split('\n').filter(Boolean);
const diskMap = new Map();
for (const p of diskPaths) {
  const fname = path.basename(p).toLowerCase();
  diskMap.set(fname, p);
}
console.log(`  ${diskMap.size} JPEG files on disk`);

// Match DB records to disk files
const matchedRecords = [];
const dbFilenamesSeen = new Set();

for (const rec of allRecords) {
  const fn = rec.filename.toLowerCase();
  if (diskMap.has(fn) && !dbFilenamesSeen.has(fn)) {
    dbFilenamesSeen.add(fn);
    const id = fn.replace(/\.jpe?g$/i, '');
    matchedRecords.push({
      id,
      title: rec.title || '',
      description: rec.description || '',
      file: fn,
      type: Array.isArray(rec.type) ? rec.type : (rec.type ? [rec.type] : []),
      location: Array.isArray(rec.location) ? rec.location : (rec.location ? [rec.location] : []),
      period: Array.isArray(rec.period) ? rec.period : (rec.period ? [rec.period] : []),
      namedIndividuals: Array.isArray(rec.namedIndividuals) ? rec.namedIndividuals : (rec.namedIndividuals ? [rec.namedIndividuals] : []),
      keywords: Array.isArray(rec.keywords) ? rec.keywords : (rec.keywords ? [rec.keywords] : []),
      owner: rec.owner || ''
    });
  }
}
console.log(`  ${matchedRecords.length} records matched to disk files`);

// Create stub records for orphan images (on disk but not in DB)
let orphanCount = 0;
for (const [fname] of diskMap) {
  if (!dbFilenamesSeen.has(fname)) {
    const id = fname.replace(/\.jpe?g$/i, '');
    const prettyName = id.replace(/(\d+)/, ' $1').replace(/^\w/, c => c.toUpperCase()).trim();
    matchedRecords.push({
      id,
      title: prettyName,
      description: '',
      file: fname,
      type: [],
      location: [],
      period: [],
      namedIndividuals: [],
      keywords: [],
      owner: ''
    });
    orphanCount++;
  }
}
console.log(`  ${orphanCount} orphan images (stub records created)`);

// Sort by id for consistent ordering
matchedRecords.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

console.log(`  ${matchedRecords.length} total records for website`);

// Write museum-data.json
fs.writeFileSync(OUT_DATA, JSON.stringify(matchedRecords, null, 0));
const dataSize = (fs.statSync(OUT_DATA).size / 1024).toFixed(0);
console.log(`  Written ${OUT_DATA} (${dataSize} KB)`);

// Build filter index with counts
function buildFacet(records, field) {
  const counts = new Map();
  for (const rec of records) {
    const values = rec[field];
    if (Array.isArray(values)) {
      for (const v of values) {
        const trimmed = v.trim();
        if (trimmed) {
          counts.set(trimmed, (counts.get(trimmed) || 0) + 1);
        }
      }
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([value, count]) => ({ value, count }));
}

const filterIndex = {
  type: buildFacet(matchedRecords, 'type'),
  location: buildFacet(matchedRecords, 'location'),
  period: buildFacet(matchedRecords, 'period'),
  namedIndividuals: buildFacet(matchedRecords, 'namedIndividuals')
};

fs.writeFileSync(OUT_FILTERS, JSON.stringify(filterIndex, null, 0));
const filterSize = (fs.statSync(OUT_FILTERS).size / 1024).toFixed(0);
console.log(`  Written ${OUT_FILTERS} (${filterSize} KB)`);

console.log('\nFilter summary:');
for (const [key, facets] of Object.entries(filterIndex)) {
  console.log(`  ${key}: ${facets.length} unique values`);
}

console.log('\nDone!');
