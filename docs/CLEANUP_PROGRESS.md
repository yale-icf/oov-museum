# OOV Cleanup Progress

Applying `DESCRIPTION_STYLE_GUIDE.md` across the collection. Multi-session effort (~850 images).

- **Branch:** `guide-cleanup`
- **Spec:** `docs/DESCRIPTION_STYLE_GUIDE.md`
- **Source of truth:** `data/museum-data.json` — do **NOT** run `excel_to_json.py`
- **Backup:** `data/museum-data.json.bak`
- **Scope of commits:** only `data/museum-data.json` + `docs/` (the repo has unrelated pre-existing changes in `js/`, `package.json`, etc. — leave them)
- **Mode:** full guide conformance, incremental batches, user spot-checks each batch

## Phases
- [x] Hygiene: stripped `_x000B_` (530), Perspectus→Prospectus (7)
- [x] Agreed edits applied: descriptions 0001, 0002, 0011, 0012, 0019 (+ 0002 `issueYear` 1943)
- [x] Title edits applied (pending master-Excel sync): 0004, 0186, 0226, 0383, 0454, 0677
- [x] **Conformance pass — ALL 477 standalone descriptions revised** (image-based; description + title + issueYear). Drafts archived in `drafts/applied/`. Legacy essays (0900/0904/0908/0909/0910) deliberately preserved per guide §4.
- [ ] **Per-page image descriptions** (63 multi-page items / 386 sub-pages; incl. 0028 = 51-card deck). Multi-page PRIMARIES mostly still un-revised too (only 0004/0012/0028/0079/0181 done).
- [ ] **Metadata-field fixes** for "+1 shift" / mislabeled records: agents corrected description+title+issueYear but NOT currency/language/issuingCountry/creator — see flags log (e.g. 0499, 0501, 0502, 0599, 0649).
- [ ] Transcription/translation audit + regenerate garbled (e.g. 0004)
- [ ] 0020: rewrite from images + `issueYear` 1705
- [ ] Exhibit corrections surfaced by the pass: 0473 (holder S.B. Way, not "Mary E. Carey"; Class A stock not warrant) in exhibit-women-investors; 0529 Anne Brown bill 1776→1778.
- [ ] Final: sync titles/issueYear → `oov_data_master.xlsx`, commit, update title-date memory

## Conformance pass — COMPLETE
All standalone records revised. Per-record corrections + flags are in `docs/CLEANUP_FACTUAL_CHANGES.md`.
**Resume mechanics:** agents follow `drafts/SPEC.md` for a given RECORD_ID (read image → fetch current data → draft → write `drafts/<id>.json`); the apply step folds `drafts/*.json` into `museum-data.json`, logs changes, moves them to `drafts/applied/`. Done-set = `drafts/applied/` + legacy + the 15 early ids.

## Reminders (from the guide)
- Voice: impersonal / object-as-subject (no "we").
- Cut serial / series / class from prose; keep rate, term, denomination.
- Visual motifs: name the movement, push to a thesis — **fact-check the attribution**.
- Don't bend the object's function to a theme; verify dates from the document itself.
- Gloss foreign terms selectively; quote a telling original phrase when it earns it.
