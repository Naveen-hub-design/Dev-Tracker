const axios = require('axios');
const DailyStreak = require('../models/DailyStreak');

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const DAILY_QUERY = `
query questionOfToday {
  activeDailyCodingChallengeQuestion {
    date
    link
    question {
      questionFrontendId
      title
      titleSlug
      difficulty
      hints
      stats
      topicTags {
        name
      }
    }
  }
}
`;

// In-memory cache for daily question (30 mins)
let dailyCache = {
  data: null,
  timestamp: 0,
};
const CACHE_TTL_MS = 30 * 60 * 1000;

// Curated fallback interview problems if LeetCode GraphQL is temporarily unreachable
const FALLBACK_PROBLEMS = [
  {
    questionFrontendId: '1',
    title: 'Two Sum',
    titleSlug: 'two-sum',
    difficulty: 'Easy',
    topicTags: [{ name: 'Array' }, { name: 'Hash Table' }],
    hints: ['A really brute force way would be to search for all possible pairs of numbers.', 'Can we use a hash map to reduce lookup time to O(1)?'],
    stats: JSON.stringify({ acRate: '54.2%', totalAccepted: '5.2M' }),
    link: '/problems/two-sum/',
  },
  {
    questionFrontendId: '121',
    title: 'Best Time to Buy and Sell Stock',
    titleSlug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }],
    hints: ['Track the minimum price seen so far and calculate profit at each step.'],
    stats: JSON.stringify({ acRate: '53.8%', totalAccepted: '4.1M' }),
    link: '/problems/best-time-to-buy-and-sell-stock/',
  },
  {
    questionFrontendId: '200',
    title: 'Number of Islands',
    titleSlug: 'number-of-islands',
    difficulty: 'Medium',
    topicTags: [{ name: 'Array' }, { name: 'Breadth-First Search' }, { name: 'Depth-First Search' }],
    hints: ['Treat the 2D grid as an undirected graph with horizontal and vertical connections.'],
    stats: JSON.stringify({ acRate: '59.1%', totalAccepted: '3.0M' }),
    link: '/problems/number-of-islands/',
  },
];

/**
 * Fetch today's official LeetCode Daily Coding Challenge
 */
async function fetchDailyProblem() {
  const now = Date.now();
  if (dailyCache.data && now - dailyCache.timestamp < CACHE_TTL_MS) {
    return dailyCache.data;
  }

  try {
    const response = await axios.post(
      LEETCODE_GRAPHQL,
      { query: DAILY_QUERY },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 8000,
      }
    );

    const challenge = response.data?.data?.activeDailyCodingChallengeQuestion;
    if (!challenge || !challenge.question) {
      throw new Error('LeetCode response missing daily challenge');
    }

    const q = challenge.question;
    let parsedStats = { acRate: 'N/A', totalAccepted: 'N/A' };
    if (q.stats) {
      try {
        parsedStats = JSON.parse(q.stats);
      } catch {
        // ignore
      }
    }

    const result = {
      date: challenge.date,
      problemId: q.questionFrontendId,
      title: q.title,
      titleSlug: q.titleSlug,
      difficulty: q.difficulty || 'Medium',
      url: `https://leetcode.com${challenge.link}`,
      topicTags: (q.topicTags || []).map((t) => t.name),
      hints: q.hints || [],
      acRate: parsedStats.acRate || '50%',
      totalAccepted: parsedStats.totalAccepted || '100K+',
    };

    dailyCache = {
      data: result,
      timestamp: now,
    };

    return result;
  } catch (error) {
    console.warn('LeetCode Daily Challenge fetch fallback:', error.message);

    // Fallback deterministic by day-of-year
    const todayStr = new Date().toISOString().split('T')[0];
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const fallback = FALLBACK_PROBLEMS[dayOfYear % FALLBACK_PROBLEMS.length];

    let parsedStats = { acRate: '50%', totalAccepted: '1M+' };
    try {
      parsedStats = JSON.parse(fallback.stats);
    } catch {
      // ignore
    }

    return {
      date: todayStr,
      problemId: fallback.questionFrontendId,
      title: fallback.title,
      titleSlug: fallback.titleSlug,
      difficulty: fallback.difficulty,
      url: `https://leetcode.com${fallback.link}`,
      topicTags: fallback.topicTags.map((t) => t.name),
      hints: fallback.hints,
      acRate: parsedStats.acRate,
      totalAccepted: parsedStats.totalAccepted,
    };
  }
}

/**
 * Calculate user's streak statistics from solved dates
 */
function calculateStreakStats(solvedDatesSet) {
  const today = new Date();
  const formatYMD = (d) => d.toISOString().split('T')[0];

  const todayStr = formatYMD(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = formatYMD(yesterday);

  const solvedToday = solvedDatesSet.has(todayStr);

  // 1. Current Streak
  let currentStreak = 0;
  let checkDate = new Date(today);

  if (solvedToday) {
    // Count consecutive days backwards starting from today
    while (solvedDatesSet.has(formatYMD(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (solvedDatesSet.has(yesterdayStr)) {
    // User hasn't solved today yet, but streak from yesterday is still alive
    checkDate = new Date(yesterday);
    while (solvedDatesSet.has(formatYMD(checkDate))) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    currentStreak = 0;
  }

  // 2. Longest Streak
  const sortedDates = Array.from(solvedDatesSet).sort();
  let longestStreak = 0;
  let running = 0;
  let prevDate = null;

  for (const dateStr of sortedDates) {
    const cur = new Date(dateStr);
    if (!prevDate) {
      running = 1;
    } else {
      const diffDays = Math.round((cur - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        running++;
      } else if (diffDays > 1) {
        running = 1;
      }
    }
    prevDate = cur;
    if (running > longestStreak) {
      longestStreak = running;
    }
  }

  // 3. Last 14 days history array
  const last14Days = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dStr = formatYMD(d);
    last14Days.push({
      date: dStr,
      dayName: daysOfWeek[d.getDay()],
      dayNum: d.getDate(),
      solved: solvedDatesSet.has(dStr),
      isToday: dStr === todayStr,
    });
  }

  return {
    solvedToday,
    currentStreak,
    longestStreak,
    totalSolved: solvedDatesSet.size,
    last14Days,
  };
}

/**
 * Get full daily challenge overview + user streak data
 */
async function getDailyOverview(userId = null) {
  const dailyProblem = await fetchDailyProblem();

  let userStreak = {
    solvedToday: false,
    currentStreak: 0,
    longestStreak: 0,
    totalSolved: 0,
    last14Days: [],
    todayRecord: null,
  };

  if (userId) {
    const solvedDates = DailyStreak.getSolvedDates(userId);
    const solvedSet = new Set(solvedDates);
    const stats = calculateStreakStats(solvedSet);

    const todayRecord = await DailyStreak.findByUserAndDate(userId, dailyProblem.date);

    userStreak = {
      ...stats,
      todayRecord,
    };
  }

  return {
    problem: dailyProblem,
    streak: userStreak,
  };
}

/**
 * Toggle solve status for today's LeetCode daily problem
 */
async function toggleDailySolve(userId, { notes = '' } = {}) {
  const dailyProblem = await fetchDailyProblem();
  const date = dailyProblem.date;

  const existing = await DailyStreak.findByUserAndDate(userId, date);

  if (existing && existing.solved) {
    // Unmark as solved (toggle off)
    await DailyStreak.deleteOne({ userId, date });
  } else {
    // Mark as solved
    await DailyStreak.findOneAndUpdate(
      { userId, date },
      {
        userId,
        date,
        problemId: dailyProblem.problemId,
        problemTitle: dailyProblem.title,
        problemDifficulty: dailyProblem.difficulty,
        problemUrl: dailyProblem.url,
        solved: 1,
        notes: notes || existing?.notes || '',
        solvedAt: new Date().toISOString(),
      },
      { upsert: true }
    );
  }

  return getDailyOverview(userId);
}

module.exports = {
  fetchDailyProblem,
  getDailyOverview,
  toggleDailySolve,
};
