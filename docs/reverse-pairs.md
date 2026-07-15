# Front / back (recto–verso) pairs — mapping

Records in the collection that are catalogued as **separate items** but are actually the
**back of another document**. Flagged by "reverse" / "verso" in the title (20 records).
No data has been changed — this is a reference for deciding whether to fold each back into
its front as a second "page" (like the existing multi-page records).

Status: **mapping only, 2026-07-15.** Fronts marked *confirm* still need an image check.

## A. Confirmed adjacent pairs (14) — back sits right after its front, titles agree

| Front | Back | Document |
|-------|------|----------|
| goetzmann0570 | goetzmann0571 | Bética Agricultural-Industrial Cooperative Mortgage Bond (Seville, 1931) |
| goetzmann0572 | goetzmann0573 | Chinese Republic 5% Gold Industrial Loan, 500-franc bond (1914) |
| goetzmann0689 | goetzmann0690 | National Pisco to Yca Railway Co. Guaranteed Loan Bond (Peru, 1869) |
| goetzmann0691 | goetzmann0692 | Chilian Eastern Central Railway £20 First Mortgage Gold Bond (London, 1910) |
| goetzmann0693 | goetzmann0694 | Kingdom of Serbs, Croats & Slovenes 4% Agrarian Liquidation Bond (Belgrade, 1921) |
| goetzmann0697 | goetzmann0698 | Chinese Imperial Government 4½% Gold Loan Bond (Berlin, 1898) |
| goetzmann0701 | goetzmann0702 | Government of Honduras Loan Bond (Paris, 1869) |
| goetzmann0954 | goetzmann0955 | Mississippi Union Bank Bond |
| goetzmann0974 | goetzmann0975 | Exposition Coloniale Internationale Paris Lottery Bond |
| goetzmann0988 | goetzmann0989 | Banque Industrielle de Chine Share |
| goetzmann1006 | goetzmann1007 | Shanghai (Pudong Qiangsheng) Taxi Co. Share Certificate (1992) |
| goetzmann1010 | goetzmann1011 | Lippmann, Rosenthal & Co. Receipt |
| goetzmann1023 | goetzmann1024 | 18th-century Dutch manuscript bond / annuity obligation (ca. 1703) |
| goetzmann1025 | goetzmann1026 | Great Ming Circulating Treasure Note (Da Ming Tong Xing Bao Chao) |

## B. Separated — back is filed away from its front; likely front found (confirm with image)

| Back | Likely front | Document | Note |
|------|--------------|----------|------|
| goetzmann0540 | goetzmann0506 | Poyaisian Land Grant | ✅ **RESOLVED 2026-07-15.** Image confirms "POYAISIAN LAND GRANT" (Gregor MacGregor's Poyais fraud). The record was wrong throughout — title, description, transcription, creator, notes, and geography (said "Potosian"/Bolivia). All corrected to Poyais / Honduras / 1834, matching front 0506. |
| goetzmann0599 | **goetzmann0634** | City of Baku 5% Loan Bond (1910) | ✅ **Confirmed by user 2026-07-15** — front is 0634 (not 0722). |
| goetzmann0730 | goetzmann0734? | Principality of Bulgaria Gold Loan Bond | ⏸ **On hold** — not confirmed; leave for now. |
| goetzmann0738 | goetzmann0695 / 0696? | Kingdom of Serbia 4% Amortizable Loan of 1895 | ⏸ **On hold** — not confirmed; leave for now. |

## C. Needs review — no obvious front in the collection

| Back | Document | Note |
|------|----------|------|
| goetzmann0235 | Anglo-Argentine Tramways Co. Debenture Stock Certificate (London, 1910) | No matching front found — the back may be the only side digitised. |
| goetzmann0728 | Ottoman Public Debt Administration Bond | Already a **multi-page** record itself; front unclear (0711/0712 are related Ottoman Public Debt *receipts*, a different instrument). |

## Caveats
- This only covers backs **flagged by title** ("reverse"/"verso"). Other front/back pairs whose
  back isn't labelled that way would not appear here — a fuller pass would need image review.
- Merging a back into its front would drop the displayed document count (currently 545) by however
  many pairs are merged, and would require regenerating `filter-index.json` and re-checking the
  affected records' fields.
