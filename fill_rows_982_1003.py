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
    # --- Update 0980 and 0981: extend to 4 pages now that 0982-0983 are coupon sheets ---
    {
        'filename': 'goetzmann0980.jpg',
        'numberPages': '4',
        'notes': 'Page 1 of 4; coupon sheets (Russian and French/English) in goetzmann0982-0983',
    },
    {
        'filename': 'goetzmann0981.jpg',
        'numberPages': '4',
        'notes': 'Page 2 of 4; coupon sheets (Russian and French/English) in goetzmann0982-0983',
    },

    # --- 0982 : Grand Russian Railway Company coupon sheet (Russian), page 3/4 ---
    {
        'filename': 'goetzmann0982.jpg',
        'title': 'Grand Russian Railway Company 3% Bond – Coupon Sheet (Russian), Page 3 of 4',
        'description': 'Russian-language coupon sheet for Grand Russian Railway Company (Главное Общество Российских Железных Дорог) 3% bond, Third Emission, No. 210979, St. Petersburg 1861. Grid of semi-annual interest coupons headed "К облигации Главного Общества Российских Железных Дорог," printed in green. Page 3 of 4.',
        'type': 'bond',
        'keywords': 'bond, railway, Russia, St. Petersburg, 1861, Grand Russian Railway, coupon sheet, Russian',
        'subjectCountry': 'Russia',
        'issuingCountry': 'Russia',
        'creator': 'Grand Russian Railway Company (Главное Общество Российских Железных Дорог)',
        'issueDate': '1861-12-04',
        'currency': 'RUB',
        'language': 'Russian',
        'numberPages': '4',
        'period': '1860s',
    },
    # --- 0983 : Grand Russian Railway Company coupon sheet (French/English), page 4/4 ---
    {
        'filename': 'goetzmann0983.jpg',
        'title': 'Grand Russian Railway Company 3% Bond – Coupon Sheet (French/English), Page 4 of 4',
        'description': 'French- and English-language coupon sheet for Grand Russian Railway Company 3% bond, Third Emission, No. 210979, St. Petersburg 1861. Headed "OBLIGATIONS DE LA GRANDE SOCIÉTÉ DES CHEMINS DE FER RUSSES / DE BONDS OF THE GRAND RUSSIAN RAILWAY COMPANY." Grid of semi-annual interest coupons, printed in green. Page 4 of 4.',
        'type': 'bond',
        'keywords': 'bond, railway, Russia, St. Petersburg, 1861, Grand Russian Railway, coupon sheet, French, English',
        'subjectCountry': 'Russia',
        'issuingCountry': 'Russia',
        'creator': 'Grand Russian Railway Company (Главное Общество Российских Железных Дорог)',
        'issueDate': '1861-12-04',
        'currency': 'RUB',
        'language': 'French; English',
        'numberPages': '4',
        'period': '1860s',
    },

    # --- 0984 : Province of Nova Scotia Government Redeemable Stock £1,000, No. C1515, page 1/4 ---
    {
        'filename': 'goetzmann0984.jpg',
        'title': 'Province of Nova Scotia (Dominion of Canada) Government Redeemable Stock £1,000 at 3½%, No. C1515',
        'description': 'Government Redeemable Stock certificate for £1,000 bearing interest at 3½% per annum, issued by the Province of Nova Scotia, Dominion of Canada. No. C1515. Redeemable at par in London on 17 July 1930. Payable at The National Provincial Bank of England Limited, 112 Bishopsgate Street, London. Dated 17 October 1910. Printed in red/orange with provincial coat of arms. Coupon sheet attached at bottom. Page 1 of 4.',
        'type': 'bond',
        'keywords': 'bond, government stock, Nova Scotia, Canada, Dominion of Canada, sterling, London, redeemable, 1910',
        'subjectCountry': 'Canada',
        'issuingCountry': 'Canada',
        'creator': 'Province of Nova Scotia',
        'issueDate': '1910-10-17',
        'currency': 'GBP',
        'language': 'English',
        'numberPages': '4',
        'period': '1910s',
    },
    # --- 0985 : Nova Scotia - Coupon sheet, page 2/4 ---
    {
        'filename': 'goetzmann0985.jpg',
        'title': 'Province of Nova Scotia Government Redeemable Stock £1,000 No. C1515 – Coupon Sheet',
        'description': 'Large coupon sheet for Province of Nova Scotia Government Redeemable Stock (No. C1515, £1,000 at 3½%). Semi-annual coupons of £17.10s. each, printed in red/orange. Page 2 of 4.',
        'type': 'bond',
        'keywords': 'bond, government stock, Nova Scotia, Canada, sterling, coupon sheet, 1910',
        'subjectCountry': 'Canada',
        'issuingCountry': 'Canada',
        'creator': 'Province of Nova Scotia',
        'issueDate': '1910-10-17',
        'currency': 'GBP',
        'language': 'English',
        'numberPages': '4',
        'period': '1910s',
    },
    # --- 0986 : Nova Scotia - Conditions + coupons, page 3/4 ---
    {
        'filename': 'goetzmann0986.jpg',
        'title': 'Province of Nova Scotia Government Redeemable Stock – Conditions and Additional Coupons',
        'description': 'Reverse/conditions page of Province of Nova Scotia Government Redeemable Stock (No. C1515, £1,000 at 3½%), showing terms and conditions of the stock and additional coupon rows in red/orange. Page 3 of 4.',
        'type': 'bond',
        'keywords': 'bond, government stock, Nova Scotia, Canada, sterling, conditions, coupon, 1910',
        'subjectCountry': 'Canada',
        'issuingCountry': 'Canada',
        'creator': 'Province of Nova Scotia',
        'issueDate': '1910-10-17',
        'currency': 'GBP',
        'language': 'English',
        'numberPages': '4',
        'period': '1910s',
    },
    # --- 0987 : Nova Scotia - Bond spine stubs, page 4/4 ---
    {
        'filename': 'goetzmann0987.jpg',
        'title': 'Province of Nova Scotia Government Redeemable Stock – Bond Spine Stubs No. C1515',
        'description': 'Bond spine stubs for Province of Nova Scotia Government Redeemable Stock (No. C1515, £1,000 at 3½%), showing two stub labels "DOMINION OF CANADA – PROVINCE OF NOVA SCOTIA – GOVERNMENT REDEEMABLE STOCK – BEARING INTEREST AT 3½ PER CENT PER ANNUM – £1000" and final coupon rows. Page 4 of 4.',
        'type': 'bond',
        'keywords': 'bond, government stock, Nova Scotia, Canada, sterling, stub, 1910',
        'subjectCountry': 'Canada',
        'issuingCountry': 'Canada',
        'creator': 'Province of Nova Scotia',
        'issueDate': '1910-10-17',
        'currency': 'GBP',
        'language': 'English',
        'numberPages': '4',
        'period': '1910s',
    },

    # --- 0988 : Banque Industrielle de Chine (中法實業銀行) 500-franc share No. 258044, page 1/2 ---
    {
        'filename': 'goetzmann0988.jpg',
        'title': 'Banque Industrielle de Chine (中法實業銀行) – Action Ordinaire de 500 Francs au Porteur, No. 258044',
        'description': 'Ordinary bearer share (action ordinaire au porteur) for 500 French francs, No. 258044, issued by Banque Industrielle de Chine (中法實業銀行, Sino-French Industrial Bank). Capital social: 150,000,000 francs. Siège social: Paris. Signed by Maspero. Printed in yellow/ochre with Chinese gateway and guardian lion vignette. Coupon sheet (中法實業銀行息票) attached at bottom. Page 1 of 2.',
        'type': 'share',
        'keywords': 'share, bank, China, France, Sino-French, Banque Industrielle de Chine, Paris, francs, Chinese gateway',
        'subjectCountry': 'China',
        'issuingCountry': 'France',
        'creator': 'Banque Industrielle de Chine',
        'issueDate': 'ca. 1913',
        'currency': 'FRF',
        'language': 'French; Chinese',
        'numberPages': '2',
        'period': '1910s',
    },
    # --- 0989 : Banque Industrielle de Chine - Extraits des Statuts, page 2/2 ---
    {
        'filename': 'goetzmann0989.jpg',
        'title': 'Banque Industrielle de Chine (中法實業銀行) – Extraits des Statuts and Coupon Stubs (Reverse)',
        'description': 'Reverse of Banque Industrielle de Chine (中法實業銀行) 500-franc ordinary share (No. 258044), showing "Extraits des Statuts" (extracts of the bylaws) in French, and Chinese coupon dividend stubs (中法實業銀行息票) at bottom. Page 2 of 2.',
        'type': 'share',
        'keywords': 'share, bank, China, France, Sino-French, Banque Industrielle de Chine, statutes, coupon stubs',
        'subjectCountry': 'China',
        'issuingCountry': 'France',
        'creator': 'Banque Industrielle de Chine',
        'issueDate': 'ca. 1913',
        'currency': 'FRF',
        'language': 'French; Chinese',
        'numberPages': '2',
        'period': '1910s',
    },

    # --- 0990 : Compagnie des Chemins de Fer Économiques de l'Est Égyptien 3½% bond £20 No. 10592, page 1/4 ---
    {
        'filename': 'goetzmann0990.jpg',
        'title': 'Compagnie des Chemins de Fer Économiques de l\'Est Égyptien – 3½% Bond to Bearer £20 / 504 Francs, No. 10592 (1897)',
        'description': '3½% Bond to Bearer (Obligation au Porteur) for £20 Sterling / 504 French francs, No. 10592, issued by Compagnie des Chemins de Fer Économiques de l\'Est Égyptien, Société Anonyme, Cairo. Issue of 12,500 bonds of £20 each (total capital £200,000), authorized by Khedival Decree of 6 June 1897. Interest of £0.7.0 payable semi-annually in Cairo, Alexandria, Paris, London, Amsterdam, Brussels, and Geneva. Signed by two directors, Cairo, 1 July 1897. Text in French and English. Page 1 of 4.',
        'type': 'bond',
        'keywords': 'bond, railway, Egypt, Cairo, Nile Delta, French, sterling, 1897, Khedival, agricultural railway',
        'subjectCountry': 'Egypt',
        'issuingCountry': 'Egypt',
        'creator': 'Compagnie des Chemins de Fer Économiques de l\'Est Égyptien',
        'issueDate': '1897-07-01',
        'currency': 'GBP',
        'language': 'French; English',
        'numberPages': '4',
        'period': '1890s',
    },
    # --- 0991 : East Egyptian Railways - Conditions/Sinkingfund, page 2/4 ---
    {
        'filename': 'goetzmann0991.jpg',
        'title': 'Compagnie des Chemins de Fer Économiques de l\'Est Égyptien 3½% Bond – Conditions and Sinking Fund Table',
        'description': 'Reverse of Compagnie des Chemins de Fer Économiques de l\'Est Égyptien 3½% Bond (No. 10592), showing guarantee conditions (Garantie / Guarantees) in French and English — the conceded railway lines and government guarantee of principal and interest — and a full amortization/sinking fund table (Tableau d\'Amortissement / Sinkingfund) running to ca. 1957. Page 2 of 4.',
        'type': 'bond',
        'keywords': 'bond, railway, Egypt, Cairo, 1897, conditions, sinking fund, amortization, guarantee',
        'subjectCountry': 'Egypt',
        'issuingCountry': 'Egypt',
        'creator': 'Compagnie des Chemins de Fer Économiques de l\'Est Égyptien',
        'issueDate': '1897-07-01',
        'currency': 'GBP',
        'language': 'French; English',
        'numberPages': '4',
        'period': '1890s',
    },
    # --- 0992 : East Egyptian Railways - Coupon sheet (coupons 110-120), page 3/4 ---
    {
        'filename': 'goetzmann0992.jpg',
        'title': 'Compagnie des Chemins de Fer Économiques de l\'Est Égyptien 3½% Bond No. 10592 – Coupon Sheet (Nos. 110–120)',
        'description': 'Coupon sheet for Compagnie des Chemins de Fer Économiques de l\'Est Égyptien 3½% Bond No. 10592. Semi-annual coupons nos. 110–120, each for £0.7.0, payable January 1 and July 1 in Cairo, Alexandria, Paris, London, Amsterdam, Brussels, and Geneva. Page 3 of 4.',
        'type': 'bond',
        'keywords': 'bond, railway, Egypt, Cairo, 1897, coupon sheet, sterling',
        'subjectCountry': 'Egypt',
        'issuingCountry': 'Egypt',
        'creator': 'Compagnie des Chemins de Fer Économiques de l\'Est Égyptien',
        'issueDate': '1897-07-01',
        'currency': 'GBP',
        'language': 'French; English',
        'numberPages': '4',
        'period': '1890s',
    },
    # --- 0993 : East Egyptian Railways - Coupon sheet (late coupons ca. 1952-1958), page 4/4 ---
    {
        'filename': 'goetzmann0993.jpg',
        'title': 'Compagnie des Chemins de Fer Économiques de l\'Est Égyptien 3½% Bond No. 10592 – Late Coupon Sheet (ca. 1952–1958)',
        'description': 'Late coupon sheet for Compagnie des Chemins de Fer Économiques de l\'Est Égyptien 3½% Bond No. 10592. Semi-annual coupons each for £0.7.0, dated January 1 and July 1 from ca. 1952 to 1958, payable in Cairo, Alexandria, Paris, London, Amsterdam, Brussels, and Geneva. Page 4 of 4.',
        'type': 'bond',
        'keywords': 'bond, railway, Egypt, Cairo, 1897, coupon sheet, late coupons, sterling',
        'subjectCountry': 'Egypt',
        'issuingCountry': 'Egypt',
        'creator': 'Compagnie des Chemins de Fer Économiques de l\'Est Égyptien',
        'issueDate': '1897-07-01',
        'currency': 'GBP',
        'language': 'French; English',
        'numberPages': '4',
        'period': '1890s',
    },

    # --- 0996 : Gräflich Casimir Esterhazy'sche Central-Casse Partial-Schuldverschreibung 20 Gulden No. 14725, page 1/2 ---
    {
        'filename': 'goetzmann0996.jpg',
        'title': 'Gräflich Casimir Esterhazy\'sche Central-Casse – Partial-Schuldverschreibung 20 Gulden, No. 14725 (1847)',
        'description': 'Partial bond certificate (Partial-Schuldverschreibung) for twenty guilders (Zwanzig Gulden Conventions-Münze im 20 fl. Fusse), No. 14725, issued by the Gräflich Casimir Esterhazy\'sche Central-Casse (Count Casimir Esterházy\'s Central Cashbox). Part of a bond issue of one million guilders bearing interest at 5%, drawn by lottery (Auslosungen) over 25 years. Repayment recapitulation table printed above the bond face. Text in German. Page 1 of 2.',
        'type': 'bond',
        'keywords': 'bond, Esterhazy, Austria, nobility, Vienna, 1847, guilders, German, lottery redemption, Conventions-Münze',
        'subjectCountry': 'Austria',
        'issuingCountry': 'Austria',
        'creator': 'Gräflich Casimir Esterhazy\'sche Central-Casse',
        'issueDate': '1847',
        'currency': 'Gulden (Austrian)',
        'language': 'German',
        'numberPages': '2',
        'period': '1840s',
    },
    # --- 0997 : Esterházy bond - Rückzahlungsplan and conditions, page 2/2 ---
    {
        'filename': 'goetzmann0997.jpg',
        'title': 'Gräflich Casimir Esterhazy\'sche Central-Casse – Rückzahlungsplan and Conditions (Reverse)',
        'description': 'Reverse of Gräflich Casimir Esterhazy\'sche Central-Casse 20-guilder Partial-Schuldverschreibung (No. 14725), showing the full repayment schedule (Rückzahlungs-Plan) and conditions. Signed Vienna, 14 November 1847, by Werner Noris and Hoffmann-Berlins, countersigned by "Die gräflich Casimir Esterhazy\'sche Central-Casse." Text in German. Page 2 of 2.',
        'type': 'bond',
        'keywords': 'bond, Esterhazy, Austria, nobility, Vienna, 1847, guilders, German, repayment plan, conditions',
        'subjectCountry': 'Austria',
        'issuingCountry': 'Austria',
        'creator': 'Gräflich Casimir Esterhazy\'sche Central-Casse',
        'issueDate': '1847',
        'currency': 'Gulden (Austrian)',
        'language': 'German',
        'numberPages': '2',
        'period': '1840s',
    },

    # --- 0998 : USSR Third State Loan for Reconstruction, 100 rubles, 1948, page 1/2 ---
    {
        'filename': 'goetzmann0998.jpg',
        'title': 'USSR Third State Loan for Reconstruction and Development of the National Economy – 100-Ruble Bond, No. 055726 (1948)',
        'description': '100-ruble bond (Облигация на сумму Сто Рублей) issued as part of the Third State Loan for Reconstruction and Development of the National Economy of the USSR (Третий Государственный Заём Восстановления и Развития Народного Хозяйства СССР), 1948. Series 23 (No. 055726), Class 150. Printed in red and brown with the Soviet state emblem (hammer and sickle) and industrial imagery (factory, hydroelectric dam, combine harvester). Page 1 of 2.',
        'type': 'bond',
        'keywords': 'bond, USSR, Soviet Union, state loan, reconstruction, 1948, rubles, postwar, Soviet emblem',
        'subjectCountry': 'Russia',
        'issuingCountry': 'Russia',
        'creator': 'USSR (Soviet Government)',
        'issueDate': '1948',
        'currency': 'RUB',
        'language': 'Russian',
        'numberPages': '2',
        'period': '1940s',
    },
    # --- 0999 : USSR Third State Loan - Conditions, page 2/2 ---
    {
        'filename': 'goetzmann0999.jpg',
        'title': 'USSR Third State Loan for Reconstruction and Development – Conditions (Reverse)',
        'description': 'Reverse of USSR Third State Loan 1948 100-ruble bond, showing full loan conditions (Условия Третьего Государственного Займа Восстановления и Развития Народного Хозяйства СССР) in Russian, including prize/lottery table, repayment schedule (20-year term from 1 October 1948 to 1 October 1968), and tax exemption provisions. Page 2 of 2.',
        'type': 'bond',
        'keywords': 'bond, USSR, Soviet Union, state loan, reconstruction, 1948, conditions, lottery, repayment',
        'subjectCountry': 'Russia',
        'issuingCountry': 'Russia',
        'creator': 'USSR (Soviet Government)',
        'issueDate': '1948',
        'currency': 'RUB',
        'language': 'Russian',
        'numberPages': '2',
        'period': '1940s',
    },

    # --- 1000 : USSR State Internal Lottery Loan 1982, 50 rubles, page 1/2 ---
    {
        'filename': 'goetzmann1000.jpg',
        'title': 'USSR State Internal Lottery Loan 1982 – 50-Ruble Bond, No. 087 Series 269867',
        'description': '50-ruble bond (Облигация на сумму Пятьдесят Рублей) issued as part of the State Internal Lottery Loan 1982 (Государственный Внутренний Выигрышный Заём 1982 года) of the USSR. Bond No. 087, Series 269867, Class 28. Text references the loan also covering draw periods 1982–1990. Printed in green with Soviet state emblem and shield. Page 1 of 2.',
        'type': 'lottery bond',
        'keywords': 'lottery bond, USSR, Soviet Union, state loan, 1982, rubles, Soviet emblem, lottery',
        'subjectCountry': 'Russia',
        'issuingCountry': 'Russia',
        'creator': 'USSR (Soviet Government)',
        'issueDate': '1982',
        'currency': 'RUB',
        'language': 'Russian',
        'numberPages': '2',
        'period': '1980s',
    },
    # --- 1001 : USSR State Internal Lottery Loan 1982 - Conditions, page 2/2 ---
    {
        'filename': 'goetzmann1001.jpg',
        'title': 'USSR State Internal Lottery Loan 1982 – Conditions (Reverse)',
        'description': 'Reverse of USSR State Internal Lottery Loan 1982 50-ruble bond, showing full loan conditions (Условия Государственного Внутреннего Выигрышного Займа 1982 года) in Russian, including prize structure, lottery draw schedule, and repayment terms. Page 2 of 2.',
        'type': 'lottery bond',
        'keywords': 'lottery bond, USSR, Soviet Union, state loan, 1982, conditions, prize structure, repayment',
        'subjectCountry': 'Russia',
        'issuingCountry': 'Russia',
        'creator': 'USSR (Soviet Government)',
        'issueDate': '1982',
        'currency': 'RUB',
        'language': 'Russian',
        'numberPages': '2',
        'period': '1980s',
    },

    # --- 1002 : Republic of China Ministry of Finance Third National Treasury Bond, 5 yuan, 1926 ---
    {
        'filename': 'goetzmann1002.jpg',
        'title': 'Republic of China Ministry of Finance Third National Treasury Bond (國民政府財政部第三次國庫券) – 5 Yuan, No. 0439850 (1926)',
        'description': 'Treasury bond (國庫券) for five yuan (伍圓), No. 0439850, issued by the Ministry of Finance (財政部) of the Nationalist Government (國民政府) of China as the Third National Treasury Bond issue. Year 15 of the Republic of China (民國十五年 = 1926). Printed in purple with ornamental border and denomination in large Chinese characters. Terms and conditions in Chinese printed on the reverse.',
        'type': 'bond',
        'keywords': 'bond, treasury bond, Republic of China, Nationalist Government, 1926, yuan, Chinese, Ministry of Finance',
        'subjectCountry': 'China',
        'issuingCountry': 'China',
        'creator': 'Republic of China, Ministry of Finance',
        'issueDate': '1926',
        'currency': 'CNY',
        'language': 'Chinese',
        'numberPages': '1',
        'period': '1920s',
    },

    # --- 1003 : Republic of China Second Nationalist Government Lottery Loan, $5 Canton currency, 1926 ---
    {
        'filename': 'goetzmann1003.jpg',
        'title': 'Republic of China Second Nationalist Government Lottery Loan – $5 Bond, Canton Currency (1926)',
        'description': 'Lottery bond for five dollars (Canton currency), Second Nationalist Government Lottery Loan, issued in the 15th year of the Republic of China (= 1926). Authorized to finance construction of the Port of Whampoa (Whanpoa). Guaranteed by the revenue of the Nationalist Government with the Central Bank of China as Government Depository. Prize structure: first prize $50,000, second prizes $1,000, etc. Signed by the Director of the Revenue Department and the Minister of Finance (H.H. Kung). Text in English. Printed in green with decorative border.',
        'type': 'lottery bond',
        'keywords': 'lottery bond, Republic of China, Nationalist Government, Canton, Whampoa, 1926, dollars, Canton currency, H.H. Kung',
        'subjectCountry': 'China',
        'issuingCountry': 'China',
        'creator': 'Republic of China, Nationalist Government',
        'issueDate': '1926',
        'currency': 'CNY',
        'language': 'English',
        'numberPages': '1',
        'period': '1920s',
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
