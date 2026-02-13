/**
 * combine-pages.js
 *
 * One-time build script to combine multi-page document records into single
 * records with a `pages` array. Run with: node scripts/combine-pages.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const MUSEUM_DATA_PATH = path.join(DATA_DIR, 'museum-data.json');
const FILTER_INDEX_PATH = path.join(DATA_DIR, 'filter-index.json');

// Matches: "Page 1 of 7", "Pages 3 of 23", "Pge 1 of 2", "Page 2 pf 2"
const PAGE_PATTERN = /^(pages?|pge)\s*(\d+)\s*(of|o[fp])\s*(\d+)\s*[-–—:]\s*/i;

// Broader pattern to check if ANY item in a group has page info (used to decide grouping)
const HAS_PAGE_PATTERN = /pages?\s*\d+\s*o[fp]\s*\d+|pge\s*\d+\s*o[fp]\s*\d+|page\s*\d+\s*pf\s*\d+/i;

function main() {
  console.log('Reading museum-data.json...');
  const allItems = JSON.parse(fs.readFileSync(MUSEUM_DATA_PATH, 'utf8'));
  console.log('Total items:', allItems.length);

  // Group items by normalized title
  const titleGroups = {};
  const singleItems = [];

  allItems.forEach(item => {
    const key = item.title.trim().toLowerCase();
    if (!titleGroups[key]) titleGroups[key] = [];
    titleGroups[key].push(item);
  });

  const combined = [];
  let groupsCombined = 0;
  let pagesCombined = 0;

  // Process each group
  for (const [titleKey, group] of Object.entries(titleGroups)) {
    // Only combine if ANY item in the group has a page pattern in its description
    const hasPageItems = group.some(item => HAS_PAGE_PATTERN.test(item.description));

    if (group.length === 1 || !hasPageItems) {
      // Single items or non-page groups: keep as-is
      group.forEach(item => combined.push(item));
      continue;
    }

    // This is a multi-page group — combine into one record
    groupsCombined++;
    pagesCombined += group.length;

    // Sort pages by extracted page number, falling back to ID order
    const sorted = group.slice().sort((a, b) => {
      const aMatch = a.description.match(PAGE_PATTERN);
      const bMatch = b.description.match(PAGE_PATTERN);
      const aNum = aMatch ? parseInt(aMatch[2], 10) : Infinity;
      const bNum = bMatch ? parseInt(bMatch[2], 10) : Infinity;
      if (aNum !== bNum) return aNum - bNum;
      return a.id.localeCompare(b.id);
    });

    const primary = sorted[0];

    // Build pages array
    const pages = sorted.map(item => ({
      id: item.id,
      description: item.description
    }));

    // Strip "Page X of Y - " prefix from primary description
    const cleanDescription = primary.description.replace(PAGE_PATTERN, '').trim();

    // Union of types across all pages, with "Page" removed
    const allTypes = new Set();
    sorted.forEach(item => {
      if (item.type) {
        item.type.forEach(t => {
          if (t !== 'Page') allTypes.add(t);
        });
      }
    });

    // Union of locations
    const allLocations = new Set();
    sorted.forEach(item => {
      if (item.location) item.location.forEach(v => allLocations.add(v));
    });

    // Union of periods
    const allPeriods = new Set();
    sorted.forEach(item => {
      if (item.period) item.period.forEach(v => allPeriods.add(v));
    });

    // Union of namedIndividuals
    const allNamedIndividuals = new Set();
    sorted.forEach(item => {
      if (item.namedIndividuals) item.namedIndividuals.forEach(v => allNamedIndividuals.add(v));
    });

    // Union of keywords
    const allKeywords = new Set();
    sorted.forEach(item => {
      if (item.keywords) item.keywords.forEach(v => allKeywords.add(v));
    });

    const combinedItem = {
      id: primary.id,
      title: primary.title,
      description: cleanDescription,
      file: primary.file,
      type: [...allTypes],
      location: [...allLocations],
      period: [...allPeriods],
      namedIndividuals: [...allNamedIndividuals],
      keywords: [...allKeywords],
      owner: primary.owner,
      pages: pages
    };

    combined.push(combinedItem);
  }

  console.log('Groups combined:', groupsCombined);
  console.log('Pages merged:', pagesCombined);
  console.log('Final record count:', combined.length);

  // Write updated museum-data.json
  fs.writeFileSync(MUSEUM_DATA_PATH, JSON.stringify(combined, null, 2), 'utf8');
  console.log('Wrote', MUSEUM_DATA_PATH);

  // Regenerate filter-index.json
  const filterIndex = buildFilterIndex(combined);
  fs.writeFileSync(FILTER_INDEX_PATH, JSON.stringify(filterIndex), 'utf8');
  console.log('Wrote', FILTER_INDEX_PATH);

  console.log('Done.');
}

function buildFilterIndex(items) {
  const facets = {
    type: {},
    location: {},
    period: {},
    namedIndividuals: {}
  };

  items.forEach(item => {
    for (const field of Object.keys(facets)) {
      const values = item[field];
      if (Array.isArray(values)) {
        values.forEach(v => {
          facets[field][v] = (facets[field][v] || 0) + 1;
        });
      }
    }
  });

  // Convert to sorted arrays (descending by count)
  const result = {};
  for (const field of Object.keys(facets)) {
    result[field] = Object.entries(facets[field])
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count);
  }

  return result;
}

main();
