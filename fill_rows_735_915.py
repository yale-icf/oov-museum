# -*- coding: utf-8 -*-
import zipfile, re, shutil, os
import pandas as pd

base = r'C:\Users\ks2479\Documents\GitHub\oov-museum'
src  = os.path.join(base, 'oov_data_new.xlsx')
repair_copy = os.path.join(base, 'oov_data_repair.xlsx')
fixed = os.path.join(base, 'oov_data_fixed.xlsx')

# ── Repair NaN corruption ────────────────────────────────────────────────────
print("Repairing NaN values...")
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

# ── Metadata ─────────────────────────────────────────────────────────────────
rows_data = [
    dict(
        filename='goetzmann0735.jpg', itemID='735', path='/images/goetzmann0735.jpg',
        title='Bulgaria 5% Gold Loan 1902, Loan Conditions and Amortization Table (Reverse)',
        description="Reverse/conditions page of a Bulgarian 5% Gold Loan bond, 1902. Multilingual text in Bulgarian/Russian (УСЛОВИЯ НА ЗАЭМА), French (CONDITIONS DE L'EMPRUNT), German (BEDINGUNGEN DES ANLEHNS), and English (CONDITIONS OF THE LOAN). Includes amortization table.",
        type='bond',
        keywords='Bulgaria, bond, gold loan, conditions, amortization, multilingual, reverse',
        subjectCountry='Bulgaria', issuingCountry='Bulgaria',
        creator='', issueDate='1902', currency='multiple',
        language='Bulgarian; French; German; English',
        numberPages='1', period='1900-1910',
        notes='Reverse/back page with multilingual loan conditions and amortization tables',
    ),
    dict(
        filename='goetzmann0736.jpg', itemID='736', path='/images/goetzmann0736.jpg',
        title='Province of Buenos Aires, 5% Deuda Interna, 100 Pesos, Series A, Law No. 4393',
        description='Bond of the Province of Buenos Aires, Argentina. 5% internal debt (Deuda Interna), Series A, under Law No. 4393, denomination 100 Pesos. Large format with attached coupon sheet. Issued from La Plata.',
        type='bond',
        keywords='Argentina, Buenos Aires, bond, internal debt, deuda interna, pesos, provincia',
        subjectCountry='Argentina', issuingCountry='Argentina',
        creator='Provincia de Buenos Aires', issueDate='1932', currency='Pesos',
        language='Spanish', numberPages='1', period='1930-1940', notes='',
    ),
    dict(
        filename='goetzmann0737.jpg', itemID='737', path='/images/goetzmann0737.jpg',
        title='Province of Buenos Aires, Law No. 4393, Coupon Sheet',
        description='Coupon sheet for the Province of Buenos Aires bond under Law No. 4393. Pink/red coupons numbered 19 through 147. Dated Buenos Aires, 25 November 1925. Art. 9 de la Ley No. 4393.',
        type='coupon sheet',
        keywords='Argentina, Buenos Aires, coupon, talones, dividend, Ley 4393',
        subjectCountry='Argentina', issuingCountry='Argentina',
        creator='Provincia de Buenos Aires', issueDate='1925', currency='Pesos',
        language='Spanish', numberPages='1', period='1920-1930', notes='',
    ),
    dict(
        filename='goetzmann0738.jpg', itemID='738', path='/images/goetzmann0738.jpg',
        title='Kingdom of Serbia, 4.5% Redemption Loan, Amortization Table and Coupons (Reverse)',
        description="Reverse page of a Kingdom of Serbia 4.5% Redemption Loan bond. Multilingual amortization table in French (TABLEAU D'AMORTISSEMENT), Serbian (AMORTIZACIONI PLAN), and German (TILGUNGS-PLAN). Bottom section shows Serbian-language coupon stubs (TALON / Kraljevina Srbija / 4.5% zadan s otkupom).",
        type='bond',
        keywords='Serbia, bond, amortization, redemption loan, coupon, multilingual, reverse',
        subjectCountry='Serbia', issuingCountry='Serbia',
        creator='Kingdom of Serbia', issueDate='', currency='multiple',
        language='Serbian; French; German',
        numberPages='1', period='1900-1920',
        notes='Reverse/back page with multilingual amortization table and coupon stubs',
    ),
    dict(
        filename='Goetzmann0900.jpg', itemID='900', path='/images/Goetzmann0900.jpg',
        title='Stadtisches Gas- und Elektrizitatswerk Hagenow, 5% Benzolwert-Anleihe, 50 kg Benzol, 1923',
        description='Benzene-value bond (Benzolwert-Anleihe) issued by the Municipal Gas and Electric Works of Hagenow in Mecklenburg, Germany. Denomination: monetary value of 50 kg of benzene. 5% interest. Series C (Lit. C), No. 173. Dated Hagenow, 30 July 1923. Inflation-era commodity-linked bond.',
        type='bond',
        keywords='Germany, Hagenow, Mecklenburg, benzene, commodity bond, inflation, municipal, gas works, Benzolwert',
        subjectCountry='Germany', issuingCountry='Germany',
        creator='Stadtisches Gas- und Elektrizitatswerk Hagenow i.M.',
        issueDate='1923-07-30', currency='Benzol (commodity-linked)',
        language='German', numberPages='1', period='1920-1930', notes='',
    ),
    dict(
        filename='Goetzmann0901.jpg', itemID='901', path='/images/Goetzmann0901.jpg',
        title='Stadtisches Gas- und Elektrizitatswerk Hagenow, 5% Benzolwert-Anleihe, Prospectus (Reverse)',
        description='Reverse/prospectus page of the 5% Benzolwert-Anleihe (benzene-value loan) of the Municipal Gas and Electric Works Hagenow i.M., 1923. Titled: Ausschreibung: 5%ige Benzolwert-Anleihe des Stadtischen Gas- und Elektrizitatswerkes Hagenow i.M. Contains loan terms and conditions.',
        type='bond',
        keywords='Germany, Hagenow, Mecklenburg, benzene, commodity bond, inflation, prospectus, terms, Benzolwert',
        subjectCountry='Germany', issuingCountry='Germany',
        creator='Stadtisches Gas- und Elektrizitatswerk Hagenow i.M.',
        issueDate='1923', currency='Benzol (commodity-linked)',
        language='German', numberPages='1', period='1920-1930',
        notes='Reverse/prospectus page of Goetzmann0900',
    ),
    dict(
        filename='Goetzmann0902.jpg', itemID='902', path='/images/Goetzmann0902.jpg',
        title='Ablosungsanleihe der Stadt Rostock, 200 Reichsmark, Series E, No. 08939, 1927',
        description='Redemption loan bond (Ablosungsanleihe) of the City of Rostock, Mecklenburg, Germany. Denomination: 200 Reichsmark. Series E (Buchstabe E), No. 08939. Issued under the Mecklenburg-Schwerin state ordinance of 5 November 1927, Nr. B 48434. Signed by Der Rat der Stadt Rostock, 13 November 1927.',
        type='bond',
        keywords='Germany, Rostock, Mecklenburg, municipal bond, Reichsmark, redemption loan, Ablosungsanleihe',
        subjectCountry='Germany', issuingCountry='Germany',
        creator='Stadt Rostock', issueDate='1927-11-13', currency='Reichsmark',
        language='German', numberPages='1', period='1920-1930', notes='',
    ),
    dict(
        filename='Goetzmann0903.jpg', itemID='903', path='/images/Goetzmann0903.jpg',
        title='Ablosungsanleihe der Stadt Rostock, 50 Reichsmark, Series C, No. 07699, with Redemption Ticket, 1927',
        description='Redemption loan bond (Ablosungsanleihe) of the City of Rostock, 50 Reichsmark, Series C (Buchstabe C), No. 07699, together with its Auslosungsschein (redemption/lottery ticket). Image shows both documents side by side. City of Rostock, Mecklenburg, 1927.',
        type='bond',
        keywords='Germany, Rostock, municipal bond, Reichsmark, redemption loan, Ablosungsanleihe, lottery ticket, Auslosungsschein',
        subjectCountry='Germany', issuingCountry='Germany',
        creator='Stadt Rostock', issueDate='1927', currency='Reichsmark',
        language='German', numberPages='1', period='1920-1930',
        notes='Image shows bond (left) and Auslosungsschein/redemption ticket (right) side by side',
    ),
    dict(
        filename='Goetzmann0904.jpg', itemID='904', path='/images/Goetzmann0904.jpg',
        title='Habsburg Silesian Loan Obligation, 1,000 Guldens, Amsterdam 1736 (Page 1 of 4)',
        description="Page 1 of a four-page Habsburg imperial loan obligation for Upper and Lower Silesia. Dutch text beginning 'WY KAREL de Zesde, door Godsgenaden verkooren Rooms Keyzer...' (We Charles VI, by God's grace elected Holy Roman Emperor...). Concerns a 700,000 gulden loan for Silesia. Translated from German into Dutch; Amsterdam, 27 September 1736. Notarized by J. Barels, Notaris Publicq.",
        type='bond',
        keywords='Habsburg, Austria, Silesia, Holy Roman Empire, Charles VI, obligation, gulden, Amsterdam, 1736, Dutch',
        subjectCountry='Austria', issuingCountry='Austria',
        creator='Charles VI, Holy Roman Emperor', issueDate='1736-09-27', currency='Gulden',
        language='Dutch', numberPages='4', period='1700-1750',
        notes='Page 1 of 4; multi-page document (Goetzmann0904-0907); Silesian loan for 700,000 guldens',
    ),
    dict(
        filename='Goetzmann0905.jpg', itemID='905', path='/images/Goetzmann0905.jpg',
        title='Habsburg Silesian Loan Obligation, 1,000 Guldens, Amsterdam 1736 (Page 2 of 4)',
        description="Page 2 of the four-page Habsburg imperial loan obligation for Upper and Lower Silesia, Amsterdam 1736. Continues Dutch text: 'WY Vorsten en Standen van Opper- en Neder-Silesieen...' (We Princes and Estates of Upper and Lower Silesia...).",
        type='bond',
        keywords='Habsburg, Austria, Silesia, Holy Roman Empire, Charles VI, obligation, gulden, Amsterdam, 1736, Dutch',
        subjectCountry='Austria', issuingCountry='Austria',
        creator='Charles VI, Holy Roman Emperor', issueDate='1736', currency='Gulden',
        language='Dutch', numberPages='4', period='1700-1750',
        notes='Page 2 of 4; multi-page document (Goetzmann0904-0907)',
    ),
    dict(
        filename='Goetzmann0906.jpg', itemID='906', path='/images/Goetzmann0906.jpg',
        title='Habsburg Silesian Loan Obligation, 1,000 Guldens, Amsterdam 1736 (Page 3 of 4)',
        description='Page 3 of the four-page Habsburg imperial loan obligation for Upper and Lower Silesia, Amsterdam 1736. Continues the legal text in Dutch.',
        type='bond',
        keywords='Habsburg, Austria, Silesia, Holy Roman Empire, Charles VI, obligation, gulden, Amsterdam, 1736, Dutch',
        subjectCountry='Austria', issuingCountry='Austria',
        creator='Charles VI, Holy Roman Emperor', issueDate='1736', currency='Gulden',
        language='Dutch', numberPages='4', period='1700-1750',
        notes='Page 3 of 4; multi-page document (Goetzmann0904-0907)',
    ),
    dict(
        filename='Goetzmann0907.jpg', itemID='907', path='/images/Goetzmann0907.jpg',
        title='Habsburg Silesian Loan Obligation, 1,000 Guldens, Amsterdam 1736 (Page 4 of 4, Subscription Receipt)',
        description="Page 4 (final) of the Habsburg imperial loan obligation for Silesia, 1736. Subscription/receipt page signed by banker Willem Gideon Deutz, confirming receipt of 1,000 Guldens from Adriaan Prins, dated 15 October 1736. Deutz served as financial intermediary for the Silesian loan.",
        type='bond',
        keywords='Habsburg, Austria, Silesia, obligation, gulden, Deutz, Amsterdam, 1736, subscription, receipt',
        subjectCountry='Austria', issuingCountry='Austria',
        creator='Willem Gideon Deutz', issueDate='1736-10-15', currency='Gulden',
        language='Dutch', numberPages='4', period='1700-1750',
        notes='Page 4 of 4; subscription/receipt page signed by banker Willem Gideon Deutz',
    ),
    dict(
        filename='Goetzmann0908.jpg', itemID='908', path='/images/Goetzmann0908.jpg',
        title="Societe du Commerce d'Asie et d'Afrique (Ostend Company), Action No. 194, 250 Florins, ca. 1723",
        description="Share (Action) No. 194 of the Societe du Commerce d'Asie et d'Afrique, established by imperial octroy (charter) of the Emperor and King in the ports of the Adriatic Sea. Orders Francois Emmanuel van Ertborn to receive 250 florins d'Allemagne. Antwerp/Amsterdam, ca. 1723. Likely related to the Austrian Ostend Company (Compagnie d'Ostende) or a similar Habsburg chartered trading company.",
        type='share',
        keywords="Habsburg, Austria, Ostend Company, Asia Africa, share, octroy, florins, Antwerp, Amsterdam, trading company, 1723",
        subjectCountry='Austria', issuingCountry='Austria',
        creator="Societe du Commerce d'Asie et d'Afrique",
        issueDate='1723', currency="Florins d'Allemagne",
        language='French', numberPages='1', period='1700-1750', notes='',
    ),
    dict(
        filename='Goetzmann0909.jpg', itemID='909', path='/images/Goetzmann0909.jpg',
        title='Accion de la Compania No. 2580, 500 Pesos de a 15 Reales de Vellon, Madrid 1752',
        description='Spanish company share (Accion), No. 2580, for 500 pesos de a 15 Reales de Vellon. Large decorative engraved certificate with company seal. Madrid, 1 June 1752. The issuing company has not been identified with certainty; possibly a royal chartered Spanish trading or commercial company.',
        type='share',
        keywords='Spain, Madrid, share, accion, pesos, reales, vellon, trading company, 18th century, 1752',
        subjectCountry='Spain', issuingCountry='Spain',
        creator='', issueDate='1752-06-01', currency='Pesos de a 15 Reales de Vellon',
        language='Spanish', numberPages='1', period='1750-1800', notes='',
    ),
    dict(
        filename='Goetzmann0910.jpg', itemID='910', path='/images/Goetzmann0910.jpg',
        title='Swedish West India Company (Vast Indiska Companget), Share No. 259, ca. 1786',
        description='Share No. 259 of the Swedish West India Company (Vast Indiska Companget). Signed by multiple directors. Large X cancellation mark across the certificate. Circa 1786. Cancelled/voided.',
        type='share',
        keywords='Sweden, West India Company, share, colonial, cancelled, 18th century, Vast Indiska, trading company',
        subjectCountry='Sweden', issuingCountry='Sweden',
        creator='Vast Indiska Companget (Swedish West India Company)',
        issueDate='1786', currency='Riksdaler',
        language='Swedish', numberPages='2', period='1750-1800',
        notes='Cancelled with large X mark; reverse (Goetzmann0911) contains handwritten transfer/dividend records 1792-1806',
    ),
    dict(
        filename='Goetzmann0911.jpg', itemID='911', path='/images/Goetzmann0911.jpg',
        title='Swedish West India Company Share No. 259, Transfer and Dividend Records (Reverse)',
        description='Reverse page of Swedish West India Company share No. 259. Contains handwritten dividend/transfer payment entries from approximately 1792 to 1806. References Banningska Compagnia / Banningsinska Compagnia. Signed by various names including Lars Rejones and others.',
        type='share',
        keywords='Sweden, West India Company, share, transfer records, dividend, reverse, 18th century, Vast Indiska',
        subjectCountry='Sweden', issuingCountry='Sweden',
        creator='Vast Indiska Companget (Swedish West India Company)',
        issueDate='1786', currency='Riksdaler',
        language='Swedish', numberPages='2', period='1750-1800',
        notes='Reverse page of Goetzmann0910; handwritten transfer/dividend payment records 1792-1806',
    ),
    dict(
        filename='goetzmann0912.jpg', itemID='912', path='/images/goetzmann0912.jpg',
        title='Strand Bridge Company, Share No. 4696, John Colegate, London 1809',
        description='Share certificate No. 4696 of the Strand Bridge Company (later Waterloo Bridge), London. Certifies that John Colegate of Buckingham Row is a proprietor of one share (1/496 of the undertaking), incorporated by Act of Parliament. Signed under the Common Seal of the Company. London, 30 December 1809.',
        type='share',
        keywords='England, London, Strand Bridge, Waterloo Bridge, share, infrastructure, bridge, Act of Parliament, 1809',
        subjectCountry='United Kingdom', issuingCountry='United Kingdom',
        creator='Strand Bridge Company', issueDate='1809-12-30', currency='Pounds Sterling',
        language='English', numberPages='2', period='1800-1820',
        notes='Strand Bridge Company later became Waterloo Bridge; reverse (goetzmann0913) shows call payment records 1810-1811',
    ),
    dict(
        filename='goetzmann0913.jpg', itemID='913', path='/images/goetzmann0913.jpg',
        title='Strand Bridge Company Share No. 4696, Call Payment Records (Reverse)',
        description='Reverse page of Strand Bridge Company share No. 4696. Contains handwritten records of call payments: first call of 2 pounds per share paid March 6, and subsequent calls dated 1810-1811.',
        type='share',
        keywords='England, London, Strand Bridge, Waterloo Bridge, share, calls, payments, 1810, reverse',
        subjectCountry='United Kingdom', issuingCountry='United Kingdom',
        creator='Strand Bridge Company', issueDate='1809-12-30', currency='Pounds Sterling',
        language='English', numberPages='2', period='1800-1820',
        notes='Reverse page of goetzmann0912; call payment records 1810-1811',
    ),
    dict(
        filename='goetzmann0914.jpg', itemID='914', path='/images/goetzmann0914.jpg',
        title='Derby Canal Company, Share No. 320, Matthew How, Derby 1793',
        description='Share certificate No. 320 of the Derby Canal Company, certifying Matthew How of Derby (Hatter) as entitled to one share in the undertaking. Established by Act of Parliament for a navigable canal from the River Trent near Swarkiton Bridge. Second General Assembly held 7 October 1793, Derby.',
        type='share',
        keywords='England, Derby, canal, share, infrastructure, transportation, Act of Parliament, 1793, navigation',
        subjectCountry='United Kingdom', issuingCountry='United Kingdom',
        creator='Derby Canal Company', issueDate='1793-10-07', currency='Pounds Sterling',
        language='English', numberPages='1', period='1790-1810', notes='',
    ),
    dict(
        filename='goetzmann0915.jpg', itemID='915', path='/images/goetzmann0915.jpg',
        title='Societe Toulousaine du Bazacle, Part de Fondateur au Porteur No. 010532, Toulouse',
        description="Founder's bearer share (Part de Fondateur au Porteur) No. 010532 of the Societe Toulousaine du Bazacle, Societe Anonyme, Toulouse. Capital social: 13,150,000 Francs (131,500 shares of 1,000 Francs each). Statutes deposited with notary Moyne in Paris, modified by extraordinary assemblies of 19 March 1927 and 26 April 1929. Registered office: 10 Quai Saint-Pierre, Toulouse. This company traces its origins to a medieval water mill cooperative, one of the oldest joint-stock companies in history.",
        type='share',
        keywords='France, Toulouse, Bazacle, mill, share, founder, bearer share, medieval origins, water mill, Societe Anonyme',
        subjectCountry='France', issuingCountry='France',
        creator='Societe Toulousaine du Bazacle', issueDate='1927', currency='Francs',
        language='French', numberPages='1', period='1920-1930',
        notes='Societe Toulousaine du Bazacle traces its origins to a medieval water mill cooperative; one of the oldest joint-stock companies in history',
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
        print(f"WARNING: no row found for '{fn}'")
        continue
    idx = matches.index[0]
    for col in COLS:
        df.at[idx, col] = rd.get(col, '')
    print(f"[{idx:>4}] itemID={rd['itemID']:>4}  {fn}")
    filled += 1

print(f"\nFilled {filled} rows.")

# ── Save ─────────────────────────────────────────────────────────────────────
df.to_excel(fixed, index=False)
shutil.copy(fixed, src)
os.remove(repair_copy)
print(f"Saved -> {src}")
