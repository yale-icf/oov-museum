# Record ids — what is taken, and where new material goes

Settled with the user 2026-09-03.

## New material starts at `goetzmann1100`

Number consecutively upward from there: `goetzmann1100`, `1101`, `1102`, …

`goetzmann1098` and `1099` are free but **deliberately skipped**, so the new sequence starts on
a round number and is visually obvious as a later batch.

## ⚠️ Do not fill the gaps

| gap | size | why it is reserved |
|---|---|---|
| `0851`–`0899` | 49 | unphotographed run inside the numbered range |
| `0976`–`0979` | 4 | ditto |

**The user wants these left blank** — the documents they were numbered for could still be added,
and the numbering should stay meaningful.

Separately, ids of **removed records keep their workbook rows on purpose** (`0294`, `0393`,
`0493`, `1031`, and the ranges `0004`–`0078` and `0134`–`0178`). Reusing one of those numbers
would silently attach new material to an old row's history. Never reuse a number that has ever
been used.

## The id space as of 2026-09-03

```
live records + page leaves   730
rows in the workbook         868   (includes rows kept for removed records)
masters photographed       1,036   (includes the 139 uncatalogued ICF files)
highest id used anywhere   goetzmann1097
```

`scratchpad/id-space.py` recomputes all of this. **Run it before allocating** — the ceiling
moves whenever masters are added, and a master can exist for a document that was never
catalogued, which is exactly the trap the `0741`–`0850` ICF batch sets.

## Where the files go

**Images** — the masters tree, one folder per batch, alongside the existing ones:

```
C:\Users\ks2479\Documents\my-project\origins-of-value\JPEG Files\
    TO-ADD_Goetzmann 1100-… JPEG\goetzmann1100.jpg
```

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
