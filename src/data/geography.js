// Idaho region/county/city mappings, US states, sentiment/source maps

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

export const IDAHO_REGIONS = {
  'Northern Idaho': {
    counties: ['Boundary', 'Bonner', 'Kootenai', 'Shoshone', 'Benewah'],
    cities: ['Coeur d\'Alene', 'Sandpoint', 'Post Falls', 'Moscow', 'Lewiston', 'Bonners Ferry', 'Kellogg', 'Wallace'],
  },
  'North Central Idaho': {
    counties: ['Latah', 'Nez Perce', 'Lewis', 'Clearwater', 'Idaho'],
    cities: ['Moscow', 'Lewiston', 'Grangeville', 'Orofino', 'Kamiah'],
  },
  'Southwestern Idaho': {
    counties: ['Ada', 'Canyon', 'Gem', 'Boise', 'Owyhee', 'Elmore', 'Payette', 'Washington', 'Adams', 'Valley'],
    cities: ['Boise', 'Nampa', 'Meridian', 'Caldwell', 'Eagle', 'Star', 'Kuna', 'Mountain Home', 'Emmett', 'McCall'],
  },
  'South Central Idaho': {
    counties: ['Twin Falls', 'Jerome', 'Gooding', 'Lincoln', 'Minidoka', 'Cassia', 'Blaine', 'Camas'],
    cities: ['Twin Falls', 'Jerome', 'Burley', 'Rupert', 'Hailey', 'Ketchum', 'Sun Valley', 'Gooding'],
  },
  'Southeastern Idaho': {
    counties: ['Bannock', 'Bingham', 'Power', 'Oneida', 'Franklin', 'Bear Lake', 'Caribou'],
    cities: ['Pocatello', 'Blackfoot', 'American Falls', 'Preston', 'Montpelier', 'Soda Springs'],
  },
  'Eastern Idaho': {
    counties: ['Bonneville', 'Jefferson', 'Madison', 'Teton', 'Fremont', 'Clark', 'Lemhi', 'Custer', 'Butte'],
    cities: ['Idaho Falls', 'Rexburg', 'Rigby', 'Driggs', 'St. Anthony', 'Salmon', 'Challis', 'Arco'],
  },
};

// Flatten all counties and cities for quick lookup
export const ALL_IDAHO_COUNTIES = Object.values(IDAHO_REGIONS)
  .flatMap(r => r.counties);

export const ALL_IDAHO_CITIES = Object.values(IDAHO_REGIONS)
  .flatMap(r => r.cities);

// Geographic synonyms for improved matching
export const GEO_SYNONYMS = {
  'Gem State': ['Idaho'],
  'CDA': ['Coeur d\'Alene'],
  'Treasure Valley': ['Boise', 'Nampa', 'Meridian', 'Caldwell', 'Eagle', 'Star', 'Kuna'],
  'Magic Valley': ['Twin Falls', 'Jerome', 'Burley', 'Rupert'],
  'Wood River Valley': ['Hailey', 'Ketchum', 'Sun Valley', 'Bellevue'],
  'Palouse': ['Moscow', 'Pullman'],
  'IC': ['Idaho County'],
};

// Idaho facilities → location mapping
export const IDAHO_FACILITIES = {
  'ISU': { city: 'Pocatello', county: 'Bannock', name: 'Idaho State University' },
  'Idaho State University': { city: 'Pocatello', county: 'Bannock' },
  'BSU': { city: 'Boise', county: 'Ada', name: 'Boise State University' },
  'Boise State': { city: 'Boise', county: 'Ada', name: 'Boise State University' },
  'Boise State University': { city: 'Boise', county: 'Ada' },
  'U of I': { city: 'Moscow', county: 'Latah', name: 'University of Idaho' },
  'University of Idaho': { city: 'Moscow', county: 'Latah' },
  'BYU-Idaho': { city: 'Rexburg', county: 'Madison', name: 'BYU-Idaho' },
  'College of Idaho': { city: 'Caldwell', county: 'Canyon' },
  'NIC': { city: 'Coeur d\'Alene', county: 'Kootenai', name: 'North Idaho College' },
  'North Idaho College': { city: 'Coeur d\'Alene', county: 'Kootenai' },
  'Mountain Home AFB': { city: 'Mountain Home', county: 'Elmore', name: 'Mountain Home Air Force Base' },
  'Mountain Home Air Force Base': { city: 'Mountain Home', county: 'Elmore' },
  'INL': { city: 'Idaho Falls', county: 'Butte', name: 'Idaho National Laboratory' },
  'Idaho National Laboratory': { city: 'Idaho Falls', county: 'Butte' },
  'Gowen Field': { city: 'Boise', county: 'Ada', name: 'Gowen Field' },
  'Idaho State Capitol': { city: 'Boise', county: 'Ada' },
};

// False positive traps — locations that sound like Idaho but aren't
export const FALSE_POSITIVES = [
  { pattern: /Northwest ICE Processing Center/i, actual: 'Tacoma, WA' },
  { pattern: /Northwest Detention Center/i, actual: 'Tacoma, WA' },
  { pattern: /Idaho Street/i, actual: 'street name, not state' },
  { pattern: /Idaho Avenue/i, actual: 'street name, not state' },
  { pattern: /Idaho Road/i, actual: 'street name, not state' },
  { pattern: /Idaho Boulevard/i, actual: 'street name, not state' },
  { pattern: /Idaho Springs/i, actual: 'Colorado' },
  { pattern: /Idaho City(?!,)/i, actual: 'could be Idaho City, ID — check context' },
];

// County seat lookups — city → county
export const COUNTY_SEATS = {
  'Boise': 'Ada',
  'Nampa': 'Canyon',
  'Caldwell': 'Canyon',
  'Meridian': 'Ada',
  'Idaho Falls': 'Bonneville',
  'Pocatello': 'Bannock',
  'Twin Falls': 'Twin Falls',
  'Coeur d\'Alene': 'Kootenai',
  'Lewiston': 'Nez Perce',
  'Moscow': 'Latah',
  'Rexburg': 'Madison',
  'Blackfoot': 'Bingham',
  'Jerome': 'Jerome',
  'Burley': 'Cassia',
  'Rupert': 'Minidoka',
  'Mountain Home': 'Elmore',
  'Emmett': 'Gem',
  'Hailey': 'Blaine',
  'Sandpoint': 'Bonner',
  'Post Falls': 'Kootenai',
  'Eagle': 'Ada',
  'Star': 'Ada',
  'Kuna': 'Ada',
  'Grangeville': 'Idaho',
  'Salmon': 'Lemhi',
  'Driggs': 'Teton',
  'Preston': 'Franklin',
  'American Falls': 'Power',
  'Soda Springs': 'Caribou',
  'Challis': 'Custer',
  'Arco': 'Butte',
  'Bonners Ferry': 'Boundary',
  'St. Anthony': 'Fremont',
  'Orofino': 'Clearwater',
  'Gooding': 'Gooding',
};

// Source type classification for known outlets
export const SOURCE_MAP = {
  // Wire services
  'Associated Press': 'wire',
  'AP': 'wire',
  'Reuters': 'wire',
  'UPI': 'wire',
  'AFP': 'wire',

  // National outlets
  'The New York Times': 'national',
  'Washington Post': 'national',
  'CNN': 'national',
  'Fox News': 'national',
  'NBC News': 'national',
  'CBS News': 'national',
  'ABC News': 'national',
  'NPR': 'national',
  'USA Today': 'national',
  'The Wall Street Journal': 'national',
  'Los Angeles Times': 'national',
  'Politico': 'national',
  'The Hill': 'national',
  'Bloomberg': 'national',
  'MSNBC': 'national',
  'The Guardian': 'national',
  'BBC News': 'national',
  'HuffPost': 'national',
  'Axios': 'national',
  'The Daily Beast': 'national',
  'Vox': 'national',
  'BuzzFeed News': 'national',

  // Idaho local
  'Idaho Statesman': 'local',
  'Times-News': 'local',
  'Idaho Press': 'local',
  'Idaho Press-Tribune': 'local',
  'Post Register': 'local',
  'Lewiston Tribune': 'local',
  'Coeur d\'Alene Press': 'local',
  'Moscow-Pullman Daily News': 'local',
  'Idaho Mountain Express': 'local',
  'Idaho State Journal': 'local',
  'Bonner County Daily Bee': 'local',
  'Shoshone News-Press': 'local',
  'Idaho County Free Press': 'local',
  'Star-News': 'local',
  'Mini-Cassia Times-News': 'local',

  // Idaho broadcast
  'KTVB': 'broadcast',
  'KIVI': 'broadcast',
  'KBOI': 'broadcast',
  'KMVT': 'broadcast',
  'KIDK': 'broadcast',
  'KIFI': 'broadcast',
  'KLEW': 'broadcast',
  'Idaho News 6': 'broadcast',
  'Idaho Public Television': 'broadcast',

  // PNW regional
  'The Oregonian': 'regional',
  'Seattle Times': 'regional',
  'Spokesman-Review': 'regional',
  'Yakima Herald': 'regional',
  'Tri-City Herald': 'regional',
  'Salt Lake Tribune': 'regional',
  'Deseret News': 'regional',
  'Great Falls Tribune': 'regional',
  'Missoulian': 'regional',
  'Bozeman Daily Chronicle': 'regional',

  // Idaho online/alternative
  'BoiseDev': 'local',
  'Idaho Capital Sun': 'local',
  'Idaho Reports': 'broadcast',
  'Idaho Education News': 'trade',
  'Blue Review': 'opinion',
};

// Source geo mapping — source name → geographic origin
export const SOURCE_GEO = {
  'Idaho Statesman': { state: 'Idaho', city: 'Boise', county: 'Ada' },
  'Times-News': { state: 'Idaho', city: 'Twin Falls', county: 'Twin Falls' },
  'Idaho Press': { state: 'Idaho', city: 'Nampa', county: 'Canyon' },
  'Post Register': { state: 'Idaho', city: 'Idaho Falls', county: 'Bonneville' },
  'Lewiston Tribune': { state: 'Idaho', city: 'Lewiston', county: 'Nez Perce' },
  'Coeur d\'Alene Press': { state: 'Idaho', city: 'Coeur d\'Alene', county: 'Kootenai' },
  'Moscow-Pullman Daily News': { state: 'Idaho', city: 'Moscow', county: 'Latah' },
  'Idaho Mountain Express': { state: 'Idaho', city: 'Ketchum', county: 'Blaine' },
  'Idaho State Journal': { state: 'Idaho', city: 'Pocatello', county: 'Bannock' },
  'Bonner County Daily Bee': { state: 'Idaho', city: 'Sandpoint', county: 'Bonner' },
  'KTVB': { state: 'Idaho', city: 'Boise', county: 'Ada' },
  'KIVI': { state: 'Idaho', city: 'Nampa', county: 'Canyon' },
  'KBOI': { state: 'Idaho', city: 'Boise', county: 'Ada' },
  'KMVT': { state: 'Idaho', city: 'Twin Falls', county: 'Twin Falls' },
  'KIFI': { state: 'Idaho', city: 'Idaho Falls', county: 'Bonneville' },
  'BoiseDev': { state: 'Idaho', city: 'Boise', county: 'Ada' },
  'Idaho Capital Sun': { state: 'Idaho', city: 'Boise', county: 'Ada' },
  'Spokesman-Review': { state: 'Washington', city: 'Spokane' },
};

// Sentiment keyword indicators
export const SENTIMENT_KEYWORDS = {
  urgent: ['breaking', 'emergency', 'crisis', 'killed', 'dead', 'shooting', 'explosion', 'evacuate', 'wildfire'],
  negative: ['arrested', 'charged', 'lawsuit', 'fraud', 'scandal', 'investigation', 'protest', 'crash', 'accident', 'fire'],
  neutral: ['meeting', 'council', 'budget', 'report', 'update', 'plan', 'proposal', 'announced'],
  positive: ['approved', 'awarded', 'growth', 'improvement', 'celebration', 'opened', 'honored', 'donated'],
};
