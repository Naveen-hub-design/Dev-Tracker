const contestService = require('../services/contestService');

const getUpcoming = async (req, res, next) => {
  try {
    const platform = req.query.platform || 'all';
    const contests = await contestService.getUpcomingContests(platform);

    const platforms = ['all', 'codeforces', 'leetcode', 'codechef', 'atcoder', 'hackerrank'];

    res.json({
      count: contests.length,
      platform,
      platforms,
      contests,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUpcoming,
};
