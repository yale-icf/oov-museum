# Lottery Book album — album filename ↔ record id

Generated 2026-09-18. **108 documents, 252 leaves, ids `goetzmann1802`–`goetzmann2053`.**

## ✅ The masters have been renamed (2026-09-18)

The source files in `JPEG Files/TO-ADD_Lottery_Book/` were originally named for the album's
own pagination — `01.jpg`, `03a.jpg`, `10h.jpg` — which no other batch in this collection
does and which `ID_ALLOCATION.md` forbids. All 252 have been renamed to `goetzmannNNNN.jpg`
**from this table**, by `scratchpad/lottery-rename.py`. Verified afterwards: 252 files, ids
1802–2053 with no gaps and nothing extra, and each renamed master still matches its own live
thumbnail.

⚠️ **THIS TABLE IS NOW THE ONLY RECORD OF THE ALBUM'S PAGINATION.** The filenames no longer
carry it, and the pagination is the only thing that says which leaves belong to one physical
document — that `03`, `03a`, `03b`, `03c` were four views of a single sheet, or that `10a`
through `10h` were eight pages of one decree. The `pages[]` arrays in `museum-data.json`
preserve the grouping, but not the album order that produced it. Do not delete this file.

A reversal manifest is at `scratchpad/lottery-rename-manifest.json` (git-ignored, so it will
not survive a clean checkout — this table is the durable copy).

## The mapping

`page` is the album's own page number and equals one document. The first leaf's id is the
record id; the rest are its `pages[]`.

| page | record id | title | leaves (album file → id) |
|---|---|---|---|
| 1 | `goetzmann1802` | Ancienne Tontine Twelfth Class Contract, Paris, 1689 | `01.jpg`→`1802` |
| 2 | `goetzmann1803` | Ancienne Tontine Receipt, Paris, 1702 | `02.jpg`→`1803` |
| 3 | `goetzmann1804` | Royal Treasury Lottery Receipt with its Ticket, Paris, 1704 | `03.jpg`→`1804` · `03a.jpg`→`1805` · `03b.jpg`→`1806` · `03c.jpg`→`1807` |
| 4 | `goetzmann1808` | Nouvelle Loterie de la Ville d'Aix-en-Provence Plan, 1730 | `04a.jpg`→`1808` · `04b.jpg`→`1809` |
| 5 | `goetzmann1810` | Marseille Charity Hospital Lottery Ticket, 1730 | `05.jpg`→`1810` |
| 6 | `goetzmann1811` | Saint-Just de Lyon Collegiate Church Lottery Ticket | `06.jpg`→`1811` |
| 7 | `goetzmann1812` | Carmes Déchaussés de Bordeaux Lottery Ticket | `07.jpg`→`1812` |
| 8 | `goetzmann1813` | Hôtel de Ville Rentiers Lottery Receipt, Paris, 1729 | `08.jpg`→`1813` |
| 9 | `goetzmann1814` | Loterie Royale Receipt for the Poor, 1742 | `09.jpg`→`1814` |
| 10 | `goetzmann1815` | Decree Establishing a Third Loterie Royale, Paris, 1755 | `10a.jpg`→`1815` · `10b.jpg`→`1816` · `10c.jpg`→`1817` · `10d.jpg`→`1818` · `10e.jpg`→`1819` · `10f.jpg`→`1820` · `10g.jpg`→`1821` · `10h.jpg`→`1822` |
| 11 | `goetzmann1823` | École Royale Militaire Lottery Receipt, Paris, 1762 | `11.jpg`→`1823` |
| 12 | `goetzmann1824` | École Royale Militaire Lottery Ticket, Paris, 1763 | `12.jpg`→`1824` |
| 13 | `goetzmann1825` | Instructive Notice on the École Royale Militaire Lottery, Paris, 1757 | `13a.jpg`→`1825` · `13b.jpg`→`1826` · `13c.jpg`→`1827` |
| 14 | `goetzmann1828` | École Royale Militaire Lottery Receipt, Grenoble, 1766 | `14.jpg`→`1828` |
| 15 | `goetzmann1829` | École Royale Militaire Lottery Receipt, Unissued Form | `15.jpg`→`1829` |
| 16 | `goetzmann1830` | École Royale Militaire Lottery Ticket, 1768 | `16.jpg`→`1830` |
| 17 | `goetzmann1831` | Decree Establishing the Hôtel de Ville de Paris Lottery, 1760 | `17a.jpg`→`1831` · `17b.jpg`→`1832` · `17c.jpg`→`1833` · `17d.jpg`→`1834` |
| 18 | `goetzmann1835` | Notice of the Twenty-Third Hôtel de Ville de Paris Lottery Drawing, 1762 | `18.jpg`→`1835` |
| 19 | `goetzmann1836` | Twenty-Fourth Hôtel de Ville de Paris Lottery Ticket, 1762 | `19.jpg`→`1836` |
| 20 | `goetzmann1837` | Thirty-Sixth Hôtel de Ville de Paris Lottery Ticket, 1763 | `20.jpg`→`1837` |
| 21 | `goetzmann1838` | Twenty-Fourth Hôtel de Ville de Paris Lottery Quarter-Ticket, 1762 | `21.jpg`→`1838` |
| 22 | `goetzmann1839` | Thirty-Sixth Hôtel de Ville de Paris Lottery Quarter-Ticket, 1763 | `22.jpg`→`1839` |
| 23 | `goetzmann1840` | Hôtel de Ville de Paris Lottery Society Share, Paris, 1763 | `23.jpg`→`1840` |
| 24 | `goetzmann1841` | Decree Establishing the Loterie Générale d'Association, Paris, 1762 | `24a.jpg`→`1841` · `24b.jpg`→`1842` · `24c.jpg`→`1843` · `24d.jpg`→`1844` · `24e.jpg`→`1845` · `24f.jpg`→`1846` · `24g.jpg`→`1847` |
| 25 | `goetzmann1848` | Decree Establishing the Loterie Générale d'Association, Second Printing, Paris, 1762 | `25a.jpg`→`1848` · `25b.jpg`→`1849` · `25c.jpg`→`1850` · `25d.jpg`→`1851` · `25e.jpg`→`1852` · `25f.jpg`→`1853` · `25g.jpg`→`1854` |
| 26 | `goetzmann1855` | Notice of the Third Loterie Générale d'Association Drawing, Paris, 1762 | `26.jpg`→`1855` |
| 27 | `goetzmann1856` | Loterie Générale d'Association Ticket, Paris, 1763 | `27.jpg`→`1856` |
| 28 | `goetzmann1857` | Loterie Générale Ticket, Paris, 1763 | `28.jpg`→`1857` |
| 29 | `goetzmann1858` | Loterie Générale d'Association Society Share, Paris, 1763 | `29.jpg`→`1858` |
| 30 | `goetzmann1859` | Loterie Générale d'Association Society Share, Paris, 1762 | `30.jpg`→`1859` |
| 31 | `goetzmann1860` | Instructive Plan of the Loterie Générale d'Association, Paris, 1762 | `31a.jpg`→`1860` · `31b.jpg`→`1861` · `31c.jpg`→`1862` · `31d.jpg`→`1863` · `31e.jpg`→`1864` · `31f.jpg`→`1865` · `31g.jpg`→`1866` · `31h.jpg`→`1867` |
| 32 | `goetzmann1868` | Decree Establishing the Loterie de Piété, Paris, 1761 | `32a.jpg`→`1868` · `32b.jpg`→`1869` · `32c.jpg`→`1870` · `32d.jpg`→`1871` |
| 33 | `goetzmann1872` | Loterie de Piété Ticket, Paris, 1774 | `33.jpg`→`1872` |
| 34 | `goetzmann1873` | Loterie de Piété Ticket, Paris, 1778 | `34.jpg`→`1873` |
| 35 | `goetzmann1874` | Loterie de Piété Uncut Sheet of Four Tickets, Paris | `35.jpg`→`1874` |
| 36 | `goetzmann1875` | First Notice of the Loterie de Piété, Paris, 1761 | `36.jpg`→`1875` |
| 37 | `goetzmann1876` | Last Notice of the Loterie de Piété Drawing, Paris, 1762 | `37.jpg`→`1876` |
| 38 | `goetzmann1877` | Parlement Decree Concerning the Lotteries, Paris, 1776 | `38a.jpg`→`1877` · `38b.jpg`→`1878` · `38c.jpg`→`1879` · `38d.jpg`→`1880` |
| 39 | `goetzmann1881` | Decree Fixing the Drawing Days of the Enfants-Trouvés and Piété Lotteries, Paris, 1776 | `39a.jpg`→`1881` · `39b.jpg`→`1882` |
| 40 | `goetzmann1883` | Decree Creating the Loterie Royale de France, Paris, 1776 | `40a.jpg`→`1883` · `40b.jpg`→`1884` · `40c.jpg`→`1885` · `40d.jpg`→`1886` · `40e.jpg`→`1887` · `40f.jpg`→`1888` · `40g.jpg`→`1889` · `40h.jpg`→`1890` · `40i.jpg`→`1891` · `40j.jpg`→`1892` |
| 41 | `goetzmann1893` | Decree Suppressing the Loterie Royale Free Premiums, Paris, 1776 | `41a.jpg`→`1893` · `41b.jpg`→`1894` · `41c.jpg`→`1895` · `41d.jpg`→`1896` |
| 42 | `goetzmann1897` | Loterie Royale de France Receipt No. 14, Grenoble, 1779 | `42.jpg`→`1897` |
| 43 | `goetzmann1898` | Loterie Royale de France Receipt No. 28, Grenoble, 1779 | `43.jpg`→`1898` |
| 44 | `goetzmann1899` | Loterie Royale de France Society Ticket, 1779 | `44.jpg`→`1899` |
| 45 | `goetzmann1900` | Loterie Royale de France Ticket, 1784 | `45.jpg`→`1900` |
| 46 | `goetzmann1901` | Loterie Royale de France Ticket, 1778 | `46.jpg`→`1901` |
| 47 | `goetzmann1902` | Decree Opening a Loan by Way of Lottery, Paris, 1780 | `47a.jpg`→`1902` · `47b.jpg`→`1903` · `47c.jpg`→`1904` · `47d.jpg`→`1905` · `47e.jpg`→`1906` · `47f.jpg`→`1907` · `47g.jpg`→`1908` |
| 48 | `goetzmann1909` | Decree Naming the Signatories of the Lottery Loan Coupons, Paris, 1780 | `48a.jpg`→`1909` · `48b.jpg`→`1910` |
| 49 | `goetzmann1911` | Prospectus of a Lottery on the Numbers of the Ville Domain Loan, Paris, 1786 | `49a.jpg`→`1911` · `49b.jpg`→`1912` · `49c.jpg`→`1913` · `49d.jpg`→`1914` |
| 50 | `goetzmann1915` | Journal de Paris No. 330, 1785 | `50a.jpg`→`1915` · `50b.jpg`→`1916` · `50c.jpg`→`1917` · `50d.jpg`→`1918` |
| 51 | `goetzmann1919` | Third Lottery of the Electorate of Cologne Ticket, 1759 | `51.jpg`→`1919` |
| 52 | `goetzmann1920` | Cologne Lottery Fourth Class Subscription, 1759 | `52.jpg`→`1920` |
| 53 | `goetzmann1921` | Royal Edict Creating Four Million in Hereditary Rentes, Versailles, 1785 | `53a.jpg`→`1921` · `53b.jpg`→`1922` · `53c.jpg`→`1923` · `53d.jpg`→`1924` |
| 54 | `goetzmann1925` | Offenburg Privileged Lotto Drawing Notice, 1779 | `54.jpg`→`1925` |
| 55 | `goetzmann1926` | Letter on a Wied Lottery Scheme, Neuwied, 1788 | `55a.jpg`→`1926` · `55b.jpg`→`1927` · `55c.jpg`→`1928` · `55d.jpg`→`1929` · `55e.jpg`→`1930` · `55f.jpg`→`1931` · `55g.jpg`→`1932` · `55h.jpg`→`1933` · `55i.jpg`→`1934` · `55j.jpg`→`1935` |
| 56 | `goetzmann1936` | Extract of a Police Administration Deliberation, Year II (1793) | `56a.jpg`→`1936` · `56b.jpg`→`1937` |
| 57 | `goetzmann1938` | Banque de Confiance Gold Note, Series 39, Paris, 1792 | `57.jpg`→`1938` |
| 58 | `goetzmann1939` | Banque de Confiance Silver Note, Series 69, Paris, 1792 | `58.jpg`→`1939` |
| 59 | `goetzmann1940` | Letter with Lottery Account Recapitulation, Paris, 1789 | `59a.jpg`→`1940` · `59b.jpg`→`1941` |
| 60 | `goetzmann1942` | Two Loterie Royale de France Tickets, Bureau 616, 1793 | `60.jpg`→`1942` |
| 61 | `goetzmann1943` | Public Notice of a Ninety-Number Lottery, Paris | `61.jpg`→`1943` |
| 62 | `goetzmann1944` | Decree of the National Convention Suppressing All Lotteries, Paris, 1793 | `62a.jpg`→`1944` · `62b.jpg`→`1945` |
| 63 | `goetzmann1946` | Regulation of the Petite Loterie Nationale, Paris, 1795 | `63a.jpg`→`1946` · `63b.jpg`→`1947` · `63c.jpg`→`1948` · `63d.jpg`→`1949` · `63e.jpg`→`1950` · `63f.jpg`→`1951` · `63g.jpg`→`1952` |
| 64 | `goetzmann1953` | Address to the Committee of Legislation on the Lotteries, Paris | `64a.jpg`→`1953` · `64b.jpg`→`1954` · `64c.jpg`→`1955` · `64d.jpg`→`1956` · `64e.jpg`→`1957` · `64f.jpg`→`1958` · `64g.jpg`→`1959` · `64h.jpg`→`1960` |
| 65 | `goetzmann1961` | Lartigue's Report to the National Convention on the Lotteries, Paris, Year III (1795) | `65a.jpg`→`1961` · `65b.jpg`→`1962` · `65c.jpg`→`1963` · `65d.jpg`→`1964` · `65e.jpg`→`1965` · `65f.jpg`→`1966` · `65g.jpg`→`1967` · `65h.jpg`→`1968` |
| 66 | `goetzmann1969` | Précis sur les Loteries, Paris | `66a.jpg`→`1969` · `66b.jpg`→`1970` · `66c.jpg`→`1971` |
| 67 | `goetzmann1972` | National Lottery of Houses and Furniture Ticket, Year III (1795) | `67.jpg`→`1972` |
| 68 | `goetzmann1973` | Second National Lottery of Houses and Furniture Ticket, Year V (1796) | `68.jpg`→`1973` |
| 69 | `goetzmann1974` | Twelve Million Lottery Bond for Three Hundred Francs, Paris | `69.jpg`→`1974` |
| 70 | `goetzmann1975` | Prize Notice for a Muslin Garniture, Paris, Year VI (1798) | `70.jpg`→`1975` |
| 71 | `goetzmann1976` | Lottery of a Spun-Glass Piece, Bordeaux, 1808 | `71.jpg`→`1976` |
| 72 | `goetzmann1977` | Loterie Nationale Public Notice No. 136, Paris | `72a.jpg`→`1977` · `72b.jpg`→`1978` · `72c.jpg`→`1979` |
| 73 | `goetzmann1980` | Loterie Nationale Drawing List, Lyon, 9 Prairial | `73.jpg`→`1980` |
| 74 | `goetzmann1981` | Loterie Nationale Stake Receipts, Bureau 707, Year VI (1798) | `74.jpg`→`1981` |
| 75 | `goetzmann1982` | Loterie Nationale Stake Receipt, Nivôse Year VI (1797) | `75.jpg`→`1982` |
| 76 | `goetzmann1983` | Loterie Nationale Stake Receipt No. 5462, Nivôse Year VI (1797) | `76.jpg`→`1983` |
| 77 | `goetzmann1984` | Imperial Lottery of France Drawing List, Rome, 1813 | `77.jpg`→`1984` |
| 78 | `goetzmann1985` | Imperial Lottery of France Drawing List, Strasbourg, 1809 | `78.jpg`→`1985` |
| 79 | `goetzmann1986` | Loterie Nationale Stake Receipts, First Sheet | `79.jpg`→`1986` |
| 80 | `goetzmann1987` | Loterie Nationale Stake Receipt Sheet, Bureau C.2 | `80.jpg`→`1987` |
| 81 | `goetzmann1988` | Loterie Impériale Half-Ticket Coupon, Brussels, Year IX (1801) | `81.jpg`→`1988` |
| 82 | `goetzmann1989` | Imperial Lottery of France Stake Receipt, Bureau 1, 1812 | `82.jpg`→`1989` |
| 83 | `goetzmann1990` | Imperial Lottery of France Stake Receipt Sheet, Brussels | `83.jpg`→`1990` |
| 84 | `goetzmann1991` | Lottery Bureau Account, Grenoble, 1813 | `84a.jpg`→`1991` · `84b.jpg`→`1992` |
| 85 | `goetzmann1993` | Imperial Lottery of France Stake Receipts, Caen, 1810 | `85a.jpg`→`1993` · `85b.jpg`→`1994` |
| 86 | `goetzmann1995` | Kingdom of Westphalia Lottery Ticket, Kassel, 1808 | `86.jpg`→`1995` |
| 87 | `goetzmann1996` | Lottery of a Fine English Engraving, One Franc the Ticket | `87.jpg`→`1996` |
| 88 | `goetzmann1997` | Imperial Lottery of France Stake Receipts, Brussels, 1811 | `88a.jpg`→`1997` · `88b.jpg`→`1998` |
| 89 | `goetzmann1999` | Loterie Royale de France Public Notice No. 136 | `89a.jpg`→`1999` · `89b.jpg`→`2000` · `89c.jpg`→`2001` |
| 90 | `goetzmann2002` | Loterie Royale de France Stake Receipt, Paris, 1818 | `90.jpg`→`2002` |
| 91 | `goetzmann2003` | Loterie Royale de France Stake Receipt, Strasbourg, 1818 | `91.jpg`→`2003` |
| 92 | `goetzmann2004` | Loterie Royale de France Drawing List, Bordeaux, 1823 | `92.jpg`→`2004` |
| 93 | `goetzmann2005` | Loterie Royale de France Drawing List, Lyon, 1824 | `93.jpg`→`2005` |
| 94 | `goetzmann2006` | Lottery Stake Slips, Paris | `94.jpg`→`2006` |
| 95 | `goetzmann2007` | Strasbourg Lottery Demand Table | `95a.jpg`→`2007` · `95b.jpg`→`2008` |
| 96 | `goetzmann2009` | Royal Edict Creating a Lottery in Life and Perpetual Rentes, Versailles, 1757 | `96a.jpg`→`2009` · `96b.jpg`→`2010` · `96c.jpg`→`2011` · `96d.jpg`→`2012` · `96e.jpg`→`2013` · `96f.jpg`→`2014` · `96g.jpg`→`2015` · `96h.jpg`→`2016` |
| 97 | `goetzmann2017` | Decree Opening a Seven-Year Loan by Way of Lottery, Paris, 1777 | `97a.jpg`→`2017` · `97b.jpg`→`2018` · `97c.jpg`→`2019` · `97d.jpg`→`2020` · `97e.jpg`→`2021` · `97f.jpg`→`2022` · `97g.jpg`→`2023` · `97h.jpg`→`2024` |
| 98 | `goetzmann2025` | Tontine des Vieillards Receipt, Paris | `98.jpg`→`2025` |
| 99 | `goetzmann2026` | Notarial Act on a Tontine Life-Annuity Division, Paris, 1779 | `99a.jpg`→`2026` · `99b.jpg`→`2027` |
| 100 | `goetzmann2028` | Prize Lottery Bulletin on the Edict of December 1785, Paris | `100.jpg`→`2028` |
| 101 | `goetzmann2029` | Letter of the Loterie Nationale Inspector at Lyon, Year X (1801) | `101a.jpg`→`2029` · `101b.jpg`→`2030` |
| 102 | `goetzmann2031` | General List of Winning Tickets of the Second Loterie Royale, Paris, 1749 | `102a.jpg`→`2031` · `102b.jpg`→`2032` · `102c.jpg`→`2033` · `102d.jpg`→`2034` · `102e.jpg`→`2035` · `102f.jpg`→`2036` · `102g.jpg`→`2037` · `102h.jpg`→`2038` · `102i.jpg`→`2039` |
| 103 | `goetzmann2040` | Prospectus of the Sieur Argoud's Lottery, Grenoble | `103a.jpg`→`2040` · `103b.jpg`→`2041` · `103c.jpg`→`2042` · `103d.jpg`→`2043` |
| 104 | `goetzmann2044` | Letter of the Loterie Nationale Inspector at Grenoble, Year XI (1803) | `104.jpg`→`2044` |
| 105 | `goetzmann2045` | Loterie Royale de France Public Notice, 1776 | `105a.jpg`→`2045` · `105b.jpg`→`2046` · `105c.jpg`→`2047` |
| 106 | `goetzmann2048` | Loterie Royale de France Public Notice, Second Copy, 1776 | `106a.jpg`→`2048` · `106b.jpg`→`2049` · `106c.jpg`→`2050` |
| 107 | `goetzmann2051` | Administration des Tontines Account, Paris, 1817 | `107a.jpg`→`2051` · `107b.jpg`→`2052` |
| 108 | `goetzmann2053` | Loterie Royale de France Numerical Table | `108.jpg`→`2053` |
