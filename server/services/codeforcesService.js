const axios = require('axios');

const CODEFORCES_API = 'https://codeforces.com/api';

const demoData = {
  profile: {
    handle: 'tourist_dev',
    rating: 1642,
    maxRating: 1785,
    rank: 'expert',
    maxRank: 'expert',
    contribution: 14,
    friendOfCount: 128,
    avatar: 'https://userpic.codeforces.org/no-avatar.jpg',
    titlePhoto: 'https://userpic.codeforces.org/no-title.jpg',
  },
  stats: {
    totalSolved: 184,
    contestsCount: 26,
    bestRank: 342,
  },
  ratingHistory: [
    { contestId: 1800, contestName: 'Codeforces Round 850 (Div. 2)', rank: 1240, oldRating: 1420, newRating: 1485, date: '2025-09-10' },
    { contestId: 1820, contestName: 'Codeforces Round 860 (Div. 2)', rank: 890, oldRating: 1485, newRating: 1540, date: '2025-11-15' },
    { contestId: 1850, contestName: 'Codeforces Round 880 (Div. 2)', rank: 640, oldRating: 1540, newRating: 1610, date: '2026-01-20' },
    { contestId: 1890, contestName: 'Educational Codeforces Round 160', rank: 1100, oldRating: 1610, newRating: 1590, date: '2026-03-05' },
    { contestId: 1910, contestName: 'Codeforces Round 910 (Div. 2)', rank: 410, oldRating: 1590, newRating: 1665, date: '2026-05-18' },
    { contestId: 1940, contestName: 'Codeforces Round 930 (Div. 2)', rank: 520, oldRating: 1665, newRating: 1720, date: '2026-07-22' },
  ],
  tagDistribution: [
    { tag: 'implementation', count: 78 },
    { tag: 'math', count: 64 },
    { tag: 'greedy', count: 52 },
    { tag: 'dp', count: 41 },
    { tag: 'data structures', count: 36 },
    { tag: 'constructive algorithms', count: 29 },
    { tag: 'sortings', count: 28 },
    { tag: 'graphs', count: 22 },
  ],
  difficultyDistribution: [
    { range: '800-1000', count: 58 },
    { range: '1100-1300', count: 62 },
    { range: '1400-1600', count: 44 },
    { range: '1700-1900', count: 16 },
    { range: '2000+', count: 4 },
  ],
  recentSolved: [
    { name: 'Watermelon', rating: 800, tags: ['math', 'brute force'], verdict: 'OK' },
    { name: 'Way Too Long Words', rating: 800, tags: ['strings'], verdict: 'OK' },
    { name: 'Next Round', rating: 800, tags: ['implementation'], verdict: 'OK' },
    { name: 'Domino piling', rating: 800, tags: ['greedy', 'math'], verdict: 'OK' },
    { name: 'Bit++', rating: 800, tags: ['implementation'], verdict: 'OK' },
  ],
};

async function fetchCodeforcesData(username) {
  try {
    const [infoRes, ratingRes, statusRes] = await Promise.all([
      axios.get(`${CODEFORCES_API}/user.info?handles=${username}`, { timeout: 8000 }),
      axios.get(`${CODEFORCES_API}/user.rating?handle=${username}`, { timeout: 8000 }),
      axios.get(`${CODEFORCES_API}/user.status?handle=${username}&from=1&count=200`, { timeout: 8000 }),
    ]);

    if (infoRes.data.status !== 'OK' || !infoRes.data.result?.length) {
      throw new Error('Codeforces user not found');
    }

    const rawUser = infoRes.data.result[0];
    const rawContests = ratingRes.data.status === 'OK' ? ratingRes.data.result : [];
    const rawSubs = statusRes.data.status === 'OK' ? statusRes.data.result : [];

    // Filter OK submissions and deduplicate by problem name
    const solvedSet = new Set();
    const tagMap = {};
    const diffMap = { '800-1000': 0, '1100-1300': 0, '1400-1600': 0, '1700-1900': 0, '2000+': 0 };
    const recentSolved = [];

    rawSubs.forEach((sub) => {
      if (sub.verdict === 'OK' && sub.problem) {
        const pKey = `${sub.problem.contestId || ''}-${sub.problem.index || ''}-${sub.problem.name}`;
        if (!solvedSet.has(pKey)) {
          solvedSet.add(pKey);

          // Tags
          (sub.problem.tags || []).forEach((t) => {
            tagMap[t] = (tagMap[t] || 0) + 1;
          });

          // Difficulty rating
          const r = sub.problem.rating;
          if (r) {
            if (r <= 1000) diffMap['800-1000']++;
            else if (r <= 1300) diffMap['1100-1300']++;
            else if (r <= 1600) diffMap['1400-1600']++;
            else if (r <= 1900) diffMap['1700-1900']++;
            else diffMap['2000+']++;
          }

          if (recentSolved.length < 10) {
            recentSolved.push({
              name: sub.problem.name,
              rating: sub.problem.rating || 800,
              tags: sub.problem.tags || [],
              verdict: 'OK',
            });
          }
        }
      }
    });

    const tagDistribution = Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }));

    const difficultyDistribution = Object.entries(diffMap).map(([range, count]) => ({
      range,
      count,
    }));

    const ratingHistory = rawContests.map((c) => ({
      contestId: c.contestId,
      contestName: c.contestName,
      rank: c.rank,
      oldRating: c.oldRating,
      newRating: c.newRating,
      date: new Date(c.ratingUpdateTimeSeconds * 1000).toISOString().slice(0, 10),
    }));

    const bestRank = rawContests.length > 0
      ? Math.min(...rawContests.map((c) => c.rank))
      : 0;

    return {
      profile: {
        handle: rawUser.handle,
        rating: rawUser.rating || 0,
        maxRating: rawUser.maxRating || 0,
        rank: rawUser.rank || 'unranked',
        maxRank: rawUser.maxRank || 'unranked',
        contribution: rawUser.contribution || 0,
        friendOfCount: rawUser.friendOfCount || 0,
        avatar: rawUser.avatar || '',
        titlePhoto: rawUser.titlePhoto || '',
      },
      stats: {
        totalSolved: solvedSet.size,
        contestsCount: rawContests.length,
        bestRank,
      },
      ratingHistory,
      tagDistribution,
      difficultyDistribution,
      recentSolved,
    };
  } catch (error) {
    if (error.response?.status === 400 || error.message.includes('not found')) {
      throw new Error('Codeforces handle not found');
    }
    throw error;
  }
}

function getDemoData() {
  return { ...demoData };
}

module.exports = {
  fetchCodeforcesData,
  getDemoData,
};
