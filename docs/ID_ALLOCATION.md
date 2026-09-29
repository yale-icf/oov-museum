# Record ids — what is taken, and where new material goes

Settled with the user 2026-09-03.

## ▶ Next new id: `goetzmann2054` (as of 2026-09-28)

Everything up to `2053` is taken (the lottery album ends there). Number consecutively upward.

History: new material was first set to start at `goetzmann1100` (2026-09-03); the September
2026 intake then filled 1100–1799, displaced documents took 1800–1801, and the lottery album
took 1802–2053. `goetzmann1098` and `1099` were free and **deliberately skipped**, so the 1100
sequence would start on a round number; leave them blank.

## ⚠️ Do not fill the gaps

| gap | size | why it is reserved |
|---|---|---|
| `0976`–`0979` | 4 | unphotographed run inside the numbered range |
| `1098`–`1099` | 2 | skipped so the 1100 batch started on a round number |

⚠️ The `0851`–`0899` line that stood here was **out of date**: all 49 of those numbers are live
records (checked 2026-09-28).

**The user wants these left blank** — the documents they were numbered for could still be added,
and the numbering should stay meaningful.

Separately, ids of **removed records keep their workbook rows on purpose** (`0294`, `0393`,
`0493`, `1031`, and the ranges `0004`–`0078` and `0134`–`0178`). Reusing one of those numbers
would silently attach new material to an old row's history. Never reuse a number that has ever
been used.

⚠️ **`0393` was reused anyway**, by the September 2026 intake, which shipped a 1795 Loterie
Nationale ticket under it. The number had belonged to a removed record — a Coptic papyrus
fragment, still in `goetzmann Misc Files Removed/`. The record and its picture agree, so nothing
is broken, but that row's history is no longer its own. See `REUSED_NUMBERS.md`.

## `1800`–` ` — displaced documents, above the intake ceiling

The September 2026 intake runs to `1799`. Numbers from **`1800`** upward are allocated to
documents **displaced by a reused number and never rescanned**, so that the intake keeps the
number it shipped under and the old document still gets one of its own:

| id | document | displaced from |
|---|---|---|
| `1800` | Republic of China Construction Gold Bonds US dollar bond, 1940 | `0318` |
| `1801` | London Stock Exchange WWI good delivery certificate, 1916 | `0526` |

These are tiled from the surviving pre-intake masters, which are byte-identical to the copies in
`goetzmann Misc Files Removed/`. Full account in `REUSED_NUMBERS.md`.

## The id space as of 2026-09-28

```
live records                 964
live page leaves           1,924
highest id used anywhere   goetzmann2053
unplaced masters             211   in JPEG Files/_Unplaced (not on site)/: 170 ICF-batch source
                                   copies (all catalogued or deliberately excluded), 4 other
                                   uncatalogued documents, 37 superseded scans
```

`scratchpad/id-space.py` recomputes all of this. **Run it before allocating** — the ceiling
moves whenever masters are added, and a master can exist for a document that was never
catalogued, which is exactly the trap the `0741`–`0850` ICF batch sets.

## Where the files go

**Images** — since the 2026-09-28 reorganization the masters tree has one folder per hundred,
holding exactly one master per live leaf:

```
C:\Users\ks2479\Documents\my-project\origins-of-value\JPEG Files\
    2000-2099\goetzmann2054.jpg
```

Scans not (yet) on the site go under `_Unplaced (not on site)\`, never in a numbered folder.
`regen-image.js` looks one folder level down, so a new hundred folder (`goetzmann2100-2199`) needs no
code change.

⚠️ **Filenames must be lowercase `goetzmannNNNN.jpg`.** Twelve rows in the provenance database
spell the id with a capital G and that cost seven ICF records their owner data until it was
caught — see the `oov-virtual-museum-database` memory.

A document with more than one view (front and back, a coupon sheet, a wrapper) takes **one id
per leaf, consecutively**; they are grouped afterwards into the record's `pages[]` array.

**Data** — one row per image in **`oov_data_new_edit_2.xlsx`**, keyed by `filename`. Fill
`title`, `description`, `type`, `issueDate`, `period`, `issuingCountry`, `subjectCountry`,
`currency`, `language`, `keywords`, `owner`, `notes`. Leave `path`, `numberPages` and the
purchase columns blank if unknown.

⚠️ `type` and `period` are **controlled vocabularies** — a new value creates a phantom facet and
can drop the record out of the type-based browse shelves. See the document-type note in memory.

## What happens next, once the files are in place

1. Generate DZI tiles from each master — 512px, overlap 2, jpeg (`scratchpad/retile.js` does one;
   the same `sharp().tile()` call handles a batch).
2. Generate thumbnails — 400px wide, quality 82.
3. Upload tiles to R2 with `upload-tiles.js` (the live site serves tiles from the bucket, not
   the repo).
4. Import the workbook with `py excel_to_json.py`, group any multi-leaf documents into `pages[]`.
5. Update the count in `about.html` — **two places** — and rebuild `data/filter-index.json`.
6. Run the site checks, and check for duplicate titles.
