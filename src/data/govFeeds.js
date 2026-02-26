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
    { id: 'al-sos', name: 'AL Secretary of State', url: 'https://www.sos.alabama.gov/feed/', category: 'Elections' },
    { id: 'al-adph', name: 'AL Dept. of Public Health', url: 'https://www.alabamapublichealth.gov/feed/', category: 'Healthcare' },
    { id: 'al-adem', name: 'AL Dept. of Environmental Mgmt.', url: 'https://adem.alabama.gov/feed/', category: 'Environment' },
    { id: 'al-alsde', name: 'AL State Dept. of Education', url: 'https://www.alsde.edu/feed/', category: 'Education' },
    { id: 'al-dot', name: 'AL Dept. of Transportation', url: 'https://www.dot.state.al.us/feed/', category: 'Transportation' },
    { id: 'al-alea', name: 'AL Law Enforcement Agency', url: 'https://www.alea.gov/feed/', category: 'Public Safety' },
  ],
  'Alaska': [
    { id: 'ak-gov', name: 'Alaska Governor', url: 'https://gov.alaska.gov/feed/', category: 'Governor' },
    { id: 'ak-ag', name: 'Alaska Attorney General', url: 'https://law.alaska.gov/feed/', category: 'Attorney General' },
    { id: 'ak-sos', name: 'AK Div. of Elections', url: 'https://www.elections.alaska.gov/feed/', category: 'Elections' },
    { id: 'ak-dhss', name: 'AK Dept. of Health', url: 'https://dhss.alaska.gov/feed/', category: 'Healthcare' },
    { id: 'ak-dec', name: 'AK Dept. of Environmental Conservation', url: 'https://dec.alaska.gov/feed/', category: 'Environment' },
    { id: 'ak-deed', name: 'AK Dept. of Education', url: 'https://education.alaska.gov/feed/', category: 'Education' },
    { id: 'ak-dot', name: 'AK Dept. of Transportation', url: 'https://dot.alaska.gov/feed/', category: 'Transportation' },
    { id: 'ak-dps', name: 'AK Dept. of Public Safety', url: 'https://dps.alaska.gov/feed/', category: 'Public Safety' },
  ],
  'Arizona': [
    { id: 'az-gov', name: 'Arizona Governor', url: 'https://azgovernor.gov/feed', category: 'Governor' },
    { id: 'az-ag', name: 'Arizona Attorney General', url: 'https://www.azag.gov/rss.xml', category: 'Attorney General' },
    { id: 'az-sos', name: 'AZ Secretary of State', url: 'https://azsos.gov/feed/', category: 'Elections' },
    { id: 'az-dhs', name: 'AZ Dept. of Health Services', url: 'https://www.azdhs.gov/feed/', category: 'Healthcare' },
    { id: 'az-deq', name: 'AZ Dept. of Environmental Quality', url: 'https://www.azdeq.gov/feed/', category: 'Environment' },
    { id: 'az-ade', name: 'AZ Dept. of Education', url: 'https://www.azed.gov/feed/', category: 'Education' },
    { id: 'az-dot', name: 'AZ Dept. of Transportation', url: 'https://azdot.gov/feed/', category: 'Transportation' },
    { id: 'az-dps', name: 'AZ Dept. of Public Safety', url: 'https://www.azdps.gov/feed/', category: 'Public Safety' },
  ],
  'Arkansas': [
    { id: 'ar-gov', name: 'Arkansas Governor', url: 'https://governor.arkansas.gov/feed/', category: 'Governor' },
    { id: 'ar-ag', name: 'Arkansas Attorney General', url: 'https://arkansasag.gov/feed/', category: 'Attorney General' },
    { id: 'ar-sos', name: 'AR Secretary of State', url: 'https://www.sos.arkansas.gov/feed/', category: 'Elections' },
    { id: 'ar-adh', name: 'AR Dept. of Health', url: 'https://www.healthy.arkansas.gov/feed/', category: 'Healthcare' },
    { id: 'ar-adeq', name: 'AR Dept. of Environmental Quality', url: 'https://www.adeq.state.ar.us/feed/', category: 'Environment' },
    { id: 'ar-ade', name: 'AR Dept. of Education', url: 'https://dese.ade.arkansas.gov/feed/', category: 'Education' },
    { id: 'ar-dot', name: 'AR Dept. of Transportation', url: 'https://www.ardot.gov/feed/', category: 'Transportation' },
    { id: 'ar-asp', name: 'Arkansas State Police', url: 'https://asp.arkansas.gov/feed/', category: 'Public Safety' },
  ],
  'California': [
    { id: 'ca-gov', name: 'California Governor', url: 'https://www.gov.ca.gov/feed/', category: 'Governor' },
    { id: 'ca-ag', name: 'California Attorney General', url: 'https://oag.ca.gov/news/feed', category: 'Attorney General' },
    { id: 'ca-sos', name: 'CA Secretary of State', url: 'https://www.sos.ca.gov/feed/', category: 'Elections' },
    { id: 'ca-cdph', name: 'CA Dept. of Public Health', url: 'https://www.cdph.ca.gov/feed/', category: 'Healthcare' },
    { id: 'ca-deq', name: 'CA Air Resources Board', url: 'https://ww2.arb.ca.gov/rss.xml', category: 'Environment' },
    { id: 'ca-cde', name: 'CA Dept. of Education', url: 'https://www.cde.ca.gov/feed/', category: 'Education' },
    { id: 'ca-dot', name: 'Caltrans', url: 'https://dot.ca.gov/feed/', category: 'Transportation' },
    { id: 'ca-chp', name: 'CA Highway Patrol', url: 'https://www.chp.ca.gov/feed/', category: 'Public Safety' },
  ],
  'Colorado': [
    { id: 'co-gov', name: 'Colorado Governor', url: 'https://www.colorado.gov/governor/rss.xml', category: 'Governor' },
    { id: 'co-ag', name: 'Colorado Attorney General', url: 'https://coag.gov/feed/', category: 'Attorney General' },
    { id: 'co-sos', name: 'CO Secretary of State', url: 'https://www.sos.state.co.us/feed/', category: 'Elections' },
    { id: 'co-cdphe', name: 'CO Dept. of Public Health & Environment', url: 'https://cdphe.colorado.gov/feed/', category: 'Healthcare' },
    { id: 'co-cde', name: 'CO Dept. of Education', url: 'https://www.cde.state.co.us/feed/', category: 'Education' },
    { id: 'co-dot', name: 'CO Dept. of Transportation', url: 'https://www.codot.gov/feed/', category: 'Transportation' },
    { id: 'co-csp', name: 'Colorado State Patrol', url: 'https://csp.colorado.gov/feed/', category: 'Public Safety' },
  ],
  'Connecticut': [
    { id: 'ct-gov', name: 'Connecticut Governor', url: 'https://portal.ct.gov/governor/news/rss', category: 'Governor' },
    { id: 'ct-ag', name: 'Connecticut Attorney General', url: 'https://portal.ct.gov/ag/feed/', category: 'Attorney General' },
    { id: 'ct-sots', name: 'CT Secretary of the State', url: 'https://portal.ct.gov/sots/feed/', category: 'Elections' },
    { id: 'ct-dph', name: 'CT Dept. of Public Health', url: 'https://portal.ct.gov/dph/feed/', category: 'Healthcare' },
    { id: 'ct-deep', name: 'CT Dept. of Energy & Environmental Protection', url: 'https://portal.ct.gov/deep/feed/', category: 'Environment' },
    { id: 'ct-sde', name: 'CT State Dept. of Education', url: 'https://portal.ct.gov/sde/feed/', category: 'Education' },
    { id: 'ct-dot', name: 'CT Dept. of Transportation', url: 'https://portal.ct.gov/dot/feed/', category: 'Transportation' },
    { id: 'ct-despp', name: 'CT Dept. of Emergency Services & Public Protection', url: 'https://portal.ct.gov/despp/feed/', category: 'Public Safety' },
  ],
  'Delaware': [
    { id: 'de-gov', name: 'Delaware Governor', url: 'https://governor.delaware.gov/feed/', category: 'Governor' },
    { id: 'de-ag', name: 'Delaware Attorney General', url: 'https://attorney.delaware.gov/feed/', category: 'Attorney General' },
    { id: 'de-sos', name: 'DE Secretary of State', url: 'https://sos.delaware.gov/feed/', category: 'Elections' },
    { id: 'de-dhss', name: 'DE Dept. of Health & Social Services', url: 'https://dhss.delaware.gov/feed/', category: 'Healthcare' },
    { id: 'de-dnrec', name: 'DE Dept. of Natural Resources & Environmental Control', url: 'https://dnrec.delaware.gov/feed/', category: 'Environment' },
    { id: 'de-doe', name: 'DE Dept. of Education', url: 'https://www.doe.k12.de.us/feed/', category: 'Education' },
    { id: 'de-dot', name: 'DelDOT', url: 'https://deldot.gov/feed/', category: 'Transportation' },
    { id: 'de-dsp', name: 'Delaware State Police', url: 'https://dsp.delaware.gov/feed/', category: 'Public Safety' },
  ],
  'Florida': [
    { id: 'fl-gov', name: 'Florida Governor', url: 'https://www.flgov.com/feed/', category: 'Governor' },
    { id: 'fl-ag', name: 'Florida Attorney General', url: 'https://www.myfloridalegal.com/rss.xml', category: 'Attorney General' },
    { id: 'fl-dos', name: 'FL Dept. of State', url: 'https://dos.myflorida.com/feed/', category: 'Elections' },
    { id: 'fl-doh', name: 'FL Dept. of Health', url: 'https://www.floridahealth.gov/feed/', category: 'Healthcare' },
    { id: 'fl-dep', name: 'FL Dept. of Environmental Protection', url: 'https://floridadep.gov/feed/', category: 'Environment' },
    { id: 'fl-doe', name: 'FL Dept. of Education', url: 'https://www.fldoe.org/feed/', category: 'Education' },
    { id: 'fl-dot', name: 'FL Dept. of Transportation', url: 'https://www.fdot.gov/feed/', category: 'Transportation' },
    { id: 'fl-fdle', name: 'FL Dept. of Law Enforcement', url: 'https://www.fdle.state.fl.us/feed/', category: 'Public Safety' },
  ],
  'Georgia': [
    { id: 'ga-gov', name: 'Georgia Governor', url: 'https://gov.georgia.gov/press-releases/feed', category: 'Governor' },
    { id: 'ga-ag', name: 'Georgia Attorney General', url: 'https://law.georgia.gov/feed/', category: 'Attorney General' },
    { id: 'ga-sos', name: 'GA Secretary of State', url: 'https://sos.ga.gov/feed/', category: 'Elections' },
    { id: 'ga-dph', name: 'GA Dept. of Public Health', url: 'https://dph.georgia.gov/feed/', category: 'Healthcare' },
    { id: 'ga-epd', name: 'GA Environmental Protection Div.', url: 'https://epd.georgia.gov/feed/', category: 'Environment' },
    { id: 'ga-doe', name: 'GA Dept. of Education', url: 'https://www.gadoe.org/feed/', category: 'Education' },
    { id: 'ga-dot', name: 'GA Dept. of Transportation', url: 'https://www.dot.ga.gov/feed/', category: 'Transportation' },
    { id: 'ga-dps', name: 'GA Dept. of Public Safety', url: 'https://dps.georgia.gov/feed/', category: 'Public Safety' },
  ],
  'Hawaii': [
    { id: 'hi-gov', name: 'Hawaii Governor', url: 'https://governor.hawaii.gov/feed/', category: 'Governor' },
    { id: 'hi-ag', name: 'Hawaii Attorney General', url: 'https://ag.hawaii.gov/feed/', category: 'Attorney General' },
    { id: 'hi-elections', name: 'HI Office of Elections', url: 'https://elections.hawaii.gov/feed/', category: 'Elections' },
    { id: 'hi-doh', name: 'HI Dept. of Health', url: 'https://health.hawaii.gov/feed/', category: 'Healthcare' },
    { id: 'hi-doe', name: 'HI Dept. of Education', url: 'https://www.hawaiipublicschools.org/feed/', category: 'Education' },
    { id: 'hi-dot', name: 'HI Dept. of Transportation', url: 'https://hidot.hawaii.gov/feed/', category: 'Transportation' },
    { id: 'hi-dps', name: 'HI Dept. of Public Safety', url: 'https://dps.hawaii.gov/feed/', category: 'Public Safety' },
  ],
  'Idaho': [
    { id: 'id-gov', name: 'Idaho Governor', url: 'https://gov.idaho.gov/feed/', category: 'Governor' },
    { id: 'id-ag', name: 'Idaho Attorney General', url: 'https://www.ag.idaho.gov/feed/', category: 'Attorney General' },
    { id: 'id-sos', name: 'Idaho Secretary of State', url: 'https://sos.idaho.gov/feed/', category: 'Elections' },
    { id: 'id-idhw', name: 'Idaho Health & Welfare', url: 'https://healthandwelfare.idaho.gov/rss.xml', category: 'Healthcare' },
    { id: 'id-deq', name: 'Idaho Dept. of Environmental Quality', url: 'https://www.deq.idaho.gov/feed/', category: 'Environment' },
    { id: 'id-sde', name: 'Idaho State Dept. of Education', url: 'https://www.sde.idaho.gov/feed/', category: 'Education' },
    { id: 'id-itd', name: 'Idaho Transportation Dept.', url: 'https://itd.idaho.gov/feed/', category: 'Transportation' },
    { id: 'id-isp', name: 'Idaho State Police', url: 'https://isp.idaho.gov/feed/', category: 'Public Safety' },
  ],
  'Illinois': [
    { id: 'il-gov', name: 'Illinois Governor', url: 'https://gov.illinois.gov/news/rss', category: 'Governor' },
    { id: 'il-ag', name: 'Illinois Attorney General', url: 'https://illinoisattorneygeneral.gov/feed/', category: 'Attorney General' },
    { id: 'il-sos', name: 'IL Secretary of State', url: 'https://www.ilsos.gov/feed/', category: 'Elections' },
    { id: 'il-dph', name: 'IL Dept. of Public Health', url: 'https://dph.illinois.gov/feed/', category: 'Healthcare' },
    { id: 'il-epa', name: 'Illinois EPA', url: 'https://epa.illinois.gov/feed/', category: 'Environment' },
    { id: 'il-isbe', name: 'IL State Board of Education', url: 'https://www.isbe.net/feed/', category: 'Education' },
    { id: 'il-dot', name: 'IL Dept. of Transportation', url: 'https://idot.illinois.gov/feed/', category: 'Transportation' },
    { id: 'il-isp', name: 'Illinois State Police', url: 'https://isp.illinois.gov/feed/', category: 'Public Safety' },
  ],
  'Indiana': [
    { id: 'in-gov', name: 'Indiana Governor', url: 'https://www.in.gov/gov/rss.xml', category: 'Governor' },
    { id: 'in-ag', name: 'Indiana Attorney General', url: 'https://www.in.gov/attorneygeneral/feed/', category: 'Attorney General' },
    { id: 'in-sos', name: 'IN Secretary of State', url: 'https://www.in.gov/sos/feed/', category: 'Elections' },
    { id: 'in-isdh', name: 'IN State Dept. of Health', url: 'https://www.in.gov/health/feed/', category: 'Healthcare' },
    { id: 'in-idem', name: 'IN Dept. of Environmental Mgmt.', url: 'https://www.in.gov/idem/feed/', category: 'Environment' },
    { id: 'in-doe', name: 'IN Dept. of Education', url: 'https://www.in.gov/doe/feed/', category: 'Education' },
    { id: 'in-dot', name: 'IN Dept. of Transportation', url: 'https://www.in.gov/indot/feed/', category: 'Transportation' },
    { id: 'in-isp', name: 'Indiana State Police', url: 'https://www.in.gov/isp/feed/', category: 'Public Safety' },
  ],
  'Iowa': [
    { id: 'ia-gov', name: 'Iowa Governor', url: 'https://governor.iowa.gov/feed/', category: 'Governor' },
    { id: 'ia-ag', name: 'Iowa Attorney General', url: 'https://www.iowaattorneygeneral.gov/feed/', category: 'Attorney General' },
    { id: 'ia-sos', name: 'IA Secretary of State', url: 'https://sos.iowa.gov/feed/', category: 'Elections' },
    { id: 'ia-idph', name: 'IA Dept. of Public Health', url: 'https://idph.iowa.gov/feed/', category: 'Healthcare' },
    { id: 'ia-dnr', name: 'IA Dept. of Natural Resources', url: 'https://www.iowadnr.gov/feed/', category: 'Environment' },
    { id: 'ia-doe', name: 'IA Dept. of Education', url: 'https://educateiowa.gov/feed/', category: 'Education' },
    { id: 'ia-dot', name: 'IA Dept. of Transportation', url: 'https://iowadot.gov/feed/', category: 'Transportation' },
    { id: 'ia-dps', name: 'IA Dept. of Public Safety', url: 'https://dps.iowa.gov/feed/', category: 'Public Safety' },
  ],
  'Kansas': [
    { id: 'ks-gov', name: 'Kansas Governor', url: 'https://governor.kansas.gov/feed/', category: 'Governor' },
    { id: 'ks-ag', name: 'Kansas Attorney General', url: 'https://ag.ks.gov/feed/', category: 'Attorney General' },
    { id: 'ks-sos', name: 'KS Secretary of State', url: 'https://sos.ks.gov/feed/', category: 'Elections' },
    { id: 'ks-kdhe', name: 'KS Dept. of Health & Environment', url: 'https://www.kdhe.ks.gov/feed/', category: 'Healthcare' },
    { id: 'ks-ksde', name: 'KS State Dept. of Education', url: 'https://www.ksde.org/feed/', category: 'Education' },
    { id: 'ks-dot', name: 'KS Dept. of Transportation', url: 'https://www.ksdot.gov/feed/', category: 'Transportation' },
    { id: 'ks-kbi', name: 'Kansas Bureau of Investigation', url: 'https://www.kbi.ks.gov/feed/', category: 'Public Safety' },
  ],
  'Kentucky': [
    { id: 'ky-gov', name: 'Kentucky Governor', url: 'https://governor.ky.gov/news/rss', category: 'Governor' },
    { id: 'ky-ag', name: 'Kentucky Attorney General', url: 'https://ag.ky.gov/feed/', category: 'Attorney General' },
    { id: 'ky-sos', name: 'KY Secretary of State', url: 'https://sos.ky.gov/feed/', category: 'Elections' },
    { id: 'ky-chfs', name: 'KY Cabinet for Health & Family Services', url: 'https://chfs.ky.gov/feed/', category: 'Healthcare' },
    { id: 'ky-eec', name: 'KY Energy & Environment Cabinet', url: 'https://eec.ky.gov/feed/', category: 'Environment' },
    { id: 'ky-kde', name: 'KY Dept. of Education', url: 'https://education.ky.gov/feed/', category: 'Education' },
    { id: 'ky-dot', name: 'KY Transportation Cabinet', url: 'https://transportation.ky.gov/feed/', category: 'Transportation' },
    { id: 'ky-ksp', name: 'Kentucky State Police', url: 'https://kentuckystatepolice.gov/feed/', category: 'Public Safety' },
  ],
  'Louisiana': [
    { id: 'la-gov', name: 'Louisiana Governor', url: 'https://gov.louisiana.gov/feed/', category: 'Governor' },
    { id: 'la-ag', name: 'Louisiana Attorney General', url: 'https://ag.louisiana.gov/feed/', category: 'Attorney General' },
    { id: 'la-sos', name: 'LA Secretary of State', url: 'https://www.sos.la.gov/feed/', category: 'Elections' },
    { id: 'la-ldh', name: 'LA Dept. of Health', url: 'https://ldh.la.gov/feed/', category: 'Healthcare' },
    { id: 'la-deq', name: 'LA Dept. of Environmental Quality', url: 'https://deq.louisiana.gov/feed/', category: 'Environment' },
    { id: 'la-doe', name: 'LA Dept. of Education', url: 'https://www.louisianabelieves.com/feed/', category: 'Education' },
    { id: 'la-dot', name: 'LA Dept. of Transportation', url: 'https://wwwsp.dotd.la.gov/feed/', category: 'Transportation' },
    { id: 'la-lsp', name: 'Louisiana State Police', url: 'https://lsp.org/feed/', category: 'Public Safety' },
  ],
  'Maine': [
    { id: 'me-gov', name: 'Maine Governor', url: 'https://www.maine.gov/governor/feed/', category: 'Governor' },
    { id: 'me-ag', name: 'Maine Attorney General', url: 'https://www.maine.gov/ag/feed/', category: 'Attorney General' },
    { id: 'me-sos', name: 'ME Secretary of State', url: 'https://www.maine.gov/sos/feed/', category: 'Elections' },
    { id: 'me-dhhs', name: 'ME Dept. of Health & Human Services', url: 'https://www.maine.gov/dhhs/feed/', category: 'Healthcare' },
    { id: 'me-dep', name: 'ME Dept. of Environmental Protection', url: 'https://www.maine.gov/dep/feed/', category: 'Environment' },
    { id: 'me-doe', name: 'ME Dept. of Education', url: 'https://www.maine.gov/doe/feed/', category: 'Education' },
    { id: 'me-dot', name: 'MaineDOT', url: 'https://www.maine.gov/mdot/feed/', category: 'Transportation' },
    { id: 'me-dps', name: 'ME Dept. of Public Safety', url: 'https://www.maine.gov/dps/feed/', category: 'Public Safety' },
  ],
  'Maryland': [
    { id: 'md-gov', name: 'Maryland Governor', url: 'https://governor.maryland.gov/feed/', category: 'Governor' },
    { id: 'md-ag', name: 'Maryland Attorney General', url: 'https://www.marylandattorneygeneral.gov/feed/', category: 'Attorney General' },
    { id: 'md-sos', name: 'MD Secretary of State', url: 'https://sos.maryland.gov/feed/', category: 'Elections' },
    { id: 'md-mdh', name: 'MD Dept. of Health', url: 'https://health.maryland.gov/feed/', category: 'Healthcare' },
    { id: 'md-mde', name: 'MD Dept. of the Environment', url: 'https://mde.maryland.gov/feed/', category: 'Environment' },
    { id: 'md-msde', name: 'MD State Dept. of Education', url: 'https://www.marylandpublicschools.org/feed/', category: 'Education' },
    { id: 'md-dot', name: 'MD Dept. of Transportation', url: 'https://mdot.maryland.gov/feed/', category: 'Transportation' },
    { id: 'md-mdsp', name: 'Maryland State Police', url: 'https://mdsp.maryland.gov/feed/', category: 'Public Safety' },
  ],
  'Massachusetts': [
    { id: 'ma-gov', name: 'Massachusetts Governor', url: 'https://www.mass.gov/news/rss', category: 'Governor' },
    { id: 'ma-ag', name: 'Massachusetts Attorney General', url: 'https://www.mass.gov/ago/feed/', category: 'Attorney General' },
    { id: 'ma-sos', name: 'MA Secretary of the Commonwealth', url: 'https://www.sec.state.ma.us/feed/', category: 'Elections' },
    { id: 'ma-dph', name: 'MA Dept. of Public Health', url: 'https://www.mass.gov/dph/feed/', category: 'Healthcare' },
    { id: 'ma-eea', name: 'MA Executive Office of Energy & Environmental Affairs', url: 'https://www.mass.gov/eea/feed/', category: 'Environment' },
    { id: 'ma-dese', name: 'MA Dept. of Elementary & Secondary Education', url: 'https://www.doe.mass.edu/feed/', category: 'Education' },
    { id: 'ma-dot', name: 'MassDOT', url: 'https://www.mass.gov/massdot/feed/', category: 'Transportation' },
    { id: 'ma-msp', name: 'Massachusetts State Police', url: 'https://www.mass.gov/msp/feed/', category: 'Public Safety' },
  ],
  'Michigan': [
    { id: 'mi-gov', name: 'Michigan Governor', url: 'https://www.michigan.gov/whitmer/news/rss', category: 'Governor' },
    { id: 'mi-ag', name: 'Michigan Attorney General', url: 'https://www.michigan.gov/ag/feed/', category: 'Attorney General' },
    { id: 'mi-sos', name: 'MI Secretary of State', url: 'https://www.michigan.gov/sos/feed/', category: 'Elections' },
    { id: 'mi-mdhhs', name: 'MI Dept. of Health & Human Services', url: 'https://www.michigan.gov/mdhhs/feed/', category: 'Healthcare' },
    { id: 'mi-egle', name: 'MI Dept. of Environment, Great Lakes & Energy', url: 'https://www.michigan.gov/egle/feed/', category: 'Environment' },
    { id: 'mi-mde', name: 'MI Dept. of Education', url: 'https://www.michigan.gov/mde/feed/', category: 'Education' },
    { id: 'mi-dot', name: 'MI Dept. of Transportation', url: 'https://www.michigan.gov/mdot/feed/', category: 'Transportation' },
    { id: 'mi-msp', name: 'Michigan State Police', url: 'https://www.michigan.gov/msp/feed/', category: 'Public Safety' },
  ],
  'Minnesota': [
    { id: 'mn-gov', name: 'Minnesota Governor', url: 'https://mn.gov/governor/news/rss', category: 'Governor' },
    { id: 'mn-ag', name: 'Minnesota Attorney General', url: 'https://www.ag.state.mn.us/feed/', category: 'Attorney General' },
    { id: 'mn-sos', name: 'MN Secretary of State', url: 'https://www.sos.state.mn.us/feed/', category: 'Elections' },
    { id: 'mn-mdh', name: 'MN Dept. of Health', url: 'https://www.health.state.mn.us/feed/', category: 'Healthcare' },
    { id: 'mn-pca', name: 'MN Pollution Control Agency', url: 'https://www.pca.state.mn.us/feed/', category: 'Environment' },
    { id: 'mn-mde', name: 'MN Dept. of Education', url: 'https://education.mn.gov/feed/', category: 'Education' },
    { id: 'mn-dot', name: 'MN Dept. of Transportation', url: 'https://www.dot.state.mn.us/feed/', category: 'Transportation' },
    { id: 'mn-dps', name: 'MN Dept. of Public Safety', url: 'https://dps.mn.gov/feed/', category: 'Public Safety' },
  ],
  'Mississippi': [
    { id: 'ms-gov', name: 'Mississippi Governor', url: 'https://governorreeves.ms.gov/feed/', category: 'Governor' },
    { id: 'ms-ag', name: 'Mississippi Attorney General', url: 'https://www.ago.state.ms.us/feed/', category: 'Attorney General' },
    { id: 'ms-sos', name: 'MS Secretary of State', url: 'https://www.sos.ms.gov/feed/', category: 'Elections' },
    { id: 'ms-msdh', name: 'MS State Dept. of Health', url: 'https://msdh.ms.gov/feed/', category: 'Healthcare' },
    { id: 'ms-mdeq', name: 'MS Dept. of Environmental Quality', url: 'https://www.mdeq.ms.gov/feed/', category: 'Environment' },
    { id: 'ms-mde', name: 'MS Dept. of Education', url: 'https://www.mdek12.org/feed/', category: 'Education' },
    { id: 'ms-dot', name: 'MS Dept. of Transportation', url: 'https://mdot.ms.gov/feed/', category: 'Transportation' },
    { id: 'ms-dps', name: 'MS Dept. of Public Safety', url: 'https://www.dps.ms.gov/feed/', category: 'Public Safety' },
  ],
  'Missouri': [
    { id: 'mo-gov', name: 'Missouri Governor', url: 'https://governor.mo.gov/press-releases/feed', category: 'Governor' },
    { id: 'mo-ag', name: 'Missouri Attorney General', url: 'https://ago.mo.gov/feed/', category: 'Attorney General' },
    { id: 'mo-sos', name: 'MO Secretary of State', url: 'https://www.sos.mo.gov/feed/', category: 'Elections' },
    { id: 'mo-dhss', name: 'MO Dept. of Health & Senior Services', url: 'https://health.mo.gov/feed/', category: 'Healthcare' },
    { id: 'mo-dnr', name: 'MO Dept. of Natural Resources', url: 'https://dnr.mo.gov/feed/', category: 'Environment' },
    { id: 'mo-dese', name: 'MO Dept. of Elementary & Secondary Education', url: 'https://dese.mo.gov/feed/', category: 'Education' },
    { id: 'mo-dot', name: 'MoDOT', url: 'https://www.modot.org/feed/', category: 'Transportation' },
    { id: 'mo-mshp', name: 'Missouri State Highway Patrol', url: 'https://www.mshp.dps.missouri.gov/feed/', category: 'Public Safety' },
  ],
  'Montana': [
    { id: 'mt-gov', name: 'Montana Governor', url: 'https://governor.mt.gov/feed/', category: 'Governor' },
    { id: 'mt-ag', name: 'Montana Attorney General', url: 'https://dojmt.gov/feed/', category: 'Attorney General' },
    { id: 'mt-sos', name: 'MT Secretary of State', url: 'https://sosmt.gov/feed/', category: 'Elections' },
    { id: 'mt-dphhs', name: 'MT Dept. of Public Health & Human Services', url: 'https://dphhs.mt.gov/feed/', category: 'Healthcare' },
    { id: 'mt-deq', name: 'MT Dept. of Environmental Quality', url: 'https://deq.mt.gov/feed/', category: 'Environment' },
    { id: 'mt-opi', name: 'MT Office of Public Instruction', url: 'https://opi.mt.gov/feed/', category: 'Education' },
    { id: 'mt-dot', name: 'MT Dept. of Transportation', url: 'https://www.mdt.mt.gov/feed/', category: 'Transportation' },
    { id: 'mt-mhp', name: 'Montana Highway Patrol', url: 'https://dojmt.gov/highway-patrol/feed/', category: 'Public Safety' },
  ],
  'Nebraska': [
    { id: 'ne-gov', name: 'Nebraska Governor', url: 'https://governor.nebraska.gov/feed/', category: 'Governor' },
    { id: 'ne-ag', name: 'Nebraska Attorney General', url: 'https://ago.nebraska.gov/feed/', category: 'Attorney General' },
    { id: 'ne-sos', name: 'NE Secretary of State', url: 'https://sos.nebraska.gov/feed/', category: 'Elections' },
    { id: 'ne-dhhs', name: 'NE Dept. of Health & Human Services', url: 'https://dhhs.ne.gov/feed/', category: 'Healthcare' },
    { id: 'ne-ndeq', name: 'NE Dept. of Environment & Energy', url: 'https://deq.state.ne.us/feed/', category: 'Environment' },
    { id: 'ne-nde', name: 'NE Dept. of Education', url: 'https://www.education.ne.gov/feed/', category: 'Education' },
    { id: 'ne-dot', name: 'NE Dept. of Transportation', url: 'https://dot.nebraska.gov/feed/', category: 'Transportation' },
    { id: 'ne-nsp', name: 'Nebraska State Patrol', url: 'https://statepatrol.nebraska.gov/feed/', category: 'Public Safety' },
  ],
  'Nevada': [
    { id: 'nv-gov', name: 'Nevada Governor', url: 'https://gov.nv.gov/News/Press_Releases/rss/', category: 'Governor' },
    { id: 'nv-ag', name: 'Nevada Attorney General', url: 'https://ag.nv.gov/feed/', category: 'Attorney General' },
    { id: 'nv-sos', name: 'NV Secretary of State', url: 'https://www.nvsos.gov/feed/', category: 'Elections' },
    { id: 'nv-dpbh', name: 'NV Div. of Public & Behavioral Health', url: 'https://dpbh.nv.gov/feed/', category: 'Healthcare' },
    { id: 'nv-ndep', name: 'NV Div. of Environmental Protection', url: 'https://ndep.nv.gov/feed/', category: 'Environment' },
    { id: 'nv-doe', name: 'NV Dept. of Education', url: 'https://doe.nv.gov/feed/', category: 'Education' },
    { id: 'nv-dot', name: 'NV Dept. of Transportation', url: 'https://www.dot.nv.gov/feed/', category: 'Transportation' },
    { id: 'nv-nhp', name: 'Nevada Highway Patrol', url: 'https://nhp.nv.gov/feed/', category: 'Public Safety' },
  ],
  'New Hampshire': [
    { id: 'nh-gov', name: 'New Hampshire Governor', url: 'https://www.governor.nh.gov/news/rss', category: 'Governor' },
    { id: 'nh-ag', name: 'NH Attorney General', url: 'https://www.doj.nh.gov/feed/', category: 'Attorney General' },
    { id: 'nh-sos', name: 'NH Secretary of State', url: 'https://www.sos.nh.gov/feed/', category: 'Elections' },
    { id: 'nh-dhhs', name: 'NH Dept. of Health & Human Services', url: 'https://www.dhhs.nh.gov/feed/', category: 'Healthcare' },
    { id: 'nh-des', name: 'NH Dept. of Environmental Services', url: 'https://www.des.nh.gov/feed/', category: 'Environment' },
    { id: 'nh-doe', name: 'NH Dept. of Education', url: 'https://www.education.nh.gov/feed/', category: 'Education' },
    { id: 'nh-dot', name: 'NH Dept. of Transportation', url: 'https://www.nh.gov/dot/feed/', category: 'Transportation' },
    { id: 'nh-dos', name: 'NH Div. of State Police', url: 'https://www.nh.gov/safety/feed/', category: 'Public Safety' },
  ],
  'New Jersey': [
    { id: 'nj-gov', name: 'New Jersey Governor', url: 'https://www.nj.gov/governor/news/news/rss.xml', category: 'Governor' },
    { id: 'nj-ag', name: 'NJ Attorney General', url: 'https://www.njoag.gov/feed/', category: 'Attorney General' },
    { id: 'nj-sos', name: 'NJ Secretary of State', url: 'https://www.nj.gov/state/feed/', category: 'Elections' },
    { id: 'nj-doh', name: 'NJ Dept. of Health', url: 'https://www.nj.gov/health/news/rss.xml', category: 'Healthcare' },
    { id: 'nj-dep', name: 'NJ Dept. of Environmental Protection', url: 'https://www.nj.gov/dep/newsrel/rss.xml', category: 'Environment' },
    { id: 'nj-doe', name: 'NJ Dept. of Education', url: 'https://www.nj.gov/education/feed/', category: 'Education' },
    { id: 'nj-dot', name: 'NJ Dept. of Transportation', url: 'https://www.nj.gov/transportation/feed/', category: 'Transportation' },
    { id: 'nj-njsp', name: 'NJ State Police', url: 'https://www.njsp.org/feed/', category: 'Public Safety' },
  ],
  'New Mexico': [
    { id: 'nm-gov', name: 'New Mexico Governor', url: 'https://www.governor.state.nm.us/feed/', category: 'Governor' },
    { id: 'nm-ag', name: 'New Mexico Attorney General', url: 'https://www.nmag.gov/feed/', category: 'Attorney General' },
    { id: 'nm-sos', name: 'NM Secretary of State', url: 'https://www.sos.state.nm.us/feed/', category: 'Elections' },
    { id: 'nm-doh', name: 'NM Dept. of Health', url: 'https://www.nmhealth.org/feed/', category: 'Healthcare' },
    { id: 'nm-nmed', name: 'NM Environment Dept.', url: 'https://www.env.nm.gov/feed/', category: 'Environment' },
    { id: 'nm-ped', name: 'NM Public Education Dept.', url: 'https://webnew.ped.state.nm.us/feed/', category: 'Education' },
    { id: 'nm-dot', name: 'NM Dept. of Transportation', url: 'https://dot.state.nm.us/feed/', category: 'Transportation' },
    { id: 'nm-nmsp', name: 'NM State Police', url: 'https://www.nmsp.dps.state.nm.us/feed/', category: 'Public Safety' },
  ],
  'New York': [
    { id: 'ny-gov', name: 'New York Governor', url: 'https://www.governor.ny.gov/news/rss', category: 'Governor' },
    { id: 'ny-ag', name: 'NY Attorney General', url: 'https://ag.ny.gov/rss.xml', category: 'Attorney General' },
    { id: 'ny-dos', name: 'NY Dept. of State', url: 'https://dos.ny.gov/feed/', category: 'Elections' },
    { id: 'ny-doh', name: 'NY Dept. of Health', url: 'https://www.health.ny.gov/feed/', category: 'Healthcare' },
    { id: 'ny-dec', name: 'NY Dept. of Environmental Conservation', url: 'https://www.dec.ny.gov/press/rss.xml', category: 'Environment' },
    { id: 'ny-nysed', name: 'NY State Education Dept.', url: 'https://www.nysed.gov/feed/', category: 'Education' },
    { id: 'ny-dot', name: 'NY Dept. of Transportation', url: 'https://www.dot.ny.gov/feed/', category: 'Transportation' },
    { id: 'ny-nysp', name: 'NY State Police', url: 'https://troopers.ny.gov/feed/', category: 'Public Safety' },
  ],
  'North Carolina': [
    { id: 'nc-gov', name: 'North Carolina Governor', url: 'https://governor.nc.gov/news/press-releases/rss', category: 'Governor' },
    { id: 'nc-ag', name: 'NC Attorney General', url: 'https://ncdoj.gov/feed/', category: 'Attorney General' },
    { id: 'nc-sos', name: 'NC Secretary of State', url: 'https://www.sosnc.gov/feed/', category: 'Elections' },
    { id: 'nc-dhhs', name: 'NC Dept. of Health & Human Services', url: 'https://www.ncdhhs.gov/feed/', category: 'Healthcare' },
    { id: 'nc-deq', name: 'NC Dept. of Environmental Quality', url: 'https://deq.nc.gov/feed/', category: 'Environment' },
    { id: 'nc-dpi', name: 'NC Dept. of Public Instruction', url: 'https://www.dpi.nc.gov/feed/', category: 'Education' },
    { id: 'nc-dot', name: 'NC Dept. of Transportation', url: 'https://www.ncdot.gov/feed/', category: 'Transportation' },
    { id: 'nc-dps', name: 'NC Dept. of Public Safety', url: 'https://www.ncdps.gov/feed/', category: 'Public Safety' },
  ],
  'North Dakota': [
    { id: 'nd-gov', name: 'North Dakota Governor', url: 'https://www.governor.nd.gov/news/rss', category: 'Governor' },
    { id: 'nd-ag', name: 'North Dakota Attorney General', url: 'https://ag.nd.gov/feed/', category: 'Attorney General' },
    { id: 'nd-sos', name: 'ND Secretary of State', url: 'https://sos.nd.gov/feed/', category: 'Elections' },
    { id: 'nd-ndh', name: 'ND Dept. of Health', url: 'https://www.health.nd.gov/feed/', category: 'Healthcare' },
    { id: 'nd-deq', name: 'ND Dept. of Environmental Quality', url: 'https://deq.nd.gov/feed/', category: 'Environment' },
    { id: 'nd-dpi', name: 'ND Dept. of Public Instruction', url: 'https://www.nd.gov/dpi/feed/', category: 'Education' },
    { id: 'nd-dot', name: 'ND Dept. of Transportation', url: 'https://www.dot.nd.gov/feed/', category: 'Transportation' },
    { id: 'nd-ndhp', name: 'ND Highway Patrol', url: 'https://www.nd.gov/ndhp/feed/', category: 'Public Safety' },
  ],
  'Ohio': [
    { id: 'oh-gov', name: 'Ohio Governor', url: 'https://governor.ohio.gov/media/news-and-media/rss', category: 'Governor' },
    { id: 'oh-ag', name: 'Ohio Attorney General', url: 'https://www.ohioattorneygeneral.gov/feed/', category: 'Attorney General' },
    { id: 'oh-sos', name: 'OH Secretary of State', url: 'https://www.ohiosos.gov/feed/', category: 'Elections' },
    { id: 'oh-odh', name: 'OH Dept. of Health', url: 'https://odh.ohio.gov/feed/', category: 'Healthcare' },
    { id: 'oh-epa', name: 'Ohio EPA', url: 'https://epa.ohio.gov/feed/', category: 'Environment' },
    { id: 'oh-ode', name: 'OH Dept. of Education', url: 'https://education.ohio.gov/feed/', category: 'Education' },
    { id: 'oh-dot', name: 'OH Dept. of Transportation', url: 'https://www.transportation.ohio.gov/feed/', category: 'Transportation' },
    { id: 'oh-oshp', name: 'Ohio State Highway Patrol', url: 'https://statepatrol.ohio.gov/feed/', category: 'Public Safety' },
  ],
  'Oklahoma': [
    { id: 'ok-gov', name: 'Oklahoma Governor', url: 'https://www.governor.ok.gov/feed/', category: 'Governor' },
    { id: 'ok-ag', name: 'Oklahoma Attorney General', url: 'https://www.oag.ok.gov/feed/', category: 'Attorney General' },
    { id: 'ok-sos', name: 'OK Secretary of State', url: 'https://www.sos.ok.gov/feed/', category: 'Elections' },
    { id: 'ok-osdh', name: 'OK State Dept. of Health', url: 'https://oklahoma.gov/health/feed/', category: 'Healthcare' },
    { id: 'ok-deq', name: 'OK Dept. of Environmental Quality', url: 'https://www.deq.ok.gov/feed/', category: 'Environment' },
    { id: 'ok-sde', name: 'OK State Dept. of Education', url: 'https://sde.ok.gov/feed/', category: 'Education' },
    { id: 'ok-dot', name: 'OK Dept. of Transportation', url: 'https://oklahoma.gov/odot/feed/', category: 'Transportation' },
    { id: 'ok-dps', name: 'OK Dept. of Public Safety', url: 'https://oklahoma.gov/dps/feed/', category: 'Public Safety' },
  ],
  'Oregon': [
    { id: 'or-gov', name: 'Oregon Governor', url: 'https://www.oregon.gov/governor/Pages/rss.aspx', category: 'Governor' },
    { id: 'or-ag', name: 'Oregon Attorney General', url: 'https://www.doj.state.or.us/feed/', category: 'Attorney General' },
    { id: 'or-sos', name: 'OR Secretary of State', url: 'https://sos.oregon.gov/feed/', category: 'Elections' },
    { id: 'or-oha', name: 'OR Health Authority', url: 'https://www.oregon.gov/oha/feed/', category: 'Healthcare' },
    { id: 'or-deq', name: 'OR Dept. of Environmental Quality', url: 'https://www.oregon.gov/deq/feed/', category: 'Environment' },
    { id: 'or-ode', name: 'OR Dept. of Education', url: 'https://www.oregon.gov/ode/feed/', category: 'Education' },
    { id: 'or-dot', name: 'OR Dept. of Transportation', url: 'https://www.oregon.gov/odot/feed/', category: 'Transportation' },
    { id: 'or-osp', name: 'Oregon State Police', url: 'https://www.oregon.gov/osp/feed/', category: 'Public Safety' },
  ],
  'Pennsylvania': [
    { id: 'pa-gov', name: 'Pennsylvania Governor', url: 'https://www.governor.pa.gov/feed/', category: 'Governor' },
    { id: 'pa-ag', name: 'Pennsylvania Attorney General', url: 'https://www.attorneygeneral.gov/feed/', category: 'Attorney General' },
    { id: 'pa-dos', name: 'PA Dept. of State', url: 'https://www.dos.pa.gov/feed/', category: 'Elections' },
    { id: 'pa-doh', name: 'PA Dept. of Health', url: 'https://www.health.pa.gov/feed/', category: 'Healthcare' },
    { id: 'pa-dep', name: 'PA Dept. of Environmental Protection', url: 'https://www.dep.pa.gov/feed/', category: 'Environment' },
    { id: 'pa-pde', name: 'PA Dept. of Education', url: 'https://www.education.pa.gov/feed/', category: 'Education' },
    { id: 'pa-dot', name: 'PennDOT', url: 'https://www.penndot.pa.gov/feed/', category: 'Transportation' },
    { id: 'pa-psp', name: 'Pennsylvania State Police', url: 'https://www.psp.pa.gov/feed/', category: 'Public Safety' },
  ],
  'Rhode Island': [
    { id: 'ri-gov', name: 'Rhode Island Governor', url: 'https://governor.ri.gov/press-releases/feed', category: 'Governor' },
    { id: 'ri-ag', name: 'Rhode Island Attorney General', url: 'https://riag.ri.gov/feed/', category: 'Attorney General' },
    { id: 'ri-sos', name: 'RI Secretary of State', url: 'https://www.sos.ri.gov/feed/', category: 'Elections' },
    { id: 'ri-ridoh', name: 'RI Dept. of Health', url: 'https://health.ri.gov/feed/', category: 'Healthcare' },
    { id: 'ri-dem', name: 'RI Dept. of Environmental Mgmt.', url: 'https://dem.ri.gov/feed/', category: 'Environment' },
    { id: 'ri-ride', name: 'RI Dept. of Education', url: 'https://www.ride.ri.gov/feed/', category: 'Education' },
    { id: 'ri-dot', name: 'RI Dept. of Transportation', url: 'https://www.dot.ri.gov/feed/', category: 'Transportation' },
    { id: 'ri-risp', name: 'RI State Police', url: 'https://risp.ri.gov/feed/', category: 'Public Safety' },
  ],
  'South Carolina': [
    { id: 'sc-gov', name: 'South Carolina Governor', url: 'https://governor.sc.gov/news/rss', category: 'Governor' },
    { id: 'sc-ag', name: 'SC Attorney General', url: 'https://www.scag.gov/feed/', category: 'Attorney General' },
    { id: 'sc-sos', name: 'SC Secretary of State', url: 'https://sos.sc.gov/feed/', category: 'Elections' },
    { id: 'sc-dhec', name: 'SC Dept. of Health & Environmental Control', url: 'https://scdhec.gov/feed/', category: 'Healthcare' },
    { id: 'sc-sde', name: 'SC Dept. of Education', url: 'https://ed.sc.gov/feed/', category: 'Education' },
    { id: 'sc-dot', name: 'SC Dept. of Transportation', url: 'https://www.scdot.org/feed/', category: 'Transportation' },
    { id: 'sc-dps', name: 'SC Dept. of Public Safety', url: 'https://scdps.sc.gov/feed/', category: 'Public Safety' },
  ],
  'South Dakota': [
    { id: 'sd-gov', name: 'South Dakota Governor', url: 'https://governor.sd.gov/news/rss', category: 'Governor' },
    { id: 'sd-ag', name: 'South Dakota Attorney General', url: 'https://atg.sd.gov/feed/', category: 'Attorney General' },
    { id: 'sd-sos', name: 'SD Secretary of State', url: 'https://sdsos.gov/feed/', category: 'Elections' },
    { id: 'sd-doh', name: 'SD Dept. of Health', url: 'https://doh.sd.gov/feed/', category: 'Healthcare' },
    { id: 'sd-denr', name: 'SD Dept. of Agriculture & Natural Resources', url: 'https://denr.sd.gov/feed/', category: 'Environment' },
    { id: 'sd-doe', name: 'SD Dept. of Education', url: 'https://doe.sd.gov/feed/', category: 'Education' },
    { id: 'sd-dot', name: 'SD Dept. of Transportation', url: 'https://dot.sd.gov/feed/', category: 'Transportation' },
    { id: 'sd-dps', name: 'SD Dept. of Public Safety', url: 'https://dps.sd.gov/feed/', category: 'Public Safety' },
  ],
  'Tennessee': [
    { id: 'tn-gov', name: 'Tennessee Governor', url: 'https://www.tn.gov/governor/news.rss', category: 'Governor' },
    { id: 'tn-ag', name: 'Tennessee Attorney General', url: 'https://www.tn.gov/attorneygeneral/feed/', category: 'Attorney General' },
    { id: 'tn-sos', name: 'TN Secretary of State', url: 'https://sos.tn.gov/feed/', category: 'Elections' },
    { id: 'tn-tdh', name: 'TN Dept. of Health', url: 'https://www.tn.gov/health/feed/', category: 'Healthcare' },
    { id: 'tn-tdec', name: 'TN Dept. of Environment & Conservation', url: 'https://www.tn.gov/environment/feed/', category: 'Environment' },
    { id: 'tn-doe', name: 'TN Dept. of Education', url: 'https://www.tn.gov/education/feed/', category: 'Education' },
    { id: 'tn-dot', name: 'TN Dept. of Transportation', url: 'https://www.tn.gov/tdot/feed/', category: 'Transportation' },
    { id: 'tn-dos', name: 'TN Dept. of Safety & Homeland Security', url: 'https://www.tn.gov/safety/feed/', category: 'Public Safety' },
  ],
  'Texas': [
    { id: 'tx-gov', name: 'Texas Governor', url: 'https://gov.texas.gov/news/rss', category: 'Governor' },
    { id: 'tx-ag', name: 'Texas Attorney General', url: 'https://www.texasattorneygeneral.gov/news/rss.xml', category: 'Attorney General' },
    { id: 'tx-sos', name: 'TX Secretary of State', url: 'https://www.sos.state.tx.us/feed/', category: 'Elections' },
    { id: 'tx-dshs', name: 'TX Dept. of State Health Services', url: 'https://www.dshs.texas.gov/feed/', category: 'Healthcare' },
    { id: 'tx-tceq', name: 'TX Commission on Environmental Quality', url: 'https://www.tceq.texas.gov/feed/', category: 'Environment' },
    { id: 'tx-tea', name: 'TX Education Agency', url: 'https://tea.texas.gov/feed/', category: 'Education' },
    { id: 'tx-dot', name: 'TX Dept. of Transportation', url: 'https://www.txdot.gov/feed/', category: 'Transportation' },
    { id: 'tx-dps', name: 'TX Dept. of Public Safety', url: 'https://www.dps.texas.gov/feed/', category: 'Public Safety' },
  ],
  'Utah': [
    { id: 'ut-gov', name: 'Utah Governor', url: 'https://governor.utah.gov/feed/', category: 'Governor' },
    { id: 'ut-ag', name: 'Utah Attorney General', url: 'https://attorneygeneral.utah.gov/feed/', category: 'Attorney General' },
    { id: 'ut-elections', name: 'UT Lt. Governor (Elections)', url: 'https://voteinfo.utah.gov/feed/', category: 'Elections' },
    { id: 'ut-udoh', name: 'UT Dept. of Health & Human Services', url: 'https://health.utah.gov/feed/', category: 'Healthcare' },
    { id: 'ut-deq', name: 'UT Dept. of Environmental Quality', url: 'https://deq.utah.gov/feed/', category: 'Environment' },
    { id: 'ut-usbe', name: 'UT State Board of Education', url: 'https://www.schools.utah.gov/feed/', category: 'Education' },
    { id: 'ut-dot', name: 'UT Dept. of Transportation', url: 'https://www.udot.utah.gov/feed/', category: 'Transportation' },
    { id: 'ut-uhp', name: 'Utah Highway Patrol', url: 'https://highwaypatrol.utah.gov/feed/', category: 'Public Safety' },
  ],
  'Vermont': [
    { id: 'vt-gov', name: 'Vermont Governor', url: 'https://governor.vermont.gov/press-releases/rss', category: 'Governor' },
    { id: 'vt-ag', name: 'Vermont Attorney General', url: 'https://ago.vermont.gov/feed/', category: 'Attorney General' },
    { id: 'vt-sos', name: 'VT Secretary of State', url: 'https://sos.vermont.gov/feed/', category: 'Elections' },
    { id: 'vt-vdh', name: 'VT Dept. of Health', url: 'https://www.healthvermont.gov/feed/', category: 'Healthcare' },
    { id: 'vt-dec', name: 'VT Dept. of Environmental Conservation', url: 'https://dec.vermont.gov/feed/', category: 'Environment' },
    { id: 'vt-aoe', name: 'VT Agency of Education', url: 'https://education.vermont.gov/feed/', category: 'Education' },
    { id: 'vt-dot', name: 'VT Agency of Transportation', url: 'https://vtrans.vermont.gov/feed/', category: 'Transportation' },
    { id: 'vt-vsp', name: 'Vermont State Police', url: 'https://vsp.vermont.gov/feed/', category: 'Public Safety' },
  ],
  'Virginia': [
    { id: 'va-gov', name: 'Virginia Governor', url: 'https://www.governor.virginia.gov/newsroom/news-releases/rss/', category: 'Governor' },
    { id: 'va-ag', name: 'Virginia Attorney General', url: 'https://www.oag.state.va.us/feed/', category: 'Attorney General' },
    { id: 'va-sbe', name: 'VA State Board of Elections', url: 'https://www.elections.virginia.gov/feed/', category: 'Elections' },
    { id: 'va-vdh', name: 'VA Dept. of Health', url: 'https://www.vdh.virginia.gov/feed/', category: 'Healthcare' },
    { id: 'va-deq', name: 'VA Dept. of Environmental Quality', url: 'https://www.deq.virginia.gov/feed/', category: 'Environment' },
    { id: 'va-doe', name: 'VA Dept. of Education', url: 'https://www.doe.virginia.gov/feed/', category: 'Education' },
    { id: 'va-dot', name: 'VA Dept. of Transportation', url: 'https://www.virginiadot.org/feed/', category: 'Transportation' },
    { id: 'va-vsp', name: 'Virginia State Police', url: 'https://vsp.virginia.gov/feed/', category: 'Public Safety' },
  ],
  'Washington': [
    { id: 'wa-gov', name: 'Washington Governor', url: 'https://governor.wa.gov/news/rss', category: 'Governor' },
    { id: 'wa-ag', name: 'WA Attorney General', url: 'https://www.atg.wa.gov/rss.xml', category: 'Attorney General' },
    { id: 'wa-sos', name: 'WA Secretary of State', url: 'https://www.sos.wa.gov/feed/', category: 'Elections' },
    { id: 'wa-doh', name: 'WA Dept. of Health', url: 'https://doh.wa.gov/feed/', category: 'Healthcare' },
    { id: 'wa-ecology', name: 'WA Dept. of Ecology', url: 'https://ecology.wa.gov/rss/news', category: 'Environment' },
    { id: 'wa-ospi', name: 'WA Office of Superintendent of Public Instruction', url: 'https://www.k12.wa.us/feed/', category: 'Education' },
    { id: 'wa-dot', name: 'WA Dept. of Transportation', url: 'https://wsdot.wa.gov/feed/', category: 'Transportation' },
    { id: 'wa-wsp', name: 'Washington State Patrol', url: 'https://www.wsp.wa.gov/feed/', category: 'Public Safety' },
  ],
  'West Virginia': [
    { id: 'wv-gov', name: 'West Virginia Governor', url: 'https://governor.wv.gov/News/press-releases/feed', category: 'Governor' },
    { id: 'wv-ag', name: 'West Virginia Attorney General', url: 'https://ago.wv.gov/feed/', category: 'Attorney General' },
    { id: 'wv-sos', name: 'WV Secretary of State', url: 'https://sos.wv.gov/feed/', category: 'Elections' },
    { id: 'wv-dhhr', name: 'WV Dept. of Health & Human Resources', url: 'https://dhhr.wv.gov/feed/', category: 'Healthcare' },
    { id: 'wv-dep', name: 'WV Dept. of Environmental Protection', url: 'https://dep.wv.gov/feed/', category: 'Environment' },
    { id: 'wv-wvde', name: 'WV Dept. of Education', url: 'https://wvde.us/feed/', category: 'Education' },
    { id: 'wv-dot', name: 'WV Div. of Highways', url: 'https://transportation.wv.gov/feed/', category: 'Transportation' },
    { id: 'wv-wvsp', name: 'WV State Police', url: 'https://www.wvsp.gov/feed/', category: 'Public Safety' },
  ],
  'Wisconsin': [
    { id: 'wi-gov', name: 'Wisconsin Governor', url: 'https://evers.wi.gov/Pages/Newsroom/rss.aspx', category: 'Governor' },
    { id: 'wi-ag', name: 'Wisconsin Attorney General', url: 'https://www.doj.state.wi.us/feed/', category: 'Attorney General' },
    { id: 'wi-sos', name: 'WI Secretary of State', url: 'https://sos.wi.gov/feed/', category: 'Elections' },
    { id: 'wi-dhs', name: 'WI Dept. of Health Services', url: 'https://www.dhs.wisconsin.gov/feed/', category: 'Healthcare' },
    { id: 'wi-dnr', name: 'WI Dept. of Natural Resources', url: 'https://dnr.wisconsin.gov/feed/', category: 'Environment' },
    { id: 'wi-dpi', name: 'WI Dept. of Public Instruction', url: 'https://dpi.wi.gov/feed/', category: 'Education' },
    { id: 'wi-dot', name: 'WI Dept. of Transportation', url: 'https://wisconsindot.gov/feed/', category: 'Transportation' },
    { id: 'wi-wsp', name: 'Wisconsin State Patrol', url: 'https://wisconsindot.gov/Pages/about-wisdot/who-we-are/dsp/feed/', category: 'Public Safety' },
  ],
  'Wyoming': [
    { id: 'wy-gov', name: 'Wyoming Governor', url: 'https://governor.wyo.gov/media/news-releases/rss', category: 'Governor' },
    { id: 'wy-ag', name: 'Wyoming Attorney General', url: 'https://ag.wyo.gov/feed/', category: 'Attorney General' },
    { id: 'wy-sos', name: 'WY Secretary of State', url: 'https://sos.wyo.gov/feed/', category: 'Elections' },
    { id: 'wy-wdh', name: 'WY Dept. of Health', url: 'https://health.wyo.gov/feed/', category: 'Healthcare' },
    { id: 'wy-deq', name: 'WY Dept. of Environmental Quality', url: 'https://deq.wyoming.gov/feed/', category: 'Environment' },
    { id: 'wy-wde', name: 'WY Dept. of Education', url: 'https://edu.wyoming.gov/feed/', category: 'Education' },
    { id: 'wy-dot', name: 'WY Dept. of Transportation', url: 'https://www.dot.state.wy.us/feed/', category: 'Transportation' },
    { id: 'wy-whp', name: 'Wyoming Highway Patrol', url: 'https://whp.wyo.gov/feed/', category: 'Public Safety' },
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
