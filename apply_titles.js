// Applies approved title_proposals.json changes to museum-data.json
// Run: node apply_titles.js

const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));
const proposals = JSON.parse(fs.readFileSync('title_proposals.json', 'utf8'));

const map = Object.fromEntries(proposals.map(p => [p.id, p.new]));
let count = 0;

for (const item of data) {
  if (map[item.id]) {
    item.title = map[item.id];
    count++;
  }
}

fs.writeFileSync('data/museum-data.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`Applied ${count} title changes to museum-data.json`);
