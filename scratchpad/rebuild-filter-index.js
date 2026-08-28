// Rebuild data/filter-index.json from museum-data.json, using the same facet list and
// ordering as excel_to_json.py's build_filter_index and drop-record.js.
const fs = require('fs');
const FACETS = ['type','location','issuingCountry','currency','language','period','namedIndividuals'];
const recs = JSON.parse(fs.readFileSync('data/museum-data.json','utf8'));
const index = {};
for (const field of FACETS) {
  const counts = new Map();
  for (const item of recs) {
    if (!Array.isArray(item[field])) continue;
    for (const v of item[field]) counts.set(v, (counts.get(v)||0)+1);
  }
  index[field] = [...counts.entries()].map(([value,count])=>({value,count}))
    .sort((a,b)=> b.count-a.count || a.value.localeCompare(b.value));
}
fs.writeFileSync('data/filter-index.json', JSON.stringify(index,null,2)+'\n','utf8');
console.log('rebuilt; period facet now:');
index.period.forEach(p=>console.log('   '+String(p.count).padStart(4)+'  '+p.value));
