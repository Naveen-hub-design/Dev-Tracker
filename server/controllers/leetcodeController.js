const axios = require('axios');

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const getLeetCodeProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          tagProblemCounts {
            advanced { tagName problemsSolved }
            intermediate { tagName problemsSolved }
            fundamental { tagName problemsSolved }
          }
        }
      }
    `;

    const response = await axios.post(
      LEETCODE_GRAPHQL,
      { query, variables: { username } },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const data = response.data.data;

    if (!data || !data.matchedUser) {
      return res.status(404).json({ message: 'LeetCode user not found' });
    }

    const { matchedUser } = data;
    const submissionStats = matchedUser.submitStats.acSubmissionNum;
    const stats = {
      easy: 0,
      medium: 0,
      hard: 0,
      total: 0,
    };
    submissionStats.forEach((s) => {
      stats[s.difficulty.toLowerCase()] = s.count;
      stats.total += s.count;
    });

    const allTopics = [
      ...(matchedUser.tagProblemCounts?.advanced || []),
      ...(matchedUser.tagProblemCounts?.intermediate || []),
      ...(matchedUser.tagProblemCounts?.fundamental || []),
    ];

    const topicMap = {};
    allTopics.forEach((t) => {
      topicMap[t.tagName] = (topicMap[t.tagName] || 0) + t.problemsSolved;
    });

    const topTopics = Object.entries(topicMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, solved]) => ({ name, solved }));

    // Generate mock weekly progress from total
    const weeklyProgress = [];
    const base = Math.round(stats.total / 8);
    for (let i = 0; i < 8; i++) {
      const variance = Math.floor(Math.random() * 5) + 2;
      weeklyProgress.push(base + variance);
    }

    res.json({
      username: matchedUser.username,
      stats,
      topTopics,
      weeklyProgress,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeetCodeProfile };
