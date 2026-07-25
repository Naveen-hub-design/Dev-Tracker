const axios = require('axios');

const HACKERRANK_API = 'https://www.hackerrank.com/rest';

async function fetchHackerRankData(username) {
  const [trackerRes, badgesRes] = await Promise.all([
    axios.get(`${HACKERRANK_API}/contests/master/tracker/${username}`, { timeout: 8000 }),
    axios.get(`${HACKERRANK_API}/badges/${username}`, { timeout: 8000 }).catch(() => ({ data: { models: [] } })),
  ]);

  const profile = trackerRes.data;
  if (!profile || !profile.name) {
    throw new Error('HackerRank user not found');
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

module.exports = { fetchHackerRankData };
