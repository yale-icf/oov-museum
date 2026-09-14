# Deferred decisions from the September 2026 intake

Parked deliberately, not forgotten. Raised 2026-09-14 and set aside to get on with
the main ranges.

## 1. A new Reichsbanknote needs a number

`TO-ADD_Goetzmann 0400 JPEG` contains `goetzmann0416.jpg` and `goetzmann0426.jpg`,
which are the **back and front of one 1,000-Mark Reichsbanknote, Berlin, 21 April
1910, Nr 1291533A**.

They are filed under two live and unrelated record ids — `0416` is the Café de la
Paix Béziers founder's share of 1921, `0426` the Reconstitution of a French Royal
Deed of 1763 — so the filenames are wrong, not the documents.

It is a genuine new object: `goetzmann0427` is the same issue and date but
**No. 6125588N**, so this is a second note of the 1910 emission, a multiple.

**Needs:** a free id, then the pair tiled as one two-leaf record, and `0427`
retitled to carry its own serial (as `0711`, `0719`, `0481` and the others were).
Neither file has been tiled or uploaded.

## 2. Four replacement images within 10 % of the live tiles

Too close in size to call by measurement alone; each needs looking at.

| id | live tiles | new master | note |
|---|---|---|---|
| `0574` | 5782x9024 | 5615x10200 | x1.10, different aspect |
| `0735` | 1093x1536 | 1073x1536 | x0.98 |
| `0736` | 1536x1092 | 1097x1536 | x1.00 but **rotated** |
| `0738` | 1536x1339 | 1536x1464 | x1.09 |

Nothing was retiled for these; the live tiles stand.

## 3. Rejected as downgrades — do not retile

Recorded so nobody tries again. Each new master is **smaller** than what is
already tiled:

| id | live | new | ratio |
|---|---|---|---|
| `0492` | 8580x10560 | 624x768 | x0.01 |
| `0465` | 3453x5409 | 1427x1157 | x0.09 |
| `0456` | 2392x2816 | 2392x1469 | x0.52 |
| `0573` | 5939x9037 | 3981x6789 | x0.50 |
| `0426` | 3429x5373 | 4430x2639 | x0.63 |
| `0416` | 3309x4690 | 4291x2527 | x0.70 |

`0456` and `0465` are crops of the two halves of record `0456`, which already
pictures both instruments on one sheet — the Boston tax certificate No. 1582 above
and the Massachusetts-Bay five-dollar bill No. 16710 below. `0492` is a small scan
of a leaf already held at full resolution. `0416`/`0426` are item 1 above.

## 4. Other open items from this session

- Three long serials still sit on two records each: **No. 1499** (`0388`/`1028`),
  **No. 2106** (`0446`/`0447`), **No. 2081** (`0600`/`0631`). Same class as the
  eight corrected in `44f8b82` and `d00863d` — worth checking whether each is a
  second claim or a coincidence.
- **89 intake ids have no row at all** in the master sheet: `0789`, `0801`–`0802`,
  and the whole of `1414`–`1499`.
- The master sheet's **purchase columns are shifted one column** (Purchase Price
  holds a seller name on 167 of 759 rows). No provenance was imported.
- **14 records carry pre-unification country names** — 4 German before 1871, 6
  Italian before 1861, 4 Ottoman-era coded Turkey. Britain was settled
  (`4ea1b50`); these were not.
- **101 descriptions** use month-day-year against 280 in day-month-year. Agreed to
  standardise on day-month-year, quoted matter keeping its original form; not yet
  done.
- **124 records** where `notes` carry a year the description does not. Sampling
  suggests roughly half are real errors of the `0500`/`0501` kind.
- OCR is out of scope for now: 78 records have none and are invisible to full-text
  search.
