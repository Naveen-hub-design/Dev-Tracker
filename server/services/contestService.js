const axios = require('axios');

const CODEFORCES_API = 'https://codeforces.com/api/contest.list?gym=false';
const KONTESTS_API = 'https://kontests.net/api/v1/all';

let cache = {
  data: null,
  timestamp: 0,
};
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Generate standard recurring LeetCode contests
 */
function getCalculatedLeetCodeContests() {
  const contests = [];
  const now = new Date();

  // Find next 2 Sundays for Weekly Contest (every Sunday 02:30 UTC)
  for (let week = 0; week < 3; week++) {
    const sunday = new Date(now);
    sunday.setUTCDate(now.getUTCDate() + ((7 - now.getUTCDay()) % 7) + week * 7);
    sunday.setUTCHours(2, 30, 0, 0);

    // If today is Sunday and 2:30 UTC already passed, push to next week
    if (sunday.getTime() < now.getTime()) {
      sunday.setUTCDate(sunday.getUTCDate() + 7);
    }

    // Rough approximate contest number based on reference: Weekly 420 was in late 2024
    const baseDate = new Date('2024-10-20T02:30:00Z');
    const weeksDiff = Math.floor((sunday.getTime() - baseDate.getTime()) / (7 * 24 * 3600 * 1000));
    const contestNum = 420 + Math.max(0, weeksDiff);

    contests.push({
      id: `lc-weekly-${contestNum}`,
      name: `LeetCode Weekly Contest ${contestNum}`,
      platform: 'leetcode',
      url: `https://leetcode.com/contest/weekly-contest-${contestNum}`,
      startTime: sunday.toISOString(),
      durationSeconds: 90 * 60, // 1h 30m
      division: 'Div. 1 & 2',
    });
  }

  // Find next Biweekly Contest (every alternate Saturday 14:30 UTC)
  // Reference: Biweekly 142 was Oct 26 2024
  const biweeklyRef = new Date('2024-10-26T14:30:00Z');
  for (let step = 0; step < 4; step++) {
    const biweeklyDate = new Date(biweeklyRef.getTime() + step * 14 * 24 * 3600 * 1000);
    if (biweeklyDate.getTime() > now.getTime()) {
      const contestNum = 142 + step;
      contests.push({
        id: `lc-biweekly-${contestNum}`,
        name: `LeetCode Biweekly Contest ${contestNum}`,
        platform: 'leetcode',
        url: `https://leetcode.com/contest/biweekly-contest-${contestNum}`,
        startTime: biweeklyDate.toISOString(),
        durationSeconds: 90 * 60,
        division: 'Div. 1 & 2',
      });
      if (contests.filter((c) => c.name.includes('Biweekly')).length >= 2) break;
    }
  }

  return contests;
}

/**
 * Generate standard recurring CodeChef Starters contests (Every Wednesday 14:30 UTC / 20:00 IST)
 */
function getCalculatedCodeChefContests() {
  const contests = [];
  const now = new Date();

  for (let week = 0; week < 4; week++) {
    const wednesday = new Date(now);
    // Day 3 is Wednesday (0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed)
    let dayDiff = (3 - now.getUTCDay() + 7) % 7;
    wednesday.setUTCDate(now.getUTCDate() + dayDiff + week * 7);
    wednesday.setUTCHours(14, 30, 0, 0);

    // If today is Wednesday and 14:30 UTC already passed, skip to next week
    if (wednesday.getTime() < now.getTime()) {
      wednesday.setUTCDate(wednesday.getUTCDate() + 7);
    }

    // Reference: Starters 157 was Oct 23, 2024
    const refDate = new Date('2024-10-23T14:30:00Z');
    const weeksDiff = Math.round((wednesday.getTime() - refDate.getTime()) / (7 * 24 * 3600 * 1000));
    const startersNum = 157 + Math.max(0, weeksDiff);

    contests.push({
      id: `cc-starters-${startersNum}`,
      name: `CodeChef Starters ${startersNum}`,
      platform: 'codechef',
      url: `https://www.codechef.com/START${startersNum}`,
      startTime: wednesday.toISOString(),
      durationSeconds: 2 * 3600, // 2h
      division: 'Div. 1, 2, 3 & 4',
    });
  }

  return contests;
}


/**
 * Fetch upcoming contests from Codeforces official API
 */
async function fetchCodeforcesUpcoming() {
  try {
    const res = await axios.get(CODEFORCES_API, { timeout: 7000 });
    if (res.data.status !== 'OK' || !Array.isArray(res.data.result)) {
      return [];
    }

    const upcoming = res.data.result
      .filter((c) => c.phase === 'BEFORE')
      .map((c) => {
        let division = 'Div. 2';
        if (c.name.includes('Div. 1 + Div. 2') || c.name.includes('Global')) division = 'Div. 1 + 2';
        else if (c.name.includes('Div. 1')) division = 'Div. 1';
        else if (c.name.includes('Div. 3')) division = 'Div. 3';
        else if (c.name.includes('Div. 4')) division = 'Div. 4';
        else if (c.name.includes('Educational')) division = 'Edu (Div. 2)';

        return {
          id: `cf-${c.id}`,
          name: c.name,
          platform: 'codeforces',
          url: `https://codeforces.com/contestRegistration/${c.id}`,
          startTime: new Date(c.startTimeSeconds * 1000).toISOString(),
          durationSeconds: c.durationSeconds,
          division,
        };
      });

    return upcoming;
  } catch (err) {
    console.warn(`ContestService: Codeforces API error: ${err.message}`);
    return [];
  }
}

/**
 * Fetch other platforms via Kontests or fallback
 */
async function fetchKontestsUpcoming() {
  try {
    const res = await axios.get(KONTESTS_API, { timeout: 7000 });
    if (!Array.isArray(res.data)) return [];

    const now = new Date();
    return res.data
      .filter((c) => {
        const start = new Date(c.start_time);
        return start > now && c.status === 'BEFORE';
      })
      .map((c) => {
        let platform = (c.site || '').toLowerCase().replace(/[^a-z]/g, '');
        if (platform.includes('codeforces')) platform = 'codeforces';
        else if (platform.includes('leetcode')) platform = 'leetcode';
        else if (platform.includes('codechef')) platform = 'codechef';
        else if (platform.includes('atcoder')) platform = 'atcoder';
        else if (platform.includes('hackerrank')) platform = 'hackerrank';
        else platform = 'other';

        return {
          id: `kontest-${c.name.replace(/\s+/g, '-').slice(0, 30)}`,
          name: c.name,
          platform,
          url: c.url,
          startTime: new Date(c.start_time).toISOString(),
          durationSeconds: parseInt(c.duration, 10) || 7200,
          division: 'Open',
        };
      });
  } catch (err) {
    // Kontests aggregator is frequently offline or blocked; silently fallback
    return [];
  }
}

/**
 * Get aggregated, sorted upcoming contests
 */
async function getUpcomingContests(platformFilter = 'all') {
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_DURATION_MS) {
    return filterContests(cache.data, platformFilter);
  }

  // Fetch in parallel
  const [cfContests, kontestContests] = await Promise.all([
    fetchCodeforcesUpcoming(),
    fetchKontestsUpcoming(),
  ]);

  const leetcodeContests = getCalculatedLeetCodeContests();
  const codechefContests = getCalculatedCodeChefContests();

  // Deduplicate and merge
  const contestMap = new Map();

  // 1. Codeforces official
  cfContests.forEach((c) => contestMap.set(c.name.toLowerCase().trim(), c));

  // 2. Kontests aggregator (if online)
  kontestContests.forEach((c) => {
    const key = c.name.toLowerCase().trim();
    if (!contestMap.has(key)) {
      contestMap.set(key, c);
    }
  });

  // 3. Calculated LeetCode
  leetcodeContests.forEach((c) => {
    const key = c.name.toLowerCase().trim();
    if (!contestMap.has(key)) {
      contestMap.set(key, c);
    }
  });

  // 4. Calculated CodeChef
  codechefContests.forEach((c) => {
    const key = c.name.toLowerCase().trim();
    if (!contestMap.has(key)) {
      contestMap.set(key, c);
    }
  });

  // Sort by earliest start time
  const sorted = Array.from(contestMap.values()).sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  cache = {
    data: sorted,
    timestamp: now,
  };

  return filterContests(sorted, platformFilter);
}

function filterContests(list, filter) {
  if (!filter || filter === 'all') return list;
  return list.filter((c) => c.platform.toLowerCase() === filter.toLowerCase());
}

module.exports = {
  getUpcomingContests,
};
