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

Carried over from the earlier backlog; figures read off the 3872×6070 master in commit `01be13c`.

| Field | Should be |
|-------|-----------|
| `notes` | `Banca Românească, 500 lei share No. 011648, Capital 160,000,000 lei, Bucharest 1920` |

The sheet may still carry the wrong `No. 011666` and `100,000,000`. Check before assuming this
one is still outstanding.

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
