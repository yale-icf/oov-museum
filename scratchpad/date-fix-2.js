// Move the date into the opening sentence for the 25 labels that genuinely missed it.
// Each entry is [id, findString, replaceString]; every find must match exactly once.
const fs = require('fs');
const p = 'scratchpad/rewrites.json';
const a = JSON.parse(fs.readFileSync(p, 'utf8'));

const EDITS = [
['goetzmann0418',
 'A blank stock certificate of the Philad\'a & West Chester Turnpike Road Co. of Philadelphia, with a par value',
 'A blank stock certificate of the Philad\'a & West Chester Turnpike Road Co. of Philadelphia, a turnpike chartered in 1803, with a par value'],
['goetzmann0418',
 'The turnpike was chartered in 1803, joining the city to the borough of West Chester, and was financed',
 'It joined the city to the borough of West Chester and was financed'],

['goetzmann0456',
 'A single sheet bearing two interest-bearing obligations of the Commonwealth of Massachusetts. The upper',
 'A single sheet bearing two interest-bearing obligations of the Commonwealth of Massachusetts, both of 1786. The upper'],

['goetzmann0504',
 'A printed receipt recording the transfer of a single share, nominally 500 guilders, in the Dutch investment pool styled "Concordia Res Parvae Crescunt," through concord small things grow. It is countersigned for the Associatie-Cassa and dated Amsterdam, 6 January 1894, executing',
 'A printed receipt, dated Amsterdam, 6 January 1894, recording the transfer of a single share, nominally 500 guilders, in the Dutch investment pool styled "Concordia Res Parvae Crescunt," through concord small things grow. It is countersigned for the Associatie-Cassa, executing'],

['goetzmann0514',
 'A Dutch administration certificate for $1,000 of common stock',
 'A Dutch administration certificate of 1897 for $1,000 of common stock'],

['goetzmann0536',
 'A printed parchment bond, with its day and year completed by hand, a redeemable obligation',
 'A printed parchment bond of about 1647 to 1650, with its day and year completed by hand, a redeemable obligation'],

['goetzmann0610',
 'A Série A bearer obligation of the Crédit Foncier Cubain, the Banco Territorial de Cuba, bearing 5 percent annual interest. The face value',
 'A Série A bearer obligation of the Crédit Foncier Cubain, the Banco Territorial de Cuba, whose statutes were approved by the Executive Power of the Republic of Cuba and published in the Gaceta Oficial of 1 March 1911. It bears 5 percent annual interest, and its face value'],
['goetzmann0610',
 'The bond\'s left field reproduces the bank\'s statutes in parallel Spanish and French, approved by the Executive Power of the Republic of Cuba and published in the Gaceta Oficial of 1 March 1911, while a lower',
 'The bond\'s left field reproduces those statutes in parallel Spanish and French, while a lower'],

['goetzmann0615',
 'A Dutch-language certificate of French Three Percent Funds entitling its bearer',
 'A Dutch-language certificate of French Three Percent Funds, issued in Amsterdam on 19 October 1868, entitling its bearer'],
['goetzmann0615',
 'It was issued in Amsterdam on 19 October 1868 by an administration office directed jointly',
 'It was issued by an administration office directed jointly'],

['goetzmann0650',
 'A Dutch bearer certificate, marked SPECIMEN, representing ten ordinary shares',
 'A Dutch bearer certificate of 1926, marked SPECIMEN, representing ten ordinary shares'],

['goetzmann0668',
 'A bearer conversion bond of the Imperial Russian Government, denominated at 150 rubles',
 'A bearer conversion bond of the Imperial Russian Government, issued under the Imperial Ukase of 6 March 1898, denominated at 150 rubles'],
['goetzmann0668',
 'Issued under the Imperial Ukase of 6 March 1898, it was offered in exchange',
 'It was offered in exchange'],

['goetzmann0687',
 'the Stockholm holding company of Ivar Kreuger. It forms part of an issue of 65,000,000 kronor in denominations of 20, 40, 100 and 500, authorised by a shareholders\' resolution of 15 May 1928, and bears',
 'the Stockholm holding company of Ivar Kreuger, authorised by a shareholders\' resolution of 15 May 1928. It forms part of an issue of 65,000,000 kronor in denominations of 20, 40, 100 and 500, and bears'],

['goetzmann0693',
 'A 4 percent bearer bond of 500 dinars issued by the Kingdom of Serbs, Croats and Slovenes for the financial',
 'A 4 percent bearer bond of 500 dinars, issued around 1921 or 1922 by the Kingdom of Serbs, Croats and Slovenes for the financial'],
['goetzmann0693',
 'the last falling due 1 May 1947, which places issue around 1921 or 1922.',
 'the last falling due 1 May 1947.'],

['goetzmann0696',
 'A bearer amortisable bond of the Kingdom of Serbia, denominated 500 francs',
 'A bearer amortisable bond of the Kingdom of Serbia, created under the law of 8/20 July 1895, denominated 500 francs'],
['goetzmann0696',
 'forming a nominal capital of 355,292,000 francs, created under the law of 8/20 July 1895. The trilingual',
 'forming a nominal capital of 355,292,000 francs. The trilingual'],

['goetzmann0719',
 'A bilingual Dutch and French certificate entitling its bearer to an inscription',
 'A bilingual Dutch and French certificate, issued at Amsterdam on 11 May 1825, entitling its bearer to an inscription'],
['goetzmann0719',
 'It was issued at Amsterdam on 11 May 1825 by the houses of Hope en Comp.',
 'It was issued by the houses of Hope en Comp.'],

['goetzmann0735',
 'A sheet setting out the conditions governing the 5 percent gold loan',
 'A sheet of 1902 setting out the conditions governing the 5 percent gold loan'],

['goetzmann0931',
 'A Dutch-language share receipt certifying a 1/1063 interest',
 'A Dutch-language share receipt, issued at Amsterdam on 1 April 1776, certifying a 1/1063 interest'],
['goetzmann0931',
 'Issued at Amsterdam, 1 April 1776, it is given in exchange',
 'It is given in exchange'],

['goetzmann0988',
 'An ordinary bearer share, fully paid, for a face value of 500 French francs',
 'An ordinary bearer share of about 1920, fully paid, for a face value of 500 French francs'],

['goetzmann0996',
 'A partial bond for twenty gulden in Conventions-Münze',
 'A partial bond of 1847 for twenty gulden in Conventions-Münze'],

['goetzmann1004',
 'A four percent consolidated railway bond of the Imperial Russian Government, First Series, with a face value',
 'A four percent consolidated railway bond of the Imperial Russian Government, First Series, issued on the authority of the Imperial Ukase of 20 February 1889, with a face value'],
['goetzmann1004',
 'It forms part of a consolidated loan of 175 million gold rubles, issued on the authority of the Imperial Ukase of 20 February 1889 to refund',
 'It forms part of a consolidated loan of 175 million gold rubles raised to refund'],

['goetzmann1006',
 'A share certificate of the Shanghai Pudong Qiangsheng Taxi Co., Ltd., representing ten shares',
 'A share certificate of the Shanghai Pudong Qiangsheng Taxi Co., Ltd., dated the twelfth of February 1992, representing ten shares'],
['goetzmann1006',
 'It was issued at Shanghai and dated the twelfth of February 1992, and bears the approval',
 'It was issued at Shanghai and bears the approval'],

['goetzmann1008',
 'A printed extract of the statutes of the Société de l\'Ikelemba, a joint-stock company, set in French',
 'A printed extract of the statutes of the Société de l\'Ikelemba, a joint-stock company constituted in 1899, set in French'],

['goetzmann1021',
 'Two related documents of the Middelburg Chamber in Zeeland of the Vereenigde Oost-Indische Compagnie, photographed together.',
 'Two related documents of 1622 and 1623 from the Middelburg Chamber in Zeeland of the Vereenigde Oost-Indische Compagnie, photographed together.'],

['goetzmann1022',
 'An allonge, a coupon-renewal sheet appended to a rentebrief',
 'An allonge of 1944, a coupon-renewal sheet appended to a rentebrief'],

['goetzmann1028',
 'established at Batavia in the Dutch East Indies, issued at Batavia and signed by a commissioner',
 'established at Batavia in the Dutch East Indies, issued there in 1909 and signed by a commissioner'],

['goetzmann1030',
 'A French-language engagement contract, No. 7, by which the Directors',
 'A French-language engagement contract, No. 7, drawn at Antwerp on 31 January 1726, by which the Directors'],
['goetzmann1030',
 'It was drawn at Antwerp on 31 January 1726, sealed with the Company\'s arms',
 'It is sealed with the Company\'s arms'],

['goetzmann1036',
 'A Russian Imperial perpetual-income certificate promising 5 percent in perpetuity',
 'A Russian Imperial perpetual-income certificate, dated 1 March 1822 at St Petersburg, promising 5 percent in perpetuity'],
['goetzmann1036',
 'the imperial sinking-fund body, and the instrument is dated 1 March 1822 at St Petersburg.',
 'the imperial sinking-fund body.'],
];

let ok = 0, fail = [];
for (const [id, find, repl] of EDITS) {
  const before = a[id];
  if (!before) { fail.push(id + ': no such record'); continue; }
  const n = before.split(find).length - 1;
  if (n !== 1) { fail.push(id + ': matched ' + n + ' times — "' + find.slice(0, 55) + '…"'); continue; }
  a[id] = before.replace(find, repl);
  ok++;
}
fs.writeFileSync(p, JSON.stringify(a, null, 1) + '\n', 'utf8');
console.log('applied ' + ok + ' of ' + EDITS.length + ' edits');
if (fail.length) { console.log('FAILED:'); fail.forEach(f => console.log('  ' + f)); }
