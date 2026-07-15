const xlsx = require('../node_modules/xlsx');
const path = 'C:/Users/ks2479/Documents/GitHub/oov-museum/oov_data_new.xlsx';

const wb = xlsx.readFile(path);
const ws = wb.Sheets['Documents'];
const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

const headers = data[0];
const col = {};
headers.forEach((h, i) => { col[h] = i; });

function set(rowIdx, field, value) {
  if (col[field] === undefined) return;
  data[rowIdx][col[field]] = value;
}

// --- Fix rows 20-26: update Turkze Rovers total pages from [TBD] to 8 ---
for (let i = 20; i <= 26; i++) {
  set(i, 'numberPages', 8);
  const desc = data[i][col['description']];
  if (desc) data[i][col['description']] = desc.replace('of [TBD]', 'of 8');
  set(i, 'notes', 'From Het Groote Tafereel der Dwaasheid (1720) or related collection. 8 pages total (goetzmann0020-0027).');
}

// --- goetzmann0027: Final page of Project tot het ruineeren der Turkze Rovers ---
set(27, 'title', 'Project tot het ruineeren der Turkze Rovers van Miers, Tunis, Tripoly en Sale (Project for the Ruin of the Turkish Pirates of Algiers, Tunis, Tripoli and Sale)');
set(27, 'description', 'Page 8 of 8 – The final page of the anti-piracy pamphlet concludes the argument with a summary of the proposed project\'s merits and the expected benefits to Dutch commerce and national security. The page ends with a formal list of signatories, including names such as T. Wensema Jr., C. Zebreur, A. v. D\'Aen, Hans Clifford, Carol C. nande Patten, and Joan Zinman, lending the document an air of official endorsement and civic credibility. The inclusion of named sponsors was a common device in early modern Dutch commercial proposals to reassure prospective investors of the scheme\'s legitimacy and the seriousness of its promoters. This concluding page transforms the pamphlet from an anonymous policy argument into a seemingly accountable commercial proposal backed by identifiable individuals. As a document preserved in the context of the 1720 Dutch speculative bubble, it illustrates the full rhetorical apparatus deployed to attract investment, from the initial argument through to the authorizing signatures.');
set(27, 'type', 'Pamphlet');
set(27, 'subjectCountry', 'Netherlands');
set(27, 'issuingCountry', 'Netherlands');
set(27, 'creator', 'T. Wensema Jr. and others');
set(27, 'issueDate', '1720-01-01');
set(27, 'language', 'Dutch');
set(27, 'numberPages', 8);
set(27, 'period', '18th Century or before');
set(27, 'notes', 'From Het Groote Tafereel der Dwaasheid (1720) or related collection. 8 pages total (goetzmann0020-0027).');

// --- English South Sea Bubble Playing Cards (goetzmann0028-0078) ---
// Shared fields for all English bubble cards
const bubbleBase = {
  type: 'Illustration',
  subjectCountry: 'Great Britain',
  issuingCountry: 'Great Britain',
  creator: 'Anonymous',
  issueDate: '1720-01-01',
  language: 'English',
  numberPages: 1,
  period: '18th Century or before',
  notes: 'From the South Sea Bubble Playing Card deck, ca. 1720 (England)',
};

const cards = [
  // row 28: goetzmann0028
  { row: 28,
    title: 'Temple Mills (South Sea Bubble Playing Card, King of Diamonds)',
    desc: 'A playing card from the English South Sea Bubble satirical deck depicting Temple Mills, showing workers at a water mill with figures carrying sacks while a king of diamonds is inset in the upper left corner. The satirical verse reads: "By these Old Mills, Strange Wonders have been done / Numbers have Suffer\'d, yet they Still Work on; / Then tell us which have done the Greater Ills, / The Temple Lawyers, or the Temple Mills." The card draws a sardonic comparison between the exploitative practices of lawyers practicing at the Temple in London and a fraudulent speculative venture promoting the Temple Mills site as an investment opportunity. The South Sea Bubble playing card deck was published around 1720 to mock the proliferation of speculative schemes and the gullibility of investors during the financial frenzy that preceded the collapse of the South Sea Company. Each card in the deck depicts a different fraudulent or impractical scheme, using satirical verses and engraved illustrations to ridicule both the promoters and their victims.' },

  // row 29: goetzmann0029
  { row: 29,
    title: 'Puckle\'s Machine (South Sea Bubble Playing Card, Nine of Spades)',
    desc: 'A playing card depicting James Puckle\'s multi-shot rotating cannon patent of 1718, showing a demonstration scene in which bystanders are struck by the weapon while a gunner operates it from a distance, with diagrams of the gun\'s chambers labeled "Round Bullets against Christians" and "Square Bullets against Turks" visible at the top. The satirical verse reads: "A rare invention to Destroy the Crowd, / Of Fools at Home instead of Foes Abroad, / Fear not my Friends, this terrible Machine, / They\'re only Wounded that have Shares therein." Puckle\'s Machine Company was one of the most notorious of the 1720 speculative bubbles, raising capital on the promise of a revolutionary weapon that was never effectively produced or deployed in battle. The card\'s absurd premise—that the machine was more dangerous to investors than to enemies—exemplifies the satirist\'s critique of speculative ventures that promised military and commercial revolution but delivered only financial ruin. The nine of spades pips identify this card\'s position in the South Sea Bubble playing card deck.' },

  // row 30: goetzmann0030
  { row: 30,
    title: 'An Inoffensive Way of Emptying Houses of Office (South Sea Bubble Playing Card, King of Spades)',
    desc: 'A playing card satirizing a scheme for emptying cesspools and privies in a socially acceptable manner, depicting workers carrying buckets and barrels through a London street while a woman empties a chamber pot from a window above and onlookers observe from a crowd. The verse reads: "Our fragrant Bubble, would the World believe it, / Is to make Humane Dung, Smell Sweet as Civet: / None Sure before us, ever durst presume, / To turn a T—d, into a Rich Perfume." The image reflects the extraordinary range of fraudulent schemes promoted during the South Sea Bubble, many of which proposed to profit from mundane or unsavory activities presented in the language of commercial enterprise. The scatological humor underscores the satirist\'s point that investors were willing to put their money into any scheme, however absurd, during the speculative frenzy of 1720. The king of spades inset in the upper left identifies this card\'s position in the South Sea Bubble playing card deck.' },

  // row 31: goetzmann0031
  { row: 31,
    title: 'Bastard Children (South Sea Bubble Playing Card, Queen of Spades)',
    desc: 'A playing card satirizing a scheme for the maintenance and employment of illegitimate children, depicting a street scene in which a gentleman interacts with women and children outside a doorway while a crowd assembles in the background and a queen of spades is inset in the upper left. The verse reads: "Love on ye jolly Rakes, and buxome Dames, / A Child is Safer than venereal Flames; / Indulge your Senses, with the Sweet offence, / We\'ll keep your Bastards at a Small expence." The card mocks both investors who subscribed to this scheme and the broader moral climate of the Bubble era, in which speculative ventures were promoted under the guise of social improvement. The combination of sexual satire and financial critique is characteristic of the robust popular print culture of early eighteenth-century Britain. The queen of spades inset identifies the card\'s position in the South Sea Bubble satirical deck.' },

  // row 32: goetzmann0032
  { row: 32,
    title: 'Raddish Oil (South Sea Bubble Playing Card, Spades)',
    desc: 'A playing card satirizing a scheme to extract oil from radishes, depicting workers in a field harvesting and processing the crop while a town is visible in the background, with a court card figure in the upper left corner. The verse reads: "Our Oily project, with the Gaping Town, / Will Surely for a time go Smoothly down, / We Son and Press, to carry on the Cheat, / To Bite Change Alley is not Fraud but Wit." The card mocks a speculative venture premised on the commercial extraction of oil from radishes, an impractical scheme emblematic of the many fraudulent enterprises promoted on Change Alley during the 1720 South Sea Bubble. The verse\'s frank admission that deceiving investors at Change Alley is "not Fraud but Wit" captures the cynical attitude of company promoters during the bubble era. The spades suit inset identifies this card\'s position in the South Sea Bubble playing card deck.' },

  // row 33: goetzmann0033
  { row: 33,
    title: 'Whale Fishery (South Sea Bubble Playing Card, King of Hearts)',
    desc: 'A playing card depicting a whale fishery scheme, showing two ships at sea pursuing a diving whale with rowing boats and crew attempting to harpoon the creature in choppy waters. The satirical verse reads: "Whale Fishing, which was once a gainfull Trade, / Is now by cunning Heads, a Bubble made; / For round the Change they only Spread their Sailes, / And to catch Gudgeons, bait their Hooks with Whales." The image satirizes the conversion of a legitimate maritime industry into a fraudulent speculative venture promoted on Exchange Alley during the 1720 South Sea Bubble. The verse\'s reference to "Gudgeons" (a small fish easily caught) is contemporary slang for gullible investors, extending the fishing metaphor to the investors themselves. The king of hearts inset identifies the card\'s position in the South Sea Bubble playing card deck.' },

  // row 34: goetzmann0034
  { row: 34,
    title: 'Cureing Tobacco for Snuff (South Sea Bubble Playing Card, Queen of Hearts)',
    desc: 'A playing card depicting a tobacco curing and snuff manufacturing scheme, showing an enslaved African woman grinding tobacco in a mortar while a European overseer stands nearby holding a document, with mountains and a town visible in the background. The verse reads: "Here Slaves for Snuff, are Sifting Indian Weed, / Whilst their O\'erseer, does the Riddle feed; / The Dust arising, gives their Eyes much trouble, / To shew their Blindness that Espouse the Bubble." The image is notable for its explicit depiction of enslaved labor as the basis of the speculative scheme, directly connecting the South Sea Bubble to the broader colonial economy and the transatlantic slave trade. The verse\'s metaphor of blindness applies equally to the enslaved workers (blinded by tobacco dust) and the investors who fail to recognize that they are being defrauded. The queen of hearts inset identifies the card\'s position in the South Sea Bubble playing card deck.' },

  // row 35: goetzmann0035
  { row: 35,
    title: 'Holy Island - Salt (South Sea Bubble Playing Card, Hearts)',
    desc: 'A playing card depicting a salt extraction scheme at Holy Island (Lindisfarne), showing workers digging in muddy terrain near a salt flat or evaporation pond, with two figures working alongside and another lying prone in the foreground. The verse reads: "Here by mixt Elements of Earth and Water, / They make a Mud, that turns to Salt herea\'ter; / To help the Project on among Change Dealers / May all bad Wives like Lot\'s become Salt-Pillars / Since crowds of Fools delight to be Salt-Sellers." The card satirizes a speculative venture to extract salt from the tidal flats around Holy Island off the Northumberland coast, emblematic of the many impractical natural resource projects promoted during the 1720 Bubble. The biblical reference to Lot\'s wife turning into a salt pillar adds a layer of religious satire to the financial critique. The hearts suit inset identifies this card\'s position within the South Sea Bubble playing card series.' },

  // row 36: goetzmann0036
  { row: 36,
    title: 'Furnishing of Funerals to all parts of Great Britain (South Sea Bubble Playing Card, Queen of Diamonds)',
    desc: 'A playing card satirizing a scheme to provide funeral services throughout Great Britain, depicting a funeral procession winding through a rural landscape toward a church, with pall-bearers, mourners in black, and a hearse drawn by horses. The satirical verse reads: "Come all ye Sickly Mortals Die apace, / And Solemn Pomps your Funerals Shall Grace, / Old Rusty Hackneys Shall attend each Hearse, / And Soare-Crows in Black Gowns compleat the Farce." The card mocks both the morbid commercialization of death and the gullibility of investors who subscribed to this and similar impractical nationwide service schemes during the South Sea Bubble. The image of scarecrows dressed as clergymen attending funerals satirizes the pretensions of the company\'s promises of dignified and universal service. The queen of diamonds inset identifies this card\'s position in the South Sea Bubble playing card deck.' },

  // row 37: goetzmann0037
  { row: 37,
    title: 'Corral Fishery (South Sea Bubble Playing Card, Diamonds)',
    desc: 'A playing card depicting a coral fishing scheme, showing workers harvesting coral from rocky outcrops along a coastline while a large three-masted sailing ship lies at anchor in the background. The verse reads: "Corral that Beautious product only found, / Beneath the Water, and above the Ground, / If Fish\'d for as it ought, from thence might Spring, / A Neptunes Pallace for a British King." The image satirizes a speculative company formed to harvest Mediterranean coral, a commodity with genuine commercial value that was nonetheless used as the basis for fraudulent investment promotion during the 1720 South Sea Bubble. The grandiose promise of building a "Neptune\'s Palace" for the British king exemplifies the extravagant claims made by company promoters in this period. The diamonds suit inset identifies this card\'s position in the South Sea Bubble satirical deck.' },

  // row 38: goetzmann0038
  { row: 38,
    title: 'Irish Sail Cloath (South Sea Bubble Playing Card, King of Clubs)',
    desc: 'A playing card depicting a scheme for manufacturing sail cloth in Ireland, showing a textile workshop interior with workers operating looms and stretching finished cloth, with a king of clubs inset in the upper left corner. The verse reads: "If Good St. Patricks Friends should raise a Stock, / And make in Irish Looms true Holland\'s Duck, / Then shall this Noble Project by my Shoul / No longer be a Bubble, but a Bull." The card satirizes a scheme to manufacture high-quality Dutch-style linen ("Holland\'s Duck") for sails using Irish labor and capital, playing on Irish national identity and the commercial appeal of domestic textile production. The verse\'s pun on "Bull" (both an Irish expression and a market term for rising stocks) exemplifies the financial wordplay characteristic of the bubble card genre. The king of clubs inset identifies this card\'s position in the South Sea Bubble playing card deck.' },

  // row 39: goetzmann0039
  { row: 39,
    title: 'Lending Money upon Bottom-Ree (South Sea Bubble Playing Card, Queen of Clubs)',
    desc: 'A playing card satirizing maritime bottomry loans ("Bottom-Ree"), showing a harbor scene in which two merchants negotiate at a waterfront table while a ship is being loaded and a lighthouse rises in the background. The verse reads: "Some lend their Money for the sake of More, / And Others borrow to Encrease their Store; / Both these do oft Engage in Bottom Ree, / But Curse Sometimes the Bottome of the Sea." The card mocks the speculative use of bottomry—a form of maritime loan secured against a ship and cargo—as the basis for fraudulent investment schemes during the 1720 Bubble. The pun on "Bottome of the Sea" satirizes both the commercial riskiness of maritime lending and the fate awaiting investors once the bubble collapsed. The queen of clubs inset identifies the card\'s position in the South Sea Bubble satirical deck.' },

  // row 40: goetzmann0040
  { row: 40,
    title: 'The Freeholder (South Sea Bubble Playing Card, Clubs)',
    desc: 'A playing card satirizing a scheme to purchase freeholds from indebted landowners, showing an interior office scene in which a crowd of gentlemen queue before a counter where clerks are processing transactions. The verse reads: "Come all ye Spendthrift Prodigals, that hold / Free Land and want to turn the Same to Gold; / We\'ll Buy your all, provided you\'ll agree / To Drown your Purchase Money in South Sea." The card directly references the South Sea Company, mocking a scheme that promised to convert illiquid landed property into South Sea stock at the height of the bubble. The image of prodigal landowners surrendering their estates in exchange for speculative paper captures the financial frenzy that gripped British landowning society in 1720. The clubs suit inset identifies this card\'s position in the South Sea Bubble playing card deck.' },

  // row 41: goetzmann0041
  { row: 41,
    title: 'River Douglas (South Sea Bubble Playing Card, Spades)',
    desc: 'A playing card depicting a scheme to make the River Douglas in Lancashire navigable, showing workers engaged in canal building and rock excavation along a waterway with a town visible in the misty background, with a red wax seal or stamp partially obscuring the card rank indicator in the upper left. The verse reads: "Since Bubbles came in vogue, new Arts are found, / To cut thro\' Rocks, and level rising Ground, / That murm\'ring Waters, may be made more Deep, / To drown the Knaves, and lul the Fools asleep." River navigation improvement schemes were among the more technically plausible speculative ventures of the early eighteenth century, as improved inland waterways could genuinely reduce transportation costs for coal and other goods. The verse mocks company promoters ("Knaves") and their victims ("Fools") with the image of both groups drowning in the very waters the scheme proposed to improve. The red stamp in the upper left corner may indicate a collection mark or provenance stamp.' },

  // row 42: goetzmann0042
  { row: 42,
    title: 'Grand Fishery (South Sea Bubble Playing Card, Two of Spades)',
    desc: 'A playing card depicting the Grand Fishery scheme, showing a large three-masted sailing ship at anchor with smaller fishing boats and a dingy in the foreground, framed by two spade pips in the upper left corner. The verse reads: "Well might this Bubble claim the Stile of Grand, / Whilst they that rais\'d the Same could Fish by Land; / But now the Town does at the Project Pish, / They\'ve nothing else to cry but Stinking Fish." The Grand Fishery scheme was an ambitious 1720 venture proposing to revive British deep-sea fishing on a large commercial scale, appealing to national pride and the promise of employment. The verse\'s dismissal of the scheme as "Stinking Fish" captures both the commercial failure of the venture and the public contempt that followed the collapse of the bubble. The two of spades pips in the upper left identify this card\'s position in the South Sea Bubble playing card deck.' },

  // row 43: goetzmann0043
  { row: 43,
    title: 'Cleaning the Streets (South Sea Bubble Playing Card, Three of Spades)',
    desc: 'A playing card satirizing a street cleaning scheme for London, showing a horse-drawn cleaning cart operating on a cobblestone street while a woman empties a chamber pot from an upper window, a group of gentlemen observes the operation, and a child hands a bottle to a pedestrian. The verse reads: "A Cleanly project, well approv\'d, no doubt, / By Stroling Dames, and all that walk on Foot; / This Bubble well deserves the Name of best, / Because the Cleanest Bite of all the rest." The three of spades pips in the upper left identify this card\'s position in the deck. The pun on "Cleanest Bite" simultaneously praises the scheme\'s apparent civic virtue while condemning it as the most artfully deceptive fraud of the bubble era. The image illustrates the range of municipal improvement schemes marketed as investment opportunities during the South Sea Bubble, appealing to investors\' civic pride as well as their greed.' },

  // row 44: goetzmann0044
  { row: 44,
    title: 'Fish Pool (South Sea Bubble Playing Card, Spades)',
    desc: 'A playing card depicting the Fish Pool scheme, showing a large sailing ship trailing a net with live fish being hauled aboard while a fantastical sea creature attacks the vessel in the foreground. The verse reads: "How famous is the Man, that could contrive / To Serve this Glutt\'nous Town with Fish alive; / But now we\'re bubb\'d by his Fishing Pools, / And as the Men catch Fish the Fish catch Fools." The Fish Pool Company was a real South Sea Bubble scheme promoted by Stephen Switzer and others to transport live fish in specially constructed ships to London markets, an idea with some theoretical merit that was nonetheless exploited as a speculative vehicle. The image of the sea creature attacking the ship is an allegorical comment on the predatory nature of the speculative enterprise and its promoters. The spades suit pips in the upper left identify this card\'s position in the South Sea Bubble playing card deck.' },

  // row 45: goetzmann0045
  { row: 45,
    title: 'York Buildings (South Sea Bubble Playing Card, Six of Spades)',
    desc: 'A playing card depicting the York Buildings Company, showing a scene of structural collapse near a Thames waterfront with workers and bystanders fleeing falling timber and masonry, a church spire visible in the distance, and a water tower to the right with a sign reading "Spare Madam." The verse reads: "You that are blest with Wealth, by your Creator, / And want to drown your Money in Thames Water, / Buy but York Buildings, and the Cistern there, / Will Sink more Pence, than any Fool can Spare." The York Buildings Company had supplied water from the Thames to London\'s West End since the 1690s but became deeply entangled in the speculative mania of 1720, taking on vast debts to finance mining ventures in Scotland while issuing inflated shares. The image of collapsing structures alludes to both the physical decay of the York Buildings waterworks and the financial collapse of the company\'s overextended operations. The six of spades pips identify this card\'s position in the South Sea Bubble playing card deck.' },

  // row 46: goetzmann0046
  { row: 46,
    title: 'Insurance on Lives (South Sea Bubble Playing Card, Seven of Spades)',
    desc: 'A playing card satirizing life insurance as an investment scheme, showing an interior office scene in which a husband and wife approach a desk where a clerk records a policy, while a crowd of prospective customers waits in the background and a figure appears to be fleeing above. The verse reads: "Come all ye Gen\'rous Husbands, with your Wives, / Insure round Sums, on your precarious Lives; / That to your comfort, when you\'re Dead and Rotten / Your Widows may be Rich when you\'re forgotten." The card satirizes the promotion of life insurance policies as speculative investments during the 1720 bubble, when several companies attempted to raise capital on the promise of life annuities and insurance premiums. The sardonic verse on widows profiting from their husbands\' deaths captures the dark humor characteristic of this genre of popular financial satire. The seven of spades pips identify this card\'s position in the South Sea Bubble playing card deck.' },

  // row 47: goetzmann0047
  { row: 47,
    title: 'Stockings (South Sea Bubble Playing Card, Spades)',
    desc: 'A playing card depicting a stocking manufacturing scheme, showing a rural cottage scene with women engaged in spinning at a wheel, knitting, and stretching finished stockings, while a child plays in the foreground. The verse reads: "You that delight to keep your Sweaty Feet, / By often changing Stockings Clean and Sweet, / Deal not in Stockin\' Shares, because I Doubt / Those that buy most, e\'erlong will go without." The card satirizes a speculative scheme to profit from stocking manufacture, an established British textile industry that was being presented as an investment opportunity during the 1720 bubble. The warning that investors will eventually "go without" stockings inverts the company\'s promises of profit and consumer benefit. The spades suit pips in the upper left identify this card\'s position in the South Sea Bubble playing card deck.' },

  // row 48: goetzmann0048
  { row: 48,
    title: 'Welch Copper (South Sea Bubble Playing Card, Spades)',
    desc: 'A playing card depicting the Welsh Copper mining scheme, showing a moorland scene with surveyors on a hillside, a horseman carrying a sign reading "Fure Facial," and a figure riding a goat in the foreground, alluding to the wild claims made by the company\'s promoters. The verse reads: "This Bubble for a time may currant pass, / Copper\'s the title but \'twill end in Brass; / Knaves cry it up, Fools Buy, but when it fails; / The loseing Crowd will Swear, Cots Splutt\'r a Nail." The Welsh Copper Company was a genuine enterprise in copper smelting, but like many legitimate businesses in 1720 it became a vehicle for speculative excess when its promoters issued inflated shares and made extravagant promises to investors. The verse\'s pun on copper versus brass captures the theme of false value underlying the speculative scheme. The spades suit pips identify this card\'s position in the South Sea Bubble playing card deck.' },

  // row 49: goetzmann0049
  { row: 49,
    title: 'Providing for and Employing all the Poor in Great Britain (South Sea Bubble Playing Card, Spades)',
    desc: 'A playing card depicting a scheme to employ and provide for the poor throughout Great Britain, showing a busy outdoor scene with various laborers including people working at a treadmill, mothers with children, workers carrying goods, and people engaged in various trades. The verse reads: "The Poor when manag\'d, and employ\'d in Trade, / Are to the publick Welfare, usefull made; / But if kept Idle from their Vices Spring / Whores for the Stews, and Soldiers for the King." The card satirizes a social improvement scheme dressed up as a profitable speculative venture, echoing the workhouse and poor employment projects that circulated alongside financial bubbles in early eighteenth-century Britain. The mordant verse exposes the coercive dimension of poor employment schemes, suggesting their primary function was social control rather than genuine relief. The spades suit pips in the upper left identify this card\'s position in the South Sea Bubble playing card deck.' },

  // row 50: goetzmann0050
  { row: 50,
    title: 'Hemp and Flax (South Sea Bubble Playing Card, Ace of Hearts)',
    desc: 'A playing card depicting a hemp and flax cultivation scheme, showing a rural scene with men sowing seeds in a field, a farmhouse in the left background, and birds flying overhead, framed by a single red heart pip in the upper left identifying it as the ace of hearts. The verse reads: "Here Hemp is Sow\'d for Stuborn Rogues to Die in, / And Softer Flax, for tender Skins to Lye in; / But Should the usefull Project be defeated; / The Knaves may prosper but the Fools are cheated." Hemp and flax were legitimate agricultural commodities providing raw materials for rope and linen in early eighteenth-century Britain, and this card satirizes the use of these useful crops as the basis for a fraudulent speculative investment scheme. The verse\'s punning references to hemp rope for hangings and flax for bed linen satirize the promoters and investors in equal measure, reserving the harshest fate for the "Fools" who fund the scheme. The ace of hearts identifies this as the beginning of the hearts suit run in the South Sea Bubble playing card deck.' },

  // row 51: goetzmann0051
  { row: 51,
    title: 'Manuring of Land (South Sea Bubble Playing Card, Two of Hearts)',
    desc: 'A playing card depicting a land improvement scheme based on systematic manuring, showing a rural scene with two workers tending to a tree while a horse and rider are visible in the background, framed by two red heart pips in the upper left. The verse reads: "A Noble Undertaking but abus\'d, / And only as a Tricking Bubble us\'d, / Much they Pretend to; but the Publick Fear, / They\'ll never make Corn Cheap, or Horse Dung Dear." The scheme for improving agricultural productivity through systematic application of manure reflects the agricultural improvement discourse of early eighteenth-century Britain, here satirized as a fraudulent device for attracting investment capital. The verse captures the public\'s skepticism toward the scheme\'s extravagant promises of improving soil fertility and reducing grain prices while enriching investors through the sale of horse dung. The two of hearts identifies this card\'s position in the South Sea Bubble playing card deck.' },

  // row 52: goetzmann0052
  { row: 52,
    title: 'Coal Trade from Newcastle (South Sea Bubble Playing Card, Three of Hearts)',
    desc: 'A playing card depicting a scheme for organizing the coal trade from Newcastle, showing a harbor scene with a horse-powered winding machine raising coal from a mine shaft while laborers work in the foreground and coal ships wait at anchor in the background. The verse reads: "Some deal in Water, Some in Wind like Fools, / Others in Wood, but we alone in Coals; / From Such like Projects, the declining Nation, / May justly fear a fatal inflamation." The three of hearts pips in the upper left identify this card\'s position in the South Sea Bubble playing card deck. The Newcastle coal trade was one of Britain\'s most important established industries, and the card satirizes the attempt to float a speculative company around an already functioning and well-understood trade network. The verse\'s warning of a "fatal inflamation" puns on both the combustible nature of coal and the economic fever gripping the nation during the bubble era.' },

  // row 53: goetzmann0053
  { row: 53,
    title: 'Water Engine (South Sea Bubble Playing Card, Four of Hearts)',
    desc: 'A playing card depicting a water engine or mine-draining pump scheme, showing two men operating a large wooden beam pump near a river, with buildings and a bridge visible in the background, framed by four red heart pips in the upper left. The verse reads: "Come all ye Culls, my Water Engine buy, / To Pump your flooded Mines, and Cole Pitts dry; / Some Projects are all Wind, but ours is Water, / And tho at present low, may rise herea\'ter." Water engine companies to drain flooded mines were among the more technologically credible of the 1720 speculative ventures, with genuine precursors in the Newcomen atmospheric engine and similar devices, though the verse satirizes both the scheme\'s reliance on water as a selling point and the promoters\' inflated promises. The pun on "rise" refers both to rising water levels and rising share prices, characteristic of the financial wordplay in this card series. The four of hearts identifies this card\'s position in the South Sea Bubble playing card deck.' },

  // row 54: goetzmann0054
  { row: 54,
    title: 'Royal Fishery of Great Britain (South Sea Bubble Playing Card, Five of Hearts)',
    desc: 'A playing card depicting the Royal Fishery of Great Britain scheme, showing a chaotic maritime scene with sailing ships, fishing boats, and a large sea creature overturning a vessel while fishermen struggle in the water, framed by five red heart pips in the upper left. The verse reads: "They talk of distant Seas, of Ships, and Nets; / And with the Stile of Royal Gild their Baits; / When all that the Projectors Hope or Wish for, / Is to catch Fools, the only Chubs they Fish for." The Royal Fishery scheme was a prominent 1720 bubble venture that appealed to investors with the prestige of its royal associations and grand promises of reviving British deep-sea fishing for profit and national glory. The verse\'s use of "Chubs" (a contemporary slang term for gullible investors, parallel to "gudgeons") reinforces the satirical theme of investors as fish being caught by unscrupulous promoters. The five of hearts identifies this card\'s position in the South Sea Bubble playing card deck.' },
];

// Write all card rows
cards.forEach(({ row, title, desc }) => {
  set(row, 'title', title);
  set(row, 'description', desc);
  Object.entries(bubbleBase).forEach(([k, v]) => set(row, k, v));
});

// Write back
const newWs = xlsx.utils.aoa_to_sheet(data);
newWs['!cols'] = ws['!cols'];
wb.Sheets['Documents'] = newWs;
xlsx.writeFile(wb, path);
console.log('Done. Updated rows 20-27 (Turkze Rovers fix + final page) and rows 28-54 (Bubble Cards).');
