const fs = require('fs');

// Manual overrides — rules can't reliably handle these
const OVERRIDES = {
  'goetzmann0003': 'Internal State Loan for National Defense',
  'goetzmann0004': 'How the Insurance Company of Rotterdam Can Be Promoted, and That No One Would Lose',
  'goetzmann0011': 'Conditions of the Maritime Insurance Company within Middelburg',
  'goetzmann0012': 'Regulations for the Exchange Bank within Utrecht',
  'goetzmann0019': 'Inventory of Assets Belonging to the Colony of Berbice',
  'goetzmann0020': 'Project for the Ruin of the Turkish Pirates of Algiers, Tunis, Tripoli and Sale',
  'goetzmann0191': 'The Decline and Fall of the English System of Finance',
  'goetzmann0215': 'Continental Lottery Ticket, Class the First',
  'goetzmann0216': 'South Sea Annuities Dividend Warrant',
  'goetzmann0218': 'Antwerp Exchange Obligation, Generale Keyserlyke Company',
  'goetzmann0220': 'Alexander Hamilton Circular Letter on State Debt Certificates',
  'goetzmann0221': 'Massachusetts Bills of Exchange Schedule',
  'goetzmann0223': 'Rowley, Massachusetts: Selectmen\'s Fine Warrant',
  'goetzmann0226': 'Massachusetts Bay War Bond',
  'goetzmann0228': 'Dutch Bond for the French Bourbon Princes in Exile',
  'goetzmann0393': 'Ancient Papyrus: Greek or Coptic Financial Document',
  // Bill of Exchange series — keep bill number to distinguish the 6 bills
  'goetzmann0495': 'Continental Loan Office Bill of Exchange, No. 57',
  'goetzmann0496': 'Continental Loan Office Bill of Exchange, No. 814',
  'goetzmann0505': 'Continental Loan Office Bill of Exchange, No. 43',
  'goetzmann0529': 'Continental Loan Office Bill of Exchange, No. 131',
  'goetzmann0531': 'Continental Loan Office Bill of Exchange, No. 64',
  'goetzmann0532': 'Continental Loan Office Bill of Exchange, No. 71',
  // "X Shares at $Y Each" — broken by dollar strip
  'goetzmann0394': 'Little Miami Rail Road Company Share Certificate',
  'goetzmann0397': 'Mexican Telephone Company Share Certificate',
  'goetzmann0398': 'Minas Geraes Goldfields Share Warrant',
  'goetzmann0413': 'Oregon and Transcontinental Company Share Certificate',
  'goetzmann0420': 'Polish-American Oil Company "Columbia" Share Certificate',
  // French/Spanish titles where rules don\'t extract English
  'goetzmann0327': 'Spanish Perpetual Rente',
  'goetzmann0336': 'Madrid-Zaragoza-Alicante Railway Company Share',
  'goetzmann0337': 'Compañía La Petrolífera Nacional Share',
  'goetzmann0338': 'Compañía Petrolera Mexicana "Faros de Aztlán" Share Certificate',
  'goetzmann0339': 'Compañía de las Hulleras de Ujo-Mieres Share Certificate',
  'goetzmann0356': 'Italian Public Debt Rendita Certificate',
  'goetzmann0357': 'Deli Railway Company Share',
  'goetzmann0361': 'Venice Giro Bank Cedula',
  'goetzmann0364': 'St. Petersburg Electric Lighting Preference Share',
  'goetzmann0365': 'Hungarian Mortgage Credit Bank Prize Bond',
  'goetzmann0406': 'Compañía del Ferro-Carril de Palencia a Ponferrada Bond',
  'goetzmann0410': 'Omnium Français du Film Share',
  'goetzmann0411': 'Ostend Company Dividend Receipt',
  'goetzmann0412': 'Norbert Fathers\' Order First Mortgage Bond',
  'goetzmann0414': 'Austrian Building Lottery Bond',
  'goetzmann0416': 'Café de la Paix Béziers Founder\'s Share',
  'goetzmann0419': 'Société des Plantations d\'Agaves de l\'Annam Share',
  'goetzmann0421': 'Compagnie Privilégiée des Ports de Cadix Mortgage Bond',
  'goetzmann0425': 'French Revolutionary Treasury Promissory Note',
  'goetzmann0426': 'French Royal Annuity Certificate',
  'goetzmann0427': 'Deutsches Reich Reichsbanknote',
  'goetzmann0428': 'Weimar Republic Reichsbanknote',
  'goetzmann0429': 'Chinese Republic Gold Bond',
  'goetzmann0430': 'Chinese Republic Lung-Tsing-U-Hai Railway Bond',
  'goetzmann0431': 'Kingdom of Bulgaria State Gold Loan Bond',
  'goetzmann0432': 'Russian General Oil Corporation Share Warrant',
  'goetzmann0433': 'Imperial Russian State Rente Certificate',
  'goetzmann0434': 'Russian-Norwegian Timber Industry Company Share',
  'goetzmann0435': 'Kremnica Municipal Bond',
  'goetzmann0436': 'Walchensee Loan Bond',
  'goetzmann0437': 'Seville–Jerez–Cadiz Railway Company Share',
  'goetzmann0438': 'Shanghai-Nanking Railway Net Profit Sub-Certificate',
  'goetzmann0440': 'Commercial Bank of Siberia Share',
  'goetzmann0441': 'Société Anonyme des Verreries d\'Extrême Orient Share',
  'goetzmann0442': 'Mongolian Mining Company Share',
  'goetzmann0443': 'Société Atlantique de Réassurances Share',
  'goetzmann0444': 'Belgian Enterprise Company Share',
  'goetzmann0445': 'Bulgarian Red Cross Society Lottery Bond',
  'goetzmann0446': 'Société de Lovitch des Produits Chimiques Share, 1st Emission',
  'goetzmann0447': 'Société de Lovitch des Produits Chimiques Share, 2nd Emission',
  'goetzmann0448': 'St. Petersburg Capital Lighting Company Share',
  'goetzmann0449': 'Kilo-Moto Gold Mines Share',
  'goetzmann0450': 'French-Peruvian Mining Company Share',
  'goetzmann0451': 'Egyptian Agricultural & Commercial Company Founder\'s Share',
  'goetzmann0452': 'Spassky Copper Mine Share Warrant',
  'goetzmann0453': 'Sixth Austrian War Loan Bond',
  'goetzmann0454': 'Eighth Austrian War Loan Bond',
  'goetzmann0455': 'Austrian Imperial State Bond',
  'goetzmann0458': 'Saint George Textile Company Share',
  'goetzmann0462': 'Egyptian Enterprise and Development Company Share Warrant',
  'goetzmann0465': 'Tontine Royale Subscription Contract',
  'goetzmann0466': 'Moscow & Russia Tramways Company Share',
  'goetzmann0467': 'Egyptian Government Irrigation Works Payment Order',
  'goetzmann0469': 'Unilever N.V. Option Certificate, No. 97790',
  'goetzmann0470': 'United States of Brazil Funding Bond',
  'goetzmann0472': 'Westchester & Philadelphia Rail Road Scrip',
  'goetzmann0473': 'Wisconsin Investment Company Stock Warrant',
  'goetzmann0474': 'Y. Rofé & Co.: Suez Canal Obligation Sale Agreement',
  'goetzmann0475': 'Deutsches Reich Treasury Note',
  'goetzmann0476': 'Eendracht Polder Bond',
  'goetzmann0477': 'Russian Gold Loan Coupon Sheet',
  'goetzmann0479': 'Chinese Imperial Government Gold Loan Bond (1903)',
  'goetzmann0481': 'Imperial Russian Gold Loan Bond',
  'goetzmann0483': 'Hamburg Lottery Ticket',
  'goetzmann0487': 'Dutch Certificate for Swedish Crown Debt',
  'goetzmann0488': 'Chinese Imperial Government Gold Loan Bond (1908)',
  'goetzmann0489': 'Hollandsche Garantie- & Trust Compagnie German Reich Certificate',
  'goetzmann0490': 'Royal Dutch Petroleum Stock Purchase Warrant, No. 015284',
  'goetzmann0492': 'Liverpool Corn Trade Association Debenture (Conditions)',
  'goetzmann0493': 'Liverpool Corn Trade Association Debenture',
  'goetzmann0498': 'Mexican Five Per Cent Deferred Stock Bond',
  'goetzmann0500': 'New York Per Cent Stock Certificate',
  'goetzmann0501': 'Lollenpolder en Hassendael Negotiatie Legal Agreement',
  'goetzmann0502': 'Unilever N.V. Option Certificate, No. 86786',
  'goetzmann0503': 'Negotiatie "Concordia Res Parvae Crescunt" Receipt',
  'goetzmann0504': 'Negotiatie "Concordia Res Parvae Crescunt" Receipt (Duplicate)',
  'goetzmann0508': 'Chinese Republic Lung-Tsing-U-Hai Railway Treasury Bill',
  'goetzmann0512': 'Republic of New Granada Deferred Bond',
  'goetzmann0513': 'Rjasan Uralsk Railway Company Certificate',
  'goetzmann0514': 'Rock Island Company Dutch Certificate',
  'goetzmann0515': 'Vereeniging tot Bevordering Lottery Loan Certificate',
  'goetzmann0518': 'Russian Perpetual Capital Certificate, 300 Rubles',
  'goetzmann0519': 'Russian Perpetual Capital Certificate, 50 Rubles Silver',
  'goetzmann0520': 'Hope & Co. Russian Certificate, 500 Rubles in Silver',
  'goetzmann0521': 'Hope & Co. Russian Certificate, 1000 Rubles in Bank Assignations',
  'goetzmann0522': 'Hamburg Russian Funds Certificate',
  'goetzmann0523': 'Hessian Rye-Coal Loan Bond',
  'goetzmann0524': 'Spanish Passive Stock Certificate',
  'goetzmann0525': 'Stadnitski & van Heukelom Russian Certificate',
  'goetzmann0526': 'London Stock Exchange WWI Good Delivery Certificate',
  'goetzmann0528': 'Dutch Deferred Debt Certificate',
  'goetzmann0530': 'Hessian Rye Loan Bond',
  'goetzmann0539': 'German Government International Loan Belgian Issue Bond',
  'goetzmann0547': 'Pekin Syndicate Bearer Certificate',
  'goetzmann0551': 'Portuguese External Debt Certificate',
  'goetzmann0553': 'New Russia Company Debenture',
  'goetzmann0555': 'New Russia Company Debenture Coupon Sheet',
  'goetzmann0556': 'Société Selim et Samaan Sednaoui Registered Shares',
  'goetzmann0558': 'Mexico Consolidated National Debt Bond',
  'goetzmann0561': 'Compagnie Impériale Chemins de Fer Ethiopiens Share',
  'goetzmann0562': 'Compagnie Impériale Chemins de Fer Ethiopiens Coupon Sheet',
  'goetzmann0564': 'Chinese Republic Railway Equipment Loan Treasury Note',
  'goetzmann0567': 'Costa Rica Railway Company Debenture (Conditions)',
  'goetzmann0568': 'Costa Rica Railway Company Debenture',
  'goetzmann0570': 'Bética Agricultural-Industrial Cooperative Mortgage Bond',
  'goetzmann0571': 'Bética Agricultural-Industrial Cooperative Mortgage Bond (Reverse)',
  'goetzmann0572': 'Chinese Republic Industrial Gold Loan Bond',
  'goetzmann0573': 'Chinese Republic Industrial Gold Loan Bond (Reverse)',
  'goetzmann0574': 'Chinese Republic Industrial Gold Loan Bond Coupon Sheet',
  'goetzmann0576': 'Republic of Peru Gold Bond',
  'goetzmann0580': 'Bulgarian Government Gold Loan Bond (1904)',
  'goetzmann0584': 'Bulgarian Government Gold Loan Bond (Conditions, 1904)',
  'goetzmann0588': 'Empire of Mexico External Public Debt Bond',
  'goetzmann0589': 'Uzinele de Fier și Domeniile din Resita Registered Shares',
  'goetzmann0591': 'Ottoman Government Prize Loan Bond',
  'goetzmann0593': 'California Mexico Land Company Land Certificate',
  'goetzmann0597': 'Chinese Government Sterling Treasury Note',
  'goetzmann0598': 'Chinese Government Reorganisation Gold Loan Bond',
  'goetzmann0599': 'Chinese Government Reorganisation Gold Loan Bond (Reverse)',
  'goetzmann0600': 'Colombian National Railway Company Debenture',
  'goetzmann0601': 'Compagnie de Colonisation Américaine Virginia & Kentucky Share, No. 4258',
  'goetzmann0602': 'Baragua Sugar Company Mortgage Gold Bond',
  'goetzmann0604': 'Confederate States Bond',
  'goetzmann0605': 'Connecticut Treasury Certificate',
  'goetzmann0610': 'Credit Foncier Cubain Bearer Obligation',
  'goetzmann0611': 'Connecticut Comptroller\'s Certificate, Five Pounds',
  'goetzmann0612': 'Connecticut Comptroller\'s Certificate, Five Shillings',
  'goetzmann0613': 'Denver & Rio Grande Railway Dutch Certificate',
  'goetzmann0615': 'Hope & Co. French Three Percent Funds Certificate',
  'goetzmann0616': 'Dutch Certificate for Russian Assignation Funds',
  'goetzmann0621': 'Compagnie de Colonisation Américaine Virginia & Kentucky Share, No. A/234',
  'goetzmann0623': 'Insurance Company of the State of Pennsylvania Stock Transfer',
  'goetzmann0624': 'Insurance Company of the State of Pennsylvania Stock Transfer Certificate',
  'goetzmann0630': 'Hope & Co. Russian Bank Assignation Funds Certificate',
  'goetzmann0631': 'Russian Public Debt (Assignation Funds) Certificate',
  'goetzmann0632': 'England War Loan Dutch Certificate',
  'goetzmann0633': 'Austrian Housing Lottery Bond',
  'goetzmann0634': 'City of Baku Bearer Bond',
  'goetzmann0635': 'Bolivian Interior Loan Bond',
  'goetzmann0636': 'Bolivian Government Trust Certificate for Bond',
  'goetzmann0637': 'Bolivian Public Debt Bond',
  'goetzmann0638': 'Kingdom of Yugoslavia Public Works Loan Bond',
  'goetzmann0639': 'Austro-Hungarian Bearer Bond',
  'goetzmann0640': 'Serbian Economic Development Loan Bond',
  'goetzmann0641': 'Bosnian Employment Loan Bond',
  'goetzmann0642': 'Imperial Brazil Loan Conversion Circular',
  'goetzmann0643': 'Hungarian Kingdom Annuity Loan Bond',
  'goetzmann0644': 'City of Budapest Obligation',
  'goetzmann0645': 'Province of Buenos Aires Gold Loan Bond',
  'goetzmann0646': 'Tungsram Share Certificate',
  'goetzmann0647': 'Zambezi Company Share Certificate',
  'goetzmann0648': 'Principality of Bulgaria State Mortgage Loan Bond',
  'goetzmann0649': 'Bulgarian State Mortgage Loan Coupon Strip',
  'goetzmann0650': 'Chrysler Corporation Dutch Certificate',
  'goetzmann0651': 'Republic of Colombia Funding Certificate',
  'goetzmann0652': 'Republic of Cuba External Gold Bond',
  'goetzmann0653': 'Czechoslovak State Bond',
  'goetzmann0654': 'Egyptian Credit Foncier Bearer Share',
  'goetzmann0657': 'Land Bank of Estonia Mortgage Bond',
  'goetzmann0658': 'Kingdom of Serbia Gold Loan Bond',
  'goetzmann0659': 'City of Berlin Municipal Loan Bond',
  'goetzmann0660': 'Kingdom of Greece Guaranteed Gold Loan Bond',
  'goetzmann0661': 'Native Guano Company Share Certificate',
  'goetzmann0662': 'Hungarian Mortgage Bank Prize Bond',
  'goetzmann0665': 'Principality of Bulgaria Hypothecary State Loan Bond, No. 023,156',
  'goetzmann0666': 'Principality of Bulgaria Hypothecary State Loan Bond, Nos. 069,185–069,186',
  'goetzmann0667': 'Imperial Russian Government Conversion Bond Talon',
  'goetzmann0668': 'Imperial Russian Government Conversion Bond',
  'goetzmann0669': 'Imperial Russian Government State Loan Bond, No. 196422',
  'goetzmann0670': 'Imperial Russian Government Gold Loan Bond, No. 277166',
  'goetzmann0671': 'Imperial Russian Government Gold Loan Bond, No. 277167',
  'goetzmann0672': 'Imperial Russian Government Nikolaevsky Railway Bond (1867)',
  'goetzmann0673': 'Imperial Russian Government Noble Land Bank Mortgage Note',
  'goetzmann0674': 'Moscow-Kiev-Voronezh Railway Bearer Bond',
  'goetzmann0675': 'Imperial Russian Government Nikolaevsky Railway Five Bonds Certificate',
  'goetzmann0676': 'Imperial Russian Government Consolidated Railway Bond',
  'goetzmann0677': 'Russian Provisional Government Liberty Loan Bond, 100 Rubles',
  'goetzmann0678': 'Imperial Russian Government Nikolaevsky Railway Bond (1869)',
  'goetzmann0680': 'Russian Provisional Government Liberty Loan Bond, 50 Rubles',
  'goetzmann0683': 'Insull Utility Investments Gold Debenture',
  'goetzmann0684': 'Middle West Utilities Company Common Stock Certificate',
  'goetzmann0685': 'West Shore Railroad Company First Mortgage Guaranteed Bond',
  'goetzmann0686': 'Kingdom of Yugoslavia International Stabilization Gold Loan Bond',
  'goetzmann0687': 'Kreuger & Toll Participating Debenture',
  'goetzmann0689': 'Republic of Peru National Railway Company Bond',
  'goetzmann0690': 'Republic of Peru National Railway Company Bond (Verso)',
  'goetzmann0691': 'Chilian Eastern Central Railway Company First Mortgage Gold Bond',
  'goetzmann0692': 'Chilian Eastern Central Railway Company First Mortgage Gold Bond (Verso)',
  'goetzmann0693': 'Kingdom of Serbia State Bond',
  'goetzmann0694': 'Kingdom of Serbia State Bond (Verso)',
  'goetzmann0696': 'Kingdom of Serbia Amortisable Bond',
  'goetzmann0697': 'Chinese Imperial Government Gold Loan Bond (1898, £100)',
  'goetzmann0698': 'Chinese Imperial Government Gold Loan Bond (Verso)',
  'goetzmann0699': 'Chinese Imperial Government Coupon Sheet (Upper Row)',
  'goetzmann0700': 'Chinese Imperial Government Coupon Sheet (Lower Row)',
  'goetzmann0701': 'Republic of Honduras Railway Loan Bearer Obligations',
  'goetzmann0702': 'Republic of Honduras Loan Bond (Verso)',
  'goetzmann0703': 'Republic of Bolivia Bearer Bond with Coupon Sheet',
  'goetzmann0705': 'City of Naples Unified Debt Bond',
  'goetzmann0707': 'Mexico Consolidated External Debt Bond',
  'goetzmann0708': 'Mexico Gold Treasury Bond',
  'goetzmann0710': 'Ottoman Damas-Hamah Railways Bond',
  'goetzmann0711': 'Ottoman Public Debt Bearer Receipt, No. 100,014',
  'goetzmann0712': 'Ottoman Public Debt Bearer Receipt, No. 125,515',
  'goetzmann0713': 'Republic of Peru Bearer Bond',
  'goetzmann0714': 'City of Warsaw Bearer Bond',
  'goetzmann0715': 'Republic of Poland Dollar Premium Loan Bond, No. 1222277',
  'goetzmann0716': 'Republic of Poland Dollar Premium Loan Bond, No. 1450669',
  'goetzmann0718': 'Portuguese External Fund Zero-Coupon Bond',
  'goetzmann0720': 'USSR State Loan Bond',
  'goetzmann0721': 'Imperial Russian Internal Lottery Bond',
  'goetzmann0722': 'City of Baku Municipal Loan Bond',
  'goetzmann0723': 'Imperial Russian Three Per Cent Loan Bond',
  'goetzmann0724': 'City of Bari Prize Loan Bond',
  'goetzmann0725': 'Romanian Monopoles Administration Stabilisation Loan Bond',
  'goetzmann0726': 'Romanian Monopoles Administration Stabilisation Loan Coupon Sheet',
  'goetzmann0728': 'Ottoman Public Debt Administration Bond (Reverse)',
  'goetzmann0730': 'Principality of Bulgaria Gold Loan Bond (Reverse)',
  'goetzmann0731': 'Ottoman Empire Unified Converted Debt Bond',
  'goetzmann0734': 'Principality of Bulgaria Gold Loan Bond',
  'goetzmann0735': 'Bulgaria Gold Loan Bond (Conditions)',
  'goetzmann0736': 'Province of Buenos Aires Interior Debt Bond',
  'goetzmann0737': 'Province of Buenos Aires Coupon Sheet',
  'goetzmann0738': 'Kingdom of Serbia Redemption Loan (Amortization and Coupons)',
  'goetzmann0912': 'Strand Bridge Company Share',
  'goetzmann0914': 'Derby Canal Company Share',
  'goetzmann0916': 'Hotel Waldorf-Astoria Corporation Specimen Share',
  'goetzmann0918': 'United States Radium Corporation Common Stock',
  'goetzmann0920': 'Nobino Seigai Partnership Share Certificate',
  'goetzmann0922': 'Shirai Dry Goods Store Bond Certificate',
  'goetzmann0924': 'Kokubun Petroleum Association Share Certificate',
  'goetzmann0926': 'Connecticut Land Company Certificate',
  'goetzmann0934': 'Unified Debt of Egypt Bearer Bond',
  'goetzmann0936': 'Chambre Imperiale et Royale d\'Assurance d\'Anvers Marine Insurance Policy',
  'goetzmann0946': 'Rancocus Toll-Bridge Share',
  'goetzmann0947': 'Chinese Imperial Government Tientsin-Pukow Railway Loan Bond',
  'goetzmann0949': 'Kousanie Tea Company Share Certificate',
  'goetzmann0951': 'Insurance Company of the State of Pennsylvania Share Transfer',
  'goetzmann0952': 'Liverpool Colquitt Street Tontine Share',
  'goetzmann0954': 'Mississippi Union Bank Bond',
  'goetzmann0955': 'Mississippi Union Bank Bond (Reverse)',
  'goetzmann0956': 'Forty Wall Street Corporation First Mortgage Sinking Fund Gold Bond',
  'goetzmann0959': 'Chanin Building First Mortgage Leasehold Bond',
  'goetzmann0961': 'Times Square Building First Mortgage Gold Bond',
  'goetzmann0964': '170 Broadway Building First Mortgage Leasehold Gold Bond',
  'goetzmann0966': 'Bulgarian Government Gold Loan Bond (1902)',
  'goetzmann0967': 'Bulgarian Government Gold Loan Bond (Conditions, 1902)',
  'goetzmann0968': 'Bulgarian Government Gold Loan Bond Talon',
  'goetzmann0969': 'Bulgarian Government Gold Loan Bond Talon (verso)',
  'goetzmann0970': 'Chinese Imperial Government Gold Loan Bond (1898, £25)',
  'goetzmann0971': 'Chinese Imperial Government Gold Loan Bond (Conditions)',
  'goetzmann0974': 'Exposition Coloniale Internationale Paris Lottery Bond',
  'goetzmann0975': 'Exposition Coloniale Internationale Paris Lottery Bond (Reverse)',
  'goetzmann0980': 'Grand Russian Railway Company Bond',
  'goetzmann0981': 'Grand Russian Railway Company Bond (Conditions)',
  'goetzmann0982': 'Grand Russian Railway Company Bond Coupon Sheet',
  'goetzmann0983': 'Grand Russian Railway Company Bond Coupon Sheet (French/English)',
  'goetzmann0984': 'Province of Nova Scotia Government Redeemable Stock',
  'goetzmann0985': 'Province of Nova Scotia Government Redeemable Stock Coupon Sheet',
  'goetzmann0986': 'Province of Nova Scotia Government Redeemable Stock (Conditions)',
  'goetzmann0987': 'Province of Nova Scotia Government Redeemable Stock Stubs',
  'goetzmann0988': 'Banque Industrielle de Chine Share',
  'goetzmann0989': 'Banque Industrielle de Chine Share (Reverse)',
  'goetzmann0990': 'East Egyptian Railways Bond',
  'goetzmann0991': 'East Egyptian Railways Bond (Conditions)',
  'goetzmann0992': 'East Egyptian Railways Bond Coupon Sheet',
  'goetzmann0993': 'East Egyptian Railways Bond Late Coupon Sheet',
  'goetzmann0996': 'Esterhazy Central Casse Partial Bond',
  'goetzmann0997': 'Esterhazy Central Casse Partial Bond (Conditions)',
  'goetzmann0998': 'USSR Third State Loan Bond',
  'goetzmann0999': 'USSR Third State Loan Bond (Conditions)',
  'goetzmann1000': 'USSR State Internal Lottery Loan Bond',
  'goetzmann1001': 'USSR State Internal Lottery Loan Bond (Conditions)',
  'goetzmann1002': 'Republic of China National Treasury Bond',
  'goetzmann1003': 'Republic of China Nationalist Government Lottery Bond',
  'goetzmann1004': 'Imperial Russian Government Consolidated Railroad Bond',
  'goetzmann1005': 'Imperial Russian Government Consolidated Railroad Bond (Conditions)',
  'goetzmann1006': 'Shanghai Taxi Company Stock Certificate',
  'goetzmann1007': 'Shanghai Taxi Company Stock Certificate (Reverse)',
  'goetzmann1008': 'Belgian Congo Company Share (Statutes)',
  'goetzmann1009': 'Belgian Congo Company Share Coupon Sheet',
  'goetzmann1010': 'Lippmann, Rosenthal & Co. Receipt for Russian Railway Bond Talons',
  'goetzmann1011': 'Lippmann, Rosenthal & Co. Receipt (Reverse)',
  'goetzmann1012': '170 Broadway Building First Mortgage Leasehold Gold Bond (Manufacturers Trust Version)',
  'goetzmann1013': '170 Broadway Building First Mortgage Leasehold Gold Bond Stub',
  'goetzmann1014': '170 Broadway Building First Mortgage Leasehold Gold Bond Coupon Sheet',
  'goetzmann1015': 'Tyler Building First Mortgage Gold Loan Bond',
  'goetzmann1018': 'Maplewood Suburban Home Company Mortgage Sinking Fund Bond',
  'goetzmann1032': 'North American Land Company Share Certificate',
  // Remaining rule failures
  'goetzmann0184': 'Continental Lottery Ticket Sales List',
  'goetzmann0186': 'Continental Lottery Ticket, Class the Third',
  'goetzmann0230': 'Kingdom of Greece Gold-Guaranteed Loan Bond',
  'goetzmann0236': 'Acts of Parliament, Anno Regni Georgii Regis Octavo (Page 1 of 38)',
  'goetzmann0237': 'Acts of Parliament, Anno Regni Georgii Regis Octavo (Page 2 of 38)',
  'goetzmann0293': 'Baltimore and Ohio Rail Road Company Preferred Stock',
  'goetzmann0317': 'Chicago, Rock Island and Pacific Railroad Company Gold Bond',
  'goetzmann0345': 'State of South Carolina Consolidation Bond',
  'goetzmann0369': 'Commonwealth of Pennsylvania Five Per Cent Stock',
  'goetzmann0375': 'Republic of Texas Government Bond',
  'goetzmann0378': 'Hungarian Fund Bond',
  'goetzmann0381': 'Imperial Russian Government: Perpetual Bond',
  'goetzmann0382': 'Japan Industrial Bank Savings Bond',
  'goetzmann0383': 'Japanese Wartime Patriotic Bond, 5 Yen',
  'goetzmann0384': 'Japanese Wartime Patriotic Bond, 10 Yen',
  'goetzmann0385': 'Kahetian Railway Company Bond',
  'goetzmann0386': 'Imperial Russian Government State Loan Bond, No. 116485',
  'goetzmann0387': 'Imperial Russian Government State Loan Bond, 4½%',
  'goetzmann0388': 'Securities Chain Declaration for De Woning Maatschappij Batavia Shares',
  'goetzmann0389': 'Royal Dutch Petroleum Stock Purchase Warrant, No. 015281',
  'goetzmann0390': 'Austrian Third War Loan Bond',
  'goetzmann0391': 'Russian-American Fur Company Share',
  'goetzmann0392': 'La Platense Flotilla Company Share Warrant',
  'goetzmann0395': 'Republic of China Lung-Tsing-U-Hai Railway Treasury Bill',
  'goetzmann0396': 'Merchants Insurance Company Share Transfer Certificate',
  'goetzmann0399': 'Mines d\'Or de Nam Kok Share',
  'goetzmann0400': 'Moscow-Kazan Railway Company Bond',
  'goetzmann0401': 'Morris Canal and Banking Company Stock Transfer Receipt',
  'goetzmann0402': 'New York Central and Hudson River Railroad Company Debt Certificate',
  'goetzmann0403': 'New York Central Rail Road Company Bond',
  'goetzmann0404': 'New York, New Haven and Hartford Railroad: Harlem River–Port Chester First Mortgage Gold Bond',
  'goetzmann0405': 'Nuovo Monte Sussidio Vacabile di Firenze Public Debt Certificate',
  'goetzmann0407': 'Norwich & Worcester Rail Road Company Bond',
  'goetzmann0415': 'Compagnie Universelle du Canal de Panama Provisional Share',
  'goetzmann0417': 'Peruvian Republic Congressional War Loan Certificate',
  'goetzmann0418': 'Philadelphia & West Chester Turnpike Road Company Blank Stock Certificate',
  'goetzmann0422': 'Portuguese External Debt Interest Certificate',
  'goetzmann0423': 'Kingdom of Serbia Prize Loan Bond',
  'goetzmann0424': 'Adelsverein Priority Bond',
  'goetzmann0457': 'New York Canal Stock Certificate',
  'goetzmann0460': 'The Common Fund Company Scrip',
  'goetzmann0468': 'Court of Chancery Injunction Bond',
  'goetzmann0683': 'Insull Utility Investments Gold Debenture',
  'goetzmann0685': 'West Shore Railroad Company First Mortgage Guaranteed Bond',
  'goetzmann0408': 'Spanish Colonial Government Payment Order',
  'goetzmann0409': 'Imperial Russian Internal Prize Loan',
  'goetzmann0456': 'Massachusetts Commonwealth Tax Certificate and Massachusetts-Bay Bill',
  'goetzmann0461': 'Commonwealth of Pennsylvania Land Warrant for Survey',
  'goetzmann0463': 'Bank of England Stock Transfer Receipt for the New Four per Cent Annuities',
  'goetzmann0484': 'Connecticut Comptroller\'s Interest Receipt',
  'goetzmann0485': 'Compagnie Française Lijfrente Subscription Record',
  'goetzmann0486': 'Hope & Co. Certificate for Russian Bonds',
  'goetzmann0491': 'Compagnie des Indes Share Transfer Authorization',
  'goetzmann0494': 'Dutch Notarial Certificate for Bank of England Consolidated Annuities',
  'goetzmann0497': 'Massachusetts Bay Interest-Bearing State Note',
  'goetzmann0499': 'Share Subscription Contract for the Ostend Company',
  'goetzmann0506': 'Potosian Land Grant',
  'goetzmann0507': 'Amsterdam Securities Price List',
  'goetzmann0509': 'Middelburg Plantation Bond for Essequibo and Demerara',
  'goetzmann0510': 'French Life Annuity on Four Million Livres',
  'goetzmann0511': 'French Life Annuity on One Head',
  'goetzmann0516': 'Imperial Russian State Perpetual Income Certificate',
  'goetzmann0517': 'Imperial Russian Public Debt Commission Inscription',
  'goetzmann0527': 'United States Treasury Funded Debt Certificate',
  'goetzmann0533': 'Suriname Plantation Loan Conditions',
  'goetzmann0534': 'Vlaardingen Orphanage Lottery Loan Conditions',
  'goetzmann0535': 'Voor den Armen (For the Poor) Charitable Bond',
  'goetzmann0536': 'Willem, Prince of Orange-Nassau: Dutch Princely Bond',
  'goetzmann0537': 'Kingdom of Sweden Royal Loan Bond',
  'goetzmann0538': 'Habsburg Royal Bond',
  'goetzmann0540': 'Potosian Land Grant (Reverse)',
  'goetzmann0541': 'Dutch Essequibo Plantation Negotiatie',
  'goetzmann0542': 'French Bourbon Princes in Exile Bond',
  'goetzmann0543': 'Ricardo & De Lara: Forward Contract for British Consolidated Stock',
  'goetzmann0544': 'Essequibo & Demerara Plantation Loan Conditions',
  'goetzmann0545': 'Essequibo & Demerara Plantation Negotiation Conditions',
  'goetzmann0546': 'Russian Imperial Perpetual Income Obligation',
  'goetzmann0549': 'Vlaardingen Orphanage Negotiatie Prospectus',
  'goetzmann0550': 'Gemeente Warnsveld Municipal Loan Certificate',
  'goetzmann0603': 'Suriname Plantation Fund Conditions',
  'goetzmann0606': 'Dutch Life Annuity Tontine Conditions',
  'goetzmann0607': 'Suriname Plantation Negotiatie Conditions',
  'goetzmann0608': 'Heshuysen & Compagnie / James Balmer: Dominica Plantation Mortgage (December 1777)',
  'goetzmann0609': 'Heshuysen & Compagnie / James Balmer: Dominica Plantation Mortgage (March 1777)',
  'goetzmann0614': 'German External Loan (Dawes-Anleihe) Swiss Issue Bond',
  'goetzmann0617': 'German External Loan (Dawes-Anleihe) Rights Certificate',
  'goetzmann0618': 'German Government International Loan (Young Plan) Dollar Gold Bond',
  'goetzmann0619': 'German Government International Loan (Young Plan) French Bearer Bond',
  'goetzmann0620': 'United States Treasury Debt Certificate',
  'goetzmann0622': 'French Forced Loan Receipt',
  'goetzmann0625': 'Massachusetts Bay Consolidated Note',
  'goetzmann0626': 'United States Loan Office Debt Certificate',
  'goetzmann0627': 'French Royal Treasury Receipt',
  'goetzmann0628': 'Piscataqua Bridge Corporation Share Certificate',
  'goetzmann0629': 'Caisse d\'Épargnes Lafarge Tontine Share',
  'goetzmann0655': 'Bank of England Transfer Receipt for Consolidated Annuities',
  'goetzmann0656': 'Bank of England Letter of Attorney for Consolidated Annuities',
  'goetzmann0663': 'Bank of England Transfer Receipt for India Stock (1886)',
  'goetzmann0664': 'Bank of England Transfer Receipt for India Stock (1889)',
  'goetzmann0679': 'Sallie Mae Yield Curve Note',
  'goetzmann0681': 'Republic of Texas Consolidated Fund Stock Certificate',
  'goetzmann0682': 'Mississippi State Bonds Deposit Certificate',
  'goetzmann0688': 'Latin American Government Bond Coupon Sheet',
  'goetzmann0695': 'Kingdom of Serbia Bond Amortization Lottery Plan',
  'goetzmann0704': 'Monte del Sale di Firenze Share Transfer',
  'goetzmann0706': 'Liberian Government External Loan Arrear Interest Certificate',
  'goetzmann0709': 'Ottoman Public Debt Provisional Receipt',
  'goetzmann0717': 'Portugal External Debt Provisional Certificate',
  'goetzmann0719': 'Hope & Co. Certificate of Russian Bank Assignations',
  'goetzmann0900': 'Mecklenburg-Vorpommern City Bond',
  'goetzmann0904': 'Silesian Loan of Holy Roman Emperor Karl VI',
  'goetzmann0908': 'Commerce d\'Asie & d\'Afrique (Trieste Company)',
  'goetzmann0909': 'The Caracas Company (Real Compañía Guipuzcoana de Caracas)',
  'goetzmann0910': 'Swedish West-India Company',
  'goetzmann0915': 'Société Toulousaine du Bazacle Share',
  'goetzmann0930': 'Colonial Connecticut Land Indenture',
  'goetzmann0931': 'Share Receipt for Garphytte Iron and Alum Works',
  'goetzmann0941': 'French Consular Certificate of Egyptian Financial Document',
  'goetzmann0943': 'Dutch Negotiation Contract Subscriber List',
  'goetzmann0953': 'Compagnie du Pont de la Mulatière Share',
  'goetzmann1021': 'Dutch East India Company (VOC) Middelburg Chamber Obligation Receipts',
  'goetzmann1022': 'Hoogheemraadschap van den Lekdijk Bovendams Rentebrief',
  'goetzmann1023': '18th-Century Dutch Manuscript Bond with Transfer Endorsements',
  'goetzmann1024': '18th-Century Dutch Manuscript Bond (Verso)',
  'goetzmann1025': 'Da Ming Tong Xing Bao Chao (Great Ming Circulating Treasure Note)',
  'goetzmann1026': 'Da Ming Tong Xing Bao Chao (Verso)',
  'goetzmann1027': 'Monte di Pietà di Firenze Bond Certificate (1647)',
  'goetzmann1028': 'De Woning-Maatschappij, Batavia Bearer Share',
  'goetzmann1029': 'Ostend Company Share Subscription Receipt',
  'goetzmann1030': 'Ostend Company Payment Receipt',
  'goetzmann1031': 'Monte di Pietà di Firenze Bond Certificate (c. 1622)',
  'goetzmann1033': 'French Joint-Stock Company Constitution',
  'goetzmann1034': 'Middelburg Plantation Bond for Essequebo and Demerara',
  'goetzmann1035': 'French Royal Annuity Bond',
  'goetzmann1036': 'Russian Imperial Perpetual Income Bond',
  'goetzmann1037': 'Republic of Texas Texian Loan Bond',
  'goetzmann1038': 'Continental Bill of Exchange',
};

// Common foreign function words — if pre-paren text has ≥2, treat as foreign title
const FOREIGN_WORDS = /\b(van|de|het|en|voor|der|aan|bij|tot|op|een|ze|ze|den|des|ter|ten|und|die|das|für|von|mit|auf|du|la|le|les|une|un|des|sur|pour|par|au|aux|et|ou|si|se|et|av|på|til|af|og|til|som|med|om|i|er|ved|pr|pr|por|del|dels|los|las|el|un|una|nos|à|ot|za|na|vy|al)\b/gi;

// English financial document keywords
const ENG_DOC = /\b(Bond|Certificate|Share|Receipt|Note|Warrant|Debenture|Obligation|Loan|Trust|Fund|Stock|Bill|Draft|Mortgage|Annuity|Tontine|Coupon|Prospectus|Indenture|Letter|Invoice|Ledger|Subscription|Contract|Agreement|Deposit|Policy|Deed|Register|Pamphlet|Correspondence|Illustration|Banknote|Check|Lottery|Dividend|Transfer|Authorization|Conditions|Regulations|Inventory|Project|Regulations|Circular|Scrip|Talon|Cedula|Assignat|Receipt)\b/i;

function foreignWordCount(text) {
  const m = text.match(FOREIGN_WORDS);
  return m ? m.length : 0;
}

function simplify(id, title) {
  if (OVERRIDES[id]) return OVERRIDES[id];

  let t = title.trim();

  // 1. Non-ASCII foreign title + (English translation) — extract English
  if (/[^\x00-\x7F]/.test(t)) {
    const m = t.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
    if (m && ENG_DOC.test(m[2]) && !/^ca\.\s*\d|^\d{3,}|^Ptolem|^Byz/i.test(m[2])) {
      t = m[2];
    } else {
      // Multi-clause: extract first paren if it looks like translation
      const m2 = t.match(/^(.+?)\s*\(([^)]+)\)/);
      if (m2 && ENG_DOC.test(m2[2]) && m2[2].length > 8 && !/^\d|^ca\./i.test(m2[2])) {
        t = m2[2] + t.slice(t.indexOf(m2[0]) + m2[0].length);
      }
    }
  }

  // 2. Latin-charset foreign title + (English) — detect via foreign word count
  {
    const m = t.match(/^([^(]{10,}?)\s*\(([^)]{10,})\)\s*$/);
    if (m && foreignWordCount(m[1]) >= 2 && ENG_DOC.test(m[2]) && !/^\d|^ca\./i.test(m[2])) {
      t = m[2];
    }
  }

  // 3. (Page X of Y)
  t = t.replace(/\s*\(Page \d+ of \d+\)/gi, '');

  // 4. Status tags: [Cancelled], CANCELLED, SPECIMEN, [Surrendered], [Redeemed] at end
  t = t.replace(/\s*\[(Cancelled|Surrendered|Redeemed|Voided?)[^\]]*\]/gi, '');
  t = t.replace(/,?\s*CANCELLED\b/gi, '');
  t = t.replace(/,?\s*SPECIMEN\b/gi, '');

  // 5. – Cover / – Back / – Front / – Title Page
  t = t.replace(/\s*[–-]\s*(Cover|Title Page|Front Cover|Back Cover|Front)\s*$/i, '');

  // 6. United States / State of prefix
  t = t.replace(/^United States of America[:\s]+/i, '');
  t = t.replace(/^United States\s+/i, '');
  t = t.replace(/^State of\s+/i, '');

  // 7. Author "Surname, The/A/An..." (single capitalized word before comma + English article)
  t = t.replace(/^([A-Z][a-zÀ-ÿ'-]{2,}),\s+(?=The |A |An )/g, '');

  // 8. Two-word personal name before colon (not org names — skip if contains &, Co, Company, etc.)
  t = t.replace(/^([A-Z][a-z]+ [A-Z]\.\s*[A-Z][a-z]+):\s+/g, '');  // "Thomas C. Jenkins: ..."
  t = t.replace(/^([A-Z][a-z]+\s+[A-Z][a-z]+):\s+(?=[A-Z])/g, (m, name) => {
    if (/\b(Co|Comp|Bank|Corp|Ltd|Company|House|Brothers|Bros|Sons|Trust|Rail|Road|Railway)\b/.test(name)) return m;
    return '';
  });

  // 9. (No. XXX, date) parentheticals
  t = t.replace(/\s*\(No\.\s*[\w,.-]+[^)]*\)/g, '');

  // 10. Trailing serial: "No. XXXXX" / ", No. XXXXX"
  t = t.replace(/,\s*No\.\s*[\w,.-]+(?:\s*[\w,.-]+)?(?=\s*,|\s*$)/g, '');
  t = t.replace(/,\s*Nos?\.\s*[\w,. -]+$/g, '');

  // 11. Series identifiers
  t = t.replace(/,\s*(?:[IVXLC]+\s*)?Series\s+[\w,.]+(?:\s+No\.\s*[\w,.]+)?/gi, '');
  t = t.replace(/,\s*Serie[sn]?\s+[\w,.]+/gi, '');

  // 12. Percentage rates
  t = t.replace(/^\d+[½¼¾]?%\s+/g, '');             // leading
  t = t.replace(/,?\s*at\s+\d+[½¼¾]?%/gi, '');       // ", at 6%"
  t = t.replace(/,\s*\d+[½¼¾]?%(?!\s*per\s*Cent)/gi, ''); // ", 5%" (not "5% per Cent")
  t = t.replace(/\s+\d+[½¼¾]?%(?!\s*per)\s*/gi, ' ');

  // 13. Dollar amounts
  t = t.replace(/,?\s*\$[\d,]+(?:\.\d+)?(?:\s*(?:US\s*)?Gold)?/g, '');

  // 14. Pound amounts (keep "£X per Cent." which is a security name)
  t = t.replace(/,\s*£[\d,. ]+\s*Sterling(?!\s+Bond|\s+Bearer)/gi, '');
  t = t.replace(/,\s*£[\d,. ]+(?!\s*per\s*Cent|Sterling\s+Bond|Sterling\s+Bearer)/gi, '');
  t = t.replace(/\s+£[\d,.]+(?!\s*per\s*Cent)/gi, '');

  // 15. Dutch guilder/florin
  t = t.replace(/,?\s*f\.\s*[\d,]+/g, '');
  t = t.replace(/,?\s*ƒ[\d,]+/g, '');

  // 16. Rouble/Franc/Mark/Krone/other amounts
  t = t.replace(/,\s*[\d,]+\s*(?:Roubles?|Rubles?|Francs?|Frs\.|Leva|Dinars?|Drachmas?|Pesos?|Florins?|Guilden|Gulden|Mark|Marks?|Kronen?|Kron[ao]r?|Krooni?|Livres?|Pesetas?|Lire?|Soles?|Pengő|Réis|Zlotys?|Yuan|Yen|Kronor)\b/gi, '');
  t = t.replace(/,?\s*K\s*[\d,]+/g, '');
  t = t.replace(/,?\s*LE\.\d+/g, '');

  // 17. Combined equivalents: "189 Roubles = £20 = 504 Francs"
  t = t.replace(/,?\s*[\d,]+\s*\w+\s*(?:=\s*[\w£$,.]+\s*)+/g, '');

  // 18. Ordinal class qualifiers
  t = t.replace(/,\s*Class\s+the\s+\w+/gi, '');
  t = t.replace(/,\s*\d+(?:st|nd|rd|th)\s+Tontine/gi, '');

  // 19. City + date at end
  t = t.replace(/,\s*[A-Z][a-zÀ-ÿ'-]+(?:,\s*[A-Z][a-zA-Z\s]+)?,\s*(?:ca\.\s*)?(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+,\s*\d{4}$/i, '');
  t = t.replace(/,\s*[A-Z][a-zÀ-ÿ'-]+(?:,\s*[A-Z][a-zA-Z]+)?,\s*(?:ca\.\s*)?\d{4}(?:-\d{4})?$/g, '');
  t = t.replace(/\s*\([A-Z][a-zÀ-ÿ'-]+,\s*(?:ca\.\s*)?\d{4}(?:-\d{4})?\)/g, '');

  // 20. Trailing year
  t = t.replace(/,\s*\d{4}(?:-\d{4})?\.?\s*$/g, '');
  t = t.replace(/\s*\(\d{4}(?:-\d{4})?\)\s*$/g, '');

  // 21. "Prospectus" / "Conditions" separated by colon
  t = t.replace(/:\s*(Prospectus|Conditions|Regulations)$/i, ' $1');

  // 22. "X Shares at Each" / "at Per Annum" fragments left by amount stripping
  t = t.replace(/\s+at\s+(Each|Per\s+Annum)\b/gi, '');
  t = t.replace(/\s+Each\b/gi, '');

  // 23. Cleanup
  t = t.replace(/\s*[,;:]\s*$/, '');
  t = t.replace(/\s+/g, ' ').trim();
  t = t.replace(/^[,\s–-]+/, '').trim();

  return t;
}

const data = JSON.parse(fs.readFileSync('data/museum-data.json', 'utf8'));
const proposals = [];
const unchanged = [];

for (const item of data) {
  const s = simplify(item.id, item.title);
  if (s && s !== item.title) {
    proposals.push({ id: item.id, old: item.title, new: s });
  } else if (!s) {
    proposals.push({ id: item.id, old: item.title, new: '⚠️ EMPTY — REVIEW', flag: true });
  } else {
    unchanged.push(item.id);
  }
}

fs.writeFileSync('title_proposals.json', JSON.stringify(proposals, null, 2), 'utf8');
console.log(`${proposals.length} changed, ${unchanged.length} unchanged.`);
