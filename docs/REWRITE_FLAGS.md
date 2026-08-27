# Description rewrite — flag list

Everything surfaced while rewriting 356 of the 357 remaining descriptions (sheet rows 382–869,
plus `goetzmann0004` skipped pending your Sammelband work). **Nothing in this file has been
changed in the data.** The rewritten labels sit in `scratchpad/rewrites.json`, unapplied.

Ordered by how much they matter, not by record number.

---

## 1. Curatorial call I need from you

Five records document **enslaved people as collateral or property**. In each I kept the plain
factual statement of what was pledged and parked the interpretive framing, per the facts-first
rule. This is the one place where facts-first and the exhibit-tone standard on your About page
could pull against each other, so I would rather you ruled than have me decide quietly.

| Record | What the label now says |
|---|---|
| `0468` | Tennessee injunction bond, 1852. Keeps the quoted valuations: *"Boyle, age 52, value 900.00" and "Loren, age 41, value 1100.00," two thousand dollars in human chattel pledged as collateral.* |
| `0608` | Surinam mortgage, 1777. Keeps the deed's operative clause obliging the debtor *"to maintain a sufficient number of enslaved labourers, replacing the dead, maimed, aged and runaways."* |
| `0545` | Changuion plantation loan, 1816. Keeps the appraisal clause covering *"the grounds, buildings, works and the enslaved people."* |
| `0502`, `0509`, `0533`, `0541`, `0544`, `0607`, `1034` | Plantation loans: the land and the enslaved stated as pledged security. |

## 2. Metadata errors — these affect the live site

**`issueYear` drives the date sort, the year on search result cards, and the "Date" row in the record viewer.** (Not the period facet — I said that earlier and it was wrong; `period` is its own Excel column.) A sweep across all 483 records (not
just my queue) found 21 whose `issueYear` appears nowhere in their description. Triaged, these
look like genuine errors:

| Record | `issueYear` | Document says |
|---|---|---|
| ~~`0640`~~ | ~~1965~~ | **FIXED in JSON 2026-08-27** → 1990. Sheet `issueDate` still reads "ca. 1965-1980"; queued in PENDING_XLSX_FIXES.md |
| ~~`0641`~~ | ~~1970~~ | **FIXED → 1987.** Sheet reads "ca. 1970-1985"; queued |
| ~~`0638`~~ | ~~1928~~ | **FIXED → 1914.** Sheet reads "ca. 1928-1933"; queued |
| ~~`0631`~~ | ~~1832~~ | **FIXED → 1825.** The notes dated it two years before its own prospectus; queued |
| ~~`0646`~~ | ~~1927~~ | **FIXED → 1930.** Sheet reads "ca. 1927-1935"; queued |
| `0317` | 1902 | **CORRECT as catalogued** — "2002" is the maturity of a hundred-year bond, not a typo |
| `0343` | 1920 | **Unresolved.** A stamp-duty notice printed on the certificate is dated 3 April 1928, so it cannot predate that. Needs the image |

Others in the sweep are undated objects where `issueYear` is a reasonable estimate. Full list:
`scratchpad/issueyear-mismatches.json`.

**Also:** `0395` and `0508` are the same bond but carry `issuingCountry` **China** and
**Netherlands** respectively. One is wrong regardless of the duplicate question.

`0916` has **no `issueYear` at all** — the field is empty.

## 3. Probable duplicate pairs — seven

Two shapes, wanting different remedies.

**Consecutive serials off one sheet** (drop candidates, like the Banca Românească case):

| Pair | Document | Serials |
|---|---|---|
| `0389` / `0490` | Royal Dutch Petroleum stock-purchase warrant, The Hague, Feb 1937 | No. 015281 / No. 015284 |
| `0395` / `0508` | Lung-Tsing-U-Hai Railway 8% treasury bill, f1,000, 1923 | No. 11638 / No. 11639 |
| `0516` / `1036` | Russian perpetual income, 960 silver roubles = £148, 1 March 1822 | neither carries a serial; place reads Pavlovsk on one, St Petersburg on the other |

⚠️ `0389` and `0490` also have **contradictory `notes`**. `0389`: subscription price f4,500 until
31 March 1940, f5,000 after. `0490`: "until March 31, 1940 at f.1,000; from April 1, 1940 at
f.500." `0490`'s figures look garbled — buying a f1,000 share *for* f1,000 is meaningless, and a
price that falls over time contradicts both the other record and the old description of each. I
used `0389`'s figures for both labels.

**Same document catalogued twice** (merge candidates for the `pages[]` mechanism):

| Pair | Document |
|---|---|
| `0534` / `0549` | Vlaardingen orphanage lottery loan, 9 May 1800 — same f75,000, 1,500 shares of f50, same prize ladder |
| `0544` / `0545` | Daniel Changuion plantation loan, 1816 — same f400,000, 6%, ten-year term; typed differently (Prospectus / Regulatory Document) |
| `0485` / `0943` | Stadnitski & Vollenhoven life-annuity negotiation, 1 May 1787 — deed and nominee register, same directors, same notary |
| `0734` / `0735` | Bulgarian 5% Gold Loan of 1902 — bond and conditions sheet; `issueYear` also disagrees, 1903 vs 1902 |

### Sweep results — two more pairs found

`scratchpad/duplicate-sweep.js` compared all 483 records, scoring shared headline totals, shared
denominations, distinctive title tokens and type/country agreement, with a penalty when both
records carry serials that are far apart. 19 candidates scored 7 or above. Two are new and real:

**`0354` / `0980` — Grand Russian Railway 3% bond, Third Emission.** Both 125 silver-metallic
rubles, both from the issue of 105,176 bonds totalling 13,147,000 rubles, both with the same
currency equivalents (500 francs, £20, 402 marks, 236 guilders). Decisively: `0354` is dated
"23 December 1880 / 4 January 1881" and `0980` "4 January 1881" — **the same day, Julian and
Gregorian.** `0354` carries serial No. 220757; `0980` carries none but its notes say "Page 1 of 4;
coupon sheets in goetzmann0982-0983," so it is the multi-page version. Their `issueYear` values
differ, 1880 and 1881, purely from which half of the dual date was taken.
⚠️ **`0354` sits in the block you already rewrote**, so this could only have surfaced from a sweep
of all 483, not from my queue.

**`0340` / `0604` — Confederate cotton loan bond.** Both $1,000, both under the Act of Congress
approved 30 April 1863, both 6 percent, both executed at Richmond on 1 June 1863, both maturing
1 June 1883, both payable in cotton of New Orleans Middling at the same list of cities. **Neither
carries a serial**, which is exactly why nothing could separate them automatically. Thumbnails
differ in size, so they are not the same file. Needs a serial read off the two images.

### Titling problems the sweep exposed

- **`0341` and `0342` are both titled "Confederate States of America Bond"** and are different
  bonds: `0341` is under the Act of 19 August 1861, dated 31 July 1862; `0342` under the Act of
  20 February 1863, dated 2 March 1863 at 7 percent. Identical titles, different instruments.
- **`0447` carries two serials, "No. 3276" and "No. 2106", and `0446` carries "No. 2106".** The
  shared number is probably an extraction artifact — my identifier seeder pulled a second "No."
  from the description. The two records are otherwise clearly distinct emissions (1895 second
  emission at 1,000,000 rubles capital; 1896 at 600,000). Worth checking the actual serials.

### Confirmed NOT duplicates by the sweep

The five Continental Loan Office bills (`0496`, `0529`, `0531`, `0532`, `1038`) all scored high on
title overlap and tripped the serial-adjacency rule, because their bill numbers are small integers
that fall within 50 of each other. They are five different drafts with different payees — Jeremiah
Green, Jesse White, John Simpkins, Anne Brown, Moses Frazier — and different dates in Oct-Nov 1778.
Likewise the two 1776 Continental lottery tickets (`0186` No. 1A, `0215` No. 16m) are different
tickets of the same lottery. **The adjacency rule is unreliable below about serial 100.**

**Recommend a systematic sweep** rather than more catching by eye. `identifiers` is the fast
discriminator — it settled the Bulgarian 1892 cluster (`0648`/`0665`/`0666`, three distinct
serials) and the Russian 1902 pair (`0386`/`0669`, serials 80,000 apart) in seconds.

## 4. Resolved while working

**`0738` has a front after all.** `docs/reverse-pairs.md` lists it as "⏸ On hold — front
unconfirmed." It is the reverse of the Kingdom of Serbia 4% Amortizable Loan of 1895, and `0696`
is a bond of that same loan — same 355,292,000 francs nominal, same law of 8/20 July 1895, same
monopoly pledge. `0696` carries serial No. 033,596; `0738` has none, as expected of a reverse.
⚠️ The dedup memory lists `0738` among "genuinely frontless reverses — don't merge." That is now
wrong for `0738`; `0235` and `0728` still stand.

**`0567` is a new frontless reverse.** It describes itself as "the reverse, or conditions, face"
of a Costa Rica Railway £100 First Mortgage Debenture. The other Costa Rica record, `0568`, is a
*Second* Debenture from a different £600,000 issue — not its front. Belongs in reverse-pairs §C
alongside `0345`.

**Checked and NOT duplicates:** `0525`/`0616`/`0631` (three Amsterdam Russian assignat
certificates, different syndicates and dates); `0498`/`0625` (two Massachusetts commodity-indexed
notes, different payees and amounts); `0601`/`0621` (same buyer, a year apart, second in Série B);
`0648`/`0665`/`0666`; `0386`/`0669`; `0388`/`1028` (a share vs a chain-declaration form about a
share); `0954`/`0682` (Mississippi Union Bank bond, and the 1925 London deposit certificate for
that repudiated issue); `0980`/`1010` (Grand Russian Railway bond, and a 1924 receipt for its
talons).

## 5. Facts held back — not printed, per "never print a guess"

| Record | Held back | Why |
|---|---|---|
| `0708` | "floated by the Huerta government" | ⚠️ **Wrong-entity risk.** Mexico, June 1913: Huerta had seized power in February and his legitimacy was contested. The bond names only the Federal Government of the United Mexican States. |
| `0524` | "under the Martínez de la Rosa government" | 1835 Spain, adjacent to your 1836 Carlist/Isabelline case. The certificate names no ministry. |
| `0387` | "floated chiefly on German capital" (1905 Russian loan) | Searched; Reichsmark denominations confirm, but no source found for *chiefly* German placement. |
| `0703` | The debased "feble" coinage as the work of Mariano Melgarejo | Named-figure claim the bond does not make. |
| `0707` | "issued under President Díaz and finance minister Limantour" | Named figures not on the document. |
| `0591` | Baron Hirsch's Balkan rail network | Named-figure claim; the company name itself is on the document and stays. |
| `0556` | "shortly before the company's nationalisation" | Egyptian nationalisations came in 1961; plausible, not stated on the object. |
| `0598` | "the Six-Power consortium that financed Yuan Shikai's new republic" | Named figure plus consortium attribution. |
| `0388` | The requesting member's name, read as "P. Boeken Jr." | Officers rule: unnamed unless legibly confirmed. |
| `0468` | The obligors' names, incl. "Nathan H. Mallon[?]" | The source itself marked the reading uncertain. |
| `0504` | The gentleman from whom shares were taken over | Illegible in the source. |
| `0399` | "gold workings in French colonial Asia" (Nam Kok) | The old description hedged this itself with "points to." |
| `0402` | The engraver's name | Transcription truncated to "Bank Note Co., New York" — almost certainly American Bank Note Co., but that is a guess. |
| `0420` | The Warsaw printer | Transcription garbled. |
| `0916` | "$40 million of bank credit" behind the Waldorf-Astoria | Unsourced figure. |

**One claim verified and restored:** `0386`'s Boxer Indemnity purpose. The 1902 loan was raised
under the Ukase of 1 March 1902 in compensation for Boxer Rebellion losses — Russia's 28.7% share
of the 450,000,000-tael indemnity. Sources: Spink lot CSS36000003, numistoria listings.
⚠️ Both give the loan's capital as **181,959,000 rubles**; the catalogue says **181,950,000**.

## 6. Contradictions inside the source descriptions

| Record | Problem |
|---|---|
| `0450` | Certificate dated **1 February 1853**, but the constituting deed before Maître Fould is **2 April 1853** — the share would predate the company's formation by two months. |
| `0345` | `notes` say "principal due July 1876"; the docket reads **JULY 1893**, and the description agrees. Already in `PENDING_XLSX_FIXES.md`. |
| `0584` / `0729` | Same 1907 loan, one titled "**Kingdom** of Bulgaria," the other "**Principality**." Bulgaria became a kingdom in 1908, so a 1907 loan is Principality-era. |
| `0648` / `0665` / `0666` | Same 1892 Bulgarian loan under three different titles ("State Mortgage Loan," "Hypothecary State Loan," "Hypothecary State Loan Double"). |
| `0636` | Description says 6 per cent, transcription says 5. `notes` independently support 6. |
| `0964` | Description 6.5%, transcription 4.5%. `notes` support 6.5%. |
| `1021` | Description 6.25 per cent, transcription 6%. |
| `0668` | Description's 85,412,400 appears nowhere in the transcription. |
| `0676` | Description's 310,498,000 appears nowhere in the transcription. |
| `0398` | Transcription gives the printer as "Imp. F. Pano, **Paris**" on a warrant sealed at **London** under the English Companies Acts. Possibly misfiled. Not used. |
| `0903` | The two transcriptions give different printers for the same pair of Rostock bonds. Not used. |

## 7. Editorial asides in the public description field — swept, all already fixed

Notes written for cataloguers, sitting in the visitor-facing field. Two turned up during the
rewrite, so I swept all 483 (`scratchpad/find-asides.js`, results in
`scratchpad/editorial-asides.tsv`).

**Six hits across five records, currently live on the site:**

| Record | The aside |
|---|---|
| `0595` | *"…is Qing-dynasty Chinese, not the Japanese yen instrument of earlier cataloguing."* |
| `0933` | *"It was formerly bound with the Garphytte share receipt (goetzmann0931) and is here catalogued as a separate item."* — also the only description that cross-references another record by id |
| `0393` | *"It is in all likelihood the oldest item in the collection."* — a claim about the collection, not the object, and unverified |
| `0468` | *"the obligors — Nathan H. Mallon[?] …"* — an unresolved reading marker meant for staff |
| `1021` | *"…among them Cornelis Jauckly[?]."* — same |

**All five are records I rewrote, and every aside is already gone from the shipping text.** None
appear in the 121 descriptions you rewrote — that block is clean.

One borderline case left in deliberately: `1021` opens "Two related documents of 1622 and 1623 …
photographed together." That describes how the two sheets are presented in the single image, which
a visitor looking at that image needs. Say the word if you would rather it went.

⚠️ **These are only fixed once the rewrite is applied.** Until then all six are live.

## 8. Labels left thin — six of seven now written up

These came out at 39–58 words because deletion removed nearly everything the old description had.
Rewritten from their transcriptions:

| Record | Before | After |
|---|---|---|
| `0403` | 48w | **140w** — New York Central RR bond; the certificate's own consolidation clause, interest warrants, and transfer restriction recovered |
| `0453` | 49w | **141w** — Sixth Austrian War Loan; series size, seven denominations, 1928–1957 drawing schedule, Wiener Zeitung publication |
| `0454` | 58w | **128w** — Eighth Austrian War Loan; twenty-two coupons, September drawings, 1 March repayment |
| `0903` | 69w | **113w** — Rostock 50 RM; the clause deferring all interest until reparations are extinguished |
| `0720` | 48w | **87w** — USSR 1946 loan; series, bond and category numbers, the union-republic micro-text band |
| `0729` | 39w | **72w** — Bulgarian 1907 gold loan; the reverse's conditions and amortisation table |
| `0558` | 46w | **67w** — Mexican consolidated debt; the 3 percent rate was missing entirely |

**`0560` remains thin at 49 words** — Ethiopian railway share. See §12: it had no transcription at
all, and the one now attached is too garbled to build on.

⚠️ **`0403`'s president is held back.** Its transcription reads "Austin Corwin, President." The New
York Central's president in 1858 was Erastus Corning, so this looks like a misreading. The label
says "signed by the president and the treasurer" without naming either.

## 9. Repaired: `0558` was holding `0560`'s transcription

The July 2026 split of a mixed record into **goetzmann0558** (Mexican consolidated debt bond) and
**goetzmann0560** (Ethiopian railway share) moved the description but not the transcription. 0558
kept the combined text of both documents, 4,923 characters in four sections; 0560 was left with
none — which is why it was the only record in the collection with an empty transcription.

**Split and applied** (`scratchpad/split-0558-transcription.js`, classified by language marker
rather than position): 0558 keeps the two Spanish sections, 2,474 chars; 0560 receives the two
French sections, 2,457 chars. Nothing dropped, and a field-by-field comparison against the previous
commit confirms **no record changed outside those two transcriptions**. `transcription` is not
Excel-backed, so this survives the next import. **Every record in the collection now has one.**

⚠️ **It also exposed a date problem on `0558`.** Three different years are in play:

| Source | Year |
|---|---|
| `issueYear` and the description | **1851** |
| The bond certificate, per its own transcription | **"Emitido en junio de 1881"** |
| The accompanying decree text | **1858–1859** |

1851 appears nowhere in the transcription. I kept the description's date in the label, per
description-wins, but one of these is wrong and the 30-year gap is not a rounding error.

## 10. Date position — found and fixed

Your rule is the date in the opening sentence. My per-batch check had a broken abbreviation guard
and under-reported, so I re-audited the finished set. Of 42 initially flagged: **12 were false
positives** (the splitter breaking on `42nd St.`, `Notary H.`, `Zilhicce 1282`), **5 are objects
the source gives no issue date for**, and **25 were genuine misses**. The 25 are corrected — the
date now opens the sentence, and the duplicate mention later in the label was removed.

**Still without an early date, legitimately:**

| Record | Why |
|---|---|
| `0471` | Holladay blank check; the printed date reads only "186_" |
| `0547` | Pekin Syndicate warrant; no date in the source |
| `0916` | Waldorf-Astoria SPECIMEN; `issueYear` field is empty |
| `0953` | Lyon bridge share; source gives no issue date, only a sinking fund opening 1790 |
| `0964` | 170 Broadway bond; source gives the 1949 maturity but no issue date |

**No date at all in the label:** `0407` (unissued remainder), `0474` (blank form), `0728` (a
reverse), `0560` (no date in source, and the one record with no transcription).

## 11. Deliberately left long

- `0498` (184w) — Massachusetts commodity-indexed note, 1780. Enumerates its own market basket
  (five bushels of corn, 68 4/7 lb of beef, 10 lb of wool, 16 lb of sole leather) and the 32.5-fold
  price comparison to the 1777 Act to prevent Monopoly and Oppression. Cutting any of it would
  remove what makes the object remarkable.
- `0511`, `0537`, `0625`, `1033`, `1035` — royal annuity and sovereign loan contracts whose terms
  *are* the document.

## 12. Objects with no date on them

`0407`, `0474`, `0533`, `0547`, `0560`, `0728`, `0916`. Mostly unissued blanks, specimens and
reverses.

## Process note

**The 60–110 word ceiling I enforced early is not in your guide** — it came from the draft I
inferred before you sent yours, which says only "one paragraph by default (wall-label length)."
Your own rewrites run a median of 84 words. Mine run a median of 102, range 39–184. If you want a
hard ceiling, name it and I will apply it in one pass.

**Totals:** 54,169 → 36,456 words, a 33% cut. Zero em-dashes, zero non-Latin script.
