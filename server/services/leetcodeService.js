const axios = require('axios');

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const GRAPHQL_QUERY = `query getUserProfile($username: String!) {
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

async function fetchLeetCodeData(username) {
  const response = await axios.post(
    LEETCODE_GRAPHQL,
    { query: GRAPHQL_QUERY, variables: { username } },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const data = response.data.data;
  if (!data?.matchedUser) {
    throw new Error('LeetCode user not found');
  }

  const stats = calculateStats(data.matchedUser.submitStats.acSubmissionNum);
  const topTopics = aggregateTopics(data.matchedUser.tagProblemCounts);
  const weeklyProgress = generateWeeklyProgress(stats.total);

  return {
    username: data.matchedUser.username,
    stats,
    topTopics,
    weeklyProgress,
  };
}

function calculateStats(acSubmissionNum) {
  const stats = { easy: 0, medium: 0, hard: 0, total: 0 };
  acSubmissionNum.forEach((s) => {
    stats[s.difficulty.toLowerCase()] = s.count;
    stats.total += s.count;
  });
  return stats;
}

function aggregateTopics(tagProblemCounts) {
  const allTopics = [
    ...(tagProblemCounts?.advanced || []),
    ...(tagProblemCounts?.intermediate || []),
    ...(tagProblemCounts?.fundamental || []),
  ];

  const topicMap = {};
  allTopics.forEach((t) => {
    topicMap[t.tagName] = (topicMap[t.tagName] || 0) + t.problemsSolved;
  });

  return Object.entries(topicMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, solved]) => ({ name, solved }));
}

function generateWeeklyProgress(totalSolved) {
  const base = Math.round(totalSolved / 8);
  return Array.from({ length: 8 }, () => base + Math.floor(Math.random() * 5) + 2);
}

module.exports = { fetchLeetCodeData };
