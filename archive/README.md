# Archived workbooks — do not edit these

Moved here 2026-08-28 because there were seven `.xlsx` files in the repo root and it was no
longer obvious which one was live.

## The live workbook is `oov_data_new_edit_2.xlsx`, in the repo root

It is the **only** file that matches the site. Measured against `data/museum-data.json` on
2026-08-28, across all 474 records:

| workbook | title drift | description drift |
|---|---|---|
| **`oov_data_new_edit_2.xlsx`** (root) | **0** | **0** |
| `oov_data_new_edit.xlsx` | 201 | 397 |
| `oov_data_new.xlsx` | 201 | 470 |
| `oov_data_fixed.xlsx` | 460 | 467 |
| `oov_template.xlsx` | 451 | 455 |
| `financial_documents_template.xlsx` | 452 | 455 |

"Drift" is the number of records where the workbook disagrees with what is live. Editing any
archived file and importing it would silently revert the August description rewrite, the title
uniformity pass and the date corrections.

`virtual_museum_database_full.xlsx` also stays in the root — it is a different thing entirely,
the collection's provenance database (owner, acquisition), not the catalogue. See
`docs/` and the `oov-virtual-museum-database` memory.

## What is here

| file | what it was |
|---|---|
| `oov_data_new.xlsx` | the long-standing source, superseded when the user began editing a copy |
| `oov_data_new.xlsx.bak`, `.bak-0493note` | its backups |
| `oov_data_new_edit.xlsx` | the user's first editing copy, superseded by `_edit_2` |
| `oov_data_fixed.xlsx`, `oov_template.xlsx`, `financial_documents_template.xlsx` | early templates and a one-off fix, from February |
| `backups/` | 23 dated `.bak-*` snapshots of `_edit_2`, one per scripted write, newest last |

## ⚠️ Scripts that point at the archived path

A dozen or so one-off scripts in the repo root still name `oov_data_new.xlsx` —
`fill_rows_*.py`, `analyze-gaps.js`, `check-countries.js`, `batch27.js` and others. They are
historical: they were written against data that is now hundreds of rows stale, and running any
of them would be a mistake regardless of where the file sits. They are left as they are rather
than repointed, since repointing them at the live workbook would make them dangerous rather
than merely broken.

`excel_to_json.py` is **not** affected — its default is `oov_data_new_edit_2.xlsx`, with a
`--file` override.
