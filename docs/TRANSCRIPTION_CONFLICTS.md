# Flagged facts — for review

Uncertain facts found while rewriting the 357 remaining labels (sheet rows 382–869).
**Nothing here has been changed.**

Transcription errors are known and expected, so this is not a list of them. What matters is
that these 357 labels rest on a layer the user has **not** been through: rows 2–381 carry the
user's own corrected descriptions and are trusted, while rows 382 and beyond still hold the
original catalogue prose. Delete-and-modernize carries whatever is wrong in that prose straight
into the new label. Two errors already surfaced this way — goetzmann0345 described the back of a
folded bond as "the engraved face," and goetzmann0346 had the holder as John V. Lorimer where the
certificate reads John W.

So the entries below are places where the **description** may be wrong, with the transcription
used only as a second opinion. Where they disagree the description usually wins, but not always,
and these are close enough to be worth a look.

---

## Rate and amount conflicts (5)

The description and the transcription state different numbers for the same fact. A wrong rate is
the most damaging kind of error in a label, since nothing else on the page contradicts it.

| Record | Row | Document | Conflict |
|---|---|---|---|
| `goetzmann0636` | 637 | Bolivian Government Loan of 1872 Trust-Fund Certificate (London) | description **6 per cent**, transcription **5 per cent** |
| `goetzmann0964` | 803 | 170 Broadway Building First Mortgage Leasehold Gold Bond | description **6.5%**, transcription **4.5%** — `notes` independently says 6.5%, so the description is probably right |
| `goetzmann1021` | 852 | Dutch East India Company (VOC) Middelburg Chamber Obligation Receipts | description **6.25 per cent**, transcription **6%** |
| `goetzmann0668` | 669 | Imperial Russian Government Conversion Bond | description's **85,412,400** appears nowhere in the transcription |
| `goetzmann0676` | 677 | Imperial Russian Government Consolidated 4% Railway Bond | description's **310,498,000** appears nowhere in the transcription |

## No transcription (1)

- `goetzmann0560` (row 561) — Compagnie Impériale des Chemins de Fer Éthiopiens Share. No second
  opinion available; the label will rest on the description alone.

## Year mismatches (37) — weak signal, expect false positives

The record's `issueYear` appears nowhere in its transcription. Usually innocent: the transcription
garbles digits, or the document dates itself in a regnal or era calendar. `goetzmann0382` is dated
Shōwa 13, which *is* 1938, so that row is a known false positive. Worth a glance only where the
two years are close enough to be a transposition — `0392` (1886 vs 1896), `0734` (1903 vs 1902),
`0461` (1793 vs 1792), `0404` (1904 vs 1912).

| Record | Row | issueYear | Years in transcription |
|---|---|---|---|
| `goetzmann0631` | 632 | 1832 | 1824, 1823 |
| `goetzmann0638` | 639 | 1928 | 1914, 1912, 1913 |
| `goetzmann0646` | 647 | 1927 | 1930 |
| `goetzmann0679` | 680 | 1986 | 1991 |
| `goetzmann0734` | 734 | 1903 | 1902 |
| `goetzmann0984` | 817 | 1904 | 1930, 1910 |
| `goetzmann0382` | 383 | 1938 | 1960, 1940 — false positive, Shōwa 13 |
| `goetzmann0392` | 393 | 1886 | 1896 |
| `goetzmann0398` | 399 | 1912 | 1862, 1900 |
| `goetzmann0404` | 405 | 1904 | 1912 |
| `goetzmann0432` | 433 | 1912 | 1913, 1908, 1625, 1940, 1953, 1954 |
| `goetzmann0461` | 462 | 1793 | 1792, 1788 |

The remaining 25 are in `scratchpad/transcription-conflicts.json`; regenerate the whole set with
`node scratchpad/flag-conflicts.js`.
