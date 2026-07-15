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

COLS = ['itemID', 'filename', 'path', 'title', 'description', 'type', 'keywords',
        'subjectCountry', 'issuingCountry', 'creator', 'issueDate', 'currency',
        'language', 'numberPages', 'period', 'notes']

rows_data = [
    # --- 0956 : Forty Wall Street Corp bond front (SPECIMEN) ---
    {
        'filename': 'goetzmann0956.jpg',
        'title': 'Forty Wall Street Corporation (The Manhattan Company Building) First Mortgage 6% Sinking Fund Gold Bond $500, Series of 1958 – Specimen',
        'description': 'Specimen $500 First Mortgage Fee and Leasehold 6% Sinking Fund Gold Bond, Series of 1958, due November 1, 1958, issued by Forty Wall Street Corporation (The Manhattan Company Building), New York. Bond no. 00000, printed in green with allegorical vignettes and decorative border. Stamped SPECIMEN in red. Page 1 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, skyscraper, gold bond, sinking fund, specimen, New York, Wall Street',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Forty Wall Street Corporation',
        'issueDate': 'ca. 1929',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },
    # --- 0957 : Forty Wall Street Corp bond reverse/stub ---
    {
        'filename': 'goetzmann0957.jpg',
        'title': 'Forty Wall Street Corporation First Mortgage 6% Sinking Fund Gold Bond $500 – Reverse/Stub with Coupon Strip (Specimen)',
        'description': 'Reverse side of specimen $500 First Mortgage 6% Sinking Fund Gold Bond of Forty Wall Street Corporation (The Manhattan Company Building), New York, showing bond stub, assignment form, and attached coupon strip. No. 00000. Page 2 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, skyscraper, gold bond, sinking fund, specimen, New York, Wall Street, coupon',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Forty Wall Street Corporation',
        'issueDate': 'ca. 1929',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },
    # --- 0958 : Forty Wall Street Corp coupon sheet ---
    {
        'filename': 'goetzmann0958.jpg',
        'title': 'Forty Wall Street Corporation First Mortgage 6% Sinking Fund Gold Bond – Coupon Sheet (Specimen)',
        'description': 'Coupon sheet for specimen $500 First Mortgage 6% Sinking Fund Gold Bond of Forty Wall Street Corporation (The Manhattan Company Building), New York. Semi-annual coupons dated 1936 to 1958, each marked SPECIMEN 00000. Page 3 of 3.',
        'type': 'bond',
        'keywords': 'bond, coupon sheet, mortgage, real estate, Manhattan, skyscraper, gold bond, sinking fund, specimen, New York, Wall Street',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Forty Wall Street Corporation',
        'issueDate': 'ca. 1929',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },
    # --- 0959 : Chanin Building bond front ---
    {
        'filename': 'goetzmann0959.jpg',
        'title': 'Chanin Building (Lexington A. 42nd St. Corporation) First Mortgage Leasehold 5% Bond $100, No. MC530',
        'description': 'First Mortgage Leasehold 5% Bond for $100, issued by Lexington A. 42nd St. Corporation (Chanin Building), 46 W. Lexington Avenue between 41st and 42nd Streets, New York City. Bond no. MC530, due September 1, 1955. Printed in blue with image of the skyscraper and decorative border. Signed and sealed. Page 1 of 2.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, skyscraper, Chanin Building, Lexington Avenue, New York, leasehold',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Lexington A. 42nd St. Corporation',
        'issueDate': 'ca. 1929',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '2',
        'period': '1920s',
    },
    # --- 0960 : Chanin Building bond reverse ---
    {
        'filename': 'goetzmann0960.jpg',
        'title': 'Chanin Building First Mortgage Leasehold 5% Bond $100 No. MC530 – Reverse/Stub',
        'description': 'Reverse side of First Mortgage Leasehold 5% Bond ($100, No. MC530) issued by Lexington A. 42nd St. Corporation (Chanin Building), New York, showing voting trust certificate, bond spine (due September 1, 1955), and stub. Principal payable at Continental Bank & Trust Company of New York. Page 2 of 2.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, Chanin Building, Lexington Avenue, New York, leasehold, voting trust',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Lexington A. 42nd St. Corporation',
        'issueDate': 'ca. 1929',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '2',
        'period': '1920s',
    },
    # --- 0961 : Times Square 46th Street Building bond front (SPECIMEN) ---
    {
        'filename': 'goetzmann0961.jpg',
        'title': 'Times Square 46th Street Building (1556 Broadway Corporation) First Mortgage Gold Bond $1,000, No. N840 – Specimen',
        'description': 'Specimen $1,000 First Mortgage Gold Bond issued by 1556 Broadway Corporation (Times Square 46th Street Building), New York. Bond no. N840, due April 1, 1953. Printed in green with decorative border. Marked SPECIMEN in red. Trustee: Hanover Trust Company. Page 1 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Times Square, Broadway, skyscraper, New York, gold bond, specimen, 1556 Broadway',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': '1556 Broadway Corporation',
        'issueDate': 'ca. 1928',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },
    # --- 0962 : Times Square bond reverse ---
    {
        'filename': 'goetzmann0962.jpg',
        'title': 'Times Square 46th Street Building First Mortgage Gold Bond $1,000 No. N840 – Reverse/Stub (Specimen)',
        'description': 'Reverse side of specimen $1,000 First Mortgage Gold Bond of 1556 Broadway Corporation (Times Square 46th Street Building), New York. Shows bond spine (due April 1, 1953, interest payable April 1 and October 1), stub, and assignment form. Trustee: Interstate Trust Company. Page 2 of 3.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Times Square, Broadway, New York, gold bond, specimen, 1556 Broadway, Interstate Trust',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': '1556 Broadway Corporation',
        'issueDate': 'ca. 1928',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },
    # --- 0963 : Times Square coupon sheet ---
    {
        'filename': 'goetzmann0963.jpg',
        'title': 'Times Square 46th Street Building First Mortgage Gold Bond – Coupon Sheet $25 (Specimen)',
        'description': 'Coupon sheet for specimen $1,000 First Mortgage Gold Bond of 1556 Broadway Corporation (Times Square 46th Street Building), New York. Semi-annual coupons of $25 each, dated April 1 and October 1, from approximately 1933 to 1953, all marked SPECIMEN. Signed by Secretary and President of Interstate Financing Corp. Page 3 of 3.',
        'type': 'bond',
        'keywords': 'bond, coupon sheet, mortgage, real estate, Times Square, Broadway, New York, gold bond, specimen, 1556 Broadway',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': '1556 Broadway Corporation',
        'issueDate': 'ca. 1928',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '3',
        'period': '1920s',
    },
    # --- 0964 : 170 Broadway Building bond front ---
    {
        'filename': 'goetzmann0964.jpg',
        'title': '170 Broadway Building (Corner Broadway-Maiden Lane, Inc.) First Mortgage Leasehold 4½% Sinking Fund Gold Bond $500, No. B25',
        'description': 'First Mortgage Leasehold 4½% Sinking Fund Gold Bond for $500, No. B25, issued by Corner Broadway-Maiden Lane, Inc. (170 Broadway Building), secured by leasehold estates at the northeast corner of Broadway and Maiden Lane, Borough of Manhattan, New York. Printed in green with eagle vignette and decorative border. Signed by Secretary and President. Page 1 of 2.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, Broadway, Maiden Lane, New York, gold bond, sinking fund, leasehold',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Corner Broadway-Maiden Lane, Inc.',
        'issueDate': 'ca. 1928',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '2',
        'period': '1920s',
    },
    # --- 0965 : 170 Broadway Building bond reverse ---
    {
        'filename': 'goetzmann0965.jpg',
        'title': '170 Broadway Building First Mortgage Leasehold 4½% Sinking Fund Gold Bond $500 No. B25 – Reverse',
        'description': 'Reverse side of First Mortgage Leasehold 4½% Sinking Fund Gold Bond ($500, No. B25) issued by Corner Broadway-Maiden Lane, Inc. (170 Broadway Building), New York. Shows bond spine (due May 1, 1940, interest payable May 1 and November 1, principal payable at Continental Bank & Trust Company of New York) and owner registration table. Page 2 of 2.',
        'type': 'bond',
        'keywords': 'bond, mortgage, real estate, Manhattan, Broadway, Maiden Lane, New York, gold bond, sinking fund, leasehold',
        'subjectCountry': 'United States',
        'issuingCountry': 'United States',
        'creator': 'Corner Broadway-Maiden Lane, Inc.',
        'issueDate': 'ca. 1928',
        'currency': 'USD',
        'language': 'English',
        'numberPages': '2',
        'period': '1920s',
    },
    # --- 0966 : Bulgarian Government 5% Gold Loan 1902, Obligation 500 Francs, No. 008761 ---
    {
        'filename': 'goetzmann0966.jpg',
        'title': 'Principauté de Bulgarie – Bulgarian Government 5% Gold Loan of 1902, Obligation 500 Francs, No. 008761',
        'description': 'Bulgarian Government 5% Gold Loan of 1902 (Emprunt de l\'État Bulgare 5% Or 1902 / Emissiya ot Obligatsia), obligation of 500 French francs, No. 008761, secured on the tobacco duties. Emission of 212,000 bonds of 500 francs from a total 100,000,000-franc loan. Text in Bulgarian, French, Russian, German, and English. Signed by the Bulgarian Minister of Finance. Page 1 of 4.',
        'type': 'bond',
        'keywords': 'bond, government loan, gold loan, Bulgaria, tobacco, Sofia, 1902, multilingual, francs',
        'subjectCountry': 'Bulgaria',
        'issuingCountry': 'Bulgaria',
        'creator': 'Principauté de Bulgarie (Bulgarian Government)',
        'issueDate': '1902',
        'currency': 'FRF',
        'language': 'Bulgarian; French; Russian; German; English',
        'numberPages': '4',
        'period': '1900s',
    },
    # --- 0967 : Bulgarian bond conditions and amortization ---
    {
        'filename': 'goetzmann0967.jpg',
        'title': 'Bulgarian Government 5% Gold Loan of 1902 – Conditions and Amortization Table',
        'description': 'Interior page of Bulgarian Government 5% Gold Loan of 1902 obligation (No. 008761), showing loan conditions (Conditions de l\'Emprunt / Условия на Займа / Bedingungen der Anleihe) and full amortization/drawing table in Bulgarian, French, Russian, and English. Page 2 of 4.',
        'type': 'bond',
        'keywords': 'bond, government loan, gold loan, Bulgaria, tobacco, 1902, multilingual, amortization, conditions',
        'subjectCountry': 'Bulgaria',
        'issuingCountry': 'Bulgaria',
        'creator': 'Principauté de Bulgarie (Bulgarian Government)',
        'issueDate': '1902',
        'currency': 'FRF',
        'language': 'Bulgarian; French; Russian; English',
        'numberPages': '4',
        'period': '1900s',
    },
    # --- 0968 : Bulgarian bond talon (Bulgarian/French) ---
    {
        'filename': 'goetzmann0968.jpg',
        'title': 'Bulgarian Government 5% Gold Loan of 1902 – Talon No. 008761 (Bulgarian/French)',
        'description': 'Talon (coupon renewal stub) attached to Bulgarian Government 5% Gold Loan of 1902 obligation No. 008761 (Царство България / Royaume de Bulgarie). Upon surrender of this talon, the Bulgarian Ministry of Finance will deliver a new coupon sheet. Text in Bulgarian and French. Page 3 of 4.',
        'type': 'bond',
        'keywords': 'bond, government loan, gold loan, Bulgaria, 1902, talon, coupon renewal, Bulgarian, French',
        'subjectCountry': 'Bulgaria',
        'issuingCountry': 'Bulgaria',
        'creator': 'Principauté de Bulgarie (Bulgarian Government)',
        'issueDate': '1902',
        'currency': 'FRF',
        'language': 'Bulgarian; French',
        'numberPages': '4',
        'period': '1900s',
    },
    # --- 0969 : Bulgarian bond talon (Russian/German/English) ---
    {
        'filename': 'goetzmann0969.jpg',
        'title': 'Bulgarian Government 5% Gold Loan of 1902 – Talon (Russian/German/English)',
        'description': 'Second talon strip of Bulgarian Kingdom (Болгарское Царство / Königreich Bulgarien / Bulgarian Kingdom) 5% Gold Loan of 1902, secured on tobacco duties. Coupon renewal talon in Russian, German, and English: upon surrender, the Ministry of Finance will deliver a new coupon sheet. Page 4 of 4.',
        'type': 'bond',
        'keywords': 'bond, government loan, gold loan, Bulgaria, 1902, talon, coupon renewal, Russian, German, English',
        'subjectCountry': 'Bulgaria',
        'issuingCountry': 'Bulgaria',
        'creator': 'Principauté de Bulgarie (Bulgarian Government)',
        'issueDate': '1902',
        'currency': 'FRF',
        'language': 'Russian; German; English',
        'numberPages': '4',
        'period': '1900s',
    },
    # --- 0970 : Chinese Imperial Government 4.5% Gold Loan 1898, £25 ---
    {
        'filename': 'goetzmann0970.jpg',
        'title': 'Chinese Imperial Government 4½% Gold Loan of 1898 – £25 Sterling Bond, No. 024487',
        'description': 'Chinese Imperial Government 4½% Gold Loan of 1898 (Kaiserlich Chinesische 4½% Staatsanleihe in Gold von 1898), bond for £25 Sterling / 25 Pfund Sterling, No. 024487, Letter A. Loan of £16,000,000 Sterling nominal. Issued by Deutsch-Asiatische Bank, Berlin, 1 March 1898. Printed in red with Chinese-style decorative border and medallions. Text in English and German. Page 1 of 2.',
        'type': 'bond',
        'keywords': 'bond, government loan, gold loan, China, Deutsch-Asiatische Bank, Berlin, 1898, sterling, infrastructure',
        'subjectCountry': 'China',
        'issuingCountry': 'China',
        'creator': 'Chinese Imperial Government; Deutsch-Asiatische Bank',
        'issueDate': '1898-03-01',
        'currency': 'GBP',
        'language': 'English; German',
        'numberPages': '2',
        'period': '1890s',
    },
    # --- 0971 : Chinese Imperial Government bond interior ---
    {
        'filename': 'goetzmann0971.jpg',
        'title': 'Chinese Imperial Government 4½% Gold Loan of 1898 – Conditions, Amortization Plan, and Remaining Coupons',
        'description': 'Interior of Chinese Imperial Government 4½% Gold Loan of 1898 bond (No. 024487, £25 Sterling), showing extracts of the agreement (in English and German), table of drawings / amortization plan, and remaining coupon sheet with coupons nos. 82–90. Page 2 of 2.',
        'type': 'bond',
        'keywords': 'bond, government loan, gold loan, China, Deutsch-Asiatische Bank, 1898, sterling, amortization, coupon sheet',
        'subjectCountry': 'China',
        'issuingCountry': 'China',
        'creator': 'Chinese Imperial Government; Deutsch-Asiatische Bank',
        'issueDate': '1898-03-01',
        'currency': 'GBP',
        'language': 'English; German',
        'numberPages': '2',
        'period': '1890s',
    },
    # --- 0974 : Exposition Coloniale Internationale Paris 1931, Bon à Lot 60 Francs ---
    {
        'filename': 'goetzmann0974.jpg',
        'title': 'Exposition Coloniale Internationale Paris 1931 – Bon à Lot de Soixante Francs, Série 018 No. 08682',
        'description': 'Lottery bond (bon à lot) of 60 francs, Série 018, No. 08682, issued for the Exposition Coloniale Internationale, Paris 1931. Authorized by law of 22 July 1921; issued through Crédit Foncier de France. Emission of 2,300,000 bonds of 60 francs in lots totalling 21,253,000 francs in prizes. Bearer also entitled to travel discount coupons (chemins de fer, transports maritimes, avions). Signed by the Gouverneur Général. Printed in red and yellow with colonial imagery (palm trees, globe). Page 1 of 2.',
        'type': 'lottery bond',
        'keywords': 'lottery bond, colonial exhibition, Paris, 1931, Crédit Foncier de France, travel, aviation, France, colonial',
        'subjectCountry': 'France',
        'issuingCountry': 'France',
        'creator': 'Exposition Coloniale Internationale Paris 1931; Crédit Foncier de France',
        'issueDate': '1931',
        'currency': 'FRF',
        'language': 'French',
        'numberPages': '2',
        'period': '1930s',
    },
    # --- 0975 : Exposition Coloniale bond reverse (prize table) ---
    {
        'filename': 'goetzmann0975.jpg',
        'title': 'Exposition Coloniale Internationale Paris 1931 Bon à Lot – Prize Draw Table and Travel Benefits (Reverse)',
        'description': 'Reverse of Exposition Coloniale Internationale Paris 1931 lottery bond (Série 018 No. 08682), showing prize draw table (Tableau des Tirages et des Lots) with prizes up to 1,000,000 francs, description of additional travel benefits including railway, maritime transport, and aviation discounts, and a list of participating shipping companies. Page 2 of 2.',
        'type': 'lottery bond',
        'keywords': 'lottery bond, colonial exhibition, Paris, 1931, Crédit Foncier de France, travel, aviation, France, colonial, shipping',
        'subjectCountry': 'France',
        'issuingCountry': 'France',
        'creator': 'Exposition Coloniale Internationale Paris 1931; Crédit Foncier de France',
        'issueDate': '1931',
        'currency': 'FRF',
        'language': 'French',
        'numberPages': '2',
        'period': '1930s',
    },
    # --- 0980 : Grand Russian Railway Company 3% 125-ruble bond front ---
    {
        'filename': 'goetzmann0980.jpg',
        'title': 'Grand Russian Railway Company (Главное Общество Российских Железных Дорог) 3% Bond 125 Rubles, Third Emission, No. 210979, 1861',
        'description': '3% bond of 125 silver-metallic rubles (equivalent to 500 francs / 20 pounds sterling / 402 gold marks / 238 Dutch guilders), Third Emission, No. 210979, issued by the Grand Russian Railway Company (Главное Общество Российских Железных Дорог), St. Petersburg, 4 December 1861. Chartered by Imperial decree 3/15 November 1861. Printed in teal/green with imperial Russian double-headed eagle and elaborate figurative imagery. Text in Russian. Page 1 of 2.',
        'type': 'bond',
        'keywords': 'bond, railway, Russia, St. Petersburg, 1861, Grand Russian Railway, imperial Russia, rubles, infrastructure, teal',
        'subjectCountry': 'Russia',
        'issuingCountry': 'Russia',
        'creator': 'Grand Russian Railway Company (Главное Общество Российских Железных Дорог)',
        'issueDate': '1861-12-04',
        'currency': 'RUB',
        'language': 'Russian',
        'numberPages': '2',
        'period': '1860s',
    },
    # --- 0981 : Grand Russian Railway Company bond reverse (multilingual conditions) ---
    {
        'filename': 'goetzmann0981.jpg',
        'title': 'Grand Russian Railway Company 3% Bond 125 Rubles – Multilingual Conditions and Amortization Table (1861)',
        'description': 'Reverse side of Grand Russian Railway Company 3% bond (Third Emission, 125 rubles, No. 210979), showing loan conditions in French (Grande Société des Chemins de fer Russes), German (Grosse Russische Eisenbahn-Gesellschaft), and English (Grand Russian Railway Company), plus amortization/drawing table. Dated St. Petersburg, 3/15 November 1861. Page 2 of 2.',
        'type': 'bond',
        'keywords': 'bond, railway, Russia, St. Petersburg, 1861, Grand Russian Railway, multilingual, amortization, conditions, French, German, English',
        'subjectCountry': 'Russia',
        'issuingCountry': 'Russia',
        'creator': 'Grand Russian Railway Company (Главное Общество Российских Железных Дорог)',
        'issueDate': '1861-12-04',
        'currency': 'RUB',
        'language': 'French; German; English; Russian',
        'numberPages': '2',
        'period': '1860s',
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
