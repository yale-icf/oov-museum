
## Metadata-field reconciliation pass (mislabeled/composite records)

### goetzmann0223
- currency: ["USD"] -> ["Massachusetts Pounds"]
- flags: currency: image+description confirm a 1782 Rowley, Massachusetts town fine/tax warrant. No US dollar existed as official currency until 1792, so the prior 'USD' is anachronistic; a Massachusetts town assessment in 1782 was denominated in Massachusetts Pounds (£.s.d). Dataset precedent exists: a 1778 Continental Loan Office Bill of Exchange (Massachusetts) already uses 'Massachusetts Pounds', and a 1780 State of Massachusetts Bay Treasury Note uses 'GBP'. No explicit monetary figure appears on this warrant page itself (amounts were on the attached per-person list), so currency is inferred from era + jurisdiction. type: prior value 'Receipt' is incorrect — this is an order/warrant directing Constable Samuel Searl to COLLECT each person's proportion of the fine, not an acknowledgment of payment received. However, the dataset 'type' vocabulary has no 'Warrant'/'Order'/'Tax Levy' term and none of the existing values (Bond, Receipt, Certificate, Draft, Indenture, Promissory Note, etc.) genuinely fit, so type was left unchanged rather than substituting another inaccurate term. Recommend adding a 'Warrant' vocabulary value. issuingCountry/subjectCountry 'United States' left unchanged — consistent with the dataset's other 1782 Massachusetts documents. creator and language confirmed correct against the image.

### goetzmann0424
- currency: ["NLG"] -> ["South German Gulden"]
- flags: Currency was 'NLG' (Dutch guilder), which is wrong: the bond is denominated in '500 Gulden im 24½ Gulden Fuss' — the South German Gulden of the 24½-Gulden standard (Conventionsfuss used by the German states), not the Dutch guilder and not the Austrian Gulden. Dataset has no exact match; existing 'Gulden' is used for a Dutch record and 'Gulden (Austrian)' for Austrian ones, so 'South German Gulden' is used for accuracy. issuingCountry kept as 'Germany' to match dataset convention (no German-state granularity exists; document issued at Wiesbaden under the Duchy of Nassau in 1850). language (German), type (Bond), subjectCountry (United States), and creator all confirmed correct against image and description.

### goetzmann0435
- currency: ["ATS"] -> ["Austrian krone"]
- issuingCountry: ["Slovakia"] -> ["Austria"]
- subjectCountry: ["Slovakia"] -> ["Austria"]
- creator: "Stadtgemeinde Kremnitz (Municipality of Kremnica)" -> "Stadtgemeinde Wien (Municipality of Vienna)"
- flags: Metadata was shifted from a different (Kremnica/Slovakia) record. Image and corrected description both confirm a 5% City of Vienna municipal bond for 10,000 Kronen, dated Wien 1. März 1921 ('Bundeshauptstadt Wien'). Fixed issuingCountry/subjectCountry Slovakia->Austria and creator Kremnitz->Wien. Currency: instrument is denominated in Kronen ('Zehntausend Kronen'), not Schilling, so ATS (Austrian Schilling, introduced 1925) is wrong; set to 'Austrian krone' matching dataset style (cf. goetzmann0633). Note other Krone-era Austrian war-loan records in this batch (e.g. goetzmann0390/0453/0454) are also coded ATS, but for this record the correct denomination is the krone. language=German and type=Bond already correct; region left null per Austrian-record convention.

### goetzmann0498
- currency: ["GBP"] -> ["Massachusetts Pounds"]
- issuingCountry: ["United Kingdom"] -> ["United States"]
- subjectCountry: ["Mexico"] -> ["United States"]
- creator: "Mexican Government; Council of the United Mexican States (London)" -> "State of Massachusetts Bay (Treasurer; Committee)"
- flags: Old metadata described a different (Mexican) document and was wholly mismatched. Image + description confirm a State of Massachusetts-Bay treasury note, 1 Jan 1780, payable to Elisha Curtis, commodity-indexed, in English. currency: denominated in Pounds in 'current money of the State'; matched sibling Massachusetts note goetzmann0497 ('Massachusetts Pounds') rather than GBP. issuingCountry/subjectCountry set to 'United States' per dataset convention for state-issued Revolutionary-era obligations (cf. goetzmann0226, 0497, 0625). creator changed from the erroneous Mexican body to the State of Massachusetts Bay named on the note. language ('English') and type ('Bond') already correct, so omitted. region left null/unchanged as siblings carry no region.

### goetzmann0499
- currency: ["NLG"] -> ["British pound sterling"]
- language: ["Dutch"] -> ["English"]
- issuingCountry: ["Belgium"] -> ["United Kingdom"]
- subjectCountry: ["Belgium"] -> ["Mexico"]
- creator: "Generale Keijserlijke Indische Compagnie" -> "Republic of Mexico"
- type: ["Bond", "Certificate", "Coupon"] -> ["Bond", "Coupon"]
- flags: Old metadata described a different, Dutch/Belgian VOC-style instrument (NLG, Dutch, Belgium, 'Generale Keijserlijke Indische Compagnie') and did not match this record at all. Image and corrected description confirm a Mexican Five Per Cent Deferred Stock bond for £500 sterling, fully in English, issued in London on 30 Sept 1837 under Agustin de Iturbide, Charge d'Affaires for the Republic of Mexico, with a full coupon sheet attached. currency set to 'British pound sterling' (£500 sterling). issuingCountry set to United Kingdom (issued in London) following sibling record goetzmann0498, a Mexican government bond also issued in London. subjectCountry set to Mexico (debt of the Republic of Mexico). creator set to the issuing body named on the instrument, the Republic of Mexico. type reduced to Bond+Coupon (bond with attached coupon sheet); 'Certificate' dropped as not distinctly supported. region left null (no region values used in dataset).

### goetzmann0502
- creator: "Unilever N.V." -> "Everard Cornelis Bordt (Notaris); C. Frymersum en Zoon (Directie)"
- type: ["Certificate"] -> ["Indenture"]
- subjectCountry: ["Netherlands"] -> ["Netherlands", "Guyana"]
- flags: creator was 'Unilever N.V.' (anachronistic for an 1817 notarial deed) — corrected to the public notary Everard Cornelis Bordt before whom the deed was passed, plus the directing firm C. Frymersum en Zoon named as directors of the negotiatie; format follows dataset notarial precedent (cf. 'Hermanus de Wolff Junior (Notaris); Adolf Jan Heshuysen en Compagnie'). type 'Certificate' -> 'Indenture' since the description and image identify it as a notarial deed (a deed); 'Indenture' is the dataset's deed vocabulary. subjectCountry expanded to include 'Guyana': the negotiatie is secured on plantations in the Colony of Demerara (modern Guyana), matching the near-identical sibling record goetzmann0545 (Dutch plantation loan, Essequibo/Demerara) which uses ['Netherlands','Guyana']. currency (NLG), language (Dutch), issuingCountry (Netherlands), region (null) all confirmed correct against image and description; left unchanged.

### goetzmann0558
- currency: ["Mexican peso"] -> ["Mexican peso", "French franc"]
- language: ["Spanish"] -> ["Spanish", "French", "Amharic"]
- issuingCountry: ["Mexico"] -> ["Mexico", "France"]
- subjectCountry: ["Mexico"] -> ["Mexico", "Ethiopia"]
- creator: "Gobierno de México" -> "Gobierno de México; Compagnie Impériale des Chemins de Fer Éthiopiens"
- type: ["Bond"] -> ["Bond", "Stock Certificate"]
- flags: Composite record of two unrelated bearer securities; existing metadata only described the first (Mexican 5,000-peso Deuda Nacional Consolidada al Tres por Ciento bond, visible in the image). Added the second instrument: the Imperial Ethiopian railway 500-franc bearer share (Action de Cinq Cents Francs au Porteur) of the Compagnie Impériale des Chemins de Fer Éthiopiens, headquartered in Paris. Hence currency adds French franc; language adds French and Amharic (bilingual French/Amharic lettering per description); issuingCountry adds France (Paris-based company); subjectCountry adds Ethiopia; creator adds the railway company; type adds Stock Certificate (the share). Note: existing creator value in source data contained a corrupted character (U+FFFD); written here as the correct 'México'. region left unchanged (null). Image shows only the Mexican bond, but the corrected description documents both instruments.

### goetzmann0562
- type: ["Stock Certificate"] -> ["Coupon"]
- flags: Corrected description and image both confirm this is a detached dividend-coupon sheet (48 numbered coupons, EXERCICE 1900-1947, 'F 20,10' each), not the share certificate itself; retyped from 'Stock Certificate' to 'Coupon' to match dataset vocabulary for standalone coupon sheets (e.g. goetzmann0737, 0726). currency (French franc), language (French), issuingCountry (France, French-chartered company), subjectCountry (Ethiopia), and creator (Compagnie Impériale des Chemins de Fer Éthiopiens) all verified correct against image/description; left unchanged. region was null and image gives no basis to assign one.

### goetzmann0599
- currency: ["British pound sterling|French franc"] -> ["Russian ruble", "British pound sterling", "French franc"]
- language: ["English", "French", "German", "Russian", "Japanese"] -> ["English", "French", "Russian"]
- issuingCountry: ["China", "Russia"] -> ["Russia"]
- subjectCountry: ["China", "Azerbaijan"] -> ["Azerbaijan"]
- creator: "Chinese Government; City of Baku" -> "City of Baku"
- flags: Old metadata was contaminated with data from an unrelated Chinese Government bond. Image + corrected description confirm this is the reverse of the 5% Loan of the City of Baku, 1910, issued by the Baku Municipal Duma, printed in Russian, English and French, denominated Roubles 189 = Pounds sterling 20 = Francs 504. Removed China from issuingCountry/subjectCountry and removed Chinese Government from creator; removed German and Japanese from language (no such text on document); added Russian ruble to currency to reflect the triple denomination (matched existing dataset value 'Russian ruble|British pound sterling|French franc'). Creator set to 'City of Baku' (document title); description also names the Baku Municipal Duma as the issuing authority. type ['Bond'] and region (null) left unchanged as already correct.

### goetzmann0608
- currency: ["British pound sterling|Dutch guilder"] -> ["Dutch guilder"]
- subjectCountry: ["Netherlands", "Dominica"] -> ["Netherlands", "Suriname"]
- creator: "Hermanus de Wolff Junior (Notaris); Adolf Jan Heshuysen en Compagnie" -> "Cornelis van Homrigh (Notaris); Fredrik Cornelis Stolkert; Reynier Isaac du Plessis en Jan Fredrik Taunay"
- type: ["Bond", "Certificate"] -> ["Bond", "Indenture"]
- flags: currency: instrument is denominated solely in guilders Holland current money (320,000 guilders); removed 'British pound sterling' which was erroneous, kept 'Dutch guilder' per dataset style. subjectCountry: the mortgaged plantations are in Surinam (image/description), not Dominica; replaced 'Dominica' with existing dataset value 'Suriname', retaining 'Netherlands' (place of execution). creator: prior value (Hermanus de Wolff Junior; Adolf Jan Heshuysen en Compagnie) belongs to a different record; corrected to the Amsterdam notary Cornelis van Homrigh and the named contracting parties (debtor Fredrik Cornelis Stolkert; creditors Du Plessis & Taunay), following the 'Name (Notaris); parties' style. type: kept 'Bond' (debt secured by mortgage); replaced 'Certificate' with 'Indenture' as the closest dataset vocabulary for a notarial deed of mortgage (Acte van Hypotheecq). language, issuingCountry left unchanged (Dutch / Netherlands confirmed).

### goetzmann0649
- type: ["Bond"] -> ["Coupon"]
- currency: ["Bulgarian lev|French franc"] -> ["British pound sterling"]
- language: ["Bulgarian", "French"] -> ["English"]
- issuingCountry: ["Bulgaria"] -> ["Chile"]
- subjectCountry: ["Bulgaria"] -> ["Chile"]
- creator: "Principality of Bulgaria, Ministry of Finance" -> "Republic of Chile"
- flags: Old metadata was entirely mislabeled (Bulgaria/Bulgarian lev/French/Principality of Bulgaria Ministry of Finance) and described a different document. Corrected description and the image both confirm this is the Chilian 5 Per Cent. Loan 1896, a sterling external loan of the Republic of Chile, payable at N.M. Rothschild & Sons, London. Coupon text read directly from the image is in English only ("CHILIAN 5 PER CENT. LOAN 1896 ... For £2.10.0 being Six Months Interest on £100 payable at the office of Messrs. N.M. ROTHSCHILD & SONS LONDON & at the exchange of the day in SANTIAGO, PARIS, BERLIN, HAMBURG, AMSTERDAM & BRUSSELS"), so language set to English. Currency is sterling (coupons denominated £2.10.0 on a £100 bond); other cities are payment-exchange points only. type changed Bond->Coupon since this is an attached coupon sheet (title/description say "Coupon Sheet"/"sheet of attached interest coupons"; dataset has an existing "Coupon" type). issuingCountry/subjectCountry set to Chile (the borrowing sovereign), consistent with goetzmann0642 where a Rothschild-placed sovereign loan uses the borrowing state as issuingCountry. creator set to "Republic of Chile", the issuing sovereign of the loan named on the document. region left unchanged (null), matching the existing Chile records.

### goetzmann0726
- type: ["Coupon"] -> ["Bond", "Coupon"]
- flags: Composite record: a bearer coupon sheet (left) plus an unissued 7% External Stabilisation & Development Loan bond certificate ('Obligation Extérieure Or 7%', 1929) for the same series (right). Original type was ['Coupon'] only; added 'Bond' to reflect the obligation certificate, matching the existing dataset ['Bond','Coupon'] vocabulary. currency ['USD; FRF'] confirmed (certificate reads 'Frs F 2.552,90 ou U.S. $100', i.e. French francs and US dollars); language ['French','Romanian'] confirmed (French body with Romanian subtitle 'Cassa Autonoma a Monopolurilor Regatului Romaniei'); issuingCountry/subjectCountry Romania and creator 'Caisse Autonome des Monopoles du Royaume de Roumanie' all confirmed against the image and left unchanged. region left null per dataset convention (region is null for all records).

### goetzmann0728
- language: ["French", "English", "German", "Turkish"] -> ["French", "English", "German", "Ottoman Turkish"]
- flags: Image confirms four contract columns: French, English, German, and the fourth in Arabic/Ottoman script. Dataset convention for Ottoman-period records uses 'Ottoman Turkish' (cf. goetzmann0710, goetzmann0591), so changed 'Turkish' -> 'Ottoman Turkish'. type (Bond), currency (FRF; GBP; TRY), issuingCountry/subjectCountry (Turkey), region (null), and creator (Conseil d'Administration de la Dette Publique Ottomane) all confirmed correct against the image (DPO monogram seal) and description; left unchanged. currency style matches sibling OPDA record goetzmann0731 exactly.

### goetzmann0931
- type: ["Stock Certificate"] -> ["Receipt"]
- currency: ["Gulden"] -> ["Dutch guilder"]
- flags: type: document is explicitly a 'RECEPIS' (share receipt) given in exchange for a share in the outstanding loan plus arrears of interest coupons; title and corrected description both call it a 'Share Receipt', so changed from 'Stock Certificate' to existing-vocabulary 'Receipt'. currency: instrument is denominated in Amsterdam guilders (f-amounts); normalized non-standard 'Gulden' to dataset-standard 'Dutch guilder'. language (Dutch), issuingCountry (Netherlands, issued at Amsterdam), subjectCountry (Sweden, location of works) all confirmed by image and left unchanged. creator left unchanged but uncertain: the document was signed/issued by the Amsterdam negotiation's directors ('De Directeuren'), not by the Swedish works themselves; the works are named as the subject enterprises, so the current value is defensible and no clearly-named issuing body alternative is present. region left null.

### goetzmann0936
- type: ["Certificate"] -> ["Certificate", "Tontine"]
- language: ["French"] -> ["French", "Dutch"]
- issuingCountry: ["Belgium"] -> ["Belgium", "Netherlands"]
- subjectCountry: ["Belgium"] -> ["Belgium", "Netherlands"]
- flags: Composite record of two unrelated instruments. (1) Antwerp marine insurance policy, 1761, in French, issued by the Chambre Imperiale et Royale d'Assurance d'Anvers at Antwerp (Austrian Netherlands = Belgium); image confirms French text, ship vignette, 'AU NOM DE DIEU', and the chamber's name. (2) Amsterdam survivorship/tontine contract ('Contract van Overleeving', device 'De Tyd baard Roozen'), 1774, in Dutch, issued at Amsterdam (Netherlands). language: added Dutch for the second leaf. issuingCountry/subjectCountry: added Netherlands for the Amsterdam leaf. type: added 'Tontine' since the description identifies the second instrument as a life-contingent tontine/survivorship contract; kept 'Certificate' for the insurance policy (no insurance/policy type exists in the dataset vocabulary). creator: left unchanged - it correctly names the Antwerp chamber shown in the image; the Amsterdam issuer is not named in the description. currency: left empty - the Antwerp policy was almost certainly denominated in Flemish pounds and the Amsterdam tontine in Dutch guilders, but the amounts on the image are not legibly confirmable and neither currency is stated in the description, so not asserted to avoid guessing. region: left unchanged (null); description places both in the eighteenth-century Low Countries but no clear dataset region vocabulary cue applies.

### goetzmann0506
- subjectCountry: ["Bolivia"] -> ["Honduras"]
- creator: "Potosian Land Grant Company (London)" -> "Poyais Land Office (London)"
- flags: subjectCountry was 'Bolivia' and creator was 'Potosian Land Grant Company (London)' — both appear to be leftovers from a different (Potosi/Bolivia) record. The image and corrected description confirm this is Gregor MacGregor's fictional Poyais scheme: header reads 'POYAISIAN LAND GRANT' with motto NESCIUS VINCI, signed 'Gregor MacGregor' at Edinburgh under an embossed 'POYAIS LAND OFFICE' seal, countersigned by 'Trustees for the Exchange and Redemption of the Securities of the Poyaisian Territory' at London. Poyais was claimed to lie on the Mosquito Shore, i.e. modern Honduras (existing dataset vocabulary). Creator set to the issuing body named on the seal, preserving the '(London)' format of the original value. currency LEFT UNCHANGED ('GBP'): the only monetary unit on the instrument is the quit rent 'one cent per acre' (a dollar/cent unit, the fictional Poyais dollar), but no specific named currency can be confidently justified from the document; redemption was conducted in London for British holders, so GBP is plausible but uncertain — not changed per the no-guess rule. issuingCountry left as 'United Kingdom' (actually subscribed at London/Edinburgh; the 'Cazique of Poyais' sovereignty is fictional). type/language confirmed correct (bilingual English/Spanish certificate).

### goetzmann0595
- type: ["Bond"] -> ["Register"]
- currency: ["Japanese yen"] -> ["Chinese copper cash"]
- language: ["Japanese"] -> ["Chinese"]
- issuingCountry: ["Japan"] -> ["China"]
- subjectCountry: ["Japan"] -> ["China"]
- creator: "Japanese government or merchant (unidentified)" -> "Chinese merchant or household (unidentified)"
- flags: Record was mislabeled as a Japanese yen bond; corrected description and image confirm a Qing-dynasty Chinese handwritten account ledger of loans in copper cash, Tongzhi 13 (1874), with red diamond tally marks and title slip 同治十三年新正月合算大吉. currency: instrument is reckoned in 千文/文 (wén, copper cash), not yen — used 'Chinese copper cash' (no exact prior dataset value; 'CNY'/'Yen' exist but neither fits pre-modern copper cash). type: it is an account ledger of loans/balances, not a bond — mapped to existing vocabulary term 'Register' (closest to ledger/account book). creator: private merchant/household account book, no issuing body named, so left as unidentified but corrected nationality to Chinese. region left unchanged (was null).

### goetzmann0730
- language: ["Russian", "French", "German", "Bulgarian", "English"] -> ["Bulgarian", "French", "German", "English"]
- currency: ["BGN; FRF"] -> ["French franc; Bulgarian lev"]
- flags: language: removed 'Russian' — the document has exactly four parallel columns (Bulgarian/Cyrillic 'Условия на заема', French, German, English per both description and image headings CONDITIONS DE L'EMPRUNT / BEDINGUNGEN DER ANLEIHE / CONDITIONS OF THE LOAN); the Cyrillic column is Bulgarian, not Russian. currency: old value 'BGN; FRF' used ISO codes, inconsistent with dataset style; this 1907 Bulgarian gold loan was denominated in lev (at par with the franc) and the amortisation table figures are in francs, so used the existing dataset value 'French franc; Bulgarian lev'. type/issuingCountry/subjectCountry/creator already correct; region left null.

### goetzmann0969
- type: ["Bond"] -> ["Coupon"]
- creator: "Principauté de Bulgarie (Bulgarian Government)" -> "Kingdom of Bulgaria, Ministry of Finance (Болгарское Царство / Königreich Bulgarien / Bulgarian Kingdom)"
- flags: type changed Bond->Coupon: the document is a talon (coupon-renewal slip), confirmed by image (TALON / ТАЛОНЪ printed three times) and description; the dataset has no 'Talon' vocabulary term, so 'Coupon' is the nearest existing instrument type. creator changed: image headers and corrected description name the issuer as the 'Bulgarian Kingdom' (Болгарское Царство / Königreich Bulgarien) and the 'Ministry of Finance', contradicting the prior 'Principauté de Bulgarie (Principality)' label; reformatted to match dataset style (cf. 'Kingdom of Bulgaria, Finance Ministry'). currency LEFT UNCHANGED (FRF): the talon image shows no denomination and the description names no currency, so no justified change (sister 1902 gold-loan records 0966-0968 also use FRF). language (Russian/German/English) confirmed by image; issuingCountry/subjectCountry (Bulgaria) correct; region is null across the entire dataset (unused).

