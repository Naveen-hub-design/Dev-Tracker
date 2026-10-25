const axios = require('axios');

const CODECHEF_BASE_URL = 'https://www.codechef.com/users';

const CODECHEF_ERRORS = {
  NOT_FOUND: 'CodeChef user not found',
  TIMEOUT: 'CodeChef request timed out',
  UNAVAILABLE: 'CodeChef service temporarily unavailable',
  INVALID_USERNAME: 'Invalid CodeChef handle format',
};

// In-memory cache with 10-minute TTL to prevent rate-limits and excess upstream calls
const cache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

function isValidUsername(username) {
  if (!username || typeof username !== 'string') return false;
  // CodeChef handles typically contain 1-50 alphanumeric and underscore characters
  return /^[a-zA-Z0-9_]{1,50}$/.test(username.trim());
}

const demoData = {
  profile: {
    username: 'chef_master',
    name: 'CodeChef Developer',
    country: 'India',
    rating: 1845,
    highestRating: 1920,
    stars: 4,
    starsDisplay: '4★',
    division: 'Div 2',
    globalRank: 3840,
    countryRank: 1950,
    profileUrl: 'https://www.codechef.com/users/chef_master',
  },
  stats: {
    totalSolved: 168,
    fullySolved: 142,
    partiallySolved: 26,
    contestsCount: 24,
  },
  ratingHistory: [
    { contestCode: 'START90B', contestName: 'Starters 90 Division 2', rating: 1540, rank: 1120, date: '2025-05-17', color: '#684273' },
    { contestCode: 'START98B', contestName: 'Starters 98 Division 2', rating: 1610, rank: 820, date: '2025-07-12', color: '#684273' },
    { contestCode: 'COOK145B', contestName: 'Cook-Off 145 Division 2', rating: 1690, rank: 540, date: '2025-09-20', color: '#684273' },
    { contestCode: 'START110B', contestName: 'Starters 110 Division 2', rating: 1745, rank: 410, date: '2025-11-28', color: '#684273' },
    { contestCode: 'LTIME115B', contestName: 'Lunchtime 115 Division 2', rating: 1810, rank: 290, date: '2026-02-14', color: '#684273' },
    { contestCode: 'START125B', contestName: 'Starters 125 Division 2', rating: 1845, rank: 315, date: '2026-04-10', color: '#684273' },
  ],
  lastUpdated: new Date().toISOString(),
};

function getDemoData() {
  return JSON.parse(JSON.stringify(demoData));
}

async function fetchCodeChefData(rawUsername, forceRefresh = false) {
  const username = (rawUsername || '').trim();

  if (!isValidUsername(username)) {
    throw new Error(CODECHEF_ERRORS.INVALID_USERNAME);
  }

  const cacheKey = username.toLowerCase();
  const cached = cache.get(cacheKey);
  if (!forceRefresh && cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  let html;
  try {
    const res = await axios.get(`${CODECHEF_BASE_URL}/${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 8000,
    });
    html = res.data;
  } catch (err) {
    if (err.response) {
      if (err.response.status === 404) {
        throw new Error(CODECHEF_ERRORS.NOT_FOUND);
      }
      if (err.response.status === 403 || err.response.status === 429) {
        throw new Error(CODECHEF_ERRORS.UNAVAILABLE);
      }
    }
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      throw new Error(CODECHEF_ERRORS.TIMEOUT);
    }
    throw new Error(CODECHEF_ERRORS.UNAVAILABLE);
  }

  // CodeChef redirects invalid users to default landing/practice pages without profile containers
  if (!html.includes('user-details') && !html.includes('rating-header')) {
    throw new Error(CODECHEF_ERRORS.NOT_FOUND);
  }

  // 1. Current Rating
  const ratingMatch = html.match(/class="rating-number"[^>]*>[\s\r\n]*([0-9]+)/i);
  const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;

  // 2. Highest Rating
  const highestRatingMatch = html.match(/Highest Rating[^0-9]*(\d+)/i);
  const highestRating = highestRatingMatch ? parseInt(highestRatingMatch[1], 10) : (rating || 0);

  // 3. Stars / Division
  const starMatches = html.match(/class="rating-star"[\s\S]*?<\/div>/i);
  let stars = 1;
  let starsDisplay = '1★';
  if (starMatches) {
    const count = (starMatches[0].match(/&#9733;/g) || []).length;
    if (count > 0) {
      stars = count;
      starsDisplay = `${count}★`;
    }
  } else if (rating > 0) {
    if (rating >= 2500) { stars = 7; starsDisplay = '7★'; }
    else if (rating >= 2200) { stars = 6; starsDisplay = '6★'; }
    else if (rating >= 2000) { stars = 5; starsDisplay = '5★'; }
    else if (rating >= 1800) { stars = 4; starsDisplay = '4★'; }
    else if (rating >= 1600) { stars = 3; starsDisplay = '3★'; }
    else if (rating >= 1400) { stars = 2; starsDisplay = '2★'; }
    else { stars = 1; starsDisplay = '1★'; }
  }

  // Division
  const divMatch = html.match(/\(Div\s*(\d+)\)/i);
  const division = divMatch
    ? `Div ${divMatch[1]}`
    : (rating >= 2000 ? 'Div 1' : rating >= 1600 ? 'Div 2' : rating >= 1400 ? 'Div 3' : 'Div 4');

  // 4. Global & Country rank
  const globalMatch = html.match(/<a[^>]*href="\/ratings\/all"[^>]*>[\s\r\n]*<strong>[\s\r\n]*([^<]+)[\s\r\n]*<\/strong>/i);
  const countryRankMatch = html.match(/<a[^>]*href="\/ratings\/all\?filterBy=Country[^\"]*"[^>]*>[\s\r\n]*<strong>[\s\r\n]*([^<]+)[\s\r\n]*<\/strong>/i);

  const rawGlobal = globalMatch ? globalMatch[1].trim() : null;
  const rawCountry = countryRankMatch ? countryRankMatch[1].trim() : null;

  const globalRank = rawGlobal && !isNaN(parseInt(rawGlobal.replace(/,/g, ''), 10))
    ? parseInt(rawGlobal.replace(/,/g, ''), 10)
    : (rawGlobal || null);

  const countryRank = rawCountry && !isNaN(parseInt(rawCountry.replace(/,/g, ''), 10))
    ? parseInt(rawCountry.replace(/,/g, ''), 10)
    : (rawCountry || null);

  // 5. Problems Solved
  const fullySolvedMatch = html.match(/Fully Solved\s*\(([^)]+)\)/i) || html.match(/Total Problems Solved:\s*(\d+)/i);
  const fullySolved = fullySolvedMatch ? parseInt(fullySolvedMatch[1].replace(/,/g, ''), 10) : 0;

  const partiallySolvedMatch = html.match(/Partially Solved\s*\(([^)]+)\)/i);
  const partiallySolved = partiallySolvedMatch ? parseInt(partiallySolvedMatch[1].replace(/,/g, ''), 10) : 0;

  const totalSolved = fullySolved + partiallySolved;

  // 6. Name & Country
  const nameMatch = html.match(/class="user-details-container"[\s\S]*?<h1[^>]*>([^<]+)<\/h1>/i) ||
                    html.match(/<header[^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : username;

  const countryMatch = html.match(/class="user-country-name"[^>]*>([^<]+)<\/span>/i);
  const country = countryMatch ? countryMatch[1].trim() : '';

  // 7. Contest Rating History
  const allRatingMatch = html.match(/var\s+all_rating\s*=\s*(\[[^;]+\]);/);
  let ratingHistory = [];
  if (allRatingMatch) {
    try {
      const raw = JSON.parse(allRatingMatch[1]);
      ratingHistory = raw.map((c) => ({
        contestCode: c.code || '',
        contestName: c.name || '',
        rating: parseInt(c.rating, 10) || 0,
        rank: !isNaN(parseInt(c.rank, 10)) ? parseInt(c.rank, 10) : (c.rank || null),
        date: c.end_date ? c.end_date.split(' ')[0] : `${c.getyear}-${String(c.getmonth || '').padStart(2, '0')}-${String(c.getday || '').padStart(2, '0')}`,
        color: c.color || '#684273',
      })).filter((c) => c.rating > 0);
    } catch {
      ratingHistory = [];
    }
  }

  const normalized = {
    username,
    currentRating: rating,
    highestRating,
    stars: starsDisplay,
    starsCount: stars,
    division,
    globalRank,
    countryRank,
    totalSolved,
    fullySolved,
    partiallySolved,
    contestCount: ratingHistory.length,
    name,
    country,
    profileUrl: `https://www.codechef.com/users/${encodeURIComponent(username)}`,
    profile: {
      username,
      name,
      country,
      rating,
      highestRating,
      stars,
      starsDisplay,
      division,
      globalRank,
      countryRank,
      profileUrl: `https://www.codechef.com/users/${encodeURIComponent(username)}`,
    },
    stats: {
      totalSolved,
      fullySolved,
      partiallySolved,
      contestsCount: ratingHistory.length,
    },
    ratingHistory,
    lastUpdated: new Date().toISOString(),
  };

  // Cache normalized result
  cache.set(cacheKey, { timestamp: Date.now(), data: normalized });

  return normalized;
}

module.exports = {
  fetchCodeChefData,
  getDemoData,
  CODECHEF_ERRORS,
};
