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
- [x] **Per-page image descriptions DONE** — all 63 multi-page items: 57 small items (primary + per-page), 3 pamphlets (primary + terse page stubs: 0191/0236/0274), 3 illustration sets per-card (0028 51 cards / 0079 55 cards / 0134 45 lottery handbills). 0020 rewritten + dated 1705. Zero non-legacy boilerplate remains.
- [x] **Metadata-field fixes** DONE — 22 mislabeled/composite candidates reconciled via agents (read corrected description + image → fix currency/language/issuingCountry/subjectCountry/creator/type). 19 changed, 3 already clean (0335, 0610, 0990). Logged in `docs/CLEANUP_METADATA_CHANGES.md`.
- [x] Transcription/translation audit DONE — 0004 regenerated (Dutch original + English, page-structured, ~27.8k chars). Audit of all 545 transcriptions (markers + coherence heuristics): all unique.
- [x] Dutch transcription re-check (all 81 Dutch records): **goetzmann0011** (Middelburg insurance Conditien) was genuine word-salad — a two-column print whose columns the OCR pipeline interleaved (museum-data.json field == scripts/ocr/0011.txt, same bad source). Regenerated from high-res column crops of the 4017×5969 original: full Dutch + English, 20 articles, ~10.3k chars. Remaining: **goetzmann0507** (Amsterdam Prys-Courant) degraded — tabular price list, lower-confidence, not yet redone.
- [ ] 0020: rewrite from images + `issueYear` 1705
- [x] Exhibit corrections DONE (commit b9b516c): 0529 Anne Brown bill corrected (1778, Anne not Annie, 1500 livres, drawn on Paris commissioners, Hopkinson+Tho. Smith). Piece #9 0473 (holder "Mrs. S.B. Way", not the misread "Mary E. Carey") REPLACED with 0234 (American Trust Co., Boston 1910, Harriette S. Foster in her own name) — new exhibit image, intro/preview/banner range 1745-1910 updated.
- [x] Full JSON→`oov_data_master.xlsx` export DONE (`_rebuild_master2.py`, built fresh from pristine `oov_data_new.xlsx`): 868 rows; 545 primary descriptions + 323 per-page descriptions; new-convention titles; metadata fields (type/currency/language/country/creator); 138 issueYear corrections (year-only where changed, M/D preserved otherwise); 0 orphans. Backup: `oov_data_master.xlsx.bak_precleanup`.
- [x] Title-date memory updated (oov-project.md notes §8 supersession).
- [ ] Final: push `guide-cleanup` / open PR (user-gated).

## Conformance pass — COMPLETE
All standalone records revised. Per-record corrections + flags are in `docs/CLEANUP_FACTUAL_CHANGES.md`.
**Resume mechanics:** agents follow `drafts/SPEC.md` for a given RECORD_ID (read image → fetch current data → draft → write `drafts/<id>.json`); the apply step folds `drafts/*.json` into `museum-data.json`, logs changes, moves them to `drafts/applied/`. Done-set = `drafts/applied/` + legacy + the 15 early ids.

## Reminders (from the guide)
- Voice: impersonal / object-as-subject (no "we").
- Cut serial / series / class from prose; keep rate, term, denomination.
- Visual motifs: name the movement, push to a thesis — **fact-check the attribution**.
- Don't bend the object's function to a theme; verify dates from the document itself.
- Gloss foreign terms selectively; quote a telling original phrase when it earns it.
