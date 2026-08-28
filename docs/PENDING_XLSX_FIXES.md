# Pending corrections — waiting on the Excel workbook

Field corrections that are **verified but not yet applied**, because the fields they touch are
Excel-backed. `excel_to_json.py` overwrites title, description, type, location, period,
keywords, owner, currency, language, issueYear, creator and **notes** from the sheet, so a fix
made directly in `data/museum-data.json` is silently reverted at the next import. Each of these
has to land in the workbook — or be re-applied to the JSON immediately after an import.

## ✅ DONE — goetzmann0416: registered office No. 5, and the printer is Cadenat

Verified from the image 2026-08-27 (`scratchpad/reconstruct.js goetzmann0416`). The certificate
reads **`SIÈGE SOCIAL: 5, Allées Paul-Riquet, BÉZIERS`**. Both the `description` and the `notes`
say **1, Allées Paul Riquet**. Both fields are Excel-backed, so both the sheet and the JSON were written 2026-08-27 by `scratchpad/fix-0416.py` (verified 0 collateral). A second error surfaced in the same check: the imprint reads **`LITH. CADENAT FRÈRES. BÉZIERS`**, where the description had written *Cadenet*.

| Row | Field | Now | Should be |
|---|---|---|---|
| 417 | `description` | `…at 1, Allées Paul Riquet…` · `Cadenet Frères` | `…at 5, Allées Paul-Riquet…` · `Cadenat Frères` |
| 417 | `notes` | `…1, Allées Paul Riquet.` | `…5, Allées Paul-Riquet.` |

⚠️ **Do not remove this record as a poster.** It reads like one — a lavish Art Nouveau design with
an allegorical figure and the Grand Café de la Paix drawn behind her — but the image shows a
genuine issued security: *Part de Fondateur*, statutes before Maître Vidal of 11 December 1920, a
stamp-duty octagon citing the *Journal Officiel* of 11 March 1921, serial No. 1335, and two
manuscript administrators' signatures. The record that genuinely is a poster is **`goetzmann0324`**,
the Hypothec Bank of Japan sales poster, typed `Illustration`. Checked and kept on the user's
instruction 2026-08-27.

## ✅ DONE — the six issueDate corrections and the `identifiers` column

Both written to `oov_data_new_edit_2.xlsx` on 2026-08-27, each verified 0 collateral.

**issueDate** (`scratchpad/fix-issuedates.py`, 7 cells). The script refuses to write a value that
would not re-derive the `issueYear` already in the JSON, so the sheet and the JSON cannot drift
apart again through this route.

| Row | Record | Was | Now |
|---|---|---|---|
| 641 | `0640` | `ca. 1965-1980` | `February 1990` |
| 642 | `0641` | `ca. 1970-1985` | `1 October 1987` |
| 639 | `0638` | `ca. 1928-1933` | `1 April 1914` |
| 647 | `0646` | `ca. 1927-1935` | `1 September 1930` |
| 632 | `0631` | `December 31, 1832` | `31 December 1825` |
| 344 | `0343` | `1920-01-01` | `ca. 1928` |

It is **six, not the five listed further down** — `0343` was settled from the image after that
section was written. The certificate carries no date at all, only a printed notice that stamp duty
was discharged under an authorisation published in the *Journal Officiel* of 3 April 1928, so the
cell reads `ca. 1928`: an inference, written as one. `0631`'s `notes` carried the same impossible
pair (a certificate dated two years before its own prospectus) and were corrected with it.

**`identifiers` column** added at index 21, **359 primary rows filled**, 124 left blank, sub-page
rows skipped. Values joined with ` | ` — never a comma, which these numbers contain. The workbook
is now 868 rows × 21 columns.

## ⚠️ `excel_to_json.py` pointed at the wrong workbook — fixed

`EXCEL_PATH` was hardcoded to **`oov_data_new.xlsx`**, which predates every edit above. Running the
import would have silently reverted the 356 labels, the six dates, the identifiers column and the
duplicate notes in one go. The default is now `oov_data_new_edit_2.xlsx`, with a `--file` override
and a refusal to read a workbook that is open in Excel.

## ✅ DONE — the 356 rewritten labels are in the workbook

Applied 2026-08-27 by `scratchpad/apply-rewrites.py`: **358 cells, 356 `description` + 2 `notes`,
verified 0 collateral.** Descriptions 54,241 → 37,200 words, a 31% cut. Sheet rows 382–869. The
labels now live in the workbook only — they reach `data/museum-data.json` at the next
`excel_to_json.py` run, which has not been done.

**Nothing hand-edited was overwritten.** `scratchpad/rewrite-overlap-check.py` confirmed all 356
target rows still held the JSON text verbatim, clear of the user's edited block (rows 1–381); the
apply script re-checks this per row and skips any that has drifted.

**The duplicate and off-the-website notes were the thing at risk.** The rewrite strips cataloguing
asides out of the visitor-facing description, so anything the description alone was carrying had to
land in `notes` first. `scratchpad/preserve-audit.py` found the whole exposure to be two records:

| Record | What would have been lost |
|---|---|
| `goetzmann0595` | The cut sentence "not the Japanese yen instrument of earlier cataloguing" was the **only** place the correction lived — `notes` still described a Meiji-era Japanese document. Notes now record the Qing reading, the 同治十三年新正月 title slip and that the yen attribution is superseded. |
| `goetzmann0494` | "A faded copy … catalogued as goetzmann0493 and dropped from the website" existed in the JSON only; the next import would have reverted it. |

`goetzmann0933`'s "formerly bound with goetzmann0931" already read the same in both. Sixteen
duplicate / off-the-website notes are now carried by the workbook, including the retained rows for
`0493` and `1031` — records dropped from the live site whose sheet rows preserve the numbering.
Verify any time with `scratchpad/verify-rewrites.py`.

Backup: `oov_data_new_edit_2.xlsx.bak-before-rewrites`.

## ✅ DONE — the two import regressions are closed

`goetzmann0729` and `goetzmann0295` held work that went straight into `data/museum-data.json` and
was never synced back, so an import would have silently reverted both. **Written into
`oov_data_new_edit_2.xlsx` on 2026-08-27** by `scratchpad/save-0729-0295.py`; the workbook now
survives an import without losing either.

| Row | Record | Cells written |
|---|---|---|
| 730 | `goetzmann0729` | `title`, `description`, `notes`, `keywords`, `creator` |
| 296 | `goetzmann0295` | `notes` only |

**`0729` was losing four fields, not one.** The sheet held the 48-word pre-merge description against
the JSON's 120-word merged version, blank `notes` and `keywords`, and a title carrying a serial
against §5 of the style guide.

⚠️ **Its `creator` was wrong too, which was not on any list.** The sheet read **"Kingdom of
Bulgaria"** for a bond of 1907. The face is headed КНЯЖЕСТВО БЪЛГАРИЯ — **Principality** — verified
from the image; Bulgaria did not become a kingdom until 1908. Corrected in the same pass.

`0295`'s **description still differs from the JSON, and that is correct**: row 296 sits inside the
user's edited block, so the sheet holds their 131-word rewrite and the import is meant to overwrite
the JSON there. Only `notes` needed saving, and their description cell was not touched.

The pre-write workbook is kept as `oov_data_new_edit_2.xlsx.bak-before-0729-0295`. The script works
on a copy, verifies all 868 rows and 20 columns are untouched but for the intended cells, and only
then swaps in — it refuses to run against an open workbook.

## Which workbook

**`oov_data_new_edit_2.xlsx` supersedes `oov_data_new_edit.xlsx`.** The `_2` file holds all 84 edits
from the earlier one plus rows 342–381, with nothing lost. The user's editing frontier is **row
381**. Importing the older file would drop 40 records' worth of work.

**Do not write to a workbook while an Excel lock file (`~$name.xlsx`) sits beside it** — the
open session's next save clobbers whatever the script wrote.

Fields that are *not* Excel-backed — `pages`, `transcription`, `namedIndividuals`, and
`identifiers` while the sheet has no such column — can be fixed in the JSON at any time and
do not belong in this file.

---

## goetzmann0345 — State of South Carolina Consolidation Bond

Verified 2026-08-27 against the full-resolution image, rebuilt from the DZI tiles at 5824×3743.
Context in [reverse-pairs.md](reverse-pairs.md) §C: this scan is the *back* of a folded bond
whose face is not in the collection.

| Field | Current | Should be | Evidence |
|-------|---------|-----------|----------|
| `notes` | `… $500, No. DP 1602, secured by annual tax, principal due July 1876` | `… $500, No. 1602, secured by annual tax, principal due July 1893` | Two errors. **"DP" is not part of the serial** — it is the ornate `№` ligature, misread by OCR; the coupons along the top edge are stamped plain `1602` in blue. **"July 1876" is wrong** — the docket reads `PRINCIPAL DUE JULY 1893` in large type at its foot. 1876 is the year the Redeemer government took power, which the description's closing sentence discusses; the two look conflated. |
| `description` | "The engraved **face**, framed in dense foliate scrollwork and floral medallions…" | "face" → "back" (or "outside", "docket side") | The sentence describes the wrong side of the object. The rest of the description is accurate, including "principal falling due in July 1893", which already contradicts the notes. |

Already applied, needs no further action: `identifiers` corrected `No. DP 1602` → `No. 1602`
in the JSON (commit follows this file). Safe there because the sheet has no `identifiers`
column yet, so `scratchpad/add-identifiers-column.py` will carry the corrected value in.

**Not corrected — unverifiable from this scan.** `issueYear` is `1872`, and the description says
"issued in the early 1870s". This panel carries no issue date at all, so neither can be confirmed
or refuted from the image. Left as catalogued.

## goetzmann0295 — Banca Românească share

Carried over from the earlier backlog: the sheet says `No. 011666` / `100,000,000 lei`, both
wrong; the correct `No. 011648` / `160,000,000 lei` were read off the 3872×6070 master in commit
`01be13c`. **Confirmed still outstanding in the workbook 2026-08-27.**

→ Folded into the row-296 replacement text in the next section, which fixes both figures and adds
the dropped-variant marker in one cell. Use that text; do not apply this one separately.

---

## Dropped-duplicate markers — rows 295, 296, 495

Applied to `data/museum-data.json` 2026-08-27, but `notes` is Excel-backed, so these must land
in the sheet or be re-applied after the next import.

The collection already has a convention for this: the **kept** record's `notes` name the dropped
id and the relationship (`goetzmann1027` → 1031, `goetzmann0729` → 0730). Two of the four dropped
records were missing from it, and one was recorded backwards.

**Row 296 — `goetzmann0295`** (kept). Also carries the two figure corrections queued above, so
this one cell settles both. Replace with:

> Banca Românească, 500 lei share No. 011648, Capital 160,000,000 lei, Bucharest 1920. A 1938 share from the same engraved plate — Emisiunea VIII-A, capital 350,000,000 lei — was catalogued as goetzmann0294 and dropped as a design variant on 2026-08-23; its scan, tiles and OCR text remain on disk.

**Row 295 — `goetzmann0294`** (dropped, row kept for numbering). The cell has the right
distinguishing facts but no marker. Append to what is already there:

> [DUPLICATE — design variant struck from the same engraved plate as goetzmann0295, the 1920 issue kept on the website. Dropped from the website collection; row kept here to preserve numbering. 2026-08-23.]

**Row 495 — `goetzmann0494`** (kept). ⚠️ This cell currently holds the *dropped* row's marker
verbatim, so it reads "a poorer, faded copy of goetzmann0494" while sitting on 0494 — it claims
the record is a copy of itself. Bleed from the 2026-07-17 notes-offset repair, which recovered
0494's notes from the retained 0493 row and brought the marker along. Strip the bracketed marker
and replace with:

> C. Perpetual Mortgage Debenture No. 291, £100 at 3½% p.a. Liverpool Corn Trade Association, Ltd. Issue of £100,000. Capital £60,000 in 400 shares of £150. 8 Brunswick Street, Liverpool. Common Seal, June 1897. Secretary: Edward Graham. A poorer, faded copy of this same debenture was catalogued as goetzmann0493 and dropped from the website collection on 2026-07-15; its row is kept in the workbook to preserve numbering.

Row 494 (`goetzmann0493`, the dropped one) is already correct — leave it alone.

## issueYear corrections — applied to JSON, still needed in the sheet

All five applied to `data/museum-data.json` 2026-08-27. `excel_to_json.py` derives `issueYear` from
the `issueDate` column, so the sheet edits below are what make them stick; without them the next
import reverts every one. `period` is correct in all five cases and needs no change.

| Record | `issueYear` | Sheet `issueDate` now | Should be | Evidence |
|---|---|---|---|---|
| `0640` | 1965 → **1990** | `ca. 1965-1980` | `February 1990` | Dated Belgrade, February 1990 on its face; coupons mature 1996-98; the Socialist Republic of Serbia existed until 1990. |
| `0641` | 1970 → **1987** | `ca. 1970-1985` | `1 October 1987` | Signed at Sarajevo 1 October 1987; four annuity coupons payable 1990-1993. |
| `0638` | 1928 → **1914** | `ca. 1928-1933` | `1 April 1914` | The loan names itself "of 1914"; issued Sarajevo and Vienna 1 April 1914; signed by Governor Oskar Potiorek, in post 1911-1914. The estimate was fourteen years late. |
| `0646` | 1927 → **1930** | `ca. 1927-1935` | `1 September 1930` | Dated 1 September 1930 at Újpest. |
| `0631` | 1832 → **1825** | `December 31, 1832` | `31 December 1825` | ⚠️ Not an estimate — a real conflict. The `notes` say "Amsterdam December 31, 1832; prospectus of June 30, 1834", which would date the certificate **two years before its own prospectus**. The description says 31 December 1825 under a prospectus of 30 June 1824, and the transcription independently carries 1824. Siblings `0525` (30 June 1825) and `0616` (7 October 1824) fit the same series. The 1832/1834 pair is internally impossible. |

⚠️ **`0631`'s `notes` carry the same error** and need the same correction: "Amsterdam December 31,
1832; prospectus of June 30, 1834" → "Amsterdam December 31, 1825; prospectus of June 30, 1824".

### Checked and NOT changed

- **`0317` — `issueYear` 1902 is correct.** The sweep flagged it because "2002" appears in the
  description, but that is the maturity: a Chicago, Rock Island and Pacific bond styled the "Gold
  Bond of 2002" and due 1 November 2002. A hundred-year bond, not a typo.
- **`0343` — left at 1920, but the evidence is against it.** The sheet says `1920-01-01`. The
  description records a notice printed on the certificate that the stamp duty was discharged under
  an authorisation published in the *Journal Officiel* of **3 April 1928** — so the sheet cannot
  predate April 1928. Nothing else on the record carries a date; the transcription has none. Either
  the company was founded in 1920 and this certificate printed later, or the issue date is wrong.
  **Needs the image.** Not changed unilaterally.

---

## goetzmann0640 — superseded by the table above

**Applied to `data/museum-data.json` 2026-08-27:** `issueYear` **1965 → 1990**.

The sheet's `issueDate` cell reads **"ca. 1965-1980"**, an estimate. `excel_to_json.py` correctly
takes the first four-digit year from it, so the pipeline is not at fault — the estimate is simply
wrong. The bond is dated **Belgrade, February 1990** on its face, with coupons maturing through
1996, 1997 and 1998, and it was issued by the Socialist Republic of Serbia, which existed until
1990. Every signal agrees on 1990.

| Sheet column | Current | Should be |
|---|---|---|
| `issueDate` | `ca. 1965-1980` | `February 1990` |

`period` is already "20th Century" and needs no change. Until the sheet is corrected, the next
import will revert `issueYear` to 1965.

**What `issueYear` actually affects** (I had overstated this earlier — it is *not* a facet; the
facets are type, location, issuingCountry, currency, language, period and namedIndividuals):

- the date sort on the search page (`year()` in `js-src/museum-search.js`)
- the year printed on each search result card
- the "Date" row in the record viewer's details table

---

## Related, larger passes still open

- **32 prefixed serials unverified.** `No. DP 1602` was an OCR artifact, and 32 identifier values
  across the collection carry a letter prefix that could have the same origin — `No. PD 21186`,
  `No. MC530`, `No. D25`, `No. NCW5418`, `No. C8081` and so on. Others look genuinely
  alphanumeric (`No. CC 04238717`, `No. DXII 0068056`). Needs an image check per record. List
  them with:
  `node -e "JSON.parse(require('fs').readFileSync('data/museum-data.json','utf8')).forEach(r=>(r.identifiers||[]).forEach(v=>/^(?:No\.|Serie) [A-Z]{1,4}[ .-]?\d/.test(v)&&console.log(r.id,v)))"`
- **14 year-like identifier values** flagged in `scratchpad/identifiers-review.tsv`, where a value
  could be a date rather than a serial (`No. 1890.`). Not Excel-backed — fixable any time.
- **Backs not flagged by title.** 0345 was found by eye, not by the "reverse"/"verso" title
  convention that `reverse-pairs.md` was built from. A full image pass would likely surface more.
