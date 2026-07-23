import axios from 'axios';

const demoLeetCode = {
  username: 'arun-dev',
  easy: 94,
  medium: 72,
  hard: 21,
  total: 187,
  weeklyProgress: [4, 7, 5, 9, 8, 12, 10, 14],
  topics: [
    { name: 'Arrays', solved: 42 },
    { name: 'Strings', solved: 38 },
    { name: 'Stack', solved: 35 },
    { name: 'DP', solved: 28 },
    { name: 'Trees', solved: 25 },
    { name: 'Graphs', solved: 19 },
  ],
};

export async function fetchLeetCodeProfile(username) {
  try {
    const base = import.meta.env.VITE_API_URL || '';
    const res = await axios.get(`${base}/api/leetcode/${username}`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('LeetCode user not found');
    }
    console.warn('LeetCode API failed, using demo data');
    return { ...demoLeetCode, username };
  }
}

export { demoLeetCode };
