/* Upload regenerated DZI tile sets to the R2 bucket via its S3-compatible API.
   Usage: node upload-tiles.js <goetzmannNNNN> [more ids...]

   Reads credentials from r2-credentials.json (gitignored — never committed):
     { "accessKeyId": "...", "secretAccessKey": "...",
       "endpoint": "https://<accountid>.r2.cloudflarestorage.com",
       "bucket": "<bucket-name>" }

   For each id it deletes the old goetzmann<id>/ prefix (rotations change the
   tile grid, so stale tiles would otherwise linger) and uploads the fresh set. */
const fs = require('fs');
const path = require('path');
const {
  S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand
} = require('@aws-sdk/client-s3');

const cred = JSON.parse(fs.readFileSync('r2-credentials.json', 'utf8'));
const s3 = new S3Client({
  region: 'auto',
  endpoint: cred.endpoint,
  credentials: { accessKeyId: cred.accessKeyId, secretAccessKey: cred.secretAccessKey }
});
const BUCKET = cred.bucket;

function contentType(file) {
  if (file.endsWith('.dzi') || file.endsWith('.xml')) return 'application/xml';
  if (file.endsWith('.jpeg') || file.endsWith('.jpg')) return 'image/jpeg';
  return 'application/octet-stream';
}

// every file under a local dir, as { key, absPath } with keys rooted at the id prefix
function walk(dir, keyPrefix, out) {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const key = keyPrefix + '/' + name;
    if (fs.statSync(abs).isDirectory()) walk(abs, key, out);
    else out.push({ key, abs });
  }
}

async function deletePrefix(prefix) {
  let token, removed = 0;
  do {
    const list = await s3.send(new ListObjectsV2Command(
      { Bucket: BUCKET, Prefix: prefix, ContinuationToken: token }));
    const objs = (list.Contents || []).map(o => ({ Key: o.Key }));
    for (let i = 0; i < objs.length; i += 1000) {
      await s3.send(new DeleteObjectsCommand(
        { Bucket: BUCKET, Delete: { Objects: objs.slice(i, i + 1000) } }));
    }
    removed += objs.length;
    token = list.IsTruncated ? list.NextContinuationToken : undefined;
  } while (token);
  return removed;
}

async function uploadId(id) {
  const dir = 'tiles/' + id;
  if (!fs.existsSync(dir)) { console.log('  SKIP (no local tiles):', id); return; }

  const removed = await deletePrefix(id + '/');
  const files = [];
  walk(dir, id, files);   // keys become goetzmann<id>/... to match the viewer's requests

  let done = 0;
  const CONCURRENCY = 16;
  async function worker() {
    while (files.length) {
      const f = files.pop();
      await s3.send(new PutObjectCommand({
        Bucket: BUCKET, Key: f.key,
        Body: fs.readFileSync(f.abs), ContentType: contentType(f.abs)
      }));
      if (++done % 100 === 0) process.stdout.write('.');
    }
  }
  const total = files.length;
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log('\n  ' + id + ': deleted ' + removed + ' old, uploaded ' + total + ' files');
}

(async () => {
  const ids = process.argv.slice(2);
  if (!ids.length) { console.error('usage: node upload-tiles.js <goetzmannNNNN> [...]'); process.exit(1); }
  for (const id of ids) { console.log(id + ' …'); await uploadId(id); }
  console.log('\nAll uploads done.');
})();
