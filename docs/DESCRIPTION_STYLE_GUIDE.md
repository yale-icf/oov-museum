# Description Style Guide — Origins of Value

> **This is the user's guide, recorded verbatim 2026-08-27.** It supersedes v1, archived at
> [DESCRIPTION_STYLE_GUIDE_v1_ARCHIVE.md](DESCRIPTION_STYLE_GUIDE_v1_ARCHIVE.md), and it
> replaces the draft I had inferred from the rewritten rows — where the two disagreed, this
> one governs. Sheet rows 2–381 of `oov_data_new_edit_2.xlsx` are the worked examples.

## Current approach: facts-first

The museum's curatorial stance isn't set yet, so labels stay factual and lean.

- Lead with what the object is and plainly shows: issuer, instrument type, denomination,
  dates, terms, parties, confirmed physical features.
- **Do not write in interpretive "significance"** (why it matters historically). Flag
  significance separately for later, but keep it out of the label.
- **Exception, the "floor":** keep a single factual sentence of context only where its absence
  would actively mislead — that a colonial territory was under foreign rule; that a company
  later failed; that a currency was collapsing. Minimal, factual, no framing.
- Drafted labels from before this shift stay as fuller "with context" versions on record. One
  consistency pass later, once the stance is set.

## House style

- **Plain language; translate financial and period jargon.** Confirmed swaps:

  | Instead of | Write |
  |---|---|
  | specie | coin |
  | flotation | company launch |
  | metropole | home country / France |
  | rente | fixed yearly payment in perpetuity |
  | verso | back |
  | mise en valeur | "development" in quotes |

  Keep precise terms only where meaning requires.
- **Keep a period or technical term ONLY** when it names something plain English can't, **or**
  when it's printed prominently on the object itself — then keep it and gloss it (*"bearer,"
  "inscription," "talon," "annullato"*). Otherwise translate; put the original in the catalog,
  not the label.
- **Non-English:**
  - **KEEP** Latin-alphabet proper names of companies and instruments (gloss in English on
    first use where helpful) and currency units (lei, yuan, guilders).
  - **TRANSLATE** Latin-alphabet prose and terms.
  - **DROP non-Latin scripts entirely** — Chinese, Cyrillic, Greek, Japanese. Give English only.
- **U.S. spelling** (labor, modeled, defense, percent).
- **Few em-dashes.** Use commas, semicolons, or new sentences.
- **No imagery or vignette interpretation.** Describe what's depicted only if it carries
  documented meaning; never say what imagery "represents," "advertises," "lends," or "evokes."
  Usually cut vignette description entirely.
- **One paragraph by default** (wall-label length). Two paragraphs reserved for major anchor
  objects, but under facts-first almost everything is one lean paragraph.
- **Vary openings.** Don't over-format. No bullets in labels.
- **Put the date early — in the opening sentence wherever it will go.** Attach it to the
  identification rather than saving it for a later sentence: *"A one-dollar note of the Hungarian
  Fund, dated at New York, 2 February 1852, and signed by Lajos Kossuth."* Where an issue date and
  a seal or stamp date differ, the issue date is the one that leads.
- **Officers and named figures:** leave unnamed unless legibly confirmed **and**, for
  load-bearing ones, verifiable.

## Verification discipline

- **Verify load-bearing facts by web search before finalizing** — named figures, significance
  claims, specific historical context, which government or entity issued the thing. Hold back
  what can't be confirmed. **Never print a guess.**
- **The "wrong entity" trap.** Extra care at politically divided moments: two governments with
  the same name (1927 China, Nanjing/Chiang vs. Wuhan/Wang Jingwei; 1940 China, Nationalist vs.
  Wang Jingwei; 1925 China, Beiyang vs. Canton KMT; 1836 Spain, Carlist pretender vs.
  Isabelline government), two companies with similar names, a person confused with a relative.
  Verify the attribution.
- **Don't rely on the user's transcription for hard-to-read text**, especially non-Latin or old
  script. Soften or hold names and figures that rest only on transcription. If neither the user
  nor I can read a name, it stays off the wall; it goes in the catalog if later confirmed.
- **Correct transcription errors when the image shows them**, and note the correction for the
  user's record.
- **For undated specimens and certificates**, bank or agent name changes can bracket the date
  (e.g. "Central Union Trust Company of New York" = 1918–1929).
- **Flag unissued blanks** — a blank date line or empty holder fields mean the object is an
  unissued remainder. Say so.

## Where cut significance goes

Significance is removed from labels but **not discarded**. Anything cut under the facts-first
rule is parked in [SIGNIFICANCE_PARKED.md](SIGNIFICANCE_PARKED.md), keyed by record id, for the
consistency pass once the curatorial stance is set.

## Records this guide does not govern

- **The five legacy Goetzmann essays** — 0900, 0904, 0908, 0909, 0910. Preserved deliberately;
  do not rewrite or trim.
- **`pages[]` fragments** on multi-page records — terse noun fragments for a single leaf. See
  the v1 archive §3. Not Excel-backed; edited directly in `data/museum-data.json`.
- **Titles** — see the v1 archive §8.
