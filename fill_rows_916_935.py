# -*- coding: utf-8 -*-
import zipfile, re, shutil, os
import pandas as pd

base = r'C:\Users\ks2479\Documents\GitHub\oov-museum'
src   = os.path.join(base, 'oov_data_new.xlsx')
repair_copy = os.path.join(base, 'oov_data_repair.xlsx')
fixed = os.path.join(base, 'oov_data_fixed.xlsx')

# Repair
print("Repairing...")
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
print(f"Loaded {len(df)} rows")

rows_data = [
    dict(
        filename='goetzmann0916.jpg', itemID='916', path='/images/goetzmann0916.jpg',
        title='Hotel Waldorf-Astoria Corporation, Common Share, SPECIMEN',
        description='SPECIMEN share certificate of the Hotel Waldorf-Astoria Corporation, incorporated under the Laws of the State of New York. Authorized capital stock: 300,000 shares without par value. Transferable in New York, N.Y. or Boston, Mass. Transfer agent: The First National Bank of Boston. Certificate No. 000, marked SPECIMEN in red.',
        type='share',
        keywords='USA, New York, hotel, Waldorf-Astoria, share, specimen, hospitality, no par value',
        subjectCountry='United States', issuingCountry='United States',
        creator='Hotel Waldorf-Astoria Corporation', issueDate='', currency='no par value',
        language='English', numberPages='2', period='1930-1960',
        notes='SPECIMEN certificate; reverse (goetzmann0917) is blank transfer form',
    ),
    dict(
        filename='goetzmann0917.jpg', itemID='917', path='/images/goetzmann0917.jpg',
        title='Hotel Waldorf-Astoria Corporation Share, Blank Transfer Form (Reverse)',
        description='Reverse page of the Hotel Waldorf-Astoria Corporation specimen share certificate. Contains the blank assignment/transfer form: For value received, hereby sell, assign and transfer unto ___ Shares of the Stock represented by the within Certificate, and do hereby irrevocably constitute and appoint ___ Attorney to transfer the said stock on the Books of the within named Corporation. THIS SPACE MUST NOT BE COVERED IN ANY WAY.',
        type='share',
        keywords='USA, New York, hotel, Waldorf-Astoria, share, transfer form, reverse',
        subjectCountry='United States', issuingCountry='United States',
        creator='Hotel Waldorf-Astoria Corporation', issueDate='', currency='no par value',
        language='English', numberPages='2', period='1930-1960',
        notes='Reverse/back page of goetzmann0916; blank transfer form',
    ),
    dict(
        filename='goetzmann0918.jpg', itemID='918', path='/images/goetzmann0918.jpg',
        title='United States Radium Corporation, Common Stock, 40 Shares, No. FN 11420, 1968',
        description='Common stock certificate No. FN 11420 of the United States Radium Corporation, incorporated under the Laws of the State of Delaware. Par value $1.00 per share, 40 shares. Issued to Thomas C. Gallanis and Helen K. Gallanis as joint tenants (JT TEN), Kenilworth, Illinois 60043. Dated May 6, 1968. Signed by Treasurer and President.',
        type='share',
        keywords='USA, Delaware, radium, mining, share, common stock, 1968, Kenilworth, Illinois',
        subjectCountry='United States', issuingCountry='United States',
        creator='United States Radium Corporation', issueDate='1968-05-06', currency='USD',
        language='English', numberPages='2', period='1960-1970',
        notes='Reverse (goetzmann0919) shows transfer endorsement to Dean Witter & Co., Aug. 1968',
    ),
    dict(
        filename='goetzmann0919.jpg', itemID='919', path='/images/goetzmann0919.jpg',
        title='United States Radium Corporation Share No. FN 11420, Transfer Endorsement to Dean Witter (Reverse)',
        description='Reverse page of United States Radium Corporation stock certificate No. FN 11420. Contains handwritten transfer instructions directing transfer to Dean Witter and Company, signed by Thomas C. Gallanis and Helen M. Gallanis. Signature guaranteed by Dean Witter and Co. Stamped August 12, 1968. Includes New York State Tax Commission exemption certificate under section 270(5).',
        type='share',
        keywords='USA, Delaware, radium, mining, share, transfer, Dean Witter, reverse, 1968, New York tax',
        subjectCountry='United States', issuingCountry='United States',
        creator='United States Radium Corporation', issueDate='1968-05-06', currency='USD',
        language='English', numberPages='2', period='1960-1970',
        notes='Reverse page of goetzmann0918; transfer to Dean Witter and Co., August 1968',
    ),
    dict(
        filename='goetzmann0920.jpg', itemID='920', path='/images/goetzmann0920.jpg',
        title='Nobino Seigai Partnership (Nobino Seigai Gomei Kaisha), Share Certificate, 50 Yen, Meiji 33 (1900)',
        description='Share certificate (kabushiki hassho) of the Nobino Seigai Partnership (Nobino Seigai Gomei Kaisha), Japan. Amount: 50 Yen. Share No. 44. Issued to Konishi Kichitaro (Konishi Kichitaro). Dated Meiji 33, 4th month (April 1900). Lists company president, vice-director and directors with red seal impressions. Orange revenue stamp affixed. Decorative border in Japanese style.',
        type='share',
        keywords='Japan, Meiji, silk, painting, partnership, share, 1900, yen, Nobino',
        subjectCountry='Japan', issuingCountry='Japan',
        creator='Nobino Seigai Gomei Kaisha (Nobino Seigai Partnership)',
        issueDate='1900', currency='Yen',
        language='Japanese', numberPages='2', period='1900-1910',
        notes='Reverse (goetzmann0921) contains conditions and blank dividend recording table',
    ),
    dict(
        filename='goetzmann0921.jpg', itemID='921', path='/images/goetzmann0921.jpg',
        title='Nobino Seigai Partnership Share, Conditions and Dividend Record Table (Reverse)',
        description='Reverse page of the Nobino Seigai Partnership share certificate. Contains handwritten Japanese conditions/terms governing the share, including rules for dividend payments, transfer conditions, and shareholder rights. Left portion has a blank table for recording annual dividend payments by year and month. Annotated in pencil at top right.',
        type='share',
        keywords='Japan, Meiji, silk, painting, partnership, share, reverse, conditions, dividend, table',
        subjectCountry='Japan', issuingCountry='Japan',
        creator='Nobino Seigai Gomei Kaisha (Nobino Seigai Partnership)',
        issueDate='1900', currency='Yen',
        language='Japanese', numberPages='2', period='1900-1910',
        notes='Reverse page of goetzmann0920; conditions and blank dividend recording table',
    ),
    dict(
        filename='goetzmann0922.jpg', itemID='922', path='/images/goetzmann0922.jpg',
        title='Shirai Dry Goods Store (Shirai Gofukuten), Kobe, Bond Certificate, 100 Yen, No. 183, Meiji 35 (1902)',
        description='Bond certificate (saiken sho) No. 183 of the Shirai Dry Goods Store (Shirai Gofukuten), Kobe, Japan. Amount: 100 Yen. One of 200 bonds totaling 20,000 Yen issued in January Meiji 35 (1902) for capital expansion of the store. Issued by store owner Shirai Harabei. Decorated with floral motifs (peonies) and company logo. Revenue stamp (2 sen) affixed.',
        type='bond',
        keywords='Japan, Kobe, dry goods, retail, bond, Meiji, 1902, yen, commercial, gofukuten, peony',
        subjectCountry='Japan', issuingCountry='Japan',
        creator='Shirai Gofukuten (Shirai Dry Goods Store, Kobe)',
        issueDate='1902', currency='Yen',
        language='Japanese', numberPages='2', period='1900-1910',
        notes='Reverse (goetzmann0923) contains bond terms and conditions',
    ),
    dict(
        filename='goetzmann0923.jpg', itemID='923', path='/images/goetzmann0923.jpg',
        title='Shirai Dry Goods Store Bond, Terms and Conditions (Reverse)',
        description='Reverse/conditions page of the Shirai Dry Goods Store (Shirai Gofukuten, Kobe) bond certificate. Handwritten Japanese terms: total bond issue 20,000 Yen in 200 certificates, maturity 10 years, interest paid January and July each year, lottery redemption, collateral provisions, and transfer conditions. Owner listed as Mizuki Saburo. Annotated "Kobe Shinai Dry G." in pencil.',
        type='bond',
        keywords='Japan, Kobe, dry goods, retail, bond, Meiji, 1902, terms, conditions, reverse, gofukuten',
        subjectCountry='Japan', issuingCountry='Japan',
        creator='Shirai Gofukuten (Shirai Dry Goods Store, Kobe)',
        issueDate='1902', currency='Yen',
        language='Japanese', numberPages='2', period='1900-1910',
        notes='Reverse/conditions page of goetzmann0922',
    ),
    dict(
        filename='goetzmann0924.jpg', itemID='924', path='/images/goetzmann0924.jpg',
        title='Kokubun Petroleum Association (Kokuban Sekiyu Kumiai), Share Certificate, 50 Yen, No. 738',
        description='Share certificate (kumiai shoken) No. 738 of the Kokubun Petroleum Association (Kokuban Sekiyu Kumiai), Japan. Amount: 50 Yen. Issued to Arita Kaku. Signed by multiple association directors (Kobayashi Uhachiro, Saito Ryutaro, Obara Shintaihei, Yamagishi Kitota, Shiga Sadashichi, Kurata Komajiro, Mizumi Kiseihachi) with red seal impressions. Green revenue stamp affixed.',
        type='share',
        keywords='Japan, petroleum, oil, cooperative, association, share, Meiji, yen, Kokubun',
        subjectCountry='Japan', issuingCountry='Japan',
        creator='Kokuban Sekiyu Kumiai (Kokubun Petroleum Association)',
        issueDate='', currency='Yen',
        language='Japanese', numberPages='2', period='1890-1910',
        notes='Reverse (goetzmann0925) contains installment payment records',
    ),
    dict(
        filename='goetzmann0925.jpg', itemID='925', path='/images/goetzmann0925.jpg',
        title='Kokubun Petroleum Association Share, Installment Payment Records (Reverse)',
        description='Reverse page of the Kokubun Petroleum Association share certificate. Contains a table recording installment payments in four tranches: 1st installment 100 Yen, 2nd through 4th installments 5 Yen each, with dates in Meiji years 32, 33, and 35. Signed by Maekawa Keijiro with seal. Annotated in pencil at top.',
        type='share',
        keywords='Japan, petroleum, oil, cooperative, association, share, reverse, installment, payments, Meiji',
        subjectCountry='Japan', issuingCountry='Japan',
        creator='Kokuban Sekiyu Kumiai (Kokubun Petroleum Association)',
        issueDate='', currency='Yen',
        language='Japanese', numberPages='2', period='1890-1910',
        notes='Reverse page of goetzmann0924; installment payment records in four tranches (Meiji 32-35)',
    ),
    dict(
        filename='goetzmann0926.jpg', itemID='926', path='/images/goetzmann0926.jpg',
        title='Connecticut Land Company, Certificate No. 151, Calvin Austin, Hartford 1795',
        description='Certificate No. 151 of the Connecticut Land Company, Hartford, Connecticut, September 5, 1795. Certifies that Calvin Austin of Sheffield, Hartford County, is entitled to the trust and benefit of Three Thousand Twelve Hundred Thousandths (3,000/1,200,000) of the Connecticut Western Reserve, as held by Trustees John Caldwell, Jonathan Brace, and John Morgan under a Deed of Trust dated 5 September 1795. Signed by all three trustees. The Connecticut Land Company purchased the Western Reserve (in present-day Ohio) from the State of Connecticut.',
        type='certificate',
        keywords='USA, Connecticut, Ohio, Western Reserve, land company, certificate, 1795, frontier, land grant',
        subjectCountry='United States', issuingCountry='United States',
        creator='Connecticut Land Company',
        issueDate='1795-09-05', currency='(land shares)',
        language='English', numberPages='2', period='1790-1800',
        notes='Multi-document set: certificate (0926-0927) and transfer assignment (0928-0929); Western Reserve land in present-day Ohio',
    ),
    dict(
        filename='goetzmann0927.jpg', itemID='927', path='/images/goetzmann0927.jpg',
        title='Connecticut Land Company Certificate No. 151, Registration Endorsement (Reverse)',
        description='Reverse/back of Connecticut Land Company Certificate No. 151. Handwritten registration endorsement: No. 151. Certificate from Trustees to Calvin Austin. Received Nov. 15. 1796 and entered in the Book of Records of the Connecticut Land Company for registering Certificates. Signed by Epn. Root, Clerk of the Directors.',
        type='certificate',
        keywords='USA, Connecticut, Ohio, Western Reserve, land company, certificate, reverse, registration, 1796',
        subjectCountry='United States', issuingCountry='United States',
        creator='Connecticut Land Company',
        issueDate='1795-09-05', currency='(land shares)',
        language='English', numberPages='2', period='1790-1800',
        notes='Reverse page of goetzmann0926; registration note dated November 15, 1796',
    ),
    dict(
        filename='goetzmann0928.jpg', itemID='928', path='/images/goetzmann0928.jpg',
        title='Connecticut Land Company, Share Transfer/Assignment by Calvin Austin, December 1796',
        description='Transfer and assignment document for Connecticut Land Company shares. Calvin Austin of Sheffield, Hartford County, Connecticut, assigns his Three Thousand Twelve Hundred Thousandths of the Connecticut Western Reserve for a Consideration of Eight Thousand Dollars. Dated December 20, 1796. Signed by Calvin Austin with witnesses. Notarized Hartford County, December 20, 1796, before justice of the peace.',
        type='certificate',
        keywords='USA, Connecticut, Ohio, Western Reserve, land company, transfer, assignment, 1796, Calvin Austin',
        subjectCountry='United States', issuingCountry='United States',
        creator='Calvin Austin',
        issueDate='1796-12-20', currency='USD',
        language='English', numberPages='2', period='1790-1800',
        notes='Transfer/assignment document for Connecticut Land Company Certificate No. 151; reverse (goetzmann0929) contains registration endorsement',
    ),
    dict(
        filename='goetzmann0929.jpg', itemID='929', path='/images/goetzmann0929.jpg',
        title='Connecticut Land Company Share Transfer, Registration Endorsement (Reverse)',
        description='Reverse/back of the Connecticut Land Company share transfer/assignment document. Handwritten registration endorsement: L. Garnsey. Rec\'d Jan. 2d 1797 and entered in the Book of Records of the Connecticut Land Company for registering Transfers. Signed by Epn. Root, Clerk of the Directors.',
        type='certificate',
        keywords='USA, Connecticut, Ohio, Western Reserve, land company, transfer, reverse, registration, 1797',
        subjectCountry='United States', issuingCountry='United States',
        creator='Connecticut Land Company',
        issueDate='1796-12-20', currency='(land shares)',
        language='English', numberPages='2', period='1790-1800',
        notes='Reverse page of goetzmann0928; registered January 2, 1797',
    ),
    dict(
        filename='goetzmann0930.jpg', itemID='930', path='/images/goetzmann0930.jpg',
        title='Colonial Connecticut Land Indenture, 12th Year of George II (1739)',
        description='Colonial American land indenture from Connecticut, dated in the Twelfth Year of His Majesty\'s Reign, Anno Domini 1739 (reign of King George II). Printed form with handwritten details. Partially illegible due to age and water damage. Concerns the conveyance of land with all profits, improvements and appurtenances. Signed, Sealed and Delivered. Mentions consideration paid and covenant to hold.',
        type='indenture',
        keywords='USA, Connecticut, colonial, indenture, land deed, 1739, George II, real estate, conveyance',
        subjectCountry='United States', issuingCountry='United States',
        creator='(private parties)',
        issueDate='1739', currency='(land/property)',
        language='English', numberPages='1', period='1730-1750',
        notes='Colonial American land deed; partially illegible due to age and water damage',
    ),
    dict(
        filename='goetzmann0931.jpg', itemID='931', path='/images/goetzmann0931.jpg',
        title='Share Receipt (Recepis) for 1/1063 of Garphytte Iron and Alum Works and Beata Christina Alum Works, Sweden, Amsterdam 1776',
        description='Dutch-language share receipt (Recepis) No. 27, certifying ownership of 1/1063 share in the Iron Manufacturer and Alum Works Garphytte (Yser-Manufactuur en Aluyn-Werken Garphytte) and in the Alum Work Beata Christina (Aluyn-Werk Beata Christina), both in Sweden. Received in exchange for a share from the outstanding negotiation on these works, including unpaid interest coupons. Issued Amsterdam, 1 April 1776. Signed by directors G.L. Caaypranger and Bran Heeschuyssensfe. Registered by Notary Paulus Runtum.',
        type='share',
        keywords='Netherlands, Sweden, Amsterdam, iron, alum, Garphytte, Beata Christina, share receipt, 1776, Dutch, Swedish industry, Recepis',
        subjectCountry='Sweden', issuingCountry='Netherlands',
        creator='Garphytte Iron and Alum Works / Beata Christina Alum Works',
        issueDate='1776-04-01', currency='Gulden',
        language='Dutch', numberPages='2', period='1770-1790',
        notes='Recepis No. 27; reverse (goetzmann0932) contains annual dividend/interest receipts',
    ),
    dict(
        filename='goetzmann0932.jpg', itemID='932', path='/images/goetzmann0932.jpg',
        title='Garphytte Iron and Alum Works Share Receipt No. 27, Annual Dividend Receipts (Reverse)',
        description='Reverse page of the Garphytte/Beata Christina share receipt No. 27. Contains multiple annual interest/dividend receipts (Ontvangsten) for Recepis No. 27, each signed by the recipient, covering successive years from the 1770s onward. References the Alum and Iron Works of Garphytte and Beata Christina in Sweden.',
        type='share',
        keywords='Netherlands, Sweden, Amsterdam, iron, alum, Garphytte, dividend, interest, receipts, reverse, coupon',
        subjectCountry='Sweden', issuingCountry='Netherlands',
        creator='Garphytte Iron and Alum Works / Beata Christina Alum Works',
        issueDate='1776-04-01', currency='Gulden',
        language='Dutch', numberPages='2', period='1770-1790',
        notes='Reverse page of goetzmann0931; annual dividend/interest receipts signed by holder',
    ),
    dict(
        filename='goetzmann0933.jpg', itemID='933', path='/images/goetzmann0933.jpg',
        title='Marine Insurance Policy, "Au Nom de Dieu Amen", 20,000 Livres, Antwerp',
        description='Marine insurance policy (police d\'assurance maritime) beginning with the traditional formula AU NOM DE DIEU AMEN (In the Name of God, Amen). Written in French. Insures Monsieur James Dorner for 20,000 livres (Antwerp currency) for a sea voyage. Specifies coverage for perils of the sea including storms, fire, and pirates. Includes guarantee of indemnification. Signed by the underwriter. 18th century, Antwerp.',
        type='insurance policy',
        keywords='Antwerp, Belgium, marine insurance, policy, French, livres, sea voyage, cargo, 18th century, Au Nom de Dieu',
        subjectCountry='Belgium', issuingCountry='Belgium',
        creator='(private underwriter, Antwerp)',
        issueDate='', currency='Livres (Antwerp)',
        language='French', numberPages='1', period='1700-1800',
        notes='Marine insurance policy; traditional Au Nom de Dieu Amen opening; amount 20,000 livres; 18th century',
    ),
    dict(
        filename='goetzmann0934.jpg', itemID='934', path='/images/goetzmann0934.jpg',
        title='Unified Debt of Egypt (Dette d\'Egypte Unifiee), Bearer Bond, 2,500 Francs / 400 Pounds Sterling, No. 1,036,101',
        description='Bearer bond (Obligation au Porteur) of the Unified Debt of Egypt (Dette d\'Egypte Unifiee), bilingual French/English. Denomination: 2,500 Francs / 400 Pounds Sterling. Bond No. 1,036,101. Total capital stock: 1,470,500,000 Francs / 29,500,000 Pounds Sterling. Amortizable. Issued under decrees by His Highness the Khedive. Coupon sheet attached. The Unified Debt of Egypt was created in 1876 to consolidate Egyptian government debt under European (Caisse de la Dette Publique) financial control.',
        type='bond',
        keywords='Egypt, bond, bearer, unified debt, Dette Unifiee, Khedive, French, English, pounds sterling, francs, 19th century, Caisse',
        subjectCountry='Egypt', issuingCountry='Egypt',
        creator='Egyptian Government (Caisse de la Dette Publique)',
        issueDate='1876', currency='Francs; Pounds Sterling',
        language='French; English', numberPages='2', period='1870-1900',
        notes='Unified Debt of Egypt established 1876; coupon sheet attached; companion page (goetzmann0935) shows smaller denomination bonds and amortization table',
    ),
    dict(
        filename='goetzmann0935.jpg', itemID='935', path='/images/goetzmann0935.jpg',
        title='Unified Debt of Egypt, Smaller Denomination Bonds (100 Livres Turques / 500 Francs) and Amortization Table',
        description='Companion page to the Unified Debt of Egypt main bond (goetzmann0934). Shows two smaller denomination bonds from the same series: Bond to Bearer of 100 Livres Turques and Obligation to Bearer of 500 Francs, both numbered 1,036,101. Also includes amortization schedule table for the Unified Debt of Egypt.',
        type='bond',
        keywords='Egypt, bond, bearer, unified debt, amortization, livres turques, francs, Khedive, smaller denomination',
        subjectCountry='Egypt', issuingCountry='Egypt',
        creator='Egyptian Government (Caisse de la Dette Publique)',
        issueDate='1876', currency='Livres Turques; Francs',
        language='French; English', numberPages='2', period='1870-1900',
        notes='Companion page of goetzmann0934; smaller denomination bonds (100 Livres Turques / 500 Francs) and amortization table',
    ),
]

COLS = ['itemID', 'filename', 'path', 'title', 'description', 'type', 'keywords',
        'subjectCountry', 'issuingCountry', 'creator', 'issueDate', 'currency',
        'language', 'numberPages', 'period', 'notes']

filled = 0
for rd in rows_data:
    fn = rd['filename']
    mask = df['filename'] == fn
    matches = df[mask]
    if len(matches) == 0:
        print(f"WARNING: no row for '{fn}'")
        continue
    idx = matches.index[0]
    for col in COLS:
        df.at[idx, col] = rd.get(col, '')
    print(f"[{idx:>4}] itemID={rd['itemID']:>4}  {fn}")
    filled += 1

print(f"\nFilled {filled} rows.")
df.to_excel(fixed, index=False)
shutil.copy(fixed, src)
os.remove(repair_copy)
print(f"Saved -> {src}")
