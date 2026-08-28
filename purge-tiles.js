/* Delete tile sets from the R2 bucket for records removed from the collection.
   Usage: node purge-tiles.js <ids-file> [--write]

   The site loads tiles from R2 when served from github.io, so dropping a record
   from museum-data.json leaves its full-resolution scan publicly addressable at
   its R2 URL. This removes them.

   SAFETY. The bucket is public and these deletions cannot be undone, so before
   deleting anything the script checks every id against data/museum-data.json and
   refuses outright if a single one is still live -- as a record or as a leaf of
   one. It also refuses an id that does not match goetzmann\d{4}, so a malformed
   line can never widen into a prefix that matches more than intended.

   Credentials come from r2-credentials.json, gitignored, same as upload-tiles.js. */
const fs = require('fs');
const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');

const file = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!file) { console.error('usage: node purge-tiles.js <ids-file> [--write]'); process.exit(1); }

const ids = fs.readFileSync(file, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
const badFormat = ids.filter(i => !/^goetzmann\d{4}$/.test(i));
if (badFormat.length) { console.error('REFUSING: malformed id(s): ' + badFormat.slice(0, 5)); process.exit(1); }

const recs = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));
const alive = new Set();
for (const r of recs) { alive.add(r.id); for (const p of (r.pages || [])) alive.add(p.id); }
const stillLive = ids.filter(i => alive.has(i));
if (stillLive.length) {
  console.error('REFUSING: ' + stillLive.length + ' id(s) are still in the collection: ' + stillLive.slice(0, 8));
  process.exit(1);
}
console.log(ids.length + ' ids, none of them live in data/museum-data.json (' + alive.size + ' live ids checked)');

const cred = JSON.parse(fs.readFileSync('r2-credentials.json', 'utf8'));
const s3 = new S3Client({ region: 'auto', endpoint: cred.endpoint,
  credentials: { accessKeyId: cred.accessKeyId, secretAccessKey: cred.secretAccessKey } });

async function keysUnder(prefix) {
  const out = []; let token;
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket: cred.bucket, Prefix: prefix, ContinuationToken: token }));
    (r.Contents || []).forEach(o => out.push(o.Key));
    token = r.IsTruncated ? r.NextContinuationToken : undefined;
  } while (token);
  return out;
}

(async () => {
  let total = 0, bytes = 0, missing = 0, deleted = 0;
  for (const id of ids) {
    const keys = await keysUnder(id + '/');
    if (!keys.length) { missing++; continue; }
    total += keys.length;
    // guard again per batch: no key may belong to a live id
    const leak = keys.find(k => alive.has(k.split('/')[0]));
    if (leak) { console.error('ABORT: key belongs to a live record: ' + leak); process.exit(1); }
    if (WRITE) {
      for (let i = 0; i < keys.length; i += 1000) {
        await s3.send(new DeleteObjectsCommand({ Bucket: cred.bucket,
          Delete: { Objects: keys.slice(i, i + 1000).map(Key => ({ Key })), Quiet: true } }));
      }
      deleted += keys.length;
      process.stdout.write('.');
    }
  }
  if (WRITE) console.log('');
  console.log((WRITE ? 'DELETED ' + deleted : 'would delete ' + total) + ' objects across ' +
    (ids.length - missing) + ' prefixes; ' + missing + ' prefix(es) already absent');
  if (!WRITE) console.log('dry run -- pass --write to delete');
})();
