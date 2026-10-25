import axios from 'axios';

const demoHackerRank = {
  username: 'hacker',
  name: 'HackerRank Developer',
  avatar: 'https://d1ce3iv5vajdy.cloudfront.net/hackerrank/assets/gravatar.jpg',
  country: 'Global',
  hackerBadge: 'GOLD',
  hackerRank: 1650,
  totalSolved: 142,
  solved: 142,
  hard: 22,
  problemsSolved: { easy: 64, medium: 56, hard: 22, total: 142 },
  languages: [
    { name: 'Python', count: 52, percentage: 37 },
    { name: 'Java', count: 38, percentage: 27 },
    { name: 'C++', count: 32, percentage: 22 },
    { name: 'SQL', count: 20, percentage: 14 },
  ],
  badges: [
    { name: 'Problem Solving (5 Stars)', icon: 'https://hrcdn.net/fcore/assets/badges/problem-solving-5-stars.svg', earnedDate: '2026-03-12' },
    { name: 'Python (5 Stars)', icon: 'https://hrcdn.net/fcore/assets/badges/python-5-stars.svg', earnedDate: '2026-04-18' },
    { name: '10 Days of Statistics', icon: 'https://hrcdn.net/fcore/assets/badges/statistics-badge.svg', earnedDate: '2026-05-04' },
    { name: 'SQL (Gold Badge)', icon: 'https://hrcdn.net/fcore/assets/badges/sql-gold.svg', earnedDate: '2026-06-15' },
  ],
};

export async function fetchHackerRankProfile(username) {
  try {
    const base = import.meta.env.VITE_API_URL || '';
    const res = await axios.get(`${base}/api/hackerrank/${encodeURIComponent(username)}`);
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('HackerRank user not found');
    }
    console.warn('HackerRank API failed, using fallback data');
    return { ...demoHackerRank, username };
  }
}

export { demoHackerRank };
