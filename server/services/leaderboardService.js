const { getCollection, db } = require('../config/db');
const { calculateDeveloperScore } = require('../utils/developerScore');
const DailyStreak = require('../models/DailyStreak');

/**
 * Fetch and rank developers across categories
 */
async function getLeaderboard({ category = 'overall', currentUserId = null, limit = 50 } = {}) {
  const users = getCollection('users').find();

  // Pre-calculate streak data for users
  const streakRows = db.prepare(`
    SELECT userId, COUNT(*) as totalSolved
    FROM daily_streaks
    WHERE solved = 1
    GROUP BY userId
  `).all();
  const streakMap = new Map();
  streakRows.forEach((r) => streakMap.set(r.userId, r.totalSolved));

  // Build developer ranking cards
  const developers = users.map((u) => {
    const gh = u.githubData || null;
    const lc = u.leetcodeData || null;
    const hr = u.hackerRankData || null;
    const cf = u.codeforcesData || null;
    const cc = u.codeChefData || null;

    const devScore = calculateDeveloperScore({
      github: gh,
      leetcode: lc,
      hackerrank: hr,
      codeforces: cf,
      codechef: cc,
    });

    const lcSolved = lc?.stats?.total || 0;
    const cfSolved = cf?.stats?.totalSolved || cf?.solved || 0;
    const hrSolved = hr?.solved || 0;
    const ccSolved = cc?.stats?.totalSolved || cc?.totalSolved || 0;
    const totalProblems = lcSolved + cfSolved + hrSolved + ccSolved;

    const commits = gh?.totalCommits || 0;
    const stars = (gh?.repos || []).reduce((acc, r) => acc + (r.stars || 0), 0);
    const repos = gh?.public_repos || gh?.repos?.length || 0;

    const dailyStreakCount = streakMap.get(u._id) || 0;

    return {
      id: u._id,
      name: u.name || 'Anonymous Developer',
      email: u.email,
      githubUsername: u.githubUsername || gh?.profile?.username || '',
      leetcodeUsername: u.leetcodeUsername || lc?.username || '',
      codeforcesUsername: u.codeforcesUsername || cf?.profile?.handle || '',
      codeChefUsername: u.codeChefUsername || cc?.profile?.username || '',
      avatar: gh?.profile?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${u._id}`,
      developerScore: devScore,
      totalProblems,
      lcSolved,
      cfSolved,
      ccSolved,
      cfRating: cf?.profile?.rating || 0,
      cfRank: cf?.profile?.rank || '',
      ccRating: cc?.profile?.rating || 0,
      ccStars: cc?.profile?.stars || 0,
      commits,
      stars,
      repos,
      dailyStreakCount,
      isCurrentUser: currentUserId === u._id,
    };
  });

  // Sort based on category
  switch (category) {
    case 'algorithms':
      developers.sort((a, b) => b.totalProblems - a.totalProblems || b.cfRating - a.cfRating || b.developerScore - a.developerScore);
      break;
    case 'opensource':
      developers.sort((a, b) => (b.commits + b.stars * 2) - (a.commits + a.stars * 2) || b.repos - a.repos);
      break;
    case 'consistency':
      developers.sort((a, b) => b.dailyStreakCount - a.dailyStreakCount || b.developerScore - a.developerScore);
      break;
    case 'overall':
    default:
      developers.sort((a, b) => b.developerScore - a.developerScore || b.totalProblems - a.totalProblems);
      break;
  }

  // Assign ranks and compute percentile
  const total = developers.length;
  developers.forEach((dev, idx) => {
    dev.rank = idx + 1;
    const percentile = Math.max(1, Math.round(((total - idx) / total) * 100));
    dev.percentile = percentile;
    dev.tier = dev.developerScore >= 85 ? 'Elite' : dev.developerScore >= 70 ? 'Advanced' : dev.developerScore >= 50 ? 'Intermediate' : 'Novice';
  });

  const currentUser = developers.find((d) => d.id === currentUserId) || null;

  return {
    category,
    totalDevelopers: total,
    top3: developers.slice(0, 3),
    rankings: developers.slice(0, limit),
    currentUserRank: currentUser ? {
      rank: currentUser.rank,
      percentile: currentUser.percentile,
      developerScore: currentUser.developerScore,
      totalProblems: currentUser.totalProblems,
    } : null,
  };
}

module.exports = {
  getLeaderboard,
};
