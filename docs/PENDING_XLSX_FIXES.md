# Pending corrections — waiting on the Excel workbook

Field corrections that are **verified but not yet applied**, because the fields they touch are
Excel-backed. `excel_to_json.py` overwrites title, description, type, location, period,
keywords, owner, currency, language, issueYear, creator and **notes** from the sheet, so a fix
made directly in `data/museum-data.json` is silently reverted at the next import. Each of these
has to land in the workbook — or be re-applied to the JSON immediately after an import.

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
