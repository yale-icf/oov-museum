# Twelve records were retiled from the wrong documents — FIXED

## What happened

Commit **`fae254d`**, *"Retile 12 records from better masters; reject 6 that would
have been downgrades"*, took the September 2026 intake's **"replacement" bucket** —
24 images described as fuller scans of things already on the site — and retiled
twelve live records from them.

It checked one thing: that each new master was **bigger** than the live tile set.
It never checked that the new master was **the same document**. Its own commit
message says the comparison "turned out to matter a great deal" — but the
comparison was of size, not of identity.

The intake's "replacement" label was not reliable. For most of these twelve the
new master is a **different document entirely**, so the record kept its title,
description and OCR while its picture was replaced by something unrelated.

⚠️ This is a regression introduced by earlier work in this project, not a
pre-existing fault in the collection.

## The twelve

`0318` `0526` `0527` `0317` `0502` `0509` `0541` `0542` `0345` `0549` `0737` `0511`

Confirmed **wrong document** after retiling — the record's own OCR transcribes one
document and its tiles show another:

| record | its title and OCR | what its tiles now show |
|---|---|---|
| `0345` | State of South Carolina consolidation bond No. 1602 | Ostend Company receipt, Antwerp 1723 |
| `0549` | Vlaardingen orphanage negotiatie, 1800 | Phelps Dodge Corporation share, 1950 |
| `0511` | Royal life annuity, Paris, 26 July 1759 | Wabash Railroad deposit certificate, 1915 |
| `0527` | US Treasury deferred stock No. 4294, 1792 | St. Louis–San Francisco Railway common stock |
| `0502` | Garden of Eden plantation act, 4 March 1817 | Compañía Petrolera Mexicana "La Tampiqueña", 1914 |
| `0509` | Middelburg plantation bond No. 99 | Russian perpetual bond, stamped 1860s–1900s |
| `0526` | London Stock Exchange re-opening regulations, 1916 | International Mercantile Marine share, 1937 |
| `0318` | Republic of China construction gold bond | German External Loan 1924, Italian issue |
| `0541` | a Dutch printed act ("Copia") | United States of Brazil 100 bond |
| `0737` | a coupon sheet | a Chinese bond with coupons |

`0317` and `0542` look like genuine improvements of the same document and need a
closer look before being counted either way.

## ✅ Everything is recoverable

**All twelve original masters still exist**, at full resolution, in the pre-intake
source folders under `JPEG Files/` — `goetzmann 0286-0375 JPEG`, `Goetzmann
0465-0546 JPEG`, `Goetzmann 0547-0603 JPEG`, `Goetzmann 0696-0738 JPEG`. Sizes run
from 1536×1112 to 5984×3999. Nothing is lost; each record can be retiled back to
its own document exactly.

The pre-retile 400 px thumbnails also survive in git at `218952a`, which is how the
before/after comparison above was made.

## How this was found, and how to find more

`scratchpad/find-swapped-images.py`. Each `scripts/ocr_boxes/<id>.json` stores
`img_w` and `img_h` — the size of the image the OCR was actually read from. The
absolute numbers are a downscale and mean nothing, but the **aspect ratio** is a
property of the sheet. Where the stored aspect disagrees with the aspect of the
record's current `.dzi`, the picture under that id is not the picture the OCR was
read from.

⚠️ A **reciprocal** aspect (a × b ≈ 1) is the same sheet turned 90°, not a swap;
twelve records show that and are benign. ⚠️ A match proves nothing — two documents
can share a shape — so this finds candidates, not verdicts.

Current genuine mismatches, all but one of them among the retiled twelve:

- **`0509`** 54%  ocr 0.628 → now 1.377 — Middelburg Plantation Bond for Essequibo and Demerara, 1768
- **`0527`** 47%  ocr 0.837 → now 1.591 — United States Treasury Six Per Cent Deferred Stock Certificate, Philadelphia, 1792
- **`0526`** 42%  ocr 0.901 → now 1.550 — London Stock Exchange WWI Good Delivery Certificate, 1916
- **`0502`** 40%  ocr 0.666 → now 1.119 — Demerara Plantation Mortgage Deed, 1817
- **`0318`** 13%  ocr 0.778 → now 0.678 — Republic of China Construction Gold Bonds US Dollar Bond, 1940
- **`1027`** 10%  ocr 1.333 → now 1.477 — Monte di Pietà of Florence assignment of luoghi, Florence, 1627
- **`0542`** 8%  ocr 0.634 → now 0.584 — Bourbon Princes in Exile Loan Certificate, Amsterdam, 1793

`1027` is the exception and is not one of the twelve; it needs its own look.

## ⚠️ Three of these were already "repaired", on a wrong premise

Before the cause was known, `0345`, `0549` and `0511` were repaired by rewriting
each record to describe the document its picture showed, and moving its text and
OCR to the intake document the text fitted — `1373`, `1418` and `1437`.

That is the right treatment for a **reused number**, where a number really does
change owner, as happened with the 68 repurposed ids earlier in the intake. It is
the wrong treatment here, because the cause was a bad retile, not a reuse: the
record never stopped being its own document.

## ✅ What was done (2026-09-16)

All of it. The detector now reports **one** genuine mismatch left in the whole
collection, `1027`, which is not one of the twelve and still needs its own look.

**Seven retiled from their own pre-intake originals** and re-uploaded — `0318`,
`0502`, `0509`, `0526`, `0541`, `0542`, `0549`.

**Three retiled from the INTAKE scan of the same document**, which is larger than
the pre-intake original, with the intake's further leaves attached — so these end
up better than they were before the regression:

| record | retiled from | leaves now |
|---|---|---|
| `0345` South Carolina consolidation bond | `1373` | 2 |
| `0511` Royal life annuity, Paris 1759 | `1437` | 5 |
| `0527` US Treasury deferred stock, 1792 | `1421` | 2 |

The three records created during the mistaken repair — `1373`, `1437`, `1421` —
are removed; their leaves are now pages of the records above.

**Text reverted** on `0345`, `0549` and `0511` from git, and their transcriptions
and word boxes moved back. ⚠️ One correction was re-applied afterwards: `0345`
had the year as **1872**, and the intake's fuller scan shows "Columbia S.C. this
First day of January A.D. **1874**", under an act approved 22 December 1873. It is
also unissued.

⚠️ `0549` and `1418` are deliberately **not** merged: `0549`'s own original is
restored, and `1418` is a second set of the Vlaardingen negotiatie with its own
hundred-guilder participation. They stand as multiples.

⚠️ The documents that had been wrongly put under these ids are not lost — they are
the intake masters, still in the TO-ADD folders, and can be catalogued under their
own ids: an Ostend Company receipt of 1723, a Phelps Dodge share of 1950, a Wabash
Railroad deposit certificate of 1915, a St. Louis–San Francisco share, a Mexican
oil share of 1914, a Russian perpetual bond, an International Mercantile Marine
share, an Italian Dawes bond, a Brazil bond and a coupon sheet.

## The fix as it was planned

1. Retile all twelve from the **original** masters, restoring each record's own
   document, and re-upload to R2.
2. Revert the three repairs: restore the original title, description and
   identifiers on `0345`, `0549` and `0511`, and move their OCR and word boxes
   back.
3. Then treat `1373`, `1418` and `1437` as what they actually are — the intake's
   **fuller scans of those same documents** — and merge them into the restored
   records as additional leaves, the pattern used throughout this range.

The net result is better than before the regression: each record gets its own
document back, at the intake's higher resolution wherever that is genuinely the
same sheet, plus the further leaves the single-page originals never had.

## The lesson, for the next intake

A label in a spreadsheet saying "replacement" is a claim, not a fact, and **bigger
is not the same as same**. Before retiling anything over a live record, compare
the two pictures — `scratchpad/dupe-contact.js` builds the side-by-side sheets —
and confirm the manuscript details match, not merely the printed form. The
collection's own `docs/INTAKE_DUPLICATES.md` sets out the three modes and when
each applies.
