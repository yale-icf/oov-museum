# Intake documents that may already be in the collection

## Why this list exists

The September 2026 intake was bucketed by **ID** — does `goetzmann<NNNN>` already
exist? That test cannot see the case that actually matters: a **brand-new id
holding a document the collection already has under a different id**.

Four have been found so far, and all four were the same shape — the live record
was a scan of **page 1 only**, and the intake supplied the whole document:

| live record | intake | leaves now |
|---|---|---|
| `1035` French Royal 3% Rente, 1761 | `1300`–`1304` | 5 |
| `1033` Compagnie des Indes Life-Annuity, 1726 | `1305`–`1308` | 4 |
| `0426` Reconstitution of a French Royal 3% Rente, 1763 | `1309`–`1313` | 5 |
| `0465` Royal Tontine on the Edict of August 1734, 2nd class | `1317`–`1321` | 5 |

Each also corrected the live record: `1035` had the identifier **No. 46460** when
the plate reads **No. 2340**; `1033` carried notes describing a different
document entirely; `0465` was dated to the **edict year 1734** when the contract
is of **1736**.

## ⚠️ Two sweeps, and the picture one is primary

`0465` ← `1317` was **missed by the text sweep** — the vendor's row and the live
description shared too few rare words to clear the threshold. It was found by
comparing the **pictures**. Text matching alone is not safe.

| tool | what it compares | run it |
|---|---|---|
| **`scratchpad/image-dupe-sweep.js`** — primary | a 16×16 mean-centred grey signature of the intake's first leaf against every live record's thumbnail | `node scratchpad/image-dupe-sweep.js` |
| `scratchpad/find-intake-dupes.py` — secondary | weighted rare-word overlap between the master sheet's row and the live record's text | `py scratchpad/find-intake-dupes.py` |

All four confirmed merges scored **0.910 – 0.990** on the image sweep. Treat
**≥ 0.90 as needing a look before anything else**, and check 0.85–0.90 too;
below that the matches are mostly documents that merely share a layout.

## What to do with a hit

Compare the intake plate against the live record's own image first —
`node scratchpad/reconstruct.js <live id>` rebuilds it full-res from its tiles.

- **Same physical sheet, live record shorter** → *merge*, do not create a record.
  `scratchpad/merge-intake-into-live.py` / `merge-pass2.py` show the pattern:
  retile the live id from the intake's larger master, set `pages` to the live id
  plus the remaining leaves, rewrite title/description/notes/identifiers in **both
  the JSON and the workbook** (Excel wins on the next round-trip), append a
  workbook row per new leaf, then `upload-tiles.js` the live id and
  `purge-tiles.js` the orphan. Record the orphan in `scratchpad/consumed.json`.
- **Different objects of the same issue** → two records, titles split by year or
  serial, per the multiples convention.
- **Same object, the live scan is as good or better** → leave the live record
  alone and retire the intake id.

## Candidates

`img` is the image-sweep score, `txt` the text-sweep score where it also fired.

- **`1466`** (1 lv) img **0.990** → `0538` Habsburg Imperial Obligation (Deutz Loan), Amsterdam, 1736
  - sheet: (no title)
- **`1456`** (1 lv) img **0.983** → `0537` Kingdom of Sweden Royal Loan Bond (Amsterdam), 1784
  - sheet: (no title)
- **`1423`** (1 lv) img **0.981** → `0533` Suriname Plantation Loan Conditions, 1760
  - sheet: (no title)
- **`1486`** (1 lv) img **0.979** → `0545` Conditions of the Daniel Changuion Plantation Loan, Essequibo and 
  - sheet: (no title)
- **`1408`** (5 lv) img **0.976** → `0608` Stolkert Surinam Plantation Mortgage to Du Plessis & Taunay, Amste, txt 0.34
  - sheet: Frederik Cornelis Stolkert Colonial Plantation Mortgage — 5% Obligation No. 139, 1777
- **`1780`** (1 lv) img **0.976** → `0485` Notarial Register of a French Crown Life-Annuity Loan, 1787, txt 0.57
  - sheet: French Royal Life-Annuity Loan Contract, Directors Pieter Stadnitski & Hendrik Vollenhoven — Amsterd
- **`1446`** (1 lv) img **0.973** → `0607` Suriname Plantation Negotiatie Conditions, 1765
  - sheet: (no title)
- **`1539`** (2 lv) img **0.971** → `0427` Reichsbank 1,000-Mark Reichsbanknote, Berlin, 1910
  - sheet: German Reichsbank 1,000 Mark banknote
- **`1442`** (1 lv) img **0.964** → `0606` Dutch Life-Annuity Tontine Conditions, 1687
  - sheet: (no title)
- **`1482`** (1 lv) img **0.962** → `0544` Changuion Plantation Mortgage Loan, Essequibo & Demerara, 1816
  - sheet: (no title)
- **`1478`** (1 lv) img **0.960** → `0491` Compagnie des Indes Life Annuity, 1725
  - sheet: (no title)
- **`1401`** (1 lv) img **0.956** → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxha, txt 0.66
  - sheet: Vauxhall Plantation Mortgage, Dominica — 5% Obligation No. 38, 1777
- **`1463`** (1 lv) img **0.956** → `0476` Eendracht Polder Bond, Zaamslag (Zeeland) Bond, 1779
  - sheet: (no title)
- **`1375`** (1 lv) img **0.948** → `0681` Republic of Texas Consolidated Fund Stock Certificate, 1840
  - sheet: Republic of Texas 10% Consolidated Fund Certificate, 1840
- **`1468`** (1 lv) img **0.941** → `0538` Habsburg Imperial Obligation (Deutz Loan), Amsterdam, 1736
  - sheet: (no title)
- **`1460`** (1 lv) img **0.941** → `0603` Suriname Plantation Fund Conditions, 1785
  - sheet: (no title)
- **`1673`** (2 lv) img **0.938** → `0292` Baltimore and Ohio Railroad Company Common Stock, 1934, txt 0.29 → `0293`
  - sheet: Baltimore and Ohio Railroad Company Stock Certificate, 1935, No. D264139
- **`1426`** (1 lv) img **0.937** → `0535` "Voor den Armen" Charitable Bond, City of Haarlem, 1805
  - sheet: (no title)
- **`1702`** (1 lv) img **0.933** → `0614` German External Loan 1924 (Dawes Loan), Swiss Issue — Funding Bond, txt 0.43
  - sheet: German External Loan 1924 (Dawes Loan), Swiss Issue Funding Certificate, 1953 — No. 8691
- **`1775`** (1 lv) img **0.929** → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxha, txt 0.47 → `0042`
  - sheet: Surinam Plantations Alsimo (Warapper-Creek and Edenburg)1793, No. 28
- **`1366`** (5 lv) img **0.925** → `0228` Dutch Bond for the French Bourbon Princes in Exile, 1793, txt 0.42
  - sheet: Dutch loan to the pretender to the French Throne, 1793
- **`1402`** (1 lv) img **0.924** → `0608` Stolkert Surinam Plantation Mortgage to Du Plessis & Taunay, Amste, txt 0.40 → `0609`
  - sheet: Vauxhall Plantation Mortgage, Dominica — 5% Obligation No. 38, 1777
- **`1216`** (2 lv) img **0.921** → `0452` Spassky Copper Mine Share Warrant, London, 1917
  - sheet: The Spassky Copper Mine, Limited — Share Warrant to Bearer, 1913
- **`1413`** (1 lv) img **0.920** → `0534` Vlaardingen Orphanage Lottery Loan Conditions, 1800, txt 0.98 → `0549`
  - sheet: Vlaardingen Orphanage Lottery and Life-Annuity Fund — 1800
- **`1715`** (1 lv) img **0.916** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: Associated Gas and Electric Company, Certificaat voor Tien Aandeelen Class A Stock Serial No. 37495
- **`1774`** (1 lv) img **0.907** → `0042` Fahraeus & Laurin Suriname Plantation Negotiatie Participation, Am, txt 0.47
  - sheet: Surinam Plantations Alsimo (Warapper-Creek and Edenburg)1793, No. 28
- **`1766`** (1 lv) img **0.892** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: The Fisk Rubber Company 1926 No. 0944
- **`1712`** (1 lv) img **0.888** → `0004` Societeit der Plantagiën Beekenhorst en Egmond Share, Amsterdam, 1
  - sheet: Gewerkschaft Consolidirte Wenceslaus Grube, 5% Kohlenwertanleihe, Serie II, Teilschuldverschreibung 
- **`1452`** (1 lv) img **0.885** → `0608` Stolkert Surinam Plantation Mortgage to Du Plessis & Taunay, Amste
  - sheet: (no title)
- **`1475`** (1 lv) img **0.882** → `0610` Banco Territorial de Cuba (Crédit Foncier Cubain) Bearer Bond, Hav
  - sheet: (no title)
- **`1756`** (1 lv) img **0.881** → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxha
  - sheet: Frans de Wilde Surinam Plantation Mortgage Bond No. 109 1770
- **`1749`** (1 lv) img **0.879** → `0608` Stolkert Surinam Plantation Mortgage to Du Plessis & Taunay, Amste
  - sheet: Negotiatie op de Bank van Leening of Lombard, der Stad Amsterdam — Amsterdam Municipal Pawnbank Loan
- **`1322`** (2 lv) img **0.873** → `0500` Share Subscription Contract for the Ostend Company, 1729
  - sheet: Keyserlijcke Indische Compagnie (Ostend Company) Share Option Contract — Antwerp, 1730
- **`1711`** (1 lv) img **0.868** → `1144` Banque de Commerce Russo-Française Share, St. Petersburg, 1912
  - sheet: Gewerkschaft Consolidirte Wenceslaus Grube, 5% Kohlenwertanleihe, Serie II, Teilschuldverschreibung 
- **`1453`** (1 lv) img **0.867** → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxha
  - sheet: (no title)
- **`1583`** (2 lv) img **0.864** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: Detroit Aircraft Corporation
- **`1731`** (1 lv) img **0.861** → `0220` Alexander Hamilton Treasury Circular on Subscription of State Debt
  - sheet: N.V. Cultuurmaatschappij Vereenigde Lawoe-Ondernemingen — Certificate for Common Shares, f1,000 (red
- **`1784`** (1 lv) img **0.861** → `0001` Austrian Republic State Treasury Note, Vienna, 1920, txt 0.31 → `0454`
  - sheet: Austrian Eighth War Loan 5½% Treasury Certificate for 1,000 Kronen, 1918 — No. 032804
- **`1750`** (1 lv) img **0.861** → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxha
  - sheet: Negotiatie op de Bank van Leening of Lombard, der Stad Amsterdam — Amsterdam Municipal Pawnbank Loan
- **`1738`** (1 lv) img **0.860** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: Associated Gas and Electric Company — Certificate for 10 Class A Shares, No. 3280 (1928/1933)
- **`1651`** (2 lv) img **0.860** → `0432` Russian General Oil Corporation Share Warrant to Bearer, London, 1
  - sheet: The Russian General Oil Corporation — 25-Share Warrant, 1913, No. C35871
- **`1740`** (1 lv) img **0.855** → `0433` Imperial Russian Government State Rente Certificate, St. Petersbur
  - sheet: Associated Gas and Electric Company — Certificate for 10 Class A Shares, No. 3280 (1928/1933)
- **`1609`** (2 lv) img **0.854** → `0427` Reichsbank 1,000-Mark Reichsbanknote, Berlin, 1910, txt 0.44 → `0515`
  - sheet: Dutch Lottery Loan, 1870
- **`1694`** (1 lv) img **0.853** → `0003` Bulgarian Internal State Loan for National Defense, 1941, txt 0.35 → `0530`
  - sheet: Province of Westphalia 20-Zentner Rye Mortgage Bond (Roggen-Pfandbrief), 1923 — No. 665
- **`1723`** (1 lv) img **0.851** → `0469` Unilever N.V. Option Certificate, 1937, txt 0.34 → `0346`
  - sheet: St. Louis–San Francisco Railway Company — Certificate for 10 Common Shares, $1,000, No. 2133 (1917/1
- **`1762`** (1 lv) img **0.849** → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxha, txt 0.25 → `0631`
  - sheet: 5% Russian Fund Certificate in Silver 1825 No. 263
- **`1683`** (1 lv) img **0.848** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: Associated Gas and Electric Company Cumulative Preference Stock Certificate, 1931 — No. 0374
- **`1403`** (5 lv) img **0.847** → `1292` De Vyver Plantation Mortgage Loan Share, Essequibo, 1789, txt 1.00
  - sheet: De Vyver Plantation Mortgage Loan, Essequibo — 6% Loan, 1789
- **`1467`** (1 lv) img **0.846** → `0476` Eendracht Polder Bond, Zaamslag (Zeeland) Bond, 1779
  - sheet: (no title)
- **`1755`** (1 lv) img **0.844** → `1292` De Vyver Plantation Mortgage Loan Share, Essequibo, 1789
  - sheet: Frans de Wilde Surinam Plantation Mortgage Bond No. 109 1770
- **`1487`** (1 lv) img **0.842** → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxha
  - sheet: (no title)
- **`1788`** (1 lv) img **0.842** → `0433` Imperial Russian Government State Rente Certificate, St. Petersbur, txt 0.40 → `0530`
  - sheet: Central-Landschaft 5% Rye Mortgage Bond for 10 Zentner of Rye, 1923 — No. 868967
- **`1791`** (1 lv) img **0.842** → `0427` Reichsbank 1,000-Mark Reichsbanknote, Berlin, 1910
  - sheet: Municipality of Ilmenau 6% Coke-Value Loan for 20 Zentner of Coke, 1923 — No. 0031
- **`1380`** (2 lv) img **0.841** → `0489` Hollandsche Garantie- & Trust Compagnie German Reich Certificate, , txt 0.37 → `0459`
  - sheet: Galveston, Houston and Henderson Rail Road Company Bond
- **`1553`** (1 lv) img **0.832** → `0232` American & British Securities Company Common Stock Certificate, 19
  - sheet: The Peoples Bank and Trust Company Stock Certificate, 1915
- **`1496`** (1 lv) img **0.832** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: (no title)
- **`1708`** (1 lv) img **0.829** → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxha
  - sheet: Gewerkschaft Consolidirte Wenceslaus Grube, 5% Kohlenwertanleihe, Serie IV, Teilschuldverschreibung 
- **`1550`** (3 lv) img **0.825** → `0236` Acts of Parliament: South-Sea Company, London, 1722
  - sheet: British Act concerning the South Sea Company, 1751.
- **`1787`** (1 lv) img **0.822** → `0433` Imperial Russian Government State Rente Certificate, St. Petersbur, txt 0.40 → `0530`
  - sheet: Central-Landschaft 5% Rye Mortgage Bond for 50 Zentner of Rye, 1923 — No. 515635
- **`1792`** (1 lv) img **0.822** → `0433` Imperial Russian Government State Rente Certificate, St. Petersbur, txt 0.40 → `0530`
  - sheet: Central-Landschaft 5% Rye Mortgage Bond for 20 Zentner of Rye, 1923 — No. 633858
- **`1703`** (1 lv) img **0.821** → `1144` Banque de Commerce Russo-Française Share, St. Petersburg, 1912
  - sheet: Gewerkschaft Consolidirte Wenceslaus Grube, 5% Kohlenwertanleihe, Serie III, Teilschuldverschreibung
- **`1751`** (1 lv) img **0.820** → `0537` Kingdom of Sweden Royal Loan Bond (Amsterdam), 1784
  - sheet: Negotiatie op de Bank van Leening of Lombard, der Stad Amsterdam — Amsterdam Municipal Pawnbank Loan
- **`1471`** (1 lv) img **0.818** → `0618` German Government International Loan (Young Plan) Dollar Gold Bond
  - sheet: (no title)
- **`1444`** (1 lv) img **0.815** → `1292` De Vyver Plantation Mortgage Loan Share, Essequibo, 1789
  - sheet: (no title)
- **`1763`** (1 lv) img **0.814** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: Consolidated Railway Lighting and Refrigerating Company 1805 No. 2773
- **`1741`** (1 lv) img **0.814** → `0614` German External Loan 1924 (Dawes Loan), Swiss Issue — Funding Bond
  - sheet: Associated Gas and Electric Company — Certificate for 10 Class A Shares, No. 3280 (1928/1933)
- **`1447`** (1 lv) img **0.814** → `0476` Eendracht Polder Bond, Zaamslag (Zeeland) Bond, 1779
  - sheet: (no title)
- **`1457`** (1 lv) img **0.813** → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxha
  - sheet: (no title)
- **`1790`** (1 lv) img **0.813** → `0530` Hessian Rye Loan Bond, 1923
  - sheet: Municipality of Ilmenau 6% Coke-Value Loan for 20 Zentner of Coke, 1923 — No. 0031
- **`1704`** (1 lv) img **0.810** → `0427` Reichsbank 1,000-Mark Reichsbanknote, Berlin, 1910
  - sheet: Gewerkschaft Consolidirte Wenceslaus Grube, 5% Kohlenwertanleihe, Serie IV, Teilschuldverschreibung 
- **`1425`** (1 lv) img **0.809** → `0537` Kingdom of Sweden Royal Loan Bond (Amsterdam), 1784
  - sheet: (no title)
- **`1451`** (1 lv) img **0.809** → `0228` Dutch Bond for the French Bourbon Princes in Exile, 1793
  - sheet: (no title)
- **`1761`** (1 lv) img **0.808** → `0520` Hope & Co. Russian Silver Certificate, Amsterdam, 1857, txt 0.25 → `0631`
  - sheet: 5% Russian Fund Certificate in Silver 1825 No. 263
- **`1434`** (1 lv) img **0.807** → `0608` Stolkert Surinam Plantation Mortgage to Du Plessis & Taunay, Amste
  - sheet: (no title)
- **`1533`** (1 lv) img **0.806** → `0614` German External Loan 1924 (Dawes Loan), Swiss Issue — Funding Bond, txt 0.52 → `0356`
  - sheet: Kingdom of Italy Public Debt Certificate
- **`1585`** (3 lv) img **0.805** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: Central States Electric Corporation
- **`1607`** (2 lv) img **0.801** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: Chicago, Milwaukee, St. Paul and Pacific Railroad Company preferred stock certificate and dividend s

### Text-sweep hits with no strong image match

Lower priority, but a different issue of the same loan is still worth knowing about.

- **`1305`** (4 lv) txt 1.00 → `1033` Compagnie des Indes Life-Annuity Contract, Paris, 1726
  - sheet: Compagnie des Indes Life-Annuity Contract, Paris
- **`1371`** (2 lv) txt 1.00 → `0235` Anglo-Argentine Tramways Company Debenture Stock Certificate, Lond
  - sheet: Anglo-Argentine Tramways Company Limited
- **`1373`** (2 lv) txt 1.00 → `0345` State of South Carolina Consolidation Bond, 1872
  - sheet: Consolidation Bond
- **`1641`** (1 lv) txt 0.95 → `1285` St. Croix Plantation Loan Conversion Share, Amsterdam, 1778
  - sheet: 1772 St. Croix Plantation Life-Annuity Receipt — 1,000 Guilders, No. 22
- **`1400`** (1 lv) txt 0.66 → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxha
  - sheet: Vauxhall Plantation Mortgage, Dominica — 5% Obligation No. 38, 1777
- **`1746`** (1 lv) txt 0.64 → `0407` Norwich & Worcester Rail Road Company Bond, 1877
  - sheet: Hartford and New Haven Rail Road Company Stock Certificate
- **`1747`** (1 lv) txt 0.64 → `0407` Norwich & Worcester Rail Road Company Bond, 1877
  - sheet: Hartford and New Haven Rail Road Company Stock Certificate
- **`1742`** (1 lv) txt 0.61 → `0394` Little Miami Rail Road Company Share Certificate, 1862
  - sheet: New-York and New-Haven Rail-Road Company Stock Certificate
- **`1743`** (1 lv) txt 0.61 → `0394` Little Miami Rail Road Company Share Certificate, 1862
  - sheet: New-York and New-Haven Rail-Road Company Stock Certificate
- **`1781`** (1 lv) txt 0.57 → `0485` Notarial Register of a French Crown Life-Annuity Loan, 1787
  - sheet: French Royal Life-Annuity Loan Contract, Directors Pieter Stadnitski & Hendrik Vollenhoven — Amsterd
- **`1782`** (1 lv) txt 0.57 → `0485` Notarial Register of a French Crown Life-Annuity Loan, 1787
  - sheet: French Royal Life-Annuity Loan Contract, Directors Pieter Stadnitski & Hendrik Vollenhoven — Amsterd
- **`1783`** (1 lv) txt 0.57 → `0485` Notarial Register of a French Crown Life-Annuity Loan, 1787
  - sheet: French Royal Life-Annuity Loan Contract, Directors Pieter Stadnitski & Hendrik Vollenhoven — Amsterd
- **`1700`** (1 lv) txt 0.55 → `0613` Denver & Rio Grande Railway Dutch Bearer Certificate, Amsterdam, 1
  - sheet: Denver & Rio Grande Spoorweg-Maatschappij Common Stock Certificate, 1911 — No. 29546
- **`1701`** (1 lv) txt 0.55 → `0613` Denver & Rio Grande Railway Dutch Bearer Certificate, Amsterdam, 1
  - sheet: Denver & Rio Grande Spoorweg-Maatschappij Common Stock Certificate, 1911 — No. 29546
- **`1342`** (2 lv) txt 0.54 → `0630` Hope & Co. Certificate of Russian Bank Assignations, Amsterdam, 18
  - sheet: Russian 6% Government Funds Certificate, 1824
