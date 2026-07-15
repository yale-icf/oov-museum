const xlsx = require('../node_modules/xlsx');
const path = 'C:/Users/ks2479/Documents/GitHub/oov-museum/oov_data_new.xlsx';

const wb = xlsx.readFile(path);
const ws = wb.Sheets['Documents'];
const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

const headers = data[0];
const col = {};
headers.forEach((h, i) => { col[h] = i; });

function set(rowIdx, field, value) {
  if (col[field] === undefined) return;
  data[rowIdx][col[field]] = value;
}

// --- goetzmann0001 ---
set(1, 'title', 'Österreichischer Staatsschatzschein über Fünftausend Kronen (Austrian State Treasury Note for Five Thousand Crowns)');
set(1, 'description', 'A bearer treasury note issued by the Austrian state for 5,000 Kronen, dated September 1, 1920 in Vienna, bearing serial number 008255 in Series 1920b. The note is designated as tax-free (steuerfrei) and interest-bearing, with provisions for redemption by the state debt administration. The document features elaborate green and pink decorative borders with floral motifs, a double-headed Austrian imperial eagle at the top center, and ornamental medallions at each corner. Issued in the immediate aftermath of World War I and the dissolution of the Habsburg Empire, this bond represents the new Austrian republic\'s efforts to raise capital during a period of severe economic instability and hyperinflation.');
set(1, 'type', 'Bond, Debt, Security');
set(1, 'subjectCountry', 'Austria');
set(1, 'issuingCountry', 'Austria');
set(1, 'creator', 'Republic of Austria, Österreichische Staatsschuldenverwaltung');
set(1, 'issueDate', '1920-09-01');
set(1, 'currency', 'Austrian Krone (K)');
set(1, 'language', 'German');
set(1, 'numberPages', 1);
set(1, 'period', '20th Century');
set(1, 'owner', 'WNG');

// --- goetzmann0002 ---
set(2, 'title', 'Burmese Government Bond');
set(2, 'description', 'A Burmese government bond written entirely in Burmese script, featuring green and purple decorative borders with traditional floral and geometric motifs. The document displays the serial number 008358 in red numerals on both sides and a central circular vignette with the denomination printed in Burmese characters. The footer contains a date in the Burmese calendar system, suggesting issuance during the 1940s when Burma operated as a nominally independent state under Japanese occupation. The design incorporates traditional Burmese decorative elements including intricate petal and leaf motifs framing the central text, in a style consistent with official financial instruments of the era. This is a rare surviving example of financial documentation from wartime Burma, notable for its exclusive use of the indigenous script at a politically turbulent moment in Burmese history.');
set(2, 'type', 'Bond, Security');
set(2, 'subjectCountry', 'Myanmar (Burma)');
set(2, 'issuingCountry', 'Myanmar (Burma)');
set(2, 'creator', 'Government of Burma');
set(2, 'currency', 'Burmese Kyat');
set(2, 'language', 'Burmese');
set(2, 'numberPages', 1);
set(2, 'period', '20th Century');
set(2, 'notes', 'Approximate date ca. 1943-1945 based on historical context of Japanese-occupied Burma');

// --- goetzmann0003 ---
set(3, 'title', '5% Vutreshen Durzaven Zaem ot 1941g. za Narodnata Otbrana (5% Internal State Loan of 1941 for National Defense, Kingdom of Bulgaria)');
set(3, 'description', 'A bearer bond issued by the Kingdom of Bulgaria ("Tsarstvo Bulgaria") for the 5% Internal State Loan of 1941, explicitly designated for national defense, valued at 5,000 leva, Series B, serial number 022882. The bond is issued under the authority of the Main Directorate of State and State-Guaranteed Debts and signed by senior officials. The document features a cream and brown color scheme with ornate circular decorations at each corner and a central panel prominently displaying the denomination of 5,000 leva alongside the 5% interest rate. Issued during World War II when Bulgaria was aligned with the Axis powers under Tsar Boris III, this bond was intended to fund military expenditure. The phrase "Na Prinositelya" (to the bearer) confirms it was a negotiable bearer instrument payable to whoever presented it.');
set(3, 'type', 'Bond, Debt, Security');
set(3, 'subjectCountry', 'Bulgaria');
set(3, 'issuingCountry', 'Bulgaria');
set(3, 'creator', 'Kingdom of Bulgaria, Main Directorate of State Debts');
set(3, 'issueDate', '1941-01-01');
set(3, 'currency', 'Bulgarian Lev');
set(3, 'language', 'Bulgarian');
set(3, 'numberPages', 1);
set(3, 'period', '20th Century');
set(3, 'notes', 'Approximate issue date; exact date not visible on document');

// --- goetzmann0004-0010: Hoe de Assurantie-Compagnie van Rotterdam (7 pages) ---
const rotterdamTitle = 'Hoe de Assurantie-Compagnie van Rotterdam kan werden gevodert, en dat niemant zou verliezen (How the Insurance Company of Rotterdam Can Be Promoted, and That No One Would Lose)';
const rotterdamDescs = [
  'The first page of a seven-page Dutch pamphlet proposing the establishment of a Rotterdam insurance company during the speculative bubble of 1720, presenting numbered articles (1 through 7) outlining how investors could participate without risk of loss. The text is set in a simple typographic style with an ornamental initial capital, characteristic of Dutch commercial printing of the early eighteenth century. This document was included in "Het Groote Tafereel der Dwaasheid" (The Great Mirror of Folly), a famous Dutch compilation documenting the speculative mania of 1720. The title\'s promise that "no one would lose" is characteristic of the optimistic—and often misleading—claims made by company promoters during this financial bubble. The pamphlet reflects the proliferation of prospectuses during this period, when hundreds of speculative ventures were promoted across the Dutch Republic.',
  'The second page of the Rotterdam insurance company pamphlet continues the numbered articles (approximately 8 through 18), detailing proposed operational rules including share subscriptions, profit distribution, and shareholder obligations. The formal regulatory language is intended to convey legitimacy to prospective investors, presenting the enterprise in legalistic terms typical of Dutch commercial documentation. As with other documents in the "Groote Tafereel" collection, the straightforward typographic presentation contrasts with the speculative nature of the venture being promoted. The numbered articles address the administrative structure and handling of claims within the proposed insurance scheme. This page illustrates how promoters during the 1720 bubble used detailed regulatory language to attract investor capital.',
  'The third page continues the Rotterdam insurance company prospectus with articles numbered approximately 19 through 27, elaborating on shareholder rights, insurance procedures, and administrative arrangements. The text reflects the conventions of early modern Dutch commercial documentation, presenting the company\'s terms in a formal legalistic manner. Issued during the height of the 1720 speculative bubble, this document typifies the flood of company proposals circulating to attract Dutch investor capital at the time. The dense typographic layout is consistent with standard Dutch printing conventions of the early eighteenth century. Like other documents in the "Groote Tafereel" collection, it serves as primary evidence of the speculative fever that gripped the Netherlands following the collapse of John Law\'s System in France.',
  'The fourth page continues the numbered articles addressing capital requirements, insurance procedures, and the management structure of the proposed Rotterdam insurance company. The text outlines the terms under which the company would operate and the protections purportedly afforded to investors within the scheme. The straightforward legal language was a common rhetorical device used by company promoters during the 1720 bubble to lend credibility to their ventures. This page is preserved in "Het Groote Tafereel der Dwaasheid" as historical evidence of one of the earliest documented speculative financial bubbles. The document illustrates the sophisticated promotional strategies employed by early modern Dutch financial entrepreneurs to attract capital.',
  'The fifth page presents additional numbered articles addressing share transfer, liability limitations, and company governance for the proposed Rotterdam insurance company. The text continues to outline proposed investor guarantees and the company\'s operational structure in formal regulatory language. Printed during the Dutch financial bubble of 1720, this document represents one of dozens of similar prospectuses that circulated during this period of intense commercial speculation. The earnest legal framing of the articles belies the inherently speculative nature of the enterprise being promoted. This page demonstrates the sophistication with which early modern Dutch financial promoters constructed their marketing schemes.',
  'The sixth page continues with numbered articles (approximately 42 through 49) covering operational details, investor rights, and the company\'s obligations to its shareholders. The document maintains the formal regulatory style typical of Dutch company charters of the early eighteenth century. Preserved in the "Groote Tafereel" collection, this pamphlet serves as primary evidence of the speculative instruments that circulated during the 1720 Dutch financial bubble. The increasing detail in the later articles reflects an effort to address potential investor concerns about the company\'s viability. This page rounds out the substantive provisions of the proposed insurance scheme before the final concluding articles.',
  'The final page concludes with articles 50 and 51, which note that investors have no formal legal obligation ("geen Obligatien") against the company, as no formal bonds were issued—only informal promises. Despite this absence of enforceable legal protections, the pamphlet maintained its promise that investors would not lose their capital. This concluding page encapsulates the paradox at the heart of many 1720 speculative ventures: elaborate documentation masking fundamentally unenforceable claims. The document was preserved in "Het Groote Tafereel der Dwaasheid" as a record of the promotional excesses of the Dutch bubble era. Its survival provides historians with direct evidence of the language and rhetoric used to attract investment during one of Europe\'s earliest modern financial crises.',
];
for (let i = 0; i < 7; i++) {
  const rowIdx = 4 + i;
  set(rowIdx, 'title', rotterdamTitle);
  set(rowIdx, 'description', 'Page ' + (i + 1) + ' of 7 – ' + rotterdamDescs[i]);
  set(rowIdx, 'type', 'Pamphlet');
  set(rowIdx, 'subjectCountry', 'Netherlands');
  set(rowIdx, 'issuingCountry', 'Netherlands');
  set(rowIdx, 'creator', 'Anonymous');
  set(rowIdx, 'issueDate', '1720-01-01');
  set(rowIdx, 'language', 'Dutch');
  set(rowIdx, 'numberPages', 7);
  set(rowIdx, 'period', '18th Century or before');
  set(rowIdx, 'notes', 'From Het Groote Tafereel der Dwaasheid (The Great Mirror of Folly), 1720');
}

// --- goetzmann0011: Conditien van de Maatschappy... Middelburg ---
set(11, 'title', 'Conditien van de Maatschappy tot het Asseureeren van Scheepen en Goederen, Binnen de Stad Middelburg (Conditions of the Company for Insuring Ships and Goods within the City of Middelburg)');
set(11, 'description', 'A single-page printed broadsheet presenting the conditions of a maritime insurance company established within the city of Middelburg in the province of Zeeland, the Netherlands, set in two columns with numbered articles covering membership, share subscriptions, claims procedures, and governance. Middelburg was a major Dutch trading port and the capital of Zeeland, making it a natural center for maritime insurance ventures during the speculative climate of 1720. The two-column layout and Roman typeface are typical of Dutch commercial printing of the early eighteenth century, and the numbered articles present the company\'s terms in a formal legalistic manner intended to convey legitimacy. This document is likely associated with the speculative companies promoted during the Dutch financial bubble of 1720 and is preserved in the "Groote Tafereel" collection. The broadsheet format and dense text suggest it was intended for public posting or distribution to prospective investors.');
set(11, 'type', 'Pamphlet, Document');
set(11, 'subjectCountry', 'Netherlands');
set(11, 'issuingCountry', 'Netherlands');
set(11, 'creator', 'Maatschappy tot het Asseureeren van Scheepen en Goederen, Middelburg');
set(11, 'issueDate', '1720-01-01');
set(11, 'language', 'Dutch');
set(11, 'numberPages', 1);
set(11, 'period', '18th Century or before');
set(11, 'notes', 'Likely from Het Groote Tafereel der Dwaasheid (1720); exact page count uncertain');

// --- goetzmann0012-0018: Reglement op de Wisselbank Binnen Utrecht (7 pages) ---
const wisselTitle = 'Reglement op de Wisselbank Binnen Utrecht (Regulations for the Exchange Bank within Utrecht), 1720';
const wisselDescs = [
  'The title page of a seven-page document establishing the Exchange Bank ("Wisselbank") within the city of Utrecht, adopted by the city council on 7 October 1720 and formally published on 11 October by Jacob van Poolsum, the official city printer ("Stads Drukker"). The page displays the Utrecht city coat of arms flanked by heraldic supporters, marking the document as an official civic publication. Exchange banks modeled on the Amsterdam Wisselbank were established in several Dutch cities during the early eighteenth century as stabilizing financial institutions for commerce. This document was issued at the height of the 1720 Dutch financial bubble, reflecting the city\'s effort to create a reliable monetary institution amid speculative chaos. The formal civic authorization underscores the role of Dutch municipal governments in regulating financial activity during the early modern period.',
  'The first text page of the Utrecht Exchange Bank regulations opens with an ornamental initial capital and the authorizing resolution of the Burgomasters and Council ("Burgemeesteren en Vroeschap") establishing a public exchange bank for the benefit of local trade, to begin operations in November 1720. The bank was to be administered by commissioners appointed from among the city council and would function as a public clearing house ("Publiequen Geld- of Wisselbank") for merchants and traders. The article establishes the civic authority under which the bank would operate and the scope of its mandate to facilitate commercial transactions in Utrecht. The formal regulatory language is consistent with comparable exchange bank charters of the period in other Dutch cities. This opening article illustrates how Dutch civic authorities sought to institutionalize financial stability during a period of intense commercial speculation.',
  'The third page details the accounting procedures of the Wisselbank, specifying the types of currencies and coin denominations accepted for deposit, including rijksdaalders, daalders, ducatoons, and guilden coins of various grades. The articles establish precise rules governing how accounts would be maintained and what currencies could be converted into standardized bank money ("Banco geld") for use in commercial transactions. These procedures demonstrate the careful attention to monetary standardization required by exchange banks to function as reliable clearing houses for merchants operating in a diverse currency environment. The formal regulatory language reflects the sophisticated monetary understanding of early modern Dutch civic administrators. This page illustrates the practical complexity of managing a multi-currency commercial economy in the Dutch Republic of the early eighteenth century.',
  'The fourth page continues the operational articles of the Wisselbank regulations, addressing procedures for account withdrawals, assignations, and the transfer of funds between account holders. Articles specify that holders wishing to make payments through the bank must appear in person or send an authorized representative, and detail the fees charged for various services including a transfer charge of six stuivers per transaction. The document exemplifies the highly procedural approach to financial regulation characteristic of Dutch civic institutions in the early modern period. These regulations served as the legal foundation for the bank\'s daily operations as a clearing house for commercial transactions in Utrecht. The emphasis on personal appearance for transfers reflects the importance of identity verification in an era before modern financial documentation.',
  'The fifth page establishes the Wisselbank\'s operating hours and schedule, specifying that commissioners would be present on Wednesday, Thursday, and Saturday mornings from nine until noon and in the afternoons, with holidays and Sundays designated as non-banking days. The articles also address the compensation of bank commissioners and bookkeepers and establish procedures for managing late arrivals to banking sessions. The precise scheduling of banking hours reflects the orderly administration of civic financial institutions in early modern Dutch cities, where reliability and predictability were essential to maintaining merchant confidence. This page illustrates the degree to which commercial life in Utrecht was supported by formal institutional frameworks with clearly defined operating procedures. The detailed scheduling provisions demonstrate the importance of structured access to financial services in the early modern economy.',
  'The sixth page addresses administrative procedures for managing account records, including requirements for authenticated signatures on all assignations and the documentation of transactions in the bank\'s ledgers. Articles specify conditions under which accounts would be maintained or closed, how abandoned balances would be handled, and the obligations of the bank\'s bookkeepers to maintain accurate double-entry records. These provisions reflect the Dutch tradition of meticulous bookkeeping that had made Amsterdam\'s financial institutions the model for European commerce throughout the seventeenth and early eighteenth centuries. The careful attention to record-keeping procedures underscores the civic authorities\' commitment to financial transparency in the newly established institution. This page demonstrates how the bureaucratic infrastructure of Dutch public banking was designed to instill confidence among depositors and users.',
  'The final page concludes the Utrecht Exchange Bank regulations with articles governing minimum deposit requirements, fee structures for non-compliance, and remedies for errors in account entries. The concluding clause specifies that no fewer than three hundred guilders must be deposited to open an account, restricting participation to merchants of substantial means. The document closes with the formal colophon signed by E.V. Harscamp as witness, confirming the provisional adoption by the Vroeschap on 1 October 1720 and official publication on 11 October 1720. This closing section confirms the official civic authorization of the bank and the formal legal standing of the regulations. The document stands as a key primary source for understanding how Dutch municipal authorities sought to institutionalize financial regulation during the turbulent speculative climate of 1720.',
];
for (let i = 0; i < 7; i++) {
  const rowIdx = 12 + i;
  set(rowIdx, 'title', wisselTitle);
  set(rowIdx, 'description', 'Page ' + (i + 1) + ' of 7 – ' + wisselDescs[i]);
  set(rowIdx, 'type', 'Document');
  set(rowIdx, 'subjectCountry', 'Netherlands');
  set(rowIdx, 'issuingCountry', 'Netherlands');
  set(rowIdx, 'creator', 'Vroeschap der Stadt Utrecht');
  set(rowIdx, 'issueDate', '1720-10-11');
  set(rowIdx, 'language', 'Dutch');
  set(rowIdx, 'numberPages', 7);
  set(rowIdx, 'period', '18th Century or before');
  set(rowIdx, 'notes', 'Printed by Jacob van Poolsum, Stads Drukker, Utrecht; established 7 October, published 11 October 1720');
}

// --- goetzmann0019: Inventaris van de Effecten, behorende aan de Colonie de Barbice ---
set(19, 'title', 'Inventaris van de Effecten, behorende aan de Colonie de Barbice (Inventory of Assets Belonging to the Colony of Berbice)');
set(19, 'description', 'A Dutch inventory document listing the assets ("effecten") of the Colony of Berbice (present-day Guyana), including 895 enslaved people described as large and small ("groote en kleyne Slaven"), cacao plantations, Fort Nassau, military equipment including sixty cannon pieces, ships, weapons, livestock, medical supplies, and a church. The document is formatted as a numbered list of asset categories with quantities and estimated values, reflecting the bookkeeping conventions of Dutch colonial enterprise. The page number 574 visible at the bottom indicates this is an extract from a larger bound volume, likely related to speculative colonial investment promoted during the 1720 Dutch financial bubble. Berbice was a Dutch colony on the northern coast of South America administered under a chartered company structure, and this inventory reflects the entanglement of colonial enterprise, enslaved labor, and early modern financial speculation. The document is a stark record of the commodification of enslaved people alongside material assets in Dutch colonial accounting.');
set(19, 'type', 'Document');
set(19, 'subjectCountry', 'Guyana');
set(19, 'issuingCountry', 'Netherlands');
set(19, 'creator', 'Colony of Berbice / Dutch West India Company');
set(19, 'issueDate', '1720-01-01');
set(19, 'language', 'Dutch');
set(19, 'numberPages', 1);
set(19, 'period', '18th Century or before');
set(19, 'notes', 'Extract from larger bound volume (page 574); likely from Het Groote Tafereel der Dwaasheid (1720) or related colonial prospectus');

// --- goetzmann0020-0026: Project tot het ruineeren der Turkze Rovers (7 images; total pages TBD) ---
const turkzeTitle = 'Project tot het ruineeren der Turkze Rovers van Miers, Tunis, Tripoly en Sale (Project for the Ruin of the Turkish Pirates of Algiers, Tunis, Tripoli and Sale)';
const turkzeDescs = [
  'The title page of a Dutch pamphlet proposing a project to eliminate ("ruineeren") the Barbary pirates ("Turkze Rovers") of Algiers, Tunis, Tripoli, and Sale, framed as beneficial not only for the security of Dutch shipping but also for the expansion of navigation and commerce across these trade routes. The title emphasizes dual objectives: protecting Dutch merchant vessels from North African piracy and freeing Dutch captive subjects held in the Barbary states. The document is addressed to the States General and other authorities of the Dutch Republic, presenting the project as a matter of national economic and humanitarian interest. Barbary piracy had long posed a serious threat to European Mediterranean and Atlantic trade, and numerous proposals for its suppression circulated in the early eighteenth century. This pamphlet represents the intersection of Dutch commercial ambition, maritime security concerns, and the speculative project culture of the 1720 period.',
  'The first text page opens with an elaborate summary of the problem of Barbary piracy and its devastating impact on Dutch trade with Africa, the Canary Islands, France, England, and the Levant. The author argues that the Dutch Republic\'s failure to suppress North African piracy has resulted in significant economic losses and the enslavement of Dutch citizens in the Barbary states. The text details the geographic scope of the problem, encompassing pirates operating from Algiers, Tunis, Tripoli, and Sale along the North African coast. A set of proposals is introduced, promising to neutralize the pirate threat through a combination of diplomatic pressure and direct military action. The ambitious scope of the project reflects the entrepreneurial spirit of the 1720 Dutch bubble era, in which sweeping proposals for commercial and colonial ventures were routinely promoted.',
  'The second text page continues the argument for the anti-piracy project, elaborating on the methods by which Barbary pirates could be defeated and their operational bases neutralized through coordinated naval action. The author draws on knowledge of North African geography, diplomatic relations, and naval strategy to present a credible case for the project\'s feasibility and potential for success. Specific proposals address how to organize a combined force, engage local allies, and compel the Barbary states to release Dutch captives and cease hostilities against Dutch merchant shipping. The text reflects the early eighteenth-century Dutch Republic\'s self-image as a leading commercial and maritime power capable of projecting force in distant regions. The detailed argumentation is characteristic of the policy pamphlet genre that flourished in the Netherlands during this period of active commercial expansion.',
  'The third text page advances the proposal with arguments about the commercial benefits that would flow from the suppression of Barbary piracy, including the opening of new trade routes to Africa and the Levant and the restoration of confidence among Dutch merchants. The author addresses potential objections to the project, including its cost and diplomatic complications, and argues that the long-term economic gains would far outweigh the initial investment required. Specific reference is made to the potential for establishing Dutch commercial relationships with formerly inaccessible African markets once piracy is neutralized. The text exemplifies the optimistic commercial reasoning that characterized Dutch speculative projects of the early eighteenth century. This page reinforces the pamphlet\'s dual character as both a practical policy proposal and a promotional document for potential investors.',
  'The fourth text page addresses the military logistics of mounting an effective campaign against the Barbary states and the potential for coordinating action with other European powers, including France, England, and Spain. The author argues that a combined European effort would be more effective than unilateral Dutch action and would distribute the costs of the campaign among multiple beneficiary nations. Specific proposals for financing the project are introduced, framed in terms of the commercial returns that investors and participating states could expect from a successful campaign. The text reflects the early modern European discourse on collective security against North African piracy, a topic that had engaged diplomatic and military thinkers since the sixteenth century. This page illustrates the intersection of commercial, strategic, and diplomatic reasoning characteristic of early eighteenth-century Dutch policy thought.',
  'The fifth text page presents further strategic arguments with detailed discussion of the economic losses suffered by Dutch merchants and the potential gains from successful piracy suppression, including expanded access to Mediterranean and West African trade. The author elaborates on the proposed financial structure of the venture, suggesting mechanisms for recovering campaign costs through expanded trade revenues and the confiscation of pirate assets. The text addresses the political dimensions of the project, including the need for authorization from the States General and coordination with Dutch diplomatic representatives in North Africa and the Mediterranean. The pamphlet\'s combination of commercial, financial, and strategic arguments reflects the multidimensional nature of Dutch colonial and commercial proposals during the 1720 bubble era. This page demonstrates the author\'s effort to make the anti-piracy project attractive to a broad audience of merchants, investors, and policymakers.',
  'The sixth text page continues with discussion of the geopolitical context, including the relationship between Barbary piracy and Ottoman power in the Mediterranean, and evaluates prospects for negotiating treaties with the Barbary states as an alternative or complement to military action. The author addresses precedents for European-Barbary negotiations and the conditions under which the pirates might be persuaded to cease hostilities against Dutch shipping through diplomatic channels. Specific reference is made to prior European attempts to negotiate with Algiers, Tunis, and Tripoli and the lessons to be drawn from those experiences. The text reflects the sophisticated understanding of Mediterranean geopolitics that characterized Dutch commercial and diplomatic thought in the early eighteenth century. This page rounds out the strategic section of the pamphlet; subsequent pages are expected to present the concluding proposals and financial terms of the project.',
];
for (let i = 0; i < 7; i++) {
  const rowIdx = 20 + i;
  set(rowIdx, 'title', turkzeTitle);
  set(rowIdx, 'description', 'Page ' + (i + 1) + ' of [TBD] – ' + turkzeDescs[i]);
  set(rowIdx, 'type', 'Pamphlet');
  set(rowIdx, 'subjectCountry', 'Netherlands');
  set(rowIdx, 'issuingCountry', 'Netherlands');
  set(rowIdx, 'creator', 'Anonymous');
  set(rowIdx, 'issueDate', '1720-01-01');
  set(rowIdx, 'language', 'Dutch');
  set(rowIdx, 'period', '18th Century or before');
  set(rowIdx, 'notes', 'Multi-page pamphlet; total page count to be confirmed in next batch. Likely from Het Groote Tafereel der Dwaasheid (1720) or related collection.');
}

// Write back
const newWs = xlsx.utils.aoa_to_sheet(data);
newWs['!cols'] = ws['!cols'];
wb.Sheets['Documents'] = newWs;
xlsx.writeFile(wb, path);
console.log('Done. Updated rows 1-26 (goetzmann0001-0026).');
