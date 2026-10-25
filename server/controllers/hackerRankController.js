const { fetchHackerRankData, getDemoData, HACKERRANK_ERRORS } = require('../services/hackerRankService');

async function getHackerRankProfile(req, res, next) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    try {
      const data = await fetchHackerRankData(username);
      return res.json(data);
    } catch (err) {
      if (err.message === HACKERRANK_ERRORS.NOT_FOUND) {
        return res.status(404).json({ message: 'HackerRank user not found' });
      }
      console.warn(`HackerRank API unavailable for ${username}, serving fallback data: ${err.message}`);
      const demo = getDemoData(username);
      return res.json(demo);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getHackerRankProfile,
};
