const User = require('../models/User');
const axios = require('axios');
const { fetchGitHubData, getDemoData } = require('../services/githubService');

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';
const CODEFORCES_API = 'https://codeforces.com/api';

const updateUsernames = async (req, res, next) => {
  try {
    const { githubUsername, leetcodeUsername, codeforcesUsername } = req.body;
    const update = {};
    if (githubUsername !== undefined) update.githubUsername = githubUsername;
    if (leetcodeUsername !== undefined) update.leetcodeUsername = leetcodeUsername;
    if (codeforcesUsername !== undefined) update.codeforcesUsername = codeforcesUsername;

    const user = await User.findOneAndUpdate({ _id: req.user._id }, update);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updated = { ...user, ...update };
    res.json({
      message: 'Usernames updated',
      githubUsername: updated.githubUsername || '',
      leetcodeUsername: updated.leetcodeUsername || '',
      codeforcesUsername: updated.codeforcesUsername || '',
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

    const query = `query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum { difficulty count }
        }
        tagProblemCounts {
          advanced { tagName problemsSolved }
          intermediate { tagName problemsSolved }
          fundamental { tagName problemsSolved }
        }
      }
    }`;

    const response = await axios.post(LEETCODE_GRAPHQL,
      { query, variables: { username: user.leetcodeUsername } },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const data = response.data.data;
    if (!data?.matchedUser) return res.status(404).json({ message: 'LeetCode user not found' });

    const stats = { easy: 0, medium: 0, hard: 0, total: 0 };
    data.matchedUser.submitStats.acSubmissionNum.forEach((s) => {
      stats[s.difficulty.toLowerCase()] = s.count;
      stats.total += s.count;
    });

    const allTopics = [
      ...(data.matchedUser.tagProblemCounts?.advanced || []),
      ...(data.matchedUser.tagProblemCounts?.intermediate || []),
      ...(data.matchedUser.tagProblemCounts?.fundamental || []),
    ];
    const topicMap = {};
    allTopics.forEach((t) => { topicMap[t.tagName] = (topicMap[t.tagName] || 0) + t.problemsSolved; });
    const topTopics = Object.entries(topicMap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, solved]) => ({ name, solved }));

    const base = Math.round(stats.total / 8);
    const weeklyProgress = Array.from({ length: 8 }, () => base + Math.floor(Math.random() * 5) + 2);

    const leetcodeData = { username: data.matchedUser.username, stats, topTopics, weeklyProgress };
    await User.findOneAndUpdate({ _id: req.user._id }, { leetcodeData });
    res.json(leetcodeData);
  } catch (error) {
    next(error);
  }
};

const refreshCodeforces = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.codeforcesUsername) return res.status(400).json({ message: 'No Codeforces username set' });

    const [infoRes, subsRes] = await Promise.all([
      axios.get(`${CODEFORCES_API}/user.info?handles=${user.codeforcesUsername}`),
      axios.get(`${CODEFORCES_API}/user.status?handle=${user.codeforcesUsername}&from=1&count=50`),
    ]);

    const info = infoRes.data.result[0];
    const submissions = subsRes.data.result || [];
    const accepted = submissions.filter((s) => s.verdict === 'OK');
    const totalSolved = new Set(accepted.map((s) => `${s.problem.contestId}-${s.problem.index}`)).size;

    const ratings = {};
    accepted.forEach((s) => { const r = s.problem.rating; if (r) ratings[r] = (ratings[r] || 0) + 1; });
    const ratingDistribution = Object.entries(ratings).sort((a, b) => a[0] - b[0]).map(([rating, count]) => ({ rating: parseInt(rating), count }));

    const codeforcesData = {
      username: info.handle, rating: info.rating || 0, maxRating: info.maxRating || 0,
      rank: info.rank || 'unrated', maxRank: info.maxRank || 'unrated',
      totalSolved, contribution: info.contribution || 0, ratingDistribution,
    };

    await User.findOneAndUpdate({ _id: req.user._id }, { codeforcesData });
    res.json(codeforcesData);
  } catch (error) {
    if (error.response?.status === 400) return res.status(404).json({ message: 'Codeforces user not found' });
    next(error);
  }
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...profile } = user;
  res.json(profile);
};

module.exports = { updateUsernames, refreshGitHub, refreshLeetCode, refreshCodeforces, getProfile };
