# Intake documents that are already in the collection

## What this turned out to be

The September 2026 intake was bucketed by **ID** — does `goetzmann<NNNN>` already
exist? That cannot see the case that matters: a **brand-new id holding a document
the collection already has under a different id**.

A large part of the 1200–1799 range turned out to be exactly that. It is **the
collection itself, re-photographed** at about 1.5× linear (2.3× area) and, unlike
the originals, **in full** — the live records are overwhelmingly scans of the
**first leaf only**.

**23 documents merged**, and the record count never moved (609). Several merges
also corrected the live record: `1035`'s identifier was *No. 46460* when the
plate reads **No. 2340**; `1033`'s notes described a different document entirely;
`0465` was dated to the **edict year 1734** when the contract is **1736**.

## ⚠️ Detect by PICTURE, not by words

Text matching **missed** `0465`←`1317` outright, and I came within one document
of duplicating `0426`.

| tool | compares | run |
|---|---|---|
| **`scratchpad/image-dupe-sweep.js`** — primary | 16×16 mean-centred grey signature of each intake first leaf vs every live thumbnail | `node scratchpad/image-dupe-sweep.js` |
| `scratchpad/find-intake-dupes.py` — secondary | weighted rare-word overlap | `py scratchpad/find-intake-dupes.py` |
| `scratchpad/dupe-contact.js` — **always** | builds side-by-side plates to look at | `node scratchpad/dupe-contact.js 0.90` |

Confirmed merges scored **0.91–0.99**. But ⚠️ **the sweep over-fires on
stereotyped printed forms** — the Dutch plantation obligations are one printed
sheet with different manuscript, so several intake ids can score >0.88 against
one record. **A score is never a verdict. Look at the plates.**

Three of the last four hits above 0.90 turned out to be genuine **multiples**,
not duplicates: `0614` is 200 Swiss francs against `1702`'s 20 pounds sterling;
`0292` is 100 shares against `1673`'s 10; `0452` and `1216` are Spassky warrants
of different dates.

## Three modes, and choosing the wrong one loses a leaf

- **retile** — the live image is the *same leaf* as the intake's first. Retile the
  live id from the larger master, attach the rest as pages.
- **append** — the live image is a *different view* of the same object (`0618`'s
  scan is the bond's reverse, `1470` its face). Retiling would **discard** a leaf
  the intake lacks. Keep the live image; add the intake leaves after it.
- **retire** — same object, but the intake scan is **worse** (`1539` is 894×515
  against `0427`'s 3024×1752). Merge nothing; record the id as consumed.

Then `upload-tiles.js` the live id and `purge-tiles.js` the orphan. ⚠️ **Only the
FIRST leaf is orphaned** — the attached leaves are now live pages.
`purge-tiles.js` refused a 23-id list for exactly this reason and was right to.

Scripts: `merge-intake-into-live.py`, `merge-pass2.py`, `merge-pass3.py`,
`merge-pass4.py`. Consumed ids: `scratchpad/consumed.json`.

## ⚠️ The 1414–1499 block has no spreadsheet rows

86 images, no rows, therefore no `Page N` markers, so `group-range.py` made
**every leaf its own "document"**. They are the leaves of far fewer documents,
scanned in id order. `node scratchpad/sheet-strip.js <lo> <hi>` lays a range out
so the breaks can be read off the plates; `node scratchpad/map-norow.js` anchors
runs to live records. **Only extents confirmed by eye have been merged.**

## Candidates still open

`img` is the image-sweep score. Ids already folded in are not listed.

- **`1673`** (2 lv) img **0.938** → `0292` Baltimore and Ohio Railroad Company Common Stock, 1934
  - sheet: Baltimore and Ohio Railroad Company Stock Certificate, 1935, No. D264139
- **`1702`** (1 lv) img **0.933** → `0614` German External Loan 1924 (Dawes Loan), Swiss Issue — Funding Bond
  - sheet: German External Loan 1924 (Dawes Loan), Swiss Issue Funding Certificate, 1953 — No. 8691
- **`1216`** (2 lv) img **0.921** → `0452` Spassky Copper Mine Share Warrant, London, 1917
  - sheet: The Spassky Copper Mine, Limited — Share Warrant to Bearer, 1913
- **`1715`** (1 lv) img **0.916** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: Associated Gas and Electric Company, Certificaat voor Tien Aandeelen Class A Stock Serial No. 37495
- **`1774`** (1 lv) img **0.907** → `0042` Fahraeus & Laurin Suriname Plantation Negotiatie Participation, Am
  - sheet: Surinam Plantations Alsimo (Warapper-Creek and Edenburg)1793, No. 28
- **`1766`** (1 lv) img **0.892** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: The Fisk Rubber Company 1926 No. 0944
- **`1451`** (1 lv) img **0.892** → `0228` Dutch Bond for the French Bourbon Princes in Exile, 1793
  - sheet: (no spreadsheet row)
- **`1712`** (1 lv) img **0.888** → `0004` Societeit der Plantagiën Beekenhorst en Egmond Share, Amsterdam, 1
  - sheet: Gewerkschaft Consolidirte Wenceslaus Grube, 5% Kohlenwertanleihe, Serie II, Teilschuldverschreibung 
- **`1452`** (1 lv) img **0.885** → `0537` Kingdom of Sweden Royal Loan Bond (Amsterdam), 1784
  - sheet: (no spreadsheet row)
- **`1322`** (2 lv) img **0.873** → `0500` Share Subscription Contract for the Ostend Company, 1729
  - sheet: Keyserlijcke Indische Compagnie (Ostend Company) Share Option Contract — Antwerp, 1730
- **`1711`** (1 lv) img **0.868** → `1144` Banque de Commerce Russo-Française Share, St. Petersburg, 1912
  - sheet: Gewerkschaft Consolidirte Wenceslaus Grube, 5% Kohlenwertanleihe, Serie II, Teilschuldverschreibung 
- **`1749`** (1 lv) img **0.868** → `0608` Stolkert Surinam Plantation Mortgage to Du Plessis & Taunay, Amste
  - sheet: Negotiatie op de Bank van Leening of Lombard, der Stad Amsterdam — Amsterdam Municipal Pawnbank Loan
- **`1583`** (2 lv) img **0.864** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: Detroit Aircraft Corporation
- **`1775`** (1 lv) img **0.863** → `0608` Stolkert Surinam Plantation Mortgage to Du Plessis & Taunay, Amste
  - sheet: Surinam Plantations Alsimo (Warapper-Creek and Edenburg)1793, No. 28
- **`1731`** (1 lv) img **0.861** → `0220` Alexander Hamilton Treasury Circular on Subscription of State Debt
  - sheet: N.V. Cultuurmaatschappij Vereenigde Lawoe-Ondernemingen — Certificate for Common Shares, f1,000 (red
- **`1784`** (1 lv) img **0.861** → `0001` Austrian Republic State Treasury Note, Vienna, 1920
  - sheet: Austrian Eighth War Loan 5½% Treasury Certificate for 1,000 Kronen, 1918 — No. 032804
- **`1738`** (1 lv) img **0.860** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: Associated Gas and Electric Company — Certificate for 10 Class A Shares, No. 3280 (1928/1933)
- **`1651`** (2 lv) img **0.860** → `0432` Russian General Oil Corporation Share Warrant to Bearer, London, 1
  - sheet: The Russian General Oil Corporation — 25-Share Warrant, 1913, No. C35871
- **`1403`** (5 lv) img **0.857** → `0608` Stolkert Surinam Plantation Mortgage to Du Plessis & Taunay, Amste
  - sheet: De Vyver Plantation Mortgage Loan, Essequibo — 6% Loan, 1789
- **`1740`** (1 lv) img **0.855** → `0433` Imperial Russian Government State Rente Certificate, St. Petersbur
  - sheet: Associated Gas and Electric Company — Certificate for 10 Class A Shares, No. 3280 (1928/1933)
- **`1609`** (2 lv) img **0.854** → `0427` Reichsbank 1,000-Mark Reichsbanknote, Berlin, 1910
  - sheet: Dutch Lottery Loan, 1870
- **`1694`** (1 lv) img **0.853** → `0003` Bulgarian Internal State Loan for National Defense, 1941
  - sheet: Province of Westphalia 20-Zentner Rye Mortgage Bond (Roggen-Pfandbrief), 1923 — No. 665
- **`1723`** (1 lv) img **0.851** → `0469` Unilever N.V. Option Certificate, 1937
  - sheet: St. Louis–San Francisco Railway Company — Certificate for 10 Common Shares, $1,000, No. 2133 (1917/1
