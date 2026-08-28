# 51 ICF documents not yet in the museum — a later project

Parked on the user's instruction, 2026-08-28. This records the groundwork so the
project can start cold.

## What they are

`virtual_museum_database_full.xlsx` (sheet **Goetzmann File Names**) records **211
ICF-owned files**. Only 36 are museum records and 31 are leaves of ours. The
remaining **139 files were never made into museum records at all**.

Those 139 group by `Document Title` into **51 documents**, 40 of them multi-leaf —
so adding them takes the collection **474 → 525**, not 474 → 613.

The id list is `scratchpad/icf-candidates.txt`. Examples: `goetzmann0741`–`0743`,
`0751`–`0768`, `0781`, `0785`, `0791`, `0829`–`0846`, `1042`–`1081`.

## The images exist — all 139, none missing

```
C:\Users\ks2479\Documents\my-project\origins-of-value\JPEG Files\
    TO-ADD_Goetzmann 0741-0850 JPEG\goetzmann0741.jpg
```

The folder is literally named **`TO-ADD_`** — these were photographed and set aside,
never wired in. Nothing needs re-shooting.

⚠️ **But check for better originals first.** These masters are **0.3–0.9 MB**,
against the 5–10 MB masters behind the existing records. They will tile to fewer
zoom levels and will look visibly softer than their neighbours in the viewer. Worth
hunting for higher-resolution originals of the `TO-ADD` batch before generating
~650 MB of tiles from these.

Currently **0 of 139 have DZI tiles or thumbnails** — both are generated from the
masters. `sharp` can do it: `.tile({size: 512, overlap: 2, layout: 'dz'})`, which
matches the existing layout. Then `upload-tiles.js` pushes them to R2, since the
live site serves tiles from the bucket, not the repo.

## What the database gives, and what it does not

| Field | Coverage | Usable? |
|---|---|---|
| Document Title | 139 / 139 | yes |
| Description | 139 / 139, median ~1,780 chars | ⚠️ old interpretive style |
| Period | 139 / 139 | yes |
| Type | 82 / 139 | ⚠️ old free vocabulary — `debt`, `equity; security`, `page` |
| Location | 82 / 139 | needs mapping |
| issuingCountry, subjectCountry, currency, language, issueYear | **0** | **must be catalogued from the documents** |

So this is a **cataloguing pass over 51 records, not a bulk import**. The four
missing facet fields drive the search facets, and the descriptions are the style the
August rewrite replaced — the sample for `goetzmann0743` closes "This security allows
investors to invest in a land opportunity with developmental interests," which §
"no interpretive significance" rules out.

## Suggested order when it resumes

1. Hunt for higher-resolution masters of the `TO-ADD` batch.
2. Generate tiles + thumbnails for 139; upload to R2.
3. Build 51 records with `pages[]` grouping, titles and periods from the database.
4. Catalogue the facet fields from the images: type (controlled vocabulary),
   countries, currency, language, issueYear.
5. Rewrite the 51 descriptions to the facts-first guide.
6. Update the counts in `about.html` (two places) and regenerate `filter-index.json`.
