// Fold goetzmann0730 (verso) into goetzmann0729 (recto) as a two-page record, the same
// treatment the other recto-verso pairs got. 0730's own notes already said
// "2-page document; see goetzmann0729 for recto" -- the pair was catalogued, never merged.
// Also cuts the serial number from the title and description per the style guide (§5).
const fs = require('fs');

const JSON_PATH = 'data/museum-data.json';
const FILTER_PATH = 'data/filter-index.json';

const recs = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const front = recs.find(r => r.id === 'goetzmann0729');
const back = recs.find(r => r.id === 'goetzmann0730');
if (!front || !back) throw new Error('expected both 0729 and 0730 to be present');

front.title = 'Principality of Bulgaria 4½% Gold Loan of 1907 Bond, 500 Francs';

front.description =
  "A 500-franc bearer bond of the Principality of Bulgaria's 4½% State Gold Loan of 1907, " +
  'one of 290,000 obligations raising 145,000,000 francs. Face and reverse are set in four ' +
  'parallel languages — Bulgarian, French, German and English — the reverse carrying the ' +
  "loan's conditions above a full amortisation schedule whose half-yearly drawings retire " +
  'the debt from 1908 onward. Coupons and drawn bonds were payable in gold at Sofia, Paris, ' +
  'St Petersburg, Frankfurt, London, Amsterdam, Berlin, Zürich and Basel. That spread of ' +
  'paying agents, and the gold clause behind it, measure how far a young principality still ' +
  'tributary to the Ottoman sultan depended on Western capital to fund the state and army it ' +
  'would need on the eve of full independence.';

front.pages = [
  {
    id: 'goetzmann0729',
    description:
      'Face of the bond, printed in olive and red within an engraved border. The heading ' +
      'КНЯЖЕСТВО БЪЛГАРИЯ stands above the state arms, and the loan is set out in four ' +
      'parallel columns — Bulgarian, French, German and English — each repeating the ' +
      '500-franc denomination and the bearer form. Corner roundels carry 4½% and the date ' +
      '1907. Engraved signatures and the printer’s imprint close the sheet. Page 1 of 2.'
  },
  {
    id: 'goetzmann0730',
    description:
      'Reverse, printed in olive. Four parallel columns of loan conditions run beneath the ' +
      'heading УСЛОВИЯ НА ЗАЕМА, again in Bulgarian, French, German and English. Below them ' +
      'a full-width Table of Amortisation, titled in the same four languages, lists the ' +
      'half-yearly drawings that retire the loan from 1908. Page 2 of 2.'
  }
];

// the verso carried the only transcription of the pair
front.transcription = back.transcription;

front.keywords = (back.keywords || []).filter(k => k !== 'reverse');
front.creator = 'Principality of Bulgaria';   // a principality in 1907; a kingdom only from 1908
front.currency = ['French franc'];            // was the malformed "French franc; Bulgarian lev"
front.notes =
  'Two-page document folded into one record: recto goetzmann0729, verso goetzmann0730. ' +
  'Quadrilingual conditions (Bulgarian/French/German/English) and Table of Amortisation.';

const out = recs.filter(r => r.id !== 'goetzmann0730');
fs.writeFileSync(JSON_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');

// mirror excel_to_json.build_filter_index so the facets stay consistent
const FACETS = ['type', 'location', 'issuingCountry', 'currency', 'language', 'period', 'namedIndividuals'];
const index = {};
for (const field of FACETS) {
  const counts = new Map();
  for (const item of out) {
    const values = item[field];
    if (!Array.isArray(values)) continue;
    for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
  }
  index[field] = [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count);
}
fs.writeFileSync(FILTER_PATH, JSON.stringify(index), 'utf8');

console.log('records: ' + recs.length + ' -> ' + out.length);
console.log('0729 pages: ' + front.pages.length);
