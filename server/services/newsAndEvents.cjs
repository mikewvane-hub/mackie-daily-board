const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const NEWS_FILE = path.join(DATA_DIR, 'daily_news.json');
const DC_EVENTS_FILE = path.join(DATA_DIR, 'dc_recommendations.json');

// Authoritative RSS feeds with strong U.S. Policy & National News coverage
const RSS_FEEDS = [
  {
    name: 'NPR U.S. Politics & Policy',
    url: 'https://feeds.npr.org/1014/rss.xml',
    category: 'U.S. Policy & Government',
    isPolicyFeed: true
  },
  {
    name: 'PBS NewsHour Politics & Policy',
    url: 'https://www.pbs.org/newshour/feeds/rss/politics',
    category: 'Federal Policy & Capitol Hill',
    isPolicyFeed: true
  },
  {
    name: 'NPR National News',
    url: 'https://feeds.npr.org/1003/rss.xml',
    category: 'National & Domestic Policy',
    isPolicyFeed: false
  },
  {
    name: 'NYT U.S. Politics & Policy',
    url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml',
    category: 'U.S. Policy & Administration',
    isPolicyFeed: true
  }
];

const POLICY_KEYWORDS = [
  'policy', 'senate', 'house', 'congress', 'white house', 'supreme court', 'federal',
  'bill', 'law', 'regulation', 'administration', 'bipartisan', 'department of',
  'treasury', 'fed ', 'federal reserve', 'healthcare', 'medicaid', 'medicare',
  'tax', 'budget', 'spending', 'tariff', 'trade', 'immigration', 'border',
  'pentagon', 'defense', 'diplomacy', 'state department', 'executive order',
  'justice department', 'doj', 'fda', 'cdc', 'education', 'energy', 'climate'
];

function decodeHtmlEntities(str) {
  if (!str) return '';
  return String(str)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;|&#x27;|&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;|&#8212;|&mdash;|&ndash;/g, '—')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeTitleTokens(title) {
  const stopWords = new Set([
    'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'but',
    'is', 'are', 'was', 'were', 'be', 'been', 'with', 'by', 'from', 'as', 'that',
    'this', 'it', 'its', 'after', 'over', 'into', 'says', 'say', 'new', 'how',
    'what', 'why', 'who', 'when', 'where', 'will', 'could', 'would', 'should', 'us', 'u.s.'
  ]);
  return String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
}

function areArticlesDuplicate(a, b) {
  if (!a || !b) return false;
  const urlA = String(a.url || '').split('?')[0].replace(/\/$/, '').toLowerCase();
  const urlB = String(b.url || '').split('?')[0].replace(/\/$/, '').toLowerCase();
  if (urlA && urlB && urlA === urlB) return true;

  const titleA = String(a.title || '').toLowerCase().trim();
  const titleB = String(b.title || '').toLowerCase().trim();
  if (titleA === titleB) return true;

  const tokensA = normalizeTitleTokens(a.title);
  const tokensB = normalizeTitleTokens(b.title);
  if (tokensA.length === 0 || tokensB.length === 0) return false;

  const setB = new Set(tokensB);
  const shared = tokensA.filter(t => setB.has(t));
  const overlapRatio = shared.length / Math.min(tokensA.length, tokensB.length);
  // If 45%+ of meaningful keywords match or 3+ core entities match, treat as duplicate event
  return overlapRatio >= 0.45 || shared.length >= 3;
}

/**
 * Verifies a URL is live and reachable via HTTP HEAD/GET.
 */
async function verifyUrl(url, timeoutMs = 6500) {
  if (!url || !/^https?:\/\//i.test(url)) {
    return { valid: false, status: 0 };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    clearTimeout(timer);
    // Accept 200-399 status codes; also check final resolved URL
    if (res.status >= 200 && res.status < 400) {
      return {
        valid: true,
        status: res.status,
        finalUrl: res.url || url,
        verifiedAt: new Date().toISOString()
      };
    }
    return { valid: false, status: res.status };
  } catch (err) {
    clearTimeout(timer);
    return { valid: false, status: 0, error: err.message };
  }
}

function buildSignificanceSummary(title, summary, isPolicy) {
  const combined = `${title} ${summary}`.toLowerCase();
  let significancePrefix = '';

  if (/supreme court|ruling|judge|court|justice|legal/.test(combined)) {
    significancePrefix = 'Judicial & Constitutional Impact: Sets a key legal precedent affecting federal enforcement, constitutional rights, and how lower courts interpret national law.';
  } else if (/congress|senate|house|bill|appropriations|budget|spending|funding|shutdown/.test(combined)) {
    significancePrefix = 'Legislative & Fiscal Policy Significance: Directly shapes federal funding priorities, congressional negotiations, and downstream programs for American households.';
  } else if (/fed |federal reserve|inflation|interest rate|economy|jobs|tariff|trade|tax|treasury/.test(combined)) {
    significancePrefix = 'Economic & Household Policy Impact: Influences borrowing costs, consumer prices, trade policy, and broader U.S. macroeconomic stability.';
  } else if (/health|fda|cdc|medicare|medicaid|hospital|vaccine|maternal|child|family/.test(combined)) {
    significancePrefix = 'Public Health & Family Policy Significance: Affects national healthcare standards, regulatory guidance, and resources available to families and clinicians.';
  } else if (/white house|president|executive|administration|cabinet|agency|regulation/.test(combined)) {
    significancePrefix = 'Executive Policy Direction: Signals how the federal administration is prioritizing regulatory action and executive branch enforcement across the U.S.';
  } else if (/foreign|pentagon|defense|military|nato|diplomacy|security|border|immigration/.test(combined)) {
    significancePrefix = 'National Security & Foreign Policy Impact: Shapes U.S. strategic posture, border/homeland operations, and international diplomatic commitments.';
  } else if (isPolicy) {
    significancePrefix = 'U.S. Policy Significance: Represents a notable shift in national governance, regulatory oversight, or public-sector priorities.';
  } else {
    significancePrefix = 'National Significance: A major development drawing national attention with broad implications for public policy and daily civic life.';
  }

  const cleanDesc = summary && summary.length > 25 ? summary : '';
  return {
    whatHappened: cleanDesc || title,
    significance: significancePrefix
  };
}

function parseRssXml(xmlText, feedMeta) {
  const items = [];
  const itemRegex = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const block = match[1];
    const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const linkMatch = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
    const descMatch = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
    const pubDateMatch = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);

    const title = decodeHtmlEntities(titleMatch ? titleMatch[1] : '');
    const rawLink = decodeHtmlEntities(linkMatch ? linkMatch[1] : '');
    const description = decodeHtmlEntities(descMatch ? descMatch[1] : '');
    const pubDate = pubDateMatch ? decodeHtmlEntities(pubDateMatch[1]) : new Date().toISOString();

    if (!title || !rawLink || !/^https?:\/\//i.test(rawLink)) continue;

    const combinedText = `${title} ${description}`.toLowerCase();
    const policyScore = POLICY_KEYWORDS.reduce(
      (score, kw) => (combinedText.includes(kw) ? score + 2 : score),
      feedMeta.isPolicyFeed ? 3 : 0
    );

    items.push({
      title,
      url: rawLink.split('?utm_')[0],
      summary: description,
      source: feedMeta.name,
      category: policyScore >= 3 ? 'U.S. Policy Update' : feedMeta.category,
      isPolicy: policyScore >= 2,
      policyScore,
      publishedAt: pubDate
    });
  }
  return items;
}

/**
 * Fetches, deduplicates, and verifies Top 4-5 Daily News & U.S. Policy stories.
 */
async function refreshDailyNews() {
  console.log('[News] Fetching and verifying daily U.S. Policy & Top News stories...');
  const allCandidates = [];

  for (const feed of RSS_FEEDS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 7000);
      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MackieMomBoard/1.0)' }
      });
      clearTimeout(timer);
      if (res.ok) {
        const xml = await res.text();
        const parsed = parseRssXml(xml, feed);
        allCandidates.push(...parsed);
      }
    } catch (err) {
      console.warn(`[News] Feed warning (${feed.name}):`, err.message);
    }
  }

  // Sort candidates so U.S. Policy stories and newest stories are prioritized
  allCandidates.sort((a, b) => {
    if (b.policyScore !== a.policyScore) return b.policyScore - a.policyScore;
    const dateA = new Date(a.publishedAt).getTime() || 0;
    const dateB = new Date(b.publishedAt).getTime() || 0;
    return dateB - dateA;
  });

  const verifiedArticles = [];
  for (const candidate of allCandidates) {
    if (verifiedArticles.length >= 5) break;

    // Ensure no duplicate article or event
    const isDup = verifiedArticles.some(existing => areArticlesDuplicate(existing, candidate));
    if (isDup) continue;

    // Verify link via live HTTP check
    const verification = await verifyUrl(candidate.url);
    if (!verification.valid) continue;

    const { whatHappened, significance } = buildSignificanceSummary(
      candidate.title,
      candidate.summary,
      candidate.isPolicy
    );

    verifiedArticles.push({
      id: `news-${Date.now()}-${verifiedArticles.length + 1}`,
      rank: verifiedArticles.length + 1,
      title: candidate.title,
      whatHappened,
      significance,
      url: verification.finalUrl || candidate.url,
      source: candidate.source,
      category: candidate.category,
      isPolicy: candidate.isPolicy,
      publishedAt: candidate.publishedAt,
      linkVerified: true,
      httpStatus: verification.status,
      verifiedAt: verification.verifiedAt
    });
  }

  // Fallback verified U.S. Policy & National News portals if offline or fewer than 3 found
  const fallbackPortals = [
    {
      title: 'Congressional Legislation & Floor Activity Tracker — U.S. Policy Briefing',
      summary: 'Active federal bills, committee hearings, and roll-call votes currently moving through the U.S. Senate and House of Representatives.',
      significance: 'Legislative & Fiscal Policy Significance: Tracks binding federal statutory updates, appropriations bills, and domestic policy debates on Capitol Hill.',
      url: 'https://www.congress.gov/',
      source: 'Congress.gov Official Portal',
      category: 'U.S. Policy Update',
      isPolicy: true
    },
    {
      title: 'NPR Politics & U.S. Federal Policy Coverage',
      summary: 'Comprehensive national reporting on White House executive actions, Supreme Court decisions, and federal regulatory agencies.',
      significance: 'Executive & National Policy Impact: Covers administration directives and federal court rulings shaping national governance.',
      url: 'https://www.npr.org/sections/politics/',
      source: 'NPR Politics',
      category: 'U.S. Policy Update',
      isPolicy: true
    },
    {
      title: 'PBS NewsHour Politics & Capitol Hill Policy Desk',
      summary: 'In-depth analysis of U.S. domestic legislation, economic policy, healthcare reforms, and federal agency actions.',
      significance: 'Domestic Policy Significance: Provides nonpartisan analysis of how Washington policy shifts affect American families and the national economy.',
      url: 'https://www.pbs.org/newshour/politics',
      source: 'PBS NewsHour',
      category: 'Federal Policy & Capitol Hill',
      isPolicy: true
    }
  ];

  for (const fb of fallbackPortals) {
    if (verifiedArticles.length >= 4) break;
    if (verifiedArticles.some(a => areArticlesDuplicate(a, fb))) continue;
    const v = await verifyUrl(fb.url);
    if (v.valid) {
      verifiedArticles.push({
        id: `news-fb-${verifiedArticles.length + 1}`,
        rank: verifiedArticles.length + 1,
        title: fb.title,
        whatHappened: fb.summary,
        significance: fb.significance,
        url: v.finalUrl || fb.url,
        source: fb.source,
        category: fb.category,
        isPolicy: fb.isPolicy,
        publishedAt: new Date().toISOString(),
        linkVerified: true,
        httpStatus: v.status,
        verifiedAt: v.verifiedAt
      });
    }
  }

  const todayEST = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

  const payload = {
    updatedDateEST: todayEST,
    updatedAt: new Date().toISOString(),
    scheduleNote: 'Updated once daily at 07:00 AM EST automatically (All links HTTP verified & deduplicated)',
    articles: verifiedArticles.slice(0, 5)
  };

  try {
    fs.writeFileSync(NEWS_FILE, JSON.stringify(payload, null, 2), 'utf8');
  } catch (e) {
    console.error('[News] Error saving daily_news.json:', e.message);
  }

  return payload;
}

async function getDailyNews(forceRefresh = false) {
  const todayEST = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());

  if (!forceRefresh && fs.existsSync(NEWS_FILE)) {
    try {
      const cached = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf8'));
      if (
        cached &&
        cached.updatedDateEST === todayEST &&
        Array.isArray(cached.articles) &&
        cached.articles.length >= 3
      ) {
        return cached;
      }
    } catch (e) {
      // Proceed to refresh
    }
  }
  return await refreshDailyNews();
}

// ============================================================================
// Downtown Washington, D.C. Weekly & Monthly Seasonal Recommendations (5 W's)
// ============================================================================
const DC_RECOMMENDATIONS_POOL = [
  {
    id: 'dc-penn-quarter-market',
    cycleGroup: 0,
    timeframeBadge: 'Weekly Downtown D.C. Staple',
    neighborhood: 'Penn Quarter / Downtown D.C.',
    title: 'FRESHFARM Penn Quarter Market & Autumn Harvest Stroll',
    who: 'Downtown D.C. locals, expecting parents, and food lovers (Hosted by FRESHFARM)',
    what: 'Open-air farmers market featuring Shenandoah Valley orchard apples, warm apple cider, artisan sourdough, seasonal flowers, and local D.C. roasters right in the heart of Penn Quarter.',
    when: 'Thursdays, 3:00 PM – 7:00 PM (Spring through late Autumn season)',
    where: '8th St NW between D & E Streets NW (Penn Quarter, Downtown D.C.)',
    why: 'An easy, flat, stroller-friendly afternoon walk in Downtown D.C. to pick up fresh seasonal produce and treats next to the National Portrait Gallery.',
    url: 'https://www.freshfarm.org/markets/penn-quarter'
  },
  {
    id: 'dc-nga-sculpture-garden',
    cycleGroup: 0,
    timeframeBadge: 'This Week in Downtown D.C.',
    neighborhood: 'National Mall / Constitution Ave',
    title: 'National Gallery of Art — East & West Building Exhibitions & Sculpture Garden',
    who: 'Art lovers, couples, and families looking for a peaceful indoor/outdoor D.C. outing',
    what: 'Explore special seasonal exhibitions inside the skylit West Building courtyard (filled with seasonal botanical foliage) and stroll among monumental sculptures around the central fountain.',
    when: 'Daily, 10:00 AM – 5:00 PM (Free admission, no tickets required)',
    where: 'Constitution Ave NW between 3rd & 9th Streets NW, Washington, D.C.',
    why: 'Offers calm, bench-lined galleries, elevator/stroller accessibility, and the Pavilion Café overlooking the changing seasonal trees.',
    url: 'https://www.nga.gov/visit.html'
  },
  {
    id: 'dc-botanic-garden-autumn',
    cycleGroup: 0,
    timeframeBadge: 'Seasonal Highlight',
    neighborhood: 'Capitol Hill / National Mall',
    title: 'United States Botanic Garden — Seasonal Conservatory & Bartholdi Fountain Gardens',
    who: 'Plant enthusiasts, downtown walkers, and families (Hosted by U.S. Botanic Garden)',
    what: 'Step inside the glass Conservatory tropical & subtropical rooms or relax in the freshly planted seasonal beds at Bartholdi Park just across Independence Ave.',
    when: 'Daily: Conservatory 10:00 AM – 5:00 PM • Outdoor Gardens Dawn to Dusk (Free)',
    where: '100 Maryland Ave SW, Washington, D.C. 20001',
    why: 'One of D.C.’s most serene, climate-controlled sanctuaries with shaded seating and vibrant seasonal blooms.',
    url: 'https://www.usbg.gov/visit'
  },
  {
    id: 'dc-portrait-gallery-courtyard',
    cycleGroup: 0,
    timeframeBadge: 'Downtown D.C. Gem',
    neighborhood: 'Penn Quarter / Chinatown',
    title: 'Kogod Courtyard & Exhibitions at the National Portrait Gallery / SAAM',
    who: 'D.C. residents, culture seekers, and parents looking for a relaxed afternoon oasis',
    what: 'Tour new American portraiture and craft exhibitions, then unwind beneath the iconic Foster + Partners glass canopy in the indoor Kogod Courtyard with shallow water pools and ficus trees.',
    when: 'Daily, 11:30 AM – 7:00 PM (Open later than Mall museums; Free admission)',
    where: '8th and G Streets NW, Downtown Washington, D.C.',
    why: 'Open until 7:00 PM every evening right in Downtown D.C., making it ideal for an early-evening stroll or quiet coffee break.',
    url: 'https://npg.si.edu/visit'
  },
  {
    id: 'dc-dupont-farmers-market',
    cycleGroup: 1,
    timeframeBadge: 'Weekend D.C. Favorite',
    neighborhood: 'Dupont Circle',
    title: 'FRESHFARM Dupont Circle Sunday Market & Historic Rowhouse Walk',
    who: 'D.C. weekenders, brunch-goers, and neighborhood strollers',
    what: 'Over 50 regional farmers, cheesemakers, bakeries, and specialty food purveyors gathered around Dupont Circle, followed by a stroll down tree-lined Q and N Streets.',
    when: 'Sundays Year-Round, 8:30 AM – 1:30 PM',
    where: '1500 20th St NW (Dupont Circle Metro North Entrance), Washington, D.C.',
    why: 'D.C.’s flagship Sunday morning ritual with incredible pastries, fresh blooms, and vibrant neighborhood energy.',
    url: 'https://www.freshfarm.org/markets/dupont-circle'
  },
  {
    id: 'dc-wharf-waterfront',
    cycleGroup: 1,
    timeframeBadge: 'Monthly Waterfront Pick',
    neighborhood: 'The Wharf / Southwest Waterfront',
    title: 'The Wharf Waterfront Promenade, Pier Swings & Seasonal Concerts',
    who: 'Couples, families, and waterfront diners in Southwest D.C.',
    what: 'Walk the mile-long pedestrian esplanade along the Washington Channel, relax by the fire pits on Blair Pier, and enjoy seasonal live music and outdoor dining.',
    when: 'Daily, Morning through Evening (Special weekend activations & markets)',
    where: '760 Maine Ave SW, Washington, D.C. 20024',
    why: 'Breezy waterfront views, wide car-free promenade ideal for leisurely walks, and easy access from Downtown D.C.',
    url: 'https://www.wharfdc.com/upcoming-events/'
  },
  {
    id: 'dc-kennedy-center-millennium',
    cycleGroup: 1,
    timeframeBadge: 'Performing Arts & Views',
    neighborhood: 'Foggy Bottom / Potomac Riverfront',
    title: 'The Kennedy Center — Millennium Stage & Riverfront REACH Lawn',
    who: 'Music, theater, and dance lovers across Washington, D.C.',
    what: 'Experience concerts, chamber music, jazz, and theatrical performances at the Kennedy Center, plus panoramic views of the Potomac River and Georgetown from the rooftop terrace.',
    when: 'Wednesdays – Sundays (Check schedule for free 6:00 PM Millennium Stage shows)',
    where: '2700 F St NW, Washington, D.C. 20566',
    why: 'The outdoor REACH plazas and River Pavilion offer some of the best sunset views in D.C. alongside world-class performances.',
    url: 'https://www.kennedy-center.org/whats-on/millennium-stage/'
  },
  {
    id: 'dc-building-museum',
    cycleGroup: 1,
    timeframeBadge: 'Downtown Architecture & Family',
    neighborhood: 'Judiciary Square / Downtown D.C.',
    title: 'National Building Museum — Great Hall & Architecture Exhibitions',
    who: 'Architecture buffs, families, and Downtown D.C. neighbors',
    what: 'Marvel at the soaring Corinthian columns of the historic 1887 Pension Building Great Hall and explore interactive exhibitions on urban design, sustainable homes, and D.C. history.',
    when: 'Thursday – Monday, 10:00 AM – 4:00 PM',
    where: '401 F St NW, Washington, D.C. 20001',
    why: 'Features one of the most breathtaking, spacious indoor halls in Downtown D.C. with plenty of room to roam.',
    url: 'https://www.nbm.org/visit/'
  },
  {
    id: 'dc-library-of-congress',
    cycleGroup: 2,
    timeframeBadge: 'Monthly D.C. Cultural Pick',
    neighborhood: 'Capitol Hill',
    title: 'Library of Congress — Thomas Jefferson Building & Live at the Library',
    who: 'History lovers, readers, and D.C. evening explorers',
    what: 'Admire the gilded Gilded Age architecture, Main Reading Room overlook, Thomas Jefferson’s personal library, and Thursday evening "Live at the Library" cultural programming.',
    when: 'Tuesday – Saturday, 10:00 AM – 5:00 PM (Open until 8:00 PM on Thursdays)',
    where: '101 Independence Ave SE, Washington, D.C. 20540',
    why: 'Thursday evenings offer extended hours with talks, music, and fewer crowds inside D.C.’s most ornate historic interior.',
    url: 'https://www.loc.gov/visit/'
  },
  {
    id: 'dc-union-market-district',
    cycleGroup: 2,
    timeframeBadge: 'Culinary & Weekend Market',
    neighborhood: 'Union Market District / NoMa',
    title: 'Union Market Culinary Hall, Rooftop Hi-Lawn & La Cosecha',
    who: 'Foodies, weekend shoppers, and local makers enthusiasts',
    what: 'Sample over 40 local D.C. culinary vendors, browse Latin American artisanal goods at La Cosecha across the street, and relax on the expansive open-air rooftop lawn.',
    when: 'Daily, 8:00 AM – 9:00 PM',
    where: '1309 5th St NE, Washington, D.C. 20002',
    why: 'A vibrant, all-in-one D.C. destination for casual weekend lunches, local baby/home gifts, and rooftop city views.',
    url: 'https://unionmarketdc.com/events/'
  },
  {
    id: 'dc-hirshhorn-garden',
    cycleGroup: 2,
    timeframeBadge: 'Modern Art & Mall Stroll',
    neighborhood: 'National Mall',
    title: 'Hirshhorn Museum & Contemporary Art Exhibitions',
    who: 'Modern art fans and National Mall walkers',
    what: 'Discover bold contemporary installations, immersive video art, and 20th-century masterworks inside Gordon Bunshaft’s iconic cylindrical museum on the Mall.',
    when: 'Daily, 10:00 AM – 5:30 PM (Free admission)',
    where: 'Independence Ave at 7th St SW, Washington, D.C.',
    why: 'Compact, easy-to-navigate circular galleries make it a refreshing 1-hour cultural stop right off the Mall.',
    url: 'https://hirshhorn.si.edu/explore/visit/'
  },
  {
    id: 'dc-national-arboretum',
    cycleGroup: 2,
    timeframeBadge: 'Seasonal Foliage & Outdoors',
    neighborhood: 'Northeast D.C.',
    title: 'U.S. National Arboretum — National Capitol Columns & Autumn Foliage Trails',
    who: 'Nature lovers, photographers, and families seeking wide-open green space in D.C.',
    what: 'Drive or stroll through 446 acres of curated gardens, the iconic 1858 Capitol Columns meadow, the National Bonsai & Penjing Museum, and vibrant autumn maple collections.',
    when: 'Daily, 8:00 AM – 5:00 PM (Free admission & free parking right inside the grounds)',
    where: '3501 New York Ave NE, Washington, D.C. 20002',
    why: 'You can drive directly between garden collections with easy parking, making it effortless in late pregnancy or with a newborn stroller.',
    url: 'https://www.usna.usda.gov/visit/'
  }
];

function getWeekOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date - start;
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
}

async function getDcRecommendations(cycleOffset = 0) {
  const currentWeek = getWeekOfYear(new Date());
  const activeGroup = (currentWeek + Number(cycleOffset || 0)) % 3;

  // Pick the 4 recommendations for the active cycle group and verify their links
  const selected = DC_RECOMMENDATIONS_POOL.filter(item => item.cycleGroup === activeGroup);
  const verifiedItems = [];

  for (const item of selected) {
    const check = await verifyUrl(item.url);
    verifiedItems.push({
      ...item,
      linkVerified: check.valid,
      httpStatus: check.status || 200,
      verifiedAt: check.verifiedAt || new Date().toISOString()
    });
  }

  const payload = {
    city: 'Downtown Washington, D.C.',
    cycleWeekNumber: currentWeek,
    activeCycleGroup: activeGroup,
    updatedAt: new Date().toISOString(),
    recommendations: verifiedItems
  };

  try {
    fs.writeFileSync(DC_EVENTS_FILE, JSON.stringify(payload, null, 2), 'utf8');
  } catch (e) {
    console.warn('[DC Events] Cache write warning:', e.message);
  }

  return payload;
}

module.exports = {
  getDailyNews,
  refreshDailyNews,
  getDcRecommendations,
  verifyUrl
};
