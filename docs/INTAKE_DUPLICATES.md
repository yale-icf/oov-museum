# Intake documents that may already be in the collection

## Why this list exists

The September 2026 intake was bucketed by **ID** — does `goetzmann<NNNN>` already
exist? That test cannot see the case that actually matters: a **brand-new id
holding a document the collection already has under a different id**.

Two were found this way and both were the same shape — the live record was a scan
of **page 1 only**, and the intake supplied the whole document:

| live record | intake | what happened |
|---|---|---|
| `1035` French Royal 3% Rente, 1761 | `1300`–`1304` | same physical sheet; merged, `1035` retiled from the larger master, leaves 1301–1304 added as pages, `1300` purged |
| `1033` Compagnie des Indes Life-Annuity, 1726 | `1305`–`1308` | same physical sheet; merged the same way, `1305` purged |

Both also corrected the live record: `1035` carried the identifier **No. 46460**
when the plate reads **No. 2340**, and `1033` carried notes describing a
completely different document (an 1785 company constitution mentioning Bordeaux).

## The rule, for every remaining document in the range

**Before creating a record, check this list.** If the id appears below, compare
the intake plate against the live record's own image (`node
scratchpad/reconstruct.js <live id>` rebuilds it full-res from its tiles) before
doing anything else.

- Same physical sheet, live record shorter → **merge**, do not create a record:
  `py scratchpad/merge-intake-into-live.py` (retiles, repages, rewrites the
  workbook, lists the orphan to purge).
- Genuinely different objects of the same issue → **two records**, titles split
  by year or serial, per the multiples convention.
- Same object, live record's scan is as good or better → leave the live record
  alone and retire the intake id.

Regenerate this list at any time with `py scratchpad/find-intake-dupes.py`.

## Candidates

Scored on weighted word overlap between the master sheet's row and the live
record's title, description and notes; rare words count for more. **A score is a
reason to look, not a verdict.** `1300` scored only 0.29 and was a true merge, so
low scores are not safe to skip.

- **`1305`** (4 lv) 1.00 → `1033` Compagnie des Indes Life-Annuity Contract, Paris, 1726 — ✅ MERGED 2026-09-15 into 1033
  - sheet: Compagnie des Indes Life-Annuity Contract, Paris
  - shared: deliberation, montpellier, antoinette, généralité, trésorier, despioch, 920, annuitants', d'état, lotteries
- **`1371`** (2 lv) 1.00 → `0235` Anglo-Argentine Tramways Company Debenture Stock Certificate, London, 
  - sheet: Anglo-Argentine Tramways Company Limited
  - shared: argentine, tramways, anglo, debenture, 1910, limited, stock, company
- **`1373`** (2 lv) 1.00 → `0345` State of South Carolina Consolidation Bond, 1872
  - sheet: Consolidation Bond
  - shared: carolina, 1602, 1893, consolidation, south, due, principal, july, january, state
- **`1403`** (5 lv) 1.00 → `1292` De Vyver Plantation Mortgage Loan Share, Essequibo, 1789
  - sheet: De Vyver Plantation Mortgage Loan, Essequibo — 6% Loan, 1789
  - shared: vyver, 1789, essequibo, plantation, mortgage, loan
  - also 1.00 → `0541` Dutch Essequibo Plantation Negotiatie, 1789
  - also 0.26 → `0545` Conditions of the Daniel Changuion Plantation Loan, Essequibo and Deme
- **`1413`** (1 lv) 0.98 → `0549` Vlaardingen Orphanage Negotiatie (Lottery-Loan), Batavian Republic, 9 
  - sheet: Vlaardingen Orphanage Lottery and Life-Annuity Fund — 1800
  - shared: vlaardingen, orphanage, 1800, life, annuity, lottery
  - also 0.98 → `0534` Vlaardingen Orphanage Lottery Loan Conditions, 1800
- **`1641`** (1 lv) 0.95 → `1285` St. Croix Plantation Loan Conversion Share, Amsterdam, 1778
  - sheet: 1772 St. Croix Plantation Life-Annuity Receipt — 1,000 Guilders, No. 22
  - shared: croix, 1772, plantation, life, annuity
  - also 0.31 → `0509` Middelburg Plantation Bond for Essequibo and Demerara, 1768
  - also 0.27 → `0037` The Hague Plantation Bond for Essequibo and Demerara, 1772
- **`1400`** (1 lv) 0.66 → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxhall, 
  - sheet: Vauxhall Plantation Mortgage, Dominica — 5% Obligation No. 38, 1777
  - shared: vauxhall, dominica, 1777, plantation, mortgage
  - also 0.34 → `0608` Stolkert Surinam Plantation Mortgage to Du Plessis & Taunay, Amsterdam
- **`1401`** (1 lv) 0.66 → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxhall, 
  - sheet: Vauxhall Plantation Mortgage, Dominica — 5% Obligation No. 38, 1777
  - shared: vauxhall, dominica, 1777, plantation, mortgage
  - also 0.34 → `0608` Stolkert Surinam Plantation Mortgage to Du Plessis & Taunay, Amsterdam
- **`1746`** (1 lv) 0.64 → `0407` Norwich & Worcester Rail Road Company Bond, 1877
  - sheet: Hartford and New Haven Rail Road Company Stock Certificate
  - shared: rail, hartford, road, new, company
  - also 0.56 → `0404` New York, New Haven and Hartford Railroad Harlem River–Port Chester Fi
  - also 0.47 → `0394` Little Miami Rail Road Company Share Certificate, 1862
- **`1747`** (1 lv) 0.64 → `0407` Norwich & Worcester Rail Road Company Bond, 1877
  - sheet: Hartford and New Haven Rail Road Company Stock Certificate
  - shared: rail, hartford, road, new, company
  - also 0.56 → `0404` New York, New Haven and Hartford Railroad Harlem River–Port Chester Fi
  - also 0.47 → `0394` Little Miami Rail Road Company Share Certificate, 1862
- **`1742`** (1 lv) 0.61 → `0394` Little Miami Rail Road Company Share Certificate, 1862
  - sheet: New-York and New-Haven Rail-Road Company Stock Certificate
  - shared: rail, road, york, new, stock, company, certificate
  - also 0.59 → `0403` New York Central Rail Road Company Bond, 1858
  - also 0.58 → `0316` Chicago, Rock Island & Pacific Rail Road Company Mortgage Bond, 1880
- **`1743`** (1 lv) 0.61 → `0394` Little Miami Rail Road Company Share Certificate, 1862
  - sheet: New-York and New-Haven Rail-Road Company Stock Certificate
  - shared: rail, road, york, new, stock, company, certificate
  - also 0.59 → `0403` New York Central Rail Road Company Bond, 1858
  - also 0.58 → `0316` Chicago, Rock Island & Pacific Rail Road Company Mortgage Bond, 1880
- **`1780`** (1 lv) 0.57 → `0485` Notarial Register of a French Crown Life-Annuity Loan, 1787
  - sheet: French Royal Life-Annuity Loan Contract, Directors Pieter Stadnitski & Hendrik Vollenhoven
  - shared: 1787, pieter, vollenhoven, stadnitski, hendrik, life, annuity, royal, amsterdam, may
  - also 0.55 → `0943` Dutch Life-Annuity Negotiation Deed and Nominee List, 1787
  - also 0.27 → `0525` Stadnitski & van Heukelom Russian Loan Certificate, Amsterdam, 1825
- **`1781`** (1 lv) 0.57 → `0485` Notarial Register of a French Crown Life-Annuity Loan, 1787
  - sheet: French Royal Life-Annuity Loan Contract, Directors Pieter Stadnitski & Hendrik Vollenhoven
  - shared: 1787, pieter, vollenhoven, stadnitski, hendrik, life, annuity, royal, amsterdam, may
  - also 0.55 → `0943` Dutch Life-Annuity Negotiation Deed and Nominee List, 1787
  - also 0.27 → `0525` Stadnitski & van Heukelom Russian Loan Certificate, Amsterdam, 1825
- **`1782`** (1 lv) 0.57 → `0485` Notarial Register of a French Crown Life-Annuity Loan, 1787
  - sheet: French Royal Life-Annuity Loan Contract, Directors Pieter Stadnitski & Hendrik Vollenhoven
  - shared: 1787, pieter, vollenhoven, stadnitski, hendrik, life, annuity, royal, amsterdam, may
  - also 0.55 → `0943` Dutch Life-Annuity Negotiation Deed and Nominee List, 1787
  - also 0.27 → `0525` Stadnitski & van Heukelom Russian Loan Certificate, Amsterdam, 1825
- **`1783`** (1 lv) 0.57 → `0485` Notarial Register of a French Crown Life-Annuity Loan, 1787
  - sheet: French Royal Life-Annuity Loan Contract, Directors Pieter Stadnitski & Hendrik Vollenhoven
  - shared: 1787, pieter, vollenhoven, stadnitski, hendrik, life, annuity, royal, amsterdam, may
  - also 0.55 → `0943` Dutch Life-Annuity Negotiation Deed and Nominee List, 1787
  - also 0.27 → `0525` Stadnitski & van Heukelom Russian Loan Certificate, Amsterdam, 1825
- **`1700`** (1 lv) 0.55 → `0613` Denver & Rio Grande Railway Dutch Bearer Certificate, Amsterdam, 1886
  - sheet: Denver & Rio Grande Spoorweg-Maatschappij Common Stock Certificate, 1911 — No. 29546
  - shared: denver, grande, rio, spoorweg, maatschappij, stock, certificate
- **`1701`** (1 lv) 0.55 → `0613` Denver & Rio Grande Railway Dutch Bearer Certificate, Amsterdam, 1886
  - sheet: Denver & Rio Grande Spoorweg-Maatschappij Common Stock Certificate, 1911 — No. 29546
  - shared: denver, grande, rio, spoorweg, maatschappij, stock, certificate
- **`1342`** (2 lv) 0.54 → `0630` Hope & Co. Certificate of Russian Bank Assignations, Amsterdam, 1827, 
  - sheet: Russian 6% Government Funds Certificate, 1824
  - shared: assignations, borski, ketwich, voombergh, widow, hope, administration, petersburg, recorded, russian
  - also 0.54 → `0521` Hope & Co. Certificate of Russian Bank Assignations, Amsterdam, 1825, 
  - also 0.53 → `0719` Hope & Co. Certificate of Russian Bank Assignations, Amsterdam, 1825, 
- **`1533`** (1 lv) 0.52 → `0356` Italian Public Debt Rendita Certificate, Florence, 1864
  - sheet: Kingdom of Italy Public Debt Certificate
  - shared: regno, pubblico, debito, d'italia, del, italy, kingdom, public, debt, certificate
- **`1774`** (1 lv) 0.47 → `0042` Fahraeus & Laurin Suriname Plantation Negotiatie Participation, Amster
  - sheet: Surinam Plantations Alsimo (Warapper-Creek and Edenburg)1793, No. 28
  - shared: alsimo, edenburg, creek, 1793, plantations
- **`1775`** (1 lv) 0.47 → `0042` Fahraeus & Laurin Suriname Plantation Negotiatie Participation, Amster
  - sheet: Surinam Plantations Alsimo (Warapper-Creek and Edenburg)1793, No. 28
  - shared: alsimo, edenburg, creek, 1793, plantations
- **`1776`** (1 lv) 0.47 → `0042` Fahraeus & Laurin Suriname Plantation Negotiatie Participation, Amster
  - sheet: Surinam Plantations Alsimo (Warapper-Creek and Edenburg)1793, No. 28
  - shared: alsimo, edenburg, creek, 1793, plantations
- **`1777`** (1 lv) 0.47 → `0042` Fahraeus & Laurin Suriname Plantation Negotiatie Participation, Amster
  - sheet: Surinam Plantations Alsimo (Warapper-Creek and Edenburg)1793, No. 28
  - shared: alsimo, edenburg, creek, 1793, plantations
- **`1609`** (2 lv) 0.44 → `0515` Vereeniging tot Bevordering van 's Lands Weerbaarheid Lottery Loan Sha
  - sheet: Dutch Lottery Loan, 1870
  - shared: weerbaarheid, bevordering, defense, vereeniging, tot, rotterdam, 1870, lands, association, plan
- **`1387`** (2 lv) 0.44 → `0525` Stadnitski & van Heukelom Russian Loan Certificate, Amsterdam, 1825
  - sheet: Russian Imperial Public Debt Certificate – 1,000 Rubles
  - shared: heukelom, assignats, stadnitski, 1825, amortization, inscription, houses, banking, commission, petersburg
  - also 0.37 → `0631` Russian Public Debt (Assignation Funds) Certificate, Amsterdam, 1825
  - also 0.37 → `0017` Russian Imperial Public Debt Certificate, Amsterdam, 1824
- **`1702`** (1 lv) 0.43 → `0614` German External Loan 1924 (Dawes Loan), Swiss Issue — Funding Bond Ent
  - sheet: German External Loan 1924 (Dawes Loan), Swiss Issue Funding Certificate, 1953 — No. 8691
  - shared: dawes, swiss, 1953, funding, 1924, external, issue, loan, certificate
  - also 0.26 → `0617` German External Loan 1924 (Dawes Loan) Rights Certificate, Bad Homburg
- **`1366`** (5 lv) 0.42 → `0228` Dutch Bond for the French Bourbon Princes in Exile, 1793
  - sheet: Dutch loan to the pretender to the French Throne, 1793
  - shared: philippe, throne, croese, xavier, stanislas, princes, bourcourd, bankers, 1793, louis
  - also 0.34 → `0542` Bourbon Princes in Exile Loan Certificate, Amsterdam, 1793
- **`1666`** (1 lv) 0.40 → `0915` Société Toulousaine du Bazacle Share, 1928
  - sheet: Société Toulousaine du Bazacle Founder’s Share Certificate (Part de Fondateur au Porteur),
  - shared: bazacle, toulousaine, 1928, société, share
- **`1721`** (1 lv) 0.40 → `0459` Texas and German Emigration Company Certificate of Stock, 1852
  - sheet: Galveston, Houston & Henderson Railroad Company — Handwritten Bond Sale Agreement — New Yo
  - shared: houston, galveston, bond, company
- **`1722`** (1 lv) 0.40 → `0459` Texas and German Emigration Company Certificate of Stock, 1852
  - sheet: Galveston, Houston & Henderson Railroad Company — Handwritten Bond Sale Agreement — New Yo
  - shared: houston, galveston, bond, company
- **`1402`** (1 lv) 0.40 → `0609` Heshuysen & Compagnie / James Balmer Mortgage on Plantation Vauxhall, 
  - sheet: Vauxhall Plantation Mortgage, Dominica — 5% Obligation No. 38, 1777
  - shared: vauxhall, dominica, 1777, plantation, mortgage
- **`1787`** (1 lv) 0.40 → `0530` Hessian Rye Loan Bond, 1923
  - sheet: Central-Landschaft 5% Rye Mortgage Bond for 50 Zentner of Rye, 1923 — No. 515635
  - shared: zentner, rye, 1923, bond
- **`1788`** (1 lv) 0.40 → `0530` Hessian Rye Loan Bond, 1923
  - sheet: Central-Landschaft 5% Rye Mortgage Bond for 10 Zentner of Rye, 1923 — No. 868967
  - shared: zentner, rye, 1923, bond
- **`1792`** (1 lv) 0.40 → `0530` Hessian Rye Loan Bond, 1923
  - sheet: Central-Landschaft 5% Rye Mortgage Bond for 20 Zentner of Rye, 1923 — No. 633858
  - shared: zentner, rye, 1923, bond
- **`1752`** (1 lv) 0.38 → `1179` Chinese Republic Lung-Tsing-U-Hai Railway Treasury Bond, Paris, 1925
  - sheet: Compagnie Générale de Chemins de Fer et de Tramways en Chine — Bearer Share Certificate (2
  - shared: tramways, générale, chemins, fer, chine, compagnie, francs, bearer
  - also 0.38 → `0430` Chinese Republic Lung-Tsing-U-Hai Railway Bond, Brussels, 1921
  - also 0.27 → `0466` Moscow & Russia Tramways Company Share, 1885
- **`1753`** (1 lv) 0.38 → `1179` Chinese Republic Lung-Tsing-U-Hai Railway Treasury Bond, Paris, 1925
  - sheet: Compagnie Générale de Chemins de Fer et de Tramways en Chine — Bearer Share Certificate (2
  - shared: tramways, générale, chemins, fer, chine, compagnie, francs, bearer
  - also 0.38 → `0430` Chinese Republic Lung-Tsing-U-Hai Railway Bond, Brussels, 1921
  - also 0.27 → `0466` Moscow & Russia Tramways Company Share, 1885
- **`1754`** (1 lv) 0.38 → `1179` Chinese Republic Lung-Tsing-U-Hai Railway Treasury Bond, Paris, 1925
  - sheet: Compagnie Générale de Chemins de Fer et de Tramways en Chine — Bearer Share Certificate (2
  - shared: tramways, générale, chemins, fer, chine, compagnie, francs, bearer
  - also 0.38 → `0430` Chinese Republic Lung-Tsing-U-Hai Railway Bond, Brussels, 1921
  - also 0.27 → `0466` Moscow & Russia Tramways Company Share, 1885
- **`1380`** (2 lv) 0.37 → `0459` Texas and German Emigration Company Certificate of Stock, 1852
  - sheet: Galveston, Houston and Henderson Rail Road Company Bond
  - shared: galveston, houston, texas, related, bond, company, interest
- **`1513`** (2 lv) 0.37 → `0629` Caisse d'Épargnes Lafarge Tontine Share, Paris, 1793
  - sheet: Caisse d'Épargnes et de Bienfaisance du Citoyen Lafarge Share
  - shared: lafarge, bienfaisance, d'épargnes, caisse, savings, action, life, livres, paris, share
- **`1694`** (1 lv) 0.35 → `0530` Hessian Rye Loan Bond, 1923
  - sheet: Province of Westphalia 20-Zentner Rye Mortgage Bond (Roggen-Pfandbrief), 1923 — No. 665
  - shared: zentner, roggen, rye, 1923, bond
- **`1408`** (5 lv) 0.34 → `0608` Stolkert Surinam Plantation Mortgage to Du Plessis & Taunay, Amsterdam
  - sheet: Frederik Cornelis Stolkert Colonial Plantation Mortgage — 5% Obligation No. 139, 1777
  - shared: stolkert, cornelis, 1777, plantation, mortgage
- **`1723`** (1 lv) 0.34 → `0346` Continental Investment Co. Stock Certificate, 1929
  - sheet: St. Louis–San Francisco Railway Company — Certificate for 10 Common Shares, $1,000, No. 21
  - shared: francisco, san, 1929, common, shares, company, certificate
- **`1724`** (1 lv) 0.34 → `0346` Continental Investment Co. Stock Certificate, 1929
  - sheet: St. Louis–San Francisco Railway Company — Certificate for 10 Common Shares, $1,000, No. 21
  - shared: francisco, san, 1929, common, shares, company, certificate
- **`1725`** (1 lv) 0.34 → `0346` Continental Investment Co. Stock Certificate, 1929
  - sheet: St. Louis–San Francisco Railway Company — Certificate for 10 Common Shares, $1,000, No. 21
  - shared: francisco, san, 1929, common, shares, company, certificate
- **`1726`** (1 lv) 0.34 → `0346` Continental Investment Co. Stock Certificate, 1929
  - sheet: St. Louis–San Francisco Railway Company — Certificate for 10 Common Shares, $1,000, No. 21
  - shared: francisco, san, 1929, common, shares, company, certificate
- **`1689`** (1 lv) 0.32 → `0439` Sherman & Barnsdall Oil Company Stock Certificate, New York, 1865
  - sheet: Irving Trust Company Stock Certificate, 1929 — No. 207142
  - shared: irving, stock, company, certificate
- **`1690`** (1 lv) 0.32 → `0439` Sherman & Barnsdall Oil Company Stock Certificate, New York, 1865
  - sheet: Irving Trust Company Stock Certificate, 1929 — No. 207142
  - shared: irving, stock, company, certificate
- **`1522`** (1 lv) 0.32 → `0622` Forced Loan Receipt of the Year IV, Ghent, 1796
  - sheet: French Forced Loan Receipt, Year IV
  - shared: forcé, l'an, forced, emprunt, receipt, payment, year, loan, under
- **`1784`** (1 lv) 0.31 → `0454` Eighth Austrian War Loan, 1918
  - sheet: Austrian Eighth War Loan 5½% Treasury Certificate for 1,000 Kronen, 1918 — No. 032804
  - shared: 1918, kronen, eighth, austrian, war, loan, 000
- **`1785`** (1 lv) 0.31 → `0454` Eighth Austrian War Loan, 1918
  - sheet: Austrian Eighth War Loan 5½% Treasury Certificate for 1,000 Kronen, 1918 — No. 032804
  - shared: 1918, kronen, eighth, austrian, war, loan, 000
- **`1786`** (1 lv) 0.31 → `0454` Eighth Austrian War Loan, 1918
  - sheet: Austrian Eighth War Loan 5½% Treasury Certificate for 1,000 Kronen, 1918 — No. 032804
  - shared: 1918, kronen, eighth, austrian, war, loan, 000
- **`1544`** (2 lv) 0.30 → `0539` German Government International Loan of 1930, Belgian Issue (Berlin)
  - sheet: German Reich 1922 loan bond – 100,000 Marks.
  - shared: deutschen, reichs, anleihe, world, reich, administration, des, war, debt, face
- **`1744`** (1 lv) 0.29 → `0363` Eagle Bank of New-Haven Stock Transfer Receipt, 1824
  - sheet: New Haven and Northampton Company Stock Receipt
  - shared: haven, receipt, stock, new
- **`1745`** (1 lv) 0.29 → `0363` Eagle Bank of New-Haven Stock Transfer Receipt, 1824
  - sheet: New Haven and Northampton Company Stock Receipt
  - shared: haven, receipt, stock, new
- **`1673`** (2 lv) 0.29 → `0293` Baltimore and Ohio Rail Road Company Preferred Stock, 1875
  - sheet: Baltimore and Ohio Railroad Company Stock Certificate, 1935, No. D264139
  - shared: ohio, baltimore, railroad, stock, company, certificate
  - also 0.29 → `0292` Baltimore and Ohio Railroad Company Common Stock, 1934
- **`1300`** (5 lv) 0.29 → `1035` French Royal Rente, Paris, 1761 — ✅ MERGED 2026-09-15 into 1035
  - sheet: French Royal 3% Rente (Droit sur les Cuirs)
  - shared: gervais, hides, 1762, chosen, ville, hôtel, ties, 1760, 1761, rentes
- **`1340`** (2 lv) 0.29 → `0719` Hope & Co. Certificate of Russian Bank Assignations, Amsterdam, 1825, 
  - sheet: Russian 6% Government Funds Certificate, 1825
  - shared: assignations, borski, ketwich, voombergh, 1825, widow, hope, inscription, administration, petersburg
  - also 0.28 → `0521` Hope & Co. Certificate of Russian Bank Assignations, Amsterdam, 1825, 
  - also 0.27 → `0517` Russian Public Debt Inscription, Imperial Sinking-Fund Commission, Sai
- **`1736`** (1 lv) 0.28 → `0346` Continental Investment Co. Stock Certificate, 1929
  - sheet: St. Louis–San Francisco Railway Company — Certificate for 10 Non-Cumulative 6% Preferred S
  - shared: francisco, san, non, shares, company, certificate
- **`1737`** (1 lv) 0.28 → `0346` Continental Investment Co. Stock Certificate, 1929
  - sheet: St. Louis–San Francisco Railway Company — Certificate for 10 Non-Cumulative 6% Preferred S
  - shared: francisco, san, non, shares, company, certificate
- **`1633`** (2 lv) 0.27 → `0404` New York, New Haven and Hartford Railroad Harlem River–Port Chester Fi
  - sheet: New York and Harlem Railroad, 1968 N. M1117 $1000
  - shared: harlem, railroad, york, new
- **`1385`** (2 lv) 0.27 → `1152` L'Ikelemba Dividend Share, Brussels, 1898
  - sheet: État Indépendant du Congo – 150 Million Franc Loan
  - shared: indépendant, état, congo, belgian, state, bearer
- **`1597`** (1 lv) 0.27 → `0685` West Shore Railroad Company First Mortgage Guaranteed Bond, 1885
  - sheet: United States Trust Company of New York stock certificate.
  - shared: punched, cancelled, trust, york, new, company
- **`1615`** (2 lv) 0.27 → `0317` Chicago, Rock Island and Pacific Railroad Company Gold Bond, 1902
  - sheet: Chicago, Rock Island and Pacific Railway Company Preferred Stock, 1920
  - shared: rock, chicago, pacific, standard, island, railway, engraved, company
- **`1761`** (1 lv) 0.25 → `0631` Russian Public Debt (Assignation Funds) Certificate, Amsterdam, 1825
  - sheet: 5% Russian Fund Certificate in Silver 1825 No. 263
  - shared: 1825, fund, russian, certificate
- **`1762`** (1 lv) 0.25 → `0631` Russian Public Debt (Assignation Funds) Certificate, Amsterdam, 1825
  - sheet: 5% Russian Fund Certificate in Silver 1825 No. 263
  - shared: 1825, fund, russian, certificate
- **`1581`** (2 lv) 0.25 → `0535` "Voor den Armen" Charitable Bond, City of Haarlem, 1805
  - sheet: Municipal Real Estate Trust
  - shared: annotations, municipal, form, under
- **`1598`** (2 lv) 0.25 → `0934` Unified Debt of Egypt Bearer Bond, Cairo, 1876
  - sheet: Imperial Russian Government 4% unified rente certificate.
  - shared: unified, amortization, attached, coupon, through, debt, government
