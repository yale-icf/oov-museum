# Conflicts — description vs transcription

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

## ✅ All 27 worked — the last six, 2026-08-28

| Record | Outcome |
|---|---|
| `0432` | **Description right on all three dates.** The liquidator's stamp reads `special resolution passed on 27th April 1949` and `On 23th May 1952 a Winding-up Order was made`; the seal is `this 1st day of October 1912`. Transcription's 1940 and 1953 corrected. Its 1913 and 1908 are genuine — the French listing decree and the Companies (Consolidation) Act. |
| `0558` | **No change.** The face reads `Sesta serie, Letra F, Número 548 · BONO DE 5.000 PS. · Gana 3 p%. desde 1.º de Enero de 1851`, exactly as described. The transcription's "Junio de 1881" is not on this leaf and was not acted on. |
| `0602` | **Description right.** `as of the fifteenth day of July, One thousand nine hundred and twenty-two`, interest from July 15 1922. Transcription 1914 → 1922. |
| `0613` | **Description right.** `Amsterdam, 8 December 18\|86`. Transcription 1890 → 1886. ⚠️ Its **1880 is genuine** — the Administratie-Kantoor's notice of December 1880 — and was left alone. |
| `0683` | **Description wrong on the warrants**, right on rate, series and maturity. The footnote reads `ONE VOID AFTER DECEMBER 31, 1930, AND THE OTHER VOID AFTER DECEMBER 31, 1934`; the description said 1933. Its **notes described a different instrument entirely** — "7% Gold Debenture, Series A, Due January 1, 1949" against the plate's `TEN-YEAR 6% GOLD DEBENTURE, SERIES B, DUE JANUARY 1, 1940`. |
| `1034` | **Description wrong by 23 years.** Signed `Middelburg den Eersten Januarij 1771`, not 1794 — corroborated twice over: the printed terms run interest from `primo January 1700 Een en Zeventig` (1771) with first due date 1772, and the coupon renewals endorsed on the sheet run in decades back from 1799, which lands on 1771 and cannot reach 1794. Its number is **No. 572**, not the No. 502 in notes and identifiers. `issueYear` 1794 → **1771**. |

## ✅ The serial and total conflicts — all 7 worked, 2026-08-28

**Five were false positives.** The checker matches any "No." and any large number without
knowing what the number is:

- `0668`, `0676` — the transcription's huge figures are the **same total restated in other
  currencies**, printed on the face: `310,498,000 gold rubles = 1,241,992,000 francs`
  (exactly 4×) `= 1,003,529,536 marks`, and so on.
- `0450` — the description's "No. 22" is a **street address**, Rue Caumartin No. 22. The share
  number, No. 1,735, was already in identifiers.
- `0576` — the description's "No. 4131" is the **Peruvian law** authorising the loan. The
  bond's serial, No. 71547, was already in identifiers.
- `0485` — a nominee register legitimately carries many numbers; No. 74 in the margin and
  No. 30 in the list are different things. (Its transcription did misread that list entry as
  No. 50; corrected.)

**Two were real.**

`goetzmann0509` — dated **1 January 1768, not 1760**, confirmed three ways: the signature
reads `17` printed with a handwritten `68`; the printed terms run interest from `primo January
1700 Agt en Zestig` (1768) with the first due date `Negen en Zestig` (1769); and the coupon
renewals endorsed on the sheet run in decades back to 1769. `issueYear` 1760 → **1768**. Its
notes were wrong twice more — bond **No. 90**, not No. 99, and **600 guilders courant**
(`Zes Honderd Guldens Courant` on the sheet), not "~500 Livres". The description had both right.

`goetzmann0375` — **description right.** The banner reads `EIGHT PER CENT FUND OF $1,500,000 /
CREATED BY ACT OF CONGRESS FEB. 5TH 1840`, repeated on all ten coupons; the transcription's
"$5,000,000" is wrong. The bond is **No. 1995** and identifiers was empty, so that was added.

## The checker now suppresses settled conflicts

Twelve conflicts are structural and would re-flag forever — a street address, a law number,
currency equivalents. `conflict-audit.js` carries them in a `SETTLED` map with the reason for
each, so a later run reports **0 unsettled conflicts** rather than re-opening closed questions.
Run it with `--all` to see them again.

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
