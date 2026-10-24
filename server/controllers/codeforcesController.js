const { fetchCodeforcesData, getDemoData } = require('../services/codeforcesService');
const User = require('../models/User');

const getCodeforcesProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ message: 'Handle is required' });

    try {
      const data = await fetchCodeforcesData(username);
      return res.json(data);
    } catch (err) {
      if (err.message.includes('not found')) {
        return res.status(404).json({ message: err.message });
      }
      return res.json(getDemoData());
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching Codeforces data' });
  }
};

const getMyCodeforces = async (req, res) => {
  try {
    const user = req.user;
    if (user.codeforcesData) {
      return res.json(user.codeforcesData);
    }
    if (user.codeforcesUsername) {
      try {
        const fresh = await fetchCodeforcesData(user.codeforcesUsername);
        await User.findOneAndUpdate({ _id: user._id }, { codeforcesData: fresh });
        return res.json(fresh);
      } catch (err) {
        console.warn('Could not fetch fresh Codeforces data:', err.message);
      }
    }
    return res.json(null);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error loading Codeforces stats' });
  }
};

module.exports = {
  getCodeforcesProfile,
  getMyCodeforces,
};
