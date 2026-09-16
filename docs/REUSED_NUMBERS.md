# Reused numbers — what they are, and how the twelve were resolved

Completed 2026-09-16.

## What a reused number is

Some pieces in the collection had only their **first leaf** ever scanned. The September 2026
intake rescanned those pieces **whole, under new numbers**, and then **reused the old numbers
for different documents** — shipping a file named `goetzmann<old>.jpg` in a TO-ADD folder.

So an old number ends up wanted by two documents at once:

- the **new** document the intake shipped under it, and
- the **old** document that used to hold it, which now lives at its new intake number.

The ruling, settled with the user: **the document moves to the intake id and the old number is
freed for the new document.** Their own example — *"0608 was only the front page. So 1407 now
has all the pages. Instead of combining the first page from the old set, use all the new
images. Then 0608 becomes a new image altogether and the old doc now lives at 1407."*

⚠️ **The first leaf is not combined with the new scan.** The intake's set is used entire; the
old single-leaf master is superseded, not appended.

## ⚠️ `fae254d` was right, and was wrongly reverted

Commit **`fae254d`**, *"Retile 12 records from better masters"*, retiled twelve live records
from the intake. That was **correct** — those twelve are reused numbers, and the intake's file
really does belong on that number.

It was then diagnosed here as a regression and ten of the twelve had their pictures reverted.
That diagnosis was wrong. What `fae254d` left undone was not the pictures but the **text**: it
moved no titles, descriptions or OCR, so each record showed one document and described another.
The reversal was undone in `scratchpad/undo-my-revert.py` and the text migration finished in
`scratchpad/finish-reused.py` and `scratchpad/move-unrescanned.py`.

The tell that settles it: the intake ships a file under the **exact old name**. If
`TO-ADD_Goetzmann 0500/goetzmann0502.jpg` exists and is not the document record `0502`
describes, the number was reused. A bad retile would have pulled in a file named something
else.

## How each old document's new home was proven

`JPEG Files/goetzmann Misc Files Removed/` holds the **displaced old masters at full
resolution** — pulled out of the working set when their numbers were reused.
`scratchpad/check-removed.js` confirms the direction: for every reused number the removed file
matches the *pre-retile* picture (0.945–0.998) and not the picture now live.

⚠️ That folder mixes two cases. Where the removed file **matches the live picture**, it is
simply an old master superseded by a better rescan of the same document — `0214` `0228` `0235`
`0416` `0426` `0465` `0533`–`0538` `0573` `0574` `1008`–`1014`. Only the non-matching ones are
reused numbers.

`scratchpad/removed-to-intake.js` then matches each old master against every intake image in
every TO-ADD folder, at a 48×48 signature off the full-res master.

⚠️ **The score cannot pick the right copy, only the right act.** These are printed acts issued
in numbered copies, so several intake leaves are near identical by design. Every match below was
confirmed **on the plate**, by manuscript detail:

| old | home | what proved it |
|---|---|---|
| `0509` | `1432` | N° 90, identical endorsements and coupon notes |
| `0541` | `1403` | identical foxing spot at the top edge — `1292` is a **different copy**, carrying pencil dealer marks `1403` does not |
| `0502` | `1428` | identical pencil "442", signature, ink blots and foxing dots |
| `0542` | `1451` | identical ink fleck at the left edge; the plate's **N° 34** is `0542`'s own identifier |
| `0549` | `1418` | identical sheet, down to the crease across the prize table |
| `0345` | `1373` | done earlier, in `undo-my-revert.py` |
| `0511` | `1437` | ditto |
| `0527` | `1421` | ditto |

## The home record keeps its own cataloguing

The home records were written **from the whole document** during the 1200–1799 pass; the old
records described a single leaf. So the home keeps its title and description and only **gains**
what the old record had and it lacked: `owner` (provenance), `transcription`, the OCR text and
word boxes, `identifiers`, `namedIndividuals`.

⚠️ **One correction travelled the other way.** `1432` was dated **1760**; the plate's interest
clause spells *"Agt en Zestig"* (1768), the first due date *"Negen en Zestig"* (1769), and the
subscription reads *"Middelburg den Eersten Januarij 1768"*. The old record `0509` had it right.
Same long-serif digit trap as `0476`, `0603` and `1035`. The plate also names the lender —
six hundred guilders received from *D'Heer S. Elias* — which neither record had.

## Two documents were never rescanned — `1800` and `1801`

`0318` and `0526` are reused numbers whose displaced document has **no rescan anywhere**.
`broad-find.js` over all 2,108 source images finds each old master only in its own pre-intake
folder, at 1.000; the best intake matches (0.507 and 0.854) are plainly different documents —
`0526`'s cluster in `1040-1097` are Suriname copia of 1767, matching only on page shape.

The intake keeps the number it shipped under, so these two old documents were given **numbers
of their own above the intake ceiling** and retiled from the surviving masters:

- **`1800`** — Republic of China Construction Gold Bonds US dollar bond, 1940 (was `0318`)
- **`1801`** — London Stock Exchange WWI good delivery certificate, 1916 (was `0526`)

⚠️ **Provenance is keyed by filename**, so a reused number's provenance row was written for
whichever document held it when the row was made. The same `owner` is kept on both sides of each
split — the same physical collection supplied both — rather than guessed at.

## What the twelve are now

| id | now holds | the old document went to |
|---|---|---|
| `0317` | *not a reused number* — the intake's file is the **same** bond No. 53065, flat instead of folded | — |
| `0318` | German External Loan 1924, Italian issue, 500 lire | `1800` |
| `0345` | Ostend Company subscription receipt, Antwerp 1723 | `1373` |
| `0393` | Loterie Nationale ticket, 1795 | ⚠️ see below |
| `0502` | Compañía Petrolera Mexicana "La Tampiqueña" share, Tampico 1914 | `1428` |
| `0509` | Russian State third loan perpetual inscription, 1819 | `1432` |
| `0511` | Wabash Railroad deposit certificate, Amsterdam 1915 | `1437` |
| `0526` | International Mercantile Marine share, 1937 | `1801` |
| `0527` | St. Louis–San Francisco Railway common stock, 1931 | `1421` |
| `0541` | United States of Brazil funding bond of 1931, with its coupon sheet at `0542` | `1403` |
| `0542` | *no longer a record* — it is page 2 of `0541`, both numbered 82941 | `1451` |
| `0549` | Phelps Dodge Corporation share, 1950 | `1418` |

⚠️ **`0393` breaks the rule in `ID_ALLOCATION.md`.** That number belonged to a **removed**
record — its old master is a Coptic papyrus fragment — and removed numbers are supposed never to
be reused. The intake reused it anyway. The record and its picture now agree, so nothing is
broken, but the papyrus has no record and the workbook row's history is no longer its own.

## Two round-trip bugs this work exposed

Both were pre-existing and both are fixed.

1. **`language` was split on commas only** in `excel_to_json.py`, but every sync script joins
   multi-value cells with `' | '`. So `German | English` collapsed into one value and the record
   lost its language facets on each round-trip. **42 records** were silently affected. The
   separator now matches the one `currency` already used.

2. **`issueYear` is derived from the `issueDate` column**, which no sync script writes. A
   recatalogued number therefore kept the **old document's year** indefinitely — `0527` was
   still dated 1792 months after it became a 1931 railway certificate. Likewise `location` is
   derived from `subjectCountry` + `issuingCountry`, so setting `location` in the JSON alone is
   reverted on the next import.

⚠️ **After recataloguing a number, set `issueDate`, `issuingCountry` and `subjectCountry` in the
workbook, then round-trip twice and confirm the second run reports zero differences.**

## Tools

| script | what it does |
|---|---|
| `scratchpad/check-removed.js` | which side of the swap each removed master is on |
| `scratchpad/removed-to-intake.js` | match a removed master against every TO-ADD image |
| `scratchpad/broad-find.js` | last resort — search all 2,108 source images |
| `scratchpad/rband.js` | crop a horizontal band of any master, `rem:0509` for a removed one |
| `scratchpad/sheet.js` | contact sheet of arbitrary plates, labels burnt in |
| `scratchpad/finish-reused.py` | the five text migrations |
| `scratchpad/move-unrescanned.py` | `0318`/`0526` → `1800`/`1801` |
