# ⚠️ WITHDRAWN — this document was wrong. See `REUSED_NUMBERS.md`.

Superseded 2026-09-16.

This file used to argue that commit **`fae254d`**, *"Retile 12 records from better masters"*,
was a regression: that it had retiled twelve live records from unrelated intake images without
checking they were the same document.

**That was wrong, and acting on it made things worse.** Ten of the twelve had their pictures
reverted on the strength of it, and had to be put back.

## What was actually happening

The twelve are **reused numbers**. Some pieces had only their first leaf scanned; the intake
rescanned them whole under new numbers and reused the old numbers for different documents,
shipping a file named `goetzmann<old>.jpg` under each. `fae254d` was right to retile from
those files — the intake's picture really does belong on that number.

What it left undone was the **text**. It moved no titles, descriptions or OCR, so each record
showed one document and described another. That is the fault, and it is a migration that was
never finished, not a bad retile.

## What gave it away

Two things this document never checked:

- **The intake ships a file under the exact old name.** A bad retile would have pulled in a
  file named something else. `TO-ADD_Goetzmann 0500/goetzmann0502.jpg` existing at all is the
  proof of reuse.
- **`JPEG Files/goetzmann Misc Files Removed/` holds the displaced old masters**, pulled out of
  the working set when their numbers were reused. Their existence only makes sense if the
  numbers changed hands deliberately.

The user said as much directly: *"we had discovered that some of the pieces only had their
first pages scanned. those numbers then got reused for new documents."*

## The lesson worth keeping

The one useful line in the original document survives, inverted. It said a spreadsheet label
saying "replacement" is a claim, not a fact. True — and so is a diagnosis. **Before reverting
live records on a theory, check whether the intake claims the number**, and look for the
displaced original before concluding nothing was displaced.

The full, corrected account is in [`REUSED_NUMBERS.md`](REUSED_NUMBERS.md).
