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
    # --- 1004 : Imperial Russian Gov't Consolidated 4% Railroad Bonds, 125 gold rubles, No. 236302, page 1/2 ---
    {
        'filename': 'goetzmann1004.jpg',
        'title': 'Imperial Russian Government Consolidated 4% Railroad Bonds, 1st Series A – 125 Gold Rubles, No. 236302',
        'description': 'Russian Imperial Government Consolidated Four Percent Railroad Bond (Консолидированные Российские Четырёхпроцентные Железнодорожные Облигации 1-й Серии), 1st Series A, for 125 gold rubles, No. 236302. Printed in dark brown with the imperial Russian double-headed eagle. Text in Russian. Page 1 of 2.',
        'type': 'bond',
        'keywords': 'bond, government bond, Russia, Imperial Russia, railroad, railway, gold, rubles, 1889, consolidated',
        'subjectCountry': 'Russia',
        'issuingCountry': 'Russia',
        'creator': 'Imperial Russian Government',
        'issueDate': 'ca. 1889',
        'currency': 'RUB',
        'language': 'Russian',
        'numberPages': '2',
        'period': '1880s',
    },
    # --- 1005 : Imperial Russian Railroad Bond conditions (French/German/English), page 2/2 ---
    {
        'filename': 'goetzmann1005.jpg',
        'title': 'Imperial Russian Government Consolidated 4% Railroad Bonds, 1st Series – Conditions and Certificate (French/German/English)',
        'description': 'Multilingual conditions and bearer certificate for Imperial Russian Government Consolidated 4% Railroad Bond, 1st Series A, No. 236302, 125 gold rubles. Denomination equivalences: 500 Francs = 401 Reichsmarks = 19 Livres Sterling = 6 pcs 22 Florins = 84 Dollars. Payable in St. Petersburg, Frankfurt, Paris, London, Amsterdam, Berlin, and New York. Text in French (Gouvernement Impérial de Russie), German (Kaiserlich Russische Regierung), and English (Imperial Government of Russia). Page 2 of 2.',
        'type': 'bond',
        'keywords': 'bond, government bond, Russia, Imperial Russia, railroad, railway, gold, multilingual, French, German, English, 1889',
        'subjectCountry': 'Russia',
        'issuingCountry': 'Russia',
        'creator': 'Imperial Russian Government',
        'issueDate': 'ca. 1889',
        'currency': 'RUB',
        'language': 'French; German; English',
        'numberPages': '2',
        'period': '1880s',
    },

    # --- 1006 : Shanghai Pu Dong Qiang Sheng Taxi Co. 10 shares, 1992, page 1/2 ---
    {
        'filename': 'goetzmann1006.jpg',
        'title': 'Shanghai Pu Dong Qiang Sheng Taxi Co., Ltd. (上海浦东强生出租汽车股份有限公司) – Stock Certificate for 10 Shares at 100 Yuan, No. DM II 0068056 (1992)',
        'description': 'Stock certificate (股票) for 10 shares (本股票拾股) at 100 yuan each (计人民币壹佰元整), issued by Shanghai Pu Dong Qiang Sheng Taxi Co., Ltd. (上海浦东强生出租汽车股份有限公司), Shanghai. Authorized by the People\'s Bank of China Shanghai Branch (中国人民银行上海市分行(92)人金股字第(1)号). Certificate No. DM II 0068056. Issued February 12, 1992 (一九九二年二月十二日). Printed in green with bus/taxi vignette. Page 1 of 2.',
        'type': 'share',
        'keywords': 'share, stock, taxi, transport, China, Shanghai, 1992, yuan, Pudong',
        'subjectCountry': 'China',
        'issuingCountry': 'China',
        'creator': 'Shanghai Pu Dong Qiang Sheng Taxi Co., Ltd.',
        'issueDate': '1992-02-12',
        'currency': 'CNY',
        'language': 'Chinese',
        'numberPages': '2',
        'period': '1990s',
    },
    # --- 1007 : Shanghai Taxi share reverse (conditions + transfer record), page 2/2 ---
    {
        'filename': 'goetzmann1007.jpg',
        'title': 'Shanghai Pu Dong Qiang Sheng Taxi Co. Stock Certificate – Explanatory Notes and Share Transfer Record (Reverse)',
        'description': 'Reverse of Shanghai Pu Dong Qiang Sheng Taxi Co., Ltd. stock certificate (No. DM II 0068056), showing explanatory notice (说明) in Chinese — including restrictions on pledging or mortgaging shares — and blank share transfer record table (股份转让记录). Page 2 of 2.',
        'type': 'share',
        'keywords': 'share, stock, taxi, transport, China, Shanghai, 1992, yuan, Pudong, transfer record',
        'subjectCountry': 'China',
        'issuingCountry': 'China',
        'creator': 'Shanghai Pu Dong Qiang Sheng Taxi Co., Ltd.',
        'issueDate': '1992-02-12',
        'currency': 'CNY',
        'language': 'Chinese',
        'numberPages': '2',
        'period': '1990s',
    },

    # --- 1008 : Belgian Congo company share – Extraits des Statuts, page 1/2 ---
    {
        'filename': 'goetzmann1008.jpg',
        'title': 'Belgian Congo Company Share – Extraits des Statuts (Statutes Extract)',
        'description': 'Extracts of the statutes (Extraits des Statuts) of an anonymous Belgian Congo company, printed in French. The company has its registered office in the Congo Belge with branches in Brussels, France, and the international union. Capital represented by 1,500 shares of 50 francs each. Louis Lambotin named as the company\'s first representative in the Congo. Page 1 of 2.',
        'type': 'share',
        'keywords': 'share, Belgium, Congo, Belgian Congo, statutes, French, colonial, Africa',
        'subjectCountry': 'Belgium',
        'issuingCountry': 'Belgium',
        'creator': 'Unknown Belgian Congo company',
        'issueDate': 'ca. 1900',
        'currency': 'BEF',
        'language': 'French',
        'numberPages': '2',
        'period': '1900s',
    },
    # --- 1009 : Belgian Congo company share – numbered dividend coupon sheet 1-30, page 2/2 ---
    {
        'filename': 'goetzmann1009.jpg',
        'title': 'Belgian Congo Company Share – Numbered Dividend Coupon Sheet (Nos. 1–30)',
        'description': 'Dividend coupon sheet for a Belgian Congo anonymous company share, showing 30 numbered coupons (nos. 1–30) in a decorative acanthus/vine oval motif, printed in black. Coupons are blank (no amounts filled in). Page 2 of 2.',
        'type': 'share',
        'keywords': 'share, Belgium, Congo, Belgian Congo, coupon sheet, dividend, colonial, Africa',
        'subjectCountry': 'Belgium',
        'issuingCountry': 'Belgium',
        'creator': 'Unknown Belgian Congo company',
        'issueDate': 'ca. 1900',
        'currency': 'BEF',
        'language': 'French',
        'numberPages': '2',
        'period': '1900s',
    },

    # --- 1010 : Lippmann Rosenthal & Co. receipt for Grand Russian Railway bond talons, 1924, page 1/2 ---
    {
        'filename': 'goetzmann1010.jpg',
        'title': 'Lippmann, Rosenthal & Co. Amsterdam – Receipt for Grand Russian Railway Company 3% Bond Talons, No. 213779 (1924)',
        'description': 'Receipt from Amsterdam banking house Lippmann, Rosenthal & Co. acknowledging receipt of talons (coupon renewal stubs) for Grand Russian Railway Company (Groote Russische Spoorweg Maatschappij) 3% bonds, 3rd emission 1881, No. 213779, from Heer en Burdet, Druyvestejn. Talon values: Rb. 125 and Rb. 625. Dated Amsterdam, 12 June 1924. Stamped "COUPON 1/14 JUNI 1917 BETAALD 8 cps. L.R. & Co." Page 1 of 2.',
        'type': 'receipt',
        'keywords': 'receipt, bond, talon, Russia, Grand Russian Railway, Amsterdam, Lippmann Rosenthal, Dutch banking, 1924',
        'subjectCountry': 'Netherlands',
        'issuingCountry': 'Netherlands',
        'creator': 'Lippmann, Rosenthal & Co.',
        'issueDate': '1924-06-12',
        'currency': 'NLG',
        'language': 'Dutch',
        'numberPages': '2',
        'period': '1920s',
    },
    # --- 1011 : Lippmann Rosenthal receipt back, page 2/2 ---
    {
        'filename': 'goetzmann1011.jpg',
        'title': 'Lippmann, Rosenthal & Co. Amsterdam – Receipt for Russian Railway Bond Talons (Reverse)',
        'description': 'Reverse of Lippmann, Rosenthal & Co. receipt for Grand Russian Railway Company 3% bond talons (No. 213779). Stamped "OORSPRONKELIJKE KWITANTIE AFGETEEKEND. L.R. & Co." and "AAN DEN INHOUD VOLDAAN. AMSTERDAM, 19[--]" (Original receipt signed off; satisfied as to the contents). Page 2 of 2.',
        'type': 'receipt',
        'keywords': 'receipt, bond, talon, Russia, Grand Russian Railway, Amsterdam, Lippmann Rosenthal, Dutch banking',
        'subjectCountry': 'Netherlands',
        'issuingCountry': 'Netherlands',
        'creator': 'Lippmann, Rosenthal & Co.',
        'issueDate': '1924-06-12',
        'currency': 'NLG',
        'language': 'Dutch',
        'numberPages': '2',
        'period': '1920s',
    },

    # --- 1012 : 170 Broadway Building $500 bond (Manufacturers Trust version), page 1/3 ---
    {
        'filename': 'goetzmann1012.jpg',
        'title': '170 Broadway Building (Corner Broadway-Maiden Lane, Inc.) First Mortgage Leasehold 4½% Sinking Fund Gold Bond $500, No. B25 – Manufacturers Trust Version',
        'description': 'First Mortgage Leasehold 4½% Sinking Fund Gold Bond for $500, No. B25, issued by Corner Broadway-Maiden Lane, Inc. (170 Broadway Building), secured by leasehold estates at the northeast corner of Broadway and Maiden Lane, Borough of Manhattan, New York. Trustee: Manufacturers Trust Company (cf. earlier version with Continental Bank & Trust). Printed in green with eagle vignette. Signed by Secretary and President. Page 1 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, Broadway, Maiden Lane, New York, gold bond, sinking fund, leasehold, Manufacturers Trust',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Corner Broadway-Maiden Lane, Inc.',
        'issueDate': 'ca. 1928',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },
    # --- 1013 : 170 Broadway Building bond reverse, page 2/3 ---
    {
        'filename': 'goetzmann1013.jpg',
        'title': '170 Broadway Building First Mortgage Leasehold 4½% Sinking Fund Gold Bond $500 No. B25 – Reverse/Stub (Manufacturers Trust)',
        'description': 'Reverse side of First Mortgage Leasehold 4½% Sinking Fund Gold Bond ($500, No. B25) issued by Corner Broadway-Maiden Lane, Inc. (170 Broadway Building), New York. Bond spine shows: due May 1, 1940; interest payable May 1 and November 1; principal and interest payable at Manufacturers Trust Company, New York. Page 2 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, Broadway, Maiden Lane, New York, gold bond, sinking fund, leasehold, Manufacturers Trust',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Corner Broadway-Maiden Lane, Inc.',
        'issueDate': 'ca. 1928',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },
    # --- 1014 : 170 Broadway Building coupon sheet, page 3/3 ---
    {
        'filename': 'goetzmann1014.jpg',
        'title': '170 Broadway Building First Mortgage Leasehold 4½% Sinking Fund Gold Bond No. B25 – Coupon Sheet and Conditions',
        'description': 'Coupon sheet and conditions for First Mortgage Leasehold 4½% Sinking Fund Gold Bond ($500, No. B25) of Corner Broadway-Maiden Lane, Inc. (170 Broadway Building), New York. Semi-annual coupons dated May and November from ca. 1934 to May 1, 1940. Signed by Charles Cashbaum (President). Page 3 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, Broadway, Maiden Lane, New York, gold bond, coupon sheet, sinking fund',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Corner Broadway-Maiden Lane, Inc.',
        'issueDate': 'ca. 1928',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },

    # --- 1015 : Tyler Building (Nineteen John Street Corp.) $1,000 6% First Mortgage Gold Loan No. M1259, page 1/3 ---
    {
        'filename': 'goetzmann1015.jpg',
        'title': 'Tyler Building (Nineteen John Street Corporation) First Mortgage 6% Sinking Fund Gold Loan $1,000, No. M1259',
        'description': 'Certificate representing a share or part ($1,000) in the First Mortgage Six Per Cent Sinking Fund Gold Loan of Nineteen John Street Corporation (Tyler Building), secured by premises at 17–23 John Street in the Borough of Manhattan, New York. No. M1259. Trustee: The New York Trust Company. Due October 1, 1953. Printed in orange with decorative border. Page 1 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, John Street, New York, gold loan, sinking fund, Tyler Building, participation certificate',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Nineteen John Street Corporation',
        'issueDate': 'ca. 1927',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },
    # --- 1016 : Tyler Building bond reverse/stub, page 2/3 ---
    {
        'filename': 'goetzmann1016.jpg',
        'title': 'Tyler Building First Mortgage 6% Sinking Fund Gold Loan $1,000 No. M1259 – Reverse/Stub',
        'description': 'Reverse side of Nineteen John Street Corporation (Tyler Building) First Mortgage 6% Sinking Fund Gold Loan certificate ($1,000, No. M1259). Bond spine shows: principal due October 1, 1953; interest payable April 1 and October 1; principal and interest payable at The New York Trust Company, Borough of Manhattan, City of New York. Trustee\'s certificate and registration table. Page 2 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, John Street, New York, gold loan, sinking fund, Tyler Building',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Nineteen John Street Corporation',
        'issueDate': 'ca. 1927',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },
    # --- 1017 : Tyler Building coupon sheet, page 3/3 ---
    {
        'filename': 'goetzmann1017.jpg',
        'title': 'Tyler Building First Mortgage 6% Sinking Fund Gold Loan No. M1259 – Coupon Sheet ($30)',
        'description': 'Coupon sheet for Nineteen John Street Corporation (Tyler Building) First Mortgage 6% Sinking Fund Gold Loan ($1,000, No. M1259). Semi-annual coupons of $30 each (= 6% on $1,000 / 2), dated April 1 and October 1 from ca. 1934 to October 1, 1953. Page 3 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, John Street, New York, gold loan, coupon sheet, Tyler Building',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Nineteen John Street Corporation',
        'issueDate': 'ca. 1927',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },

    # --- 1018 : Maplewood Suburban Home Company $500 6% Mortgage Sinking Fund Bond, page 1/3 ---
    {
        'filename': 'goetzmann1018.jpg',
        'title': 'Maplewood Suburban Home Company (Incorporated 1892) – 6% Mortgage Sinking Fund Bond $500',
        'description': 'Six Percent Mortgage Sinking Fund Bond for $500, issued by Maplewood Suburban Home Company, incorporated 1892. Capital stock $2,000,000. Printed in green with residential estate vignette and decorative border. Signed by President and Treasurer. Due August 1, 1900. Trustee: The American Loan Trust Company. Page 1 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Maplewood, New Jersey, suburban, sinking fund, 1892, residential',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Maplewood Suburban Home Company',
        'issueDate': 'ca. 1892',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1890s',
    },
    # --- 1019 : Maplewood Suburban Home Company bond reverse/stub, page 2/3 ---
    {
        'filename': 'goetzmann1019.jpg',
        'title': 'Maplewood Suburban Home Company 6% Mortgage Sinking Fund Bond $500 No. 266 – Reverse/Stub',
        'description': 'Reverse and spine of Maplewood Suburban Home Company Six Percent Mortgage Sinking Fund Bond ($500, No. 266). Bond spine: principal due August 1, 1900; interest payable quarterly; principal and interest payable at The American Loan Trust Company. Trustee\'s certificate notes bonds numbered 171 to 750. Conditions printed on inside pages. Registration table. Page 2 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Maplewood, New Jersey, suburban, sinking fund, 1892, American Loan Trust',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Maplewood Suburban Home Company',
        'issueDate': 'ca. 1892',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1890s',
    },
    # --- 1020 : Maplewood Suburban Home Company coupon sheet, page 3/3 ---
    {
        'filename': 'goetzmann1020.jpg',
        'title': 'Maplewood Suburban Home Company 6% Mortgage Sinking Fund Bond No. 266 – Quarterly Coupon Sheet ($7.50)',
        'description': 'Quarterly coupon sheet for Maplewood Suburban Home Company Six Percent Mortgage Sinking Fund Bond ($500, No. 266). Quarterly coupons of $7.50 each (= 6% on $500 / 4 quarters), dated from February 1893 through August 1900. Many coupons bear red payment stamps. Page 3 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Maplewood, New Jersey, suburban, coupon sheet, 1892, quarterly',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Maplewood Suburban Home Company',
        'issueDate': 'ca. 1892',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1890s',
    },

    # --- 1021 : VOC Middelburg Chamber obligations/receipts, 1622-1623 ---
    {
        'filename': 'goetzmann1021.jpg',
        'title': 'Dutch East India Company (VOC) – Middelburg Chamber Obligation Receipts, 1622–1623',
        'description': 'Two early VOC (Vereenigde Oost-Indische Compagnie) financial documents from the Zeeland/Middelburg Chamber, photographed together. Top: a printed payment order form from the Ontfangers der Oost-Indische Compagnie Middelburg, with handwritten receipt acknowledging satisfaction of an obligation, signed by Dominicus van Hoontshoerle, dated Amsterdam/Middelburg, 9 November/December 1623. Bottom: a handwritten bond/obligation (obligatie) issued by the Reecken-meesters of the VOC Middelburg Chamber, for a sum of £1,333:6:8 Flemish at 6% per year, repayable after 44 months, signed by Jocvry[?] and Cornelis Jauckly, Middelburg ca. October 26, 1622.',
        'type': 'bond',
        'keywords': 'bond, obligation, VOC, Dutch East India Company, Middelburg, Zeeland, 1622, 1623, early modern, Dutch Republic',
        'subjectCountry': 'Netherlands',
        'issuingCountry': 'Netherlands',
        'creator': 'VOC (Vereenigde Oost-Indische Compagnie), Kamer Middelburg',
        'issueDate': '1622',
        'currency': 'Guilder',
        'language': 'Dutch',
        'numberPages': '1',
        'period': '1620s',
    },

    # --- 1022 : Lekdijk Bovendams allonge rentebrief ƒ1,000 2.5%, 1944 ---
    {
        'filename': 'goetzmann1022.jpg',
        'title': 'Hoogheemraadschap van den Lekdijk Bovendams – Allonge bij Rentebrief Folio 25 No. 74, ƒ1,000 at 2.5%, Utrecht, 1944',
        'description': 'Allonge (coupon renewal extension) belonging to rentebrief (perpetual annuity bond) Folio 25, No. 74, for one thousand guilders (ƒ1,000), issued by the Hoogheemraadschap van den Lekdijk Bovendams, Utrecht, Netherlands. Annual interest of ƒ25 (2.5%), payable on 12 January each year. Issued 8 January 1944, signed by Dijkgraaf and Secretaris. Two attached columns recording coupon payments (letter codes and dates) from 1944 through 2003.',
        'type': 'bond',
        'keywords': 'bond, rentebrief, allonge, Lekdijk Bovendams, Netherlands, Utrecht, Dutch water board, 1944, guilder, perpetual annuity',
        'subjectCountry': 'Netherlands',
        'issuingCountry': 'Netherlands',
        'creator': 'Hoogheemraadschap van den Lekdijk Bovendams',
        'issueDate': '1944-01-08',
        'currency': 'NLG',
        'language': 'Dutch',
        'numberPages': '1',
        'period': '1940s',
    },

    # --- 1023 : 18th-century Dutch manuscript bond/obligation ---
    {
        'filename': 'goetzmann1023.jpg',
        'title': '18th-Century Dutch Manuscript Bond/Obligation with Transfer Endorsements',
        'description': 'Heavily worn manuscript bond or obligation (obligatie) in early modern Dutch, written on thick paper or parchment. Dense text in two main columns with marginal annotations and multiple transfer endorsement signatures. Dates visible at bottom include ca. 1720 and 1740, suggesting the document circulated over several decades. Likely a Dutch government or municipal bond with serial transfer/assignment endorsements.',
        'type': 'bond',
        'keywords': 'bond, obligation, Netherlands, Dutch, manuscript, 18th century, early modern, handwritten, transfer endorsements',
        'subjectCountry': 'Netherlands',
        'issuingCountry': 'Netherlands',
        'creator': 'Unknown (Dutch)',
        'issueDate': 'ca. 1700–1720',
        'currency': 'Guilder',
        'language': 'Dutch',
        'numberPages': '1',
        'period': '1700s',
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

print(f"Filled {filled} rows.")
df.to_excel(fixed, index=False)
shutil.copy(fixed, src)
os.remove(fixed)
print(f"Saved -> {src}")
