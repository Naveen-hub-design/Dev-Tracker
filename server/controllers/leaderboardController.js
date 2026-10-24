const leaderboardService = require('../services/leaderboardService');

const getLeaderboard = async (req, res, next) => {
  try {
    const category = req.query.category || 'overall';
    const limit = parseInt(req.query.limit, 10) || 50;
    const currentUserId = req.user ? req.user._id : null;

    const data = await leaderboardService.getLeaderboard({
      category,
      currentUserId,
      limit,
    });

    res.json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeaderboard,
};
