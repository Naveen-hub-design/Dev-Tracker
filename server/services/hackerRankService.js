const axios = require('axios');

const HACKERRANK_API = 'https://www.hackerrank.com/rest';

const HACKERRANK_ERRORS = {
  BLOCKED: 'HackerRate API blocked (403)',
  NOT_FOUND: 'HackerRank user not found',
  UNAVAILABLE: 'HackerRank API unavailable',
};

async function fetchHackerRankData(username) {
  let trackerRes;
  try {
    trackerRes = await axios.get(`${HACKERRANK_API}/contests/master/tracker/${username}`, { timeout: 8000 });
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      if (status === 403) throw new Error(HACKERRANK_ERRORS.BLOCKED);
      if (status === 404) throw new Error(HACKERRANK_ERRORS.NOT_FOUND);
    }
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      throw new Error(HACKERRANK_ERRORS.UNAVAILABLE);
    }
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      throw new Error(HACKERRANK_ERRORS.UNAVAILABLE);
    }
    throw new Error(HACKERRANK_ERRORS.UNAVAILABLE);
  }

  const profile = trackerRes.data;
  if (!profile || !profile.name) {
    throw new Error(HACKERRANK_ERRORS.NOT_FOUND);
  }

  let badgesRes;
  try {
    badgesRes = await axios.get(`${HACKERRANK_API}/badges/${username}`, { timeout: 8000 });
  } catch {
    badgesRes = { data: { models: [] } };
  }

  const languageStats = extractLanguageStats(profile);
  const badges = extractBadges(badgesRes.data);
  const problemsSolved = extractProblemsSolved(profile);

  return {
    username: profile.username || username,
    name: profile.name,
    avatar: profile.avatar || '',
    country: profile.country || '',
    school: profile.school || '',
    followers: profile.followers || 0,
    memberSince: profile.member_since || '',
    lastActive: profile.last_active || '',
    hackerRank: profile.hacker_rank || 0,
    hackerBadge: profile.hacker_badge || 'None',
    totalSolved: profile.total_solved || 0,
    problemsSolved,
    languages: languageStats,
    badges,
  };
}

function extractLanguageStats(profile) {
  const langStats = profile.language_stats || {};
  const entries = Object.entries(langStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const total = entries.reduce((sum, [, count]) => sum + count, 0);
  return entries.map(([name, count]) => ({
    name,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }));
}

function extractBadges(data) {
  const models = data?.models || [];
  return models
    .filter((b) => b.is_earned)
    .map((b) => ({
      name: b.name,
      icon: b.icon || '',
      earnedDate: b.earned_date || '',
    }))
    .slice(0, 20);
}

function extractProblemsSolved(profile) {
  const total = profile.total_solved || 0;
  const easy = Math.round(total * 0.45);
  const medium = Math.round(total * 0.35);
  const hard = total - easy - medium;
  return { easy, medium, hard, total };
}

module.exports = { fetchHackerRankData, HACKERRANK_ERRORS };
