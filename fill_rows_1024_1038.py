import zipfile, re, shutil, os, pandas as pd

src = r'C:\Users\ks2479\Documents\GitHub\oov-museum\oov_data_new.xlsx'
repair_copy = src + '.bak'
fixed = src + '.fixed.xlsx'

shutil.copy(src, repair_copy)
with zipfile.ZipFile(repair_copy, 'r') as zin:
    with zipfile.ZipFile(fixed, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename.startswith('xl/worksheets/sheet'):
                text = data.decode('utf-8')
                data = re.sub(r'<v>NaN</v>', '', text).encode('utf-8')
            zout.writestr(item, data)

df = pd.read_excel(fixed, dtype=str)

COLS = ['filename', 'title', 'description', 'type', 'keywords',
        'subjectCountry', 'issuingCountry', 'creator', 'issueDate', 'currency',
        'language', 'numberPages', 'period', 'notes']

rows_data = [
    # Update 1023: back (1024) now found — extend to 2 pages
    {
        'filename': 'goetzmann1023.jpg',
        'numberPages': '2',
        'notes': '18th-century Dutch manuscript bond on vellum, recto with principal text. See goetzmann1024 for verso. Together form a 2-page vellum manuscript bond document.'
    },
    # 1024: verso of Dutch manuscript bond (1023)
    {
        'filename': 'goetzmann1024.jpg',
        'title': '18th-Century Dutch Manuscript Bond/Obligation – Verso with Transfer Endorsements',
        'description': 'Verso (back) of an 18th-century Dutch manuscript bond written on folded vellum. The surface is densely covered with handwritten transfer endorsements, payment records, and administrative annotations accumulating over the document\'s circulation history.',
        'type': 'bond',
        'keywords': 'manuscript, vellum, obligation, bond, transfer endorsements, handwritten, Dutch Republic, 18th century',
        'subjectCountry': 'Netherlands',
        'issuingCountry': 'Netherlands',
        'creator': '',
        'issueDate': '18th century',
        'currency': 'Dutch guilder',
        'language': 'Dutch',
        'numberPages': '2',
        'period': '18th century',
        'notes': 'Verso (p.2/2) of the Dutch vellum manuscript bond; see goetzmann1023 for recto.'
    },
    # 1025: Ming Dynasty banknote, front
    {
        'filename': 'goetzmann1025.jpg',
        'title': 'Da Ming Tong Xing Bao Chao (Great Ming Circulating Treasure Note) – 1 Guan',
        'description': 'Front of a Ming Dynasty paper banknote (大明通行寶鈔, Da Ming Tong Xing Bao Chao) for 1 Guan (= 1,000 wen/cash), issued by the Ministry of Revenue (戶部) of the Great Ming dynasty. Bears decorative border with dragon motifs, central denomination character 壹貫, official red seals, and text stating the note circulates interchangeably with copper coins. First issued in 1375 under the Hongwu Emperor; this format was produced throughout the dynasty.',
        'type': 'banknote',
        'keywords': 'Ming dynasty, paper money, banknote, Da Ming, Bao Chao, guan, China, 壹貫, 大明通行寶鈔, Ministry of Revenue, early paper money',
        'subjectCountry': 'China',
        'issuingCountry': 'China',
        'creator': 'Ministry of Revenue (戶部), Ming Dynasty',
        'issueDate': '1375-1644',
        'currency': 'Guan (貫)',
        'language': 'Chinese',
        'numberPages': '2',
        'period': '14th–17th century',
        'notes': 'Recto (p.1/2); see goetzmann1026 for verso. Ming dynasty paper currency, among the earliest printed banknotes in history. First issued 1375 under Hongwu Emperor.'
    },
    # 1026: Ming Dynasty banknote, back
    {
        'filename': 'goetzmann1026.jpg',
        'title': 'Da Ming Tong Xing Bao Chao (Great Ming Treasure Note) – Verso with Official Seal',
        'description': 'Verso (back) of a Ming Dynasty 1 Guan banknote (大明通行寶鈔). Shows faded impression of the front printing and a large prominent red official seal, characteristic of Ming dynasty paper money.',
        'type': 'banknote',
        'keywords': 'Ming dynasty, paper money, banknote, Da Ming, Bao Chao, China, official seal, 壹貫, verso',
        'subjectCountry': 'China',
        'issuingCountry': 'China',
        'creator': 'Ministry of Revenue (戶部), Ming Dynasty',
        'issueDate': '1375-1644',
        'currency': 'Guan (貫)',
        'language': 'Chinese',
        'numberPages': '2',
        'period': '14th–17th century',
        'notes': 'Verso (p.2/2); see goetzmann1025 for recto. Red official seal on reverse.'
    },
    # 1027: Monte di Pietà di Firenze bond
    {
        'filename': 'goetzmann1027.jpg',
        'title': 'Monte di Pietà di Firenze – Assegnazione di Luoghi del Monte (Bond Certificate)',
        'description': 'Official printed bond certificate (assegnazione di luoghi) issued by the Monte di Pietà of Florence, assigning units (luoghi) of the Monte\'s capital to a named holder. Each luogo is valued at 100 scudi fiorentini (at 7 lire per scudo) and pays 5 scudi annual interest. Dated January 11, 1647. The Monte di Pietà was a charitable lending institution established by order of the Grand Duke of Tuscany in 1616. Decorated with two allegorical figures flanking the Medici/Tuscan coat of arms. Carries wax seal and manuscript signatures of the Secretary and officials.',
        'type': 'bond',
        'keywords': 'Monte di Pietà, Florence, Italy, luoghi del Monte, obligation, 17th century, Tuscany, Grand Duke, charitable institution, scudi, Medici',
        'subjectCountry': 'Italy',
        'issuingCountry': 'Italy',
        'creator': 'Monte di Pietà della Città di Firenze',
        'issueDate': '1647-01-11',
        'currency': 'Scudi fiorentini',
        'language': 'Italian',
        'numberPages': '1',
        'period': '17th century',
        'notes': 'Bond certificate assigning luoghi of the Florentine Monte di Pietà. Interest 5 scudi per luogo per year. Established under Grand Ducal senate ordinance of 1616.'
    },
    # 1028: De Woning-Maatschappij Batavia share
    {
        'filename': 'goetzmann1028.jpg',
        'title': 'De Woning-Maatschappij, Batavia – ƒ100 Bearer Share No. 1499',
        'description': 'Bearer share certificate (aan toonder) No. 1499 for ƒ100 of the Naamloze Vennootschap De Woning-Maatschappij (Housing Company Ltd.), incorporated in Batavia, Dutch East Indies. Total capital ƒ500,000 divided into 5,000 shares of ƒ100 each. Incorporated by notarial deed of February 27, 1908 before Notary H. Schotel in Batavia (No. 62); articles amended January 20, 1909 before Notary E.H. Carpenter & Alting (No. 81) and approved by Government Resolution February 18, 1909 No. 31.',
        'type': 'share',
        'keywords': 'Dutch East Indies, Batavia, housing company, bearer share, naamloze vennootschap, Netherlands, colonial, Indonesia, woning',
        'subjectCountry': 'Indonesia',
        'issuingCountry': 'Netherlands',
        'creator': 'De Woning-Maatschappij',
        'issueDate': '1909',
        'currency': 'Dutch guilder (ƒ)',
        'language': 'Dutch',
        'numberPages': '1',
        'period': 'Early 20th century',
        'notes': 'Colonial Dutch East Indies housing company bearer share, Batavia (Jakarta). ƒ100 share No. 1499, out of 5,000 total shares. Company established 1908.'
    },
    # 1029: Ostend Company receipt 1723
    {
        'filename': 'goetzmann1029.jpg',
        'title': 'Generale Keyserlyche Indische Compagnie (Ostend Company) – Share Subscription Receipt, 250 Guilden, Antwerp 1723',
        'description': 'Share subscription receipt from the Generale Keyserlyche Indische Compagnie (General Imperial Indian Company, the Ostend Company), directing cashier Jan Baptist Cegels junior to receive 250 guilden from a subscriber as first payment on company capital, per the terms of the Imperial Charter. Dated August 13, 1723 in Antwerp. Bears multiple subsequent payment endorsements (October 1723, December 1723, November 1726) documenting installment payments. The Ostend Company (1722–1731) was the Habsburg East India trading company, chartered by Emperor Charles VI.',
        'type': 'receipt',
        'keywords': 'Ostend Company, Generale Keyserlyche Indische Compagnie, Austrian Netherlands, East India company, share subscription, Antwerp, 1723, Habsburg, Charles VI, colonial trade',
        'subjectCountry': 'Belgium',
        'issuingCountry': 'Belgium',
        'creator': 'Generale Keyserlyche Indische Compagnie',
        'issueDate': '1723-08-13',
        'currency': 'Guilden',
        'language': 'Dutch',
        'numberPages': '1',
        'period': '18th century',
        'notes': 'Ostend Company share subscription receipt, 250 guilden, Antwerp 1723. Multiple payment endorsements through 1726. Ostend Company chartered 1722, suppressed 1731.'
    },
    # 1030: Ostend Company French receipt 1726
    {
        'filename': 'goetzmann1030.jpg',
        'title': 'Generale Keyserlyche Indische Compagnie (Ostend Company) – Payment Receipt, 300 Florins, Antwerp 1726',
        'description': 'French-language payment receipt from the Directors of the Generale Keyserlyche Indische Compagnie (Ostend Company) for 300 florins, issued in Antwerp on January 24, 1726. Bears the company\'s coat of arms at top, multiple director signatures, and administrative endorsements. The Ostend Company (1722–1731) was the Habsburg-chartered East India trading company based in the Austrian Netherlands.',
        'type': 'receipt',
        'keywords': 'Ostend Company, Generale Keyserlyche Indische Compagnie, Austrian Netherlands, East India company, Antwerp, 1726, Habsburg, colonial trade, florins',
        'subjectCountry': 'Belgium',
        'issuingCountry': 'Belgium',
        'creator': 'Generale Keyserlyche Indische Compagnie',
        'issueDate': '1726-01-24',
        'currency': 'Florins',
        'language': 'French',
        'numberPages': '1',
        'period': '18th century',
        'notes': 'French-language Ostend Company payment receipt, 300 florins, Antwerp January 24, 1726. See also goetzmann1029 (Dutch-language receipt, 1723).'
    },
    # 1031: Monte di Pietà di Firenze bond, second certificate
    {
        'filename': 'goetzmann1031.jpg',
        'title': 'Monte di Pietà di Firenze – Assegnazione di Luoghi del Monte (Bond Certificate)',
        'description': 'Bond certificate (assegnazione di luoghi) of the same printed type as goetzmann1027, issued by the Monte di Pietà of Florence. Assigns units (luoghi) of the Monte\'s capital to a named holder; each luogo valued at 100 scudi fiorentini (at 7 lire per scudo), paying 5 scudi annual interest. A separate issuance to a different assignee using the same pre-printed form authorized under the Grand Ducal senate ordinance of 1616. Carries wax seal and manuscript signatures.',
        'type': 'bond',
        'keywords': 'Monte di Pietà, Florence, Italy, luoghi del Monte, obligation, 17th century, Tuscany, Grand Duke, charitable institution, scudi',
        'subjectCountry': 'Italy',
        'issuingCountry': 'Italy',
        'creator': 'Monte di Pietà della Città di Firenze',
        'issueDate': '17th century',
        'currency': 'Scudi fiorentini',
        'language': 'Italian',
        'numberPages': '1',
        'period': '17th century',
        'notes': 'Second Monte di Pietà bond of same printed type as goetzmann1027; different assignee. Interest 5 scudi per luogo per year.'
    },
    # 1032: North American Land Company
    {
        'filename': 'goetzmann1032.jpg',
        'title': 'North American Land Company – 10 Shares Certificate No. 15, Philadelphia 1795',
        'description': 'Share certificate No. 15 of the North American Land Company, certifying that James Greene is entitled to ten shares in the entire property of the Company, with a guaranteed minimum annual dividend of Six Dollars per share, per the Articles of Agreement dated February 7, 1795 in Philadelphia. Signed at Philadelphia on March 10, 1795 by James Marshall (Secretary) and Robert Morris (President). Transferable only at the Company\'s Philadelphia office by the owner in person or legal representative. Robert Morris (1734–1806) was the principal financier of the American Revolution.',
        'type': 'share certificate',
        'keywords': 'North American Land Company, Robert Morris, Philadelphia, American Revolution, land company, 1795, shares, James Marshall, founding fathers',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'North American Land Company',
        'issueDate': '1795-03-10',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '1',
        'period': 'Late 18th century',
        'notes': 'No. 15, 10 shares, min. $6/share annual dividend. Signed by Robert Morris (President) and James Marshall (Secretary). Morris was a principal financier of the American Revolution.'
    },
    # 1033: French company statutes 1785
    {
        'filename': 'goetzmann1033.jpg',
        'title': 'French Joint-Stock Company – Statuts / Constitution (Notarial Act), Paris 1785',
        'description': 'Notarially certified company statutes or constitution document executed before the King\'s Notaries (Conseillers du Roy, Notaires, Garde-notes) at the Châtelet de Paris, dated January 18, 1785. Records the proposed constitution of a French joint-stock company (compagnie) with extensive numbered articles covering shareholders, directors, capital structure, and governance. References cities including Bordeaux. Mentions the company\'s Syndic. Signed by company officers and notarial witnesses.',
        'type': 'share',
        'keywords': 'French company, statutes, constitution, notarial act, Paris, 1785, compagnie, joint-stock, Châtelet, ancien régime, Bordeaux',
        'subjectCountry': 'France',
        'issuingCountry': 'France',
        'creator': '',
        'issueDate': '1785-01-18',
        'currency': 'French livres',
        'language': 'French',
        'numberPages': '1',
        'period': '18th century',
        'notes': 'Company constitution/statutes notarial act, Paris January 18, 1785. Company name partially illegible; possibly a trading or insurance company. Mentions Bordeaux.'
    },
    # 1034: Middelburg Register plantation bond
    {
        'filename': 'goetzmann1034.jpg',
        'title': 'Register Middelburg – Plantation Bond (Obligatie) for Essequebo and Demerara Colonies, No. 502',
        'description': 'Notarial bond certificate No. 502 from the Register of Middelburg (Netherlands), in which Kornelis van den Helm Boudaert acts as creditor and owner of money bonds (obligatien) secured on various plantations in the Dutch colonies of Essequebo (Essequibo) and Demerara (now Guyana). Relates to the Gold Commission system of plantation mortgage financing. Dated January 1794 in Middelburg, Zeeland. Signed by multiple parties. Part of the Middelburg commercial network that financed Dutch Guiana plantation agriculture through mortgage bonds.',
        'type': 'bond',
        'keywords': 'Middelburg, plantation bond, Essequibo, Demerara, Dutch Guiana, Guyana, Netherlands, Zeeland, mortgage, colonial, obligatie, 1794',
        'subjectCountry': 'Guyana',
        'issuingCountry': 'Netherlands',
        'creator': '',
        'issueDate': '1794-01',
        'currency': 'Dutch guilder (ƒ)',
        'language': 'Dutch',
        'numberPages': '1',
        'period': 'Late 18th century',
        'notes': 'Plantation bond No. 502, Register Middelburg, January 1794. Secured on plantations in Essequibo and Demerara (Dutch Guiana). Part of Dutch colonial plantation mortgage system.'
    },
    # 1035: French Royal Rentes 1761
    {
        'filename': 'goetzmann1035.jpg',
        'title': "Rentes à 3 Pour Cent sur l'État – French Royal Annuity Bond No. 46460, Paris 1761",
        'description': "French Royal government 3% annuity bond (Rentes à 3 pour cent sur l'État), No. 46460, dated October 1761, Paris. Issued before the King's Notaries at the Châtelet of Paris, this perpetual annuity derives from the refinancing of earlier August 1739 state debt. Contains detailed conditions on payment schedules, enforcement provisions, and the role of royal commissioners (Commissaires du Roi). Signed by M. Garnier and notarial witnesses. Part of the ancien régime French state debt structure.",
        'type': 'bond',
        'keywords': 'French rentes, annuity, 3%, Paris, 1761, Châtelet, notarial, Kingdom of France, ancien régime, state debt, perpetual',
        'subjectCountry': 'France',
        'issuingCountry': 'France',
        'creator': 'Kingdom of France',
        'issueDate': '1761-10',
        'currency': 'French livres',
        'language': 'French',
        'numberPages': '1',
        'period': '18th century',
        'notes': 'No. 46460, 3% French royal rente, Paris October 1761. Derives from 1739 state debt refinancing. Part of pre-revolutionary French government bond market.'
    },
    # 1036: Russian 5% perpetual income bond 1822
    {
        'filename': 'goetzmann1036.jpg',
        'title': 'Russian Imperial 5% Perpetual Income Bond (Непрерывный Доход) – 960 Rubles (£43 Sterling), 1822',
        'description': 'Russian Imperial 5% perpetual income bond (Непрерывный Доход 5 На Сто, "Russian 5 Per Cent Loan 1822") for 960 rubles, equivalent to £43 sterling. Issued by the Russian State Loan Bank (Государственный Заёмный Банк) on March 1, 1822. Class 1, Series 3. Contains detailed conditions in Russian and French regarding interest payment, redemption, and bank obligations. Bears pink revenue/fiscal stamp and official signatures. Denominated in both Russian rubles and British pounds sterling, targeting international investors.',
        'type': 'bond',
        'keywords': 'Russia, Imperial Russia, Russian bond, 5%, perpetual income, ruble, sterling, 1822, State Loan Bank, Непрерывный Доход, konsol',
        'subjectCountry': 'Russia',
        'issuingCountry': 'Russia',
        'creator': 'Russian State Loan Bank (Государственный Заёмный Банк)',
        'issueDate': '1822-03-01',
        'currency': 'Russian rubles / British pounds sterling',
        'language': 'Russian',
        'numberPages': '1',
        'period': '19th century',
        'notes': 'Russian 5% Perpetual Income bond, 960 rubles = £43 Sterling, Class 1, issued March 1, 1822 by Russian State Loan Bank. Bilateral ruble/sterling denomination targets foreign investors.'
    },
    # 1037: Texian Loan bond
    {
        'filename': 'goetzmann1037.jpg',
        'title': 'Republic of Texas – Texian Loan Bond No. 43, $320, 8% per annum, 1836',
        'description': 'Texian Loan bond No. 43, acknowledging receipt of $320 as a loan to the Government of Texas for five years, bearing interest at eight per cent per annum. Dated January 11, 1836. Signed by Texas Commissioners to the United States — including Branch T. Archer and William H. Wharton — who were authorized by the Texas Consultation (November 1835) to raise funds abroad during the Texas Revolution. The Texian Loan was authorized by the General Council of Texas in late 1835 to finance the independence struggle from Mexico.',
        'type': 'bond',
        'keywords': 'Texas, Texian, Republic of Texas, Texas Revolution, loan, 1836, bond, commissioners, Archer, Wharton, independence, Mexico',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Provisional Government of Texas',
        'issueDate': '1836-01-11',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '1',
        'period': '19th century',
        'notes': 'No. 43, $320, 5-year term, 8% interest. Signed by Texas Commissioners authorized November 1835 to seek funds for the Texas Revolution.'
    },
    # 1038: US Continental bill of exchange 1778
    {
        'filename': 'goetzmann1038.jpg',
        'title': 'United States Continental Bill of Exchange No. 85 – $30 / 150 Livres Tournois, 1778',
        'description': 'Continental Congress bill of exchange No. 85, dated November 25, 1778, for $30 dollars (equivalent to 150 Livres Tournois) payable at thirty days\' sight to Moses Frazier or order, representing interest due on money borrowed by the United States. Directed to the Commissioners of the United States of America in Paris. Countersigned by Nathaniel Appleton, Commissioner of the Continental Loan-Office for Massachusetts Bay. Signed by S. Hopkinson (Francis Hopkinson), Treasurer of Loans of the Continental Congress. Issued as First of a set of four bills (First, Second, Third, Fourth) as was standard practice to guard against loss at sea.',
        'type': 'bill of exchange',
        'keywords': 'Continental Congress, United States, bill of exchange, 1778, Revolutionary War, Massachusetts, Paris, Hopkinson, Appleton, livres tournois, American Revolution',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Continental Congress / Continental Loan Office',
        'issueDate': '1778-11-25',
        'currency': 'USD / French livres tournois',
        'language': 'English',
        'numberPages': '1',
        'period': '18th century',
        'notes': 'No. 85, $30 = 150 Livres Tournois. Interest on US war debt. Signed by Francis Hopkinson (Treasurer of Loans) and Nathaniel Appleton (Massachusetts Loan Commissioner). Payable in Paris.'
    },
]

filled = 0
for row in rows_data:
    fn = row['filename']
    mask = df['filename'] == fn
    if not mask.any():
        print(f"WARNING: {fn} not found")
        continue
    for col in COLS:
        if col in row:
            df.loc[mask, col] = row[col]
    filled += 1

print(f"Filled/updated {filled} rows.")
df.to_excel(fixed, index=False)
shutil.copy(fixed, src)
os.remove(fixed)
print(f"Saved -> {src}")
