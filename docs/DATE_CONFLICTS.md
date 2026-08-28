# Date conflicts — description vs transcription

`scratchpad/conflict-audit.js` compares each record's description against its
transcription and reports where the two state a **different** value of the same kind.
Both readings cannot be right, so each hit needs an eye. It found **27 date conflicts**
on 2026-08-27; this records what the images said.

The headline result: **in twelve of the fifteen settled cases the description was right
and the transcription carried the error.** The transcriptions are the unreliable side.
That matches what was already known — `0560`'s transcription turned out to be another
record's entirely, and the 44 Russian transcriptions were regenerated in July because
they were garbled.

## ✅ Description right, transcription wrong — 12 records, corrected

Verified from the reconstructed image (`scratchpad/reconstruct.js`); the transcription's
year tokens were then corrected by `scratchpad/fix-transcription-years.js` (24 tokens).

| Record | The document reads | Transcription had said |
|---|---|---|
| `0220` | `Treasury Department Oct. 13. 1790`, signed A. Hamilton | 1795 |
| `0293` | `Baltimore, Sept 7th 1875` | 1863 |
| `0346` | `Dated JAN. 19, 1929`; Wells Fargo stamp `JAN 21 1929` | Jan 13 1925 |
| `0351` | `this __ day of April 1903` | March 20, 1895 |
| `0377` | stamp `JAN 24 1972` | Jan 2 1974 |
| `0392` | seal `20th March 1886`; Scottish postmark `25·3·86` | 1896 |
| `0404` | `as of the 30th day of Nov 1904`, maturing `1 May 1954` | 1912 |
| `0495` | `den 16e Maart Anno Seventien Honderd Acht en negentig` (1798) | 21 Nov 1778 |
| `0506` | `Edinburgh, April 5th, 1834` and `London April 28, 1834` | 3 April 1824 |
| `0529` | `9th Day of October 1778`, in letterpress | 1776 |
| `0984` | `Dated, 19th October 1904`, redeemable `1st July, 1954` | 17 Oct 1910 / 11 Jul 1930 |
| `0232` | `19 23`, month reading as November | Sept 1919 — see note |

⚠️ **`0232` is a trap worth remembering.** Its transcription's "1919" is *genuine printed
text* — the preferred-stock clause says "September 15th, 1919" — and only the
transcription's summary line wrongly called that the issue date. A global year replace
would have corrupted real text, so `0232` was deliberately left out of the fix script.

## ⚠️ Description WRONG — 3 records, corrected

The minority, but the serious ones, since the description is what a visitor reads.

**`goetzmann0382`** — Nippon Kangyō Bank premium savings bond. Wrong in four places:

| | said | reads |
|---|---|---|
| date | November 1938 | 昭和十五年十一月 = **November 1940**, corroborated by the border 紀元二千六百年 (imperial year 2600 = 1940) |
| issue | eighty-eighth | 第拾八回 = **eighteenth** (the 88th would be 第八拾八回) |
| denomination | fifty yen (notes said fifty-five) | 金拾五圓 = **fifteen yen**, against the ten-yen sale price below it |
| serial | No. 009951 | **No. 069959** |

Its notes were worse still: they named the issuer the "Japan Industrial Bank" and dated
it Shōwa 35, 1960 — twenty years out. `issueYear` 1938 → **1940**.

**`goetzmann0924`** — Kokueki Petroleum Association share. The red seal reads
明治三十六年四月二十五日, Meiji 36 = **25 April 1903**; the description said "issued in
1900". `issueYear` 1900 → **1903**. Here the transcription was the right one.

**`goetzmann0900`** — Hagenow Benzol-Value Bond. The sheet reads `Hagenow, den 20. Juli
1923`; the description said **30** July. The *year* is right, and the transcription's 1925
is wrong: redemption running from 1 July 1924 rules 1925 out.

Also corrected while verifying `0495`: the notary is **Pieter** Hendrik Hoogenbergh, not
"Victor" — both the opening line and the signature read Pieter. A name error of the same
class as `0416`'s "Cadenet" for Cadenat, found only because the image was already open.

## False positives in the checker — 4

- `0218` — the description's 1727 is the Ostend Company's suspension, historical context,
  not a document date.
- `0622` — "No. 1869" is a serial the year regex caught.
- `0954` — "2000" is the $2,000 denomination.
- `0685` — 1946 and 1916 are later transfer stamps; the transcription simply omits the
  issue date.

## Still open — 6 records

Not yet image-checked:

| Record | description | transcription |
|---|---|---|
| `0432` | 1912 / 1949 / 1952 | 1913 / 1908 / 1940 / 1953 |
| `0558` | 1851 | 1881 / 1858 / 1859 |
| `0602` | 1922 | 1914 |
| `0613` | 1886 | 1880 / 1890 |
| `0683` | 1930 / 1940 | 1946 / 1926 |
| `1034` | 1794 | 1819–1848 (later coupon endorsements — may be no conflict) |

✅ **`0568` settled by the user 2026-08-27 — it is 1890.** The year is written **over** the
printed "188…", which is why the strokes read as 1880, 1888 and 1890 at once. `issueYear`
1888 → **1890**, sealed 28 February.

Two further errors surfaced with the image open for that, neither on any list:

- the plate reads `BEARING INTEREST AT THE RATE OF 6 PER CENT PER ANNUM`; the description and
  notes both said **five** percent;
- the imprint reads `DOHERTY & Cᵒ, 6, Gᵀ. NEWPORT ST, W.C.`; the description said **"Goertz &
  Co., 57 W.C."** — wrong name and wrong address.

A reminder that a date conflict is often just the thread that pulls: the record was wrong about
its rate and its printer too, and neither would ever have been flagged by comparing years.
