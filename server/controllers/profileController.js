const User = require('../models/User');
const { fetchGitHubData, getDemoData } = require('../services/githubService');
const { fetchLeetCodeData } = require('../services/leetcodeService');
const { fetchHackerRankData } = require('../services/hackerRankService');

const updateUsernames = async (req, res, next) => {
  try {
    const { githubUsername, leetcodeUsername, hackerRankUsername } = req.body;
    const update = {};
    if (githubUsername !== undefined) update.githubUsername = githubUsername;
    if (leetcodeUsername !== undefined) update.leetcodeUsername = leetcodeUsername;
    if (hackerRankUsername !== undefined) update.hackerRankUsername = hackerRankUsername;

    const user = await User.findOneAndUpdate({ _id: req.user._id }, update);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updated = { ...user, ...update };
    res.json({
      message: 'Usernames updated',
      githubUsername: updated.githubUsername || '',
      leetcodeUsername: updated.leetcodeUsername || '',
      hackerRankUsername: updated.hackerRankUsername || '',
    });
  } catch (error) {
    next(error);
  }
};

const refreshGitHub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.githubUsername) return res.status(400).json({ message: 'No GitHub username set' });

    try {
      const githubData = await fetchGitHubData(user.githubUsername);
      await User.findOneAndUpdate({ _id: req.user._id }, { githubData });
      return res.json(githubData);
    } catch (apiError) {
      console.warn(`GitHub API error for ${user.githubUsername}: ${apiError.message}. Using demo data.`);
      const fallback = getDemoData();
      await User.findOneAndUpdate({ _id: req.user._id }, { githubData: fallback });
      return res.json(fallback);
    }
  } catch (error) {
    next(error);
  }
};

const refreshLeetCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.leetcodeUsername) return res.status(400).json({ message: 'No LeetCode username set' });

    const leetcodeData = await fetchLeetCodeData(user.leetcodeUsername);
    await User.findOneAndUpdate({ _id: req.user._id }, { leetcodeData });
    res.json(leetcodeData);
  } catch (error) {
    if (error.message === 'LeetCode user not found') {
      return res.status(404).json({ message: 'LeetCode user not found' });
    }
    next(error);
  }
};

const refreshHackerRank = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.hackerRankUsername) return res.status(400).json({ message: 'No HackerRank username set' });

    try {
      const hackerRankData = await fetchHackerRankData(user.hackerRankUsername);
      await User.findOneAndUpdate({ _id: req.user._id }, { hackerRankData });
      return res.json(hackerRankData);
    } catch (apiError) {
      console.warn(`HackerRank API error for ${user.hackerRankUsername}: ${apiError.message}`);
      if (apiError.message === 'HackerRank user not found') {
        return res.status(404).json({ message: 'HackerRank user not found' });
      }
      return res.status(503).json({ message: 'HackerRank API unavailable. Please try again later.' });
    }
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...profile } = user;
  res.json(profile);
};

module.exports = { updateUsernames, refreshGitHub, refreshLeetCode, refreshHackerRank, getProfile };
