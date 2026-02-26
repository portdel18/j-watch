// Government Watch — Curated RSS Feed Registry
// Organized by level: federal, state
// All feeds are official .gov or .mil sources (public domain)

export const FEDERAL_FEEDS = [
  // White House
  {
    id: 'whitehouse',
    name: 'White House',
    url: 'https://www.whitehouse.gov/feed/',
    category: 'Executive',
  },
  // Federal Register — new rules, executive orders, agency notices
  {
    id: 'federal-register',
    name: 'Federal Register',
    url: 'https://www.federalregister.gov/documents/search.atom?conditions%5Btype%5D=PRESDOCU',
    category: 'Executive',
  },
  // Congress.gov — bills, resolutions
  {
    id: 'congress-bills',
    name: 'Congress — Recent Bills',
    url: 'https://www.congress.gov/rss/most-viewed-bills.xml',
    category: 'Legislative',
  },
  // Department of Justice
  {
    id: 'doj',
    name: 'Dept. of Justice',
    url: 'https://www.justice.gov/feeds/opa/justice-news.xml',
    category: 'Justice',
  },
  // EPA
  {
    id: 'epa',
    name: 'EPA Newsroom',
    url: 'https://www.epa.gov/newsreleases/search/rss',
    category: 'Environment',
  },
  // Department of Education
  {
    id: 'ed',
    name: 'Dept. of Education',
    url: 'https://www.ed.gov/feed',
    category: 'Education',
  },
  // HHS
  {
    id: 'hhs',
    name: 'Health & Human Services',
    url: 'https://www.hhs.gov/rss/news-releases.xml',
    category: 'Healthcare',
  },
  // Department of Labor
  {
    id: 'dol',
    name: 'Dept. of Labor',
    url: 'https://www.dol.gov/rss/releases.xml',
    category: 'Economy',
  },
  // FEMA
  {
    id: 'fema',
    name: 'FEMA',
    url: 'https://www.fema.gov/api/open/v1/NewsRoomNFO?$format=rss',
    category: 'Public Safety',
  },
  // Department of Defense
  {
    id: 'dod',
    name: 'Dept. of Defense',
    url: 'https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945',
    category: 'Defense',
  },
  // Department of Homeland Security
  {
    id: 'dhs',
    name: 'Homeland Security',
    url: 'https://www.dhs.gov/news-releases/rss.xml',
    category: 'Public Safety',
  },
  // Treasury
  {
    id: 'treasury',
    name: 'Dept. of Treasury',
    url: 'https://home.treasury.gov/system/files/136/treasury-rss.xml',
    category: 'Economy',
  },
  // Department of State
  {
    id: 'state',
    name: 'Dept. of State',
    url: 'https://www.state.gov/rss-feed/press-releases/feed/',
    category: 'Foreign Policy',
  },
  // USDA
  {
    id: 'usda',
    name: 'USDA',
    url: 'https://www.usda.gov/rss/home.xml',
    category: 'Agriculture',
  },
];

// State government feeds — keyed by state name
// Each state entry has governor + key agency feeds
export const STATE_FEEDS = {
  'Alabama': [
    { id: 'al-gov', name: 'Alabama Governor', url: 'https://governor.alabama.gov/feed/', category: 'Governor' },
  ],
  'Alaska': [
    { id: 'ak-gov', name: 'Alaska Governor', url: 'https://gov.alaska.gov/feed/', category: 'Governor' },
  ],
  'Arizona': [
    { id: 'az-gov', name: 'Arizona Governor', url: 'https://azgovernor.gov/feed', category: 'Governor' },
  ],
  'Arkansas': [
    { id: 'ar-gov', name: 'Arkansas Governor', url: 'https://governor.arkansas.gov/feed/', category: 'Governor' },
  ],
  'California': [
    { id: 'ca-gov', name: 'California Governor', url: 'https://www.gov.ca.gov/feed/', category: 'Governor' },
  ],
  'Colorado': [
    { id: 'co-gov', name: 'Colorado Governor', url: 'https://www.colorado.gov/governor/rss.xml', category: 'Governor' },
  ],
  'Connecticut': [
    { id: 'ct-gov', name: 'Connecticut Governor', url: 'https://portal.ct.gov/governor/news/rss', category: 'Governor' },
  ],
  'Delaware': [
    { id: 'de-gov', name: 'Delaware Governor', url: 'https://governor.delaware.gov/feed/', category: 'Governor' },
  ],
  'Florida': [
    { id: 'fl-gov', name: 'Florida Governor', url: 'https://www.flgov.com/feed/', category: 'Governor' },
  ],
  'Georgia': [
    { id: 'ga-gov', name: 'Georgia Governor', url: 'https://gov.georgia.gov/press-releases/feed', category: 'Governor' },
  ],
  'Hawaii': [
    { id: 'hi-gov', name: 'Hawaii Governor', url: 'https://governor.hawaii.gov/feed/', category: 'Governor' },
  ],
  'Idaho': [
    { id: 'id-gov', name: 'Idaho Governor', url: 'https://gov.idaho.gov/feed/', category: 'Governor' },
    { id: 'id-leg', name: 'Idaho Legislature', url: 'https://legislature.idaho.gov/feed/', category: 'Legislature' },
  ],
  'Illinois': [
    { id: 'il-gov', name: 'Illinois Governor', url: 'https://gov.illinois.gov/news/rss', category: 'Governor' },
  ],
  'Indiana': [
    { id: 'in-gov', name: 'Indiana Governor', url: 'https://www.in.gov/gov/rss.xml', category: 'Governor' },
  ],
  'Iowa': [
    { id: 'ia-gov', name: 'Iowa Governor', url: 'https://governor.iowa.gov/feed/', category: 'Governor' },
  ],
  'Kansas': [
    { id: 'ks-gov', name: 'Kansas Governor', url: 'https://governor.kansas.gov/feed/', category: 'Governor' },
  ],
  'Kentucky': [
    { id: 'ky-gov', name: 'Kentucky Governor', url: 'https://governor.ky.gov/news/rss', category: 'Governor' },
  ],
  'Louisiana': [
    { id: 'la-gov', name: 'Louisiana Governor', url: 'https://gov.louisiana.gov/feed/', category: 'Governor' },
  ],
  'Maine': [
    { id: 'me-gov', name: 'Maine Governor', url: 'https://www.maine.gov/governor/feed/', category: 'Governor' },
  ],
  'Maryland': [
    { id: 'md-gov', name: 'Maryland Governor', url: 'https://governor.maryland.gov/feed/', category: 'Governor' },
  ],
  'Massachusetts': [
    { id: 'ma-gov', name: 'Massachusetts Governor', url: 'https://www.mass.gov/news/rss', category: 'Governor' },
  ],
  'Michigan': [
    { id: 'mi-gov', name: 'Michigan Governor', url: 'https://www.michigan.gov/whitmer/news/rss', category: 'Governor' },
  ],
  'Minnesota': [
    { id: 'mn-gov', name: 'Minnesota Governor', url: 'https://mn.gov/governor/news/rss', category: 'Governor' },
  ],
  'Mississippi': [
    { id: 'ms-gov', name: 'Mississippi Governor', url: 'https://governorreeves.ms.gov/feed/', category: 'Governor' },
  ],
  'Missouri': [
    { id: 'mo-gov', name: 'Missouri Governor', url: 'https://governor.mo.gov/press-releases/feed', category: 'Governor' },
  ],
  'Montana': [
    { id: 'mt-gov', name: 'Montana Governor', url: 'https://governor.mt.gov/feed/', category: 'Governor' },
  ],
  'Nebraska': [
    { id: 'ne-gov', name: 'Nebraska Governor', url: 'https://governor.nebraska.gov/feed/', category: 'Governor' },
  ],
  'Nevada': [
    { id: 'nv-gov', name: 'Nevada Governor', url: 'https://gov.nv.gov/News/Press_Releases/rss/', category: 'Governor' },
  ],
  'New Hampshire': [
    { id: 'nh-gov', name: 'New Hampshire Governor', url: 'https://www.governor.nh.gov/news/rss', category: 'Governor' },
  ],
  'New Jersey': [
    { id: 'nj-gov', name: 'New Jersey Governor', url: 'https://www.nj.gov/governor/news/news/rss.xml', category: 'Governor' },
  ],
  'New Mexico': [
    { id: 'nm-gov', name: 'New Mexico Governor', url: 'https://www.governor.state.nm.us/feed/', category: 'Governor' },
  ],
  'New York': [
    { id: 'ny-gov', name: 'New York Governor', url: 'https://www.governor.ny.gov/news/rss', category: 'Governor' },
  ],
  'North Carolina': [
    { id: 'nc-gov', name: 'North Carolina Governor', url: 'https://governor.nc.gov/news/press-releases/rss', category: 'Governor' },
  ],
  'North Dakota': [
    { id: 'nd-gov', name: 'North Dakota Governor', url: 'https://www.governor.nd.gov/news/rss', category: 'Governor' },
  ],
  'Ohio': [
    { id: 'oh-gov', name: 'Ohio Governor', url: 'https://governor.ohio.gov/media/news-and-media/rss', category: 'Governor' },
  ],
  'Oklahoma': [
    { id: 'ok-gov', name: 'Oklahoma Governor', url: 'https://www.governor.ok.gov/feed/', category: 'Governor' },
  ],
  'Oregon': [
    { id: 'or-gov', name: 'Oregon Governor', url: 'https://www.oregon.gov/governor/Pages/rss.aspx', category: 'Governor' },
  ],
  'Pennsylvania': [
    { id: 'pa-gov', name: 'Pennsylvania Governor', url: 'https://www.governor.pa.gov/feed/', category: 'Governor' },
  ],
  'Rhode Island': [
    { id: 'ri-gov', name: 'Rhode Island Governor', url: 'https://governor.ri.gov/press-releases/feed', category: 'Governor' },
  ],
  'South Carolina': [
    { id: 'sc-gov', name: 'South Carolina Governor', url: 'https://governor.sc.gov/news/rss', category: 'Governor' },
  ],
  'South Dakota': [
    { id: 'sd-gov', name: 'South Dakota Governor', url: 'https://governor.sd.gov/news/rss', category: 'Governor' },
  ],
  'Tennessee': [
    { id: 'tn-gov', name: 'Tennessee Governor', url: 'https://www.tn.gov/governor/news.rss', category: 'Governor' },
  ],
  'Texas': [
    { id: 'tx-gov', name: 'Texas Governor', url: 'https://gov.texas.gov/news/rss', category: 'Governor' },
  ],
  'Utah': [
    { id: 'ut-gov', name: 'Utah Governor', url: 'https://governor.utah.gov/feed/', category: 'Governor' },
  ],
  'Vermont': [
    { id: 'vt-gov', name: 'Vermont Governor', url: 'https://governor.vermont.gov/press-releases/rss', category: 'Governor' },
  ],
  'Virginia': [
    { id: 'va-gov', name: 'Virginia Governor', url: 'https://www.governor.virginia.gov/newsroom/news-releases/rss/', category: 'Governor' },
  ],
  'Washington': [
    { id: 'wa-gov', name: 'Washington Governor', url: 'https://governor.wa.gov/news/rss', category: 'Governor' },
  ],
  'West Virginia': [
    { id: 'wv-gov', name: 'West Virginia Governor', url: 'https://governor.wv.gov/News/press-releases/feed', category: 'Governor' },
  ],
  'Wisconsin': [
    { id: 'wi-gov', name: 'Wisconsin Governor', url: 'https://evers.wi.gov/Pages/Newsroom/rss.aspx', category: 'Governor' },
  ],
  'Wyoming': [
    { id: 'wy-gov', name: 'Wyoming Governor', url: 'https://governor.wyo.gov/media/news-releases/rss', category: 'Governor' },
  ],
};

// Get all feed URLs for a given configuration
export function getGovFeedUrls({ federal = true, state = '' } = {}) {
  const feeds = [];
  if (federal) {
    feeds.push(...FEDERAL_FEEDS);
  }
  if (state && STATE_FEEDS[state]) {
    feeds.push(...STATE_FEEDS[state]);
  }
  return feeds;
}
