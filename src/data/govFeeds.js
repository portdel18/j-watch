// Government Watch — Curated RSS Feed Registry
// Organized by level: federal, state, local
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
  // Department of Interior
  {
    id: 'doi',
    name: 'Dept. of Interior',
    url: 'https://www.doi.gov/news/rss',
    category: 'Public Lands',
  },
  // Department of Transportation
  {
    id: 'dot',
    name: 'Dept. of Transportation',
    url: 'https://www.transportation.gov/rss/pressrelease',
    category: 'Infrastructure',
  },
  // Department of Energy
  {
    id: 'doe',
    name: 'Dept. of Energy',
    url: 'https://www.energy.gov/rss/articles.xml',
    category: 'Energy',
  },
  // Department of Housing and Urban Development
  {
    id: 'hud',
    name: 'HUD',
    url: 'https://www.hud.gov/rss/hud_news',
    category: 'Housing',
  },
  // Department of Veterans Affairs
  {
    id: 'va',
    name: 'Dept. of Veterans Affairs',
    url: 'https://news.va.gov/feed/',
    category: 'Veterans',
  },
  // ICE
  {
    id: 'ice',
    name: 'ICE Newsroom',
    url: 'https://www.ice.gov/rss/news-releases.xml',
    category: 'Immigration',
  },
  // CBP
  {
    id: 'cbp',
    name: 'Customs & Border Protection',
    url: 'https://www.cbp.gov/rss/feeds/newsroom',
    category: 'Immigration',
  },
  // CDC
  {
    id: 'cdc',
    name: 'CDC Newsroom',
    url: 'https://tools.cdc.gov/api/v2/resources/media/rss',
    category: 'Healthcare',
  },
  // FBI
  {
    id: 'fbi',
    name: 'FBI News',
    url: 'https://www.fbi.gov/feeds/fbi-news/rss.xml',
    category: 'Justice',
  },
  // SEC
  {
    id: 'sec',
    name: 'SEC Press Releases',
    url: 'https://www.sec.gov/rss/news/press.xml',
    category: 'Economy',
  },
  // FCC
  {
    id: 'fcc',
    name: 'FCC News',
    url: 'https://www.fcc.gov/news-events/rss.xml',
    category: 'Technology',
  },
  // SBA
  {
    id: 'sba',
    name: 'Small Business Admin.',
    url: 'https://www.sba.gov/rss/feeds/latest-news',
    category: 'Economy',
  },
];

// State government feeds — keyed by state name
// Expanded with key departments beyond just the governor
export const STATE_FEEDS = {
  'Alabama': [
    { id: 'al-gov', name: 'Alabama Governor', url: 'https://governor.alabama.gov/feed/', category: 'Governor' },
    { id: 'al-ag', name: 'Alabama Attorney General', url: 'https://www.alabamaag.gov/feed/', category: 'Attorney General' },
  ],
  'Alaska': [
    { id: 'ak-gov', name: 'Alaska Governor', url: 'https://gov.alaska.gov/feed/', category: 'Governor' },
  ],
  'Arizona': [
    { id: 'az-gov', name: 'Arizona Governor', url: 'https://azgovernor.gov/feed', category: 'Governor' },
    { id: 'az-ag', name: 'Arizona Attorney General', url: 'https://www.azag.gov/rss.xml', category: 'Attorney General' },
  ],
  'Arkansas': [
    { id: 'ar-gov', name: 'Arkansas Governor', url: 'https://governor.arkansas.gov/feed/', category: 'Governor' },
  ],
  'California': [
    { id: 'ca-gov', name: 'California Governor', url: 'https://www.gov.ca.gov/feed/', category: 'Governor' },
    { id: 'ca-ag', name: 'California Attorney General', url: 'https://oag.ca.gov/news/feed', category: 'Attorney General' },
    { id: 'ca-deq', name: 'CA Air Resources Board', url: 'https://ww2.arb.ca.gov/rss.xml', category: 'Environment' },
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
    { id: 'fl-ag', name: 'Florida Attorney General', url: 'https://www.myfloridalegal.com/rss.xml', category: 'Attorney General' },
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
    { id: 'id-ag', name: 'Idaho Attorney General', url: 'https://www.ag.idaho.gov/feed/', category: 'Attorney General' },
    { id: 'id-sos', name: 'Idaho Secretary of State', url: 'https://sos.idaho.gov/feed/', category: 'Elections' },
    { id: 'id-deq', name: 'Idaho Dept. of Environmental Quality', url: 'https://www.deq.idaho.gov/feed/', category: 'Environment' },
    { id: 'id-idhw', name: 'Idaho Health & Welfare', url: 'https://healthandwelfare.idaho.gov/rss.xml', category: 'Healthcare' },
    { id: 'id-itd', name: 'Idaho Transportation Dept.', url: 'https://itd.idaho.gov/feed/', category: 'Transportation' },
    { id: 'id-isp', name: 'Idaho State Police', url: 'https://isp.idaho.gov/feed/', category: 'Public Safety' },
    { id: 'id-sde', name: 'Idaho State Dept. of Education', url: 'https://www.sde.idaho.gov/feed/', category: 'Education' },
    { id: 'id-dol', name: 'Idaho Dept. of Labor', url: 'https://www.labor.idaho.gov/feed/', category: 'Economy' },
    { id: 'id-idwr', name: 'Idaho Dept. of Water Resources', url: 'https://idwr.idaho.gov/feed/', category: 'Water' },
    { id: 'id-lands', name: 'Idaho Dept. of Lands', url: 'https://www.idl.idaho.gov/feed/', category: 'Public Lands' },
    { id: 'id-dfm', name: 'Idaho Div. of Financial Mgmt.', url: 'https://dfm.idaho.gov/feed/', category: 'Budget' },
    { id: 'id-puc', name: 'Idaho Public Utilities Commission', url: 'https://puc.idaho.gov/feed/', category: 'Utilities' },
    { id: 'id-idfg', name: 'Idaho Fish & Game', url: 'https://idfg.idaho.gov/feed', category: 'Wildlife' },
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
    { id: 'nj-ag', name: 'NJ Attorney General', url: 'https://www.njoag.gov/feed/', category: 'Attorney General' },
    { id: 'nj-dep', name: 'NJ Dept. of Environmental Protection', url: 'https://www.nj.gov/dep/newsrel/rss.xml', category: 'Environment' },
    { id: 'nj-doh', name: 'NJ Dept. of Health', url: 'https://www.nj.gov/health/news/rss.xml', category: 'Healthcare' },
  ],
  'New Mexico': [
    { id: 'nm-gov', name: 'New Mexico Governor', url: 'https://www.governor.state.nm.us/feed/', category: 'Governor' },
  ],
  'New York': [
    { id: 'ny-gov', name: 'New York Governor', url: 'https://www.governor.ny.gov/news/rss', category: 'Governor' },
    { id: 'ny-ag', name: 'NY Attorney General', url: 'https://ag.ny.gov/rss.xml', category: 'Attorney General' },
    { id: 'ny-dec', name: 'NY Dept. of Environmental Conservation', url: 'https://www.dec.ny.gov/press/rss.xml', category: 'Environment' },
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
    { id: 'tx-ag', name: 'Texas Attorney General', url: 'https://www.texasattorneygeneral.gov/news/rss.xml', category: 'Attorney General' },
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
    { id: 'wa-ag', name: 'WA Attorney General', url: 'https://www.atg.wa.gov/rss.xml', category: 'Attorney General' },
    { id: 'wa-ecology', name: 'WA Dept. of Ecology', url: 'https://ecology.wa.gov/rss/news', category: 'Environment' },
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

// Local government feeds — keyed by state name
// City councils, county commissions, local agencies
export const LOCAL_FEEDS = {
  'Idaho': [
    // City of Boise
    { id: 'id-boise', name: 'City of Boise', url: 'https://www.cityofboise.org/feed/', category: 'City' },
    { id: 'id-boise-pd', name: 'Boise Police Dept.', url: 'https://www.cityofboise.org/departments/police/feed/', category: 'Police' },
    // Ada County
    { id: 'id-ada-county', name: 'Ada County', url: 'https://adacounty.id.gov/feed/', category: 'County' },
    { id: 'id-ada-sheriff', name: 'Ada County Sheriff', url: 'https://www.adasheriff.org/feed/', category: 'Sheriff' },
    // City of Nampa
    { id: 'id-nampa', name: 'City of Nampa', url: 'https://www.cityofnampa.us/RSSFeed.aspx', category: 'City' },
    // Canyon County
    { id: 'id-canyon-county', name: 'Canyon County', url: 'https://www.canyoncounty.id.gov/feed/', category: 'County' },
    // City of Meridian
    { id: 'id-meridian', name: 'City of Meridian', url: 'https://meridiancity.org/feed/', category: 'City' },
    // City of Idaho Falls
    { id: 'id-if', name: 'City of Idaho Falls', url: 'https://www.idahofallsidaho.gov/RSSFeed.aspx', category: 'City' },
    // Bonneville County
    { id: 'id-bonneville', name: 'Bonneville County', url: 'https://www.bonnevillecountyid.gov/feed/', category: 'County' },
    // City of Pocatello
    { id: 'id-pocatello', name: 'City of Pocatello', url: 'https://www.pocatello.us/RSSFeed.aspx', category: 'City' },
    // City of Twin Falls
    { id: 'id-twinfalls', name: 'City of Twin Falls', url: 'https://www.tfid.org/RSSFeed.aspx', category: 'City' },
    // City of Coeur d\'Alene
    { id: 'id-cda', name: 'City of Coeur d\'Alene', url: 'https://www.cdaid.org/feed/', category: 'City' },
    // Kootenai County
    { id: 'id-kootenai', name: 'Kootenai County', url: 'https://www.kcgov.us/RSSFeed.aspx', category: 'County' },
    // City of Lewiston
    { id: 'id-lewiston', name: 'City of Lewiston', url: 'https://www.cityoflewiston.org/feed/', category: 'City' },
    // Nez Perce County
    { id: 'id-nezperce', name: 'Nez Perce County', url: 'https://www.nezpercecounty.org/feed/', category: 'County' },
    // ACHD (regional roads/highways)
    { id: 'id-achd', name: 'Ada County Highway District', url: 'https://achdidaho.org/feed/', category: 'Transportation' },
    // Central District Health
    { id: 'id-cdh', name: 'Central District Health', url: 'https://www.cdhd.idaho.gov/feed/', category: 'Public Health' },
    // Panhandle Health District
    { id: 'id-phd', name: 'Panhandle Health District', url: 'https://panhandlehealthdistrict.org/feed/', category: 'Public Health' },
    // Southeastern Idaho Public Health
    { id: 'id-siph', name: 'SE Idaho Public Health', url: 'https://siphidaho.org/feed/', category: 'Public Health' },
    // West Ada School District (largest in state)
    { id: 'id-westada', name: 'West Ada School District', url: 'https://www.westada.org/site/RSS.aspx', category: 'School District' },
    // Boise School District
    { id: 'id-bsd', name: 'Boise School District', url: 'https://www.boiseschools.org/site/RSS.aspx', category: 'School District' },
  ],
  'New Jersey': [
    { id: 'nj-newark', name: 'City of Newark', url: 'https://www.newarknj.gov/feed/', category: 'City' },
    { id: 'nj-jc', name: 'City of Jersey City', url: 'https://www.jerseycitynj.gov/feed/', category: 'City' },
    { id: 'nj-trenton', name: 'City of Trenton', url: 'https://www.trentonnj.org/RSSFeed.aspx', category: 'City' },
  ],
  'New York': [
    { id: 'ny-nyc', name: 'NYC Office of the Mayor', url: 'https://www.nyc.gov/office-of-the-mayor/news/rss.page', category: 'City' },
    { id: 'ny-nypd', name: 'NYPD News', url: 'https://www.nyc.gov/site/nypd/news/rss.page', category: 'Police' },
  ],
  'California': [
    { id: 'ca-la', name: 'City of Los Angeles', url: 'https://www.lamayor.org/feed', category: 'City' },
    { id: 'ca-sf', name: 'City of San Francisco', url: 'https://sfmayor.org/feed', category: 'City' },
  ],
  'Texas': [
    { id: 'tx-houston', name: 'City of Houston', url: 'https://www.houstontx.gov/rss.xml', category: 'City' },
    { id: 'tx-austin', name: 'City of Austin', url: 'https://www.austintexas.gov/rss.xml', category: 'City' },
  ],
  'Washington': [
    { id: 'wa-seattle', name: 'City of Seattle', url: 'https://www.seattle.gov/rss', category: 'City' },
    { id: 'wa-spokane', name: 'City of Spokane', url: 'https://my.spokanecity.org/feed/', category: 'City' },
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
