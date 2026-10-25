const User = require('../models/User');
const { fetchGitHubData, getDemoData } = require('../services/githubService');
const { fetchLeetCodeData } = require('../services/leetcodeService');
const { fetchHackerRankData, HACKERRANK_ERRORS } = require('../services/hackerRankService');
const { fetchCodeforcesData, getDemoData: getCodeforcesDemo } = require('../services/codeforcesService');
const { fetchCodeChefData, getDemoData: getCodeChefDemo } = require('../services/codeChefService');

const updateUsernames = async (req, res, next) => {
  try {
    const { githubUsername, leetcodeUsername, hackerRankUsername, codeforcesUsername, codeChefUsername, githubToken } = req.body;
    const update = {};
    if (githubUsername !== undefined) update.githubUsername = githubUsername;
    if (leetcodeUsername !== undefined) update.leetcodeUsername = leetcodeUsername;
    if (hackerRankUsername !== undefined) update.hackerRankUsername = hackerRankUsername;
    if (codeforcesUsername !== undefined) update.codeforcesUsername = codeforcesUsername;
    if (codeChefUsername !== undefined) update.codeChefUsername = codeChefUsername;
    if (githubToken !== undefined) update.githubToken = typeof githubToken === 'string' ? githubToken.trim() : '';

    const user = await User.findOneAndUpdate({ _id: req.user._id }, update);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updated = { ...user, ...update };
    res.json({
      message: 'Usernames updated',
      githubUsername: updated.githubUsername || '',
      leetcodeUsername: updated.leetcodeUsername || '',
      hackerRankUsername: updated.hackerRankUsername || '',
      codeforcesUsername: updated.codeforcesUsername || '',
      codeChefUsername: updated.codeChefUsername || '',
      hasGitHubToken: Boolean(updated.githubToken && updated.githubToken.trim()),
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
      const githubData = await fetchGitHubData(user.githubUsername, user.githubToken);
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
      return res.json({ ...hackerRankData, _stale: false });
    } catch (apiError) {
      console.warn(`HackerRank API error for ${user.hackerRankUsername}: ${apiError.message}`);
      if (apiError.message === HACKERRANK_ERRORS.NOT_FOUND) {
        return res.status(404).json({ message: 'HackerRank user not found' });
      }
      if (user.hackerRankData) {
        return res.json({ ...user.hackerRankData, _stale: true, _apiError: apiError.message });
      }
      return res.status(503).json({ message: 'HackerRank API unavailable. Please try again later.' });
    }
  } catch (error) {
    next(error);
  }
};

const refreshCodeforces = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.codeforcesUsername) return res.status(400).json({ message: 'No Codeforces handle set' });

    try {
      const codeforcesData = await fetchCodeforcesData(user.codeforcesUsername);
      await User.findOneAndUpdate({ _id: req.user._id }, { codeforcesData });
      return res.json(codeforcesData);
    } catch (apiError) {
      console.warn(`Codeforces API error for ${user.codeforcesUsername}: ${apiError.message}`);
      if (apiError.message.includes('not found')) {
        return res.status(404).json({ message: 'Codeforces handle not found' });
      }
      if (user.codeforcesData) {
        return res.json({ ...user.codeforcesData, _stale: true });
      }
      const demo = getCodeforcesDemo();
      await User.findOneAndUpdate({ _id: req.user._id }, { codeforcesData: demo });
      return res.json(demo);
    }
  } catch (error) {
    next(error);
  }
};

const refreshCodeChef = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.codeChefUsername) return res.status(400).json({ message: 'No CodeChef handle set' });

    try {
      const codeChefData = await fetchCodeChefData(user.codeChefUsername, true);
      await User.findOneAndUpdate({ _id: req.user._id }, { codeChefData });
      return res.json(codeChefData);
    } catch (apiError) {
      console.warn(`CodeChef API error for ${user.codeChefUsername}: ${apiError.message}`);
      if (apiError.message.includes('not found')) {
        return res.status(404).json({ message: 'CodeChef handle not found' });
      }
      if (user.codeChefData) {
        return res.json({ ...user.codeChefData, _stale: true });
      }
      const demo = getCodeChefDemo();
      await User.findOneAndUpdate({ _id: req.user._id }, { codeChefData: demo });
      return res.json(demo);
    }
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, githubToken, ...profile } = user;
  res.json({
    ...profile,
    hasGitHubToken: Boolean(githubToken && githubToken.trim()),
  });
};

module.exports = {
  updateUsernames,
  refreshGitHub,
  refreshLeetCode,
  refreshHackerRank,
  refreshCodeforces,
  refreshCodeChef,
  getProfile,
};
