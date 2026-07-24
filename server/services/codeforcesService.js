const axios = require('axios');

const CODEFORCES_API = 'https://codeforces.com/api';

async function fetchCodeforcesData(username) {
  const [infoRes, subsRes] = await Promise.all([
    axios.get(`${CODEFORCES_API}/user.info?handles=${username}`),
    axios.get(`${CODEFORCES_API}/user.status?handle=${username}&from=1&count=50`),
  ]);

  const info = infoRes.data.result[0];
  const submissions = subsRes.data.result || [];
  const accepted = submissions.filter((s) => s.verdict === 'OK');
  const totalSolved = new Set(
    accepted.map((s) => `${s.problem.contestId}-${s.problem.index}`)
  ).size;

  const ratingDistribution = buildRatingDistribution(accepted);

  return {
    username: info.handle,
    rating: info.rating || 0,
    maxRating: info.maxRating || 0,
    rank: info.rank || 'unrated',
    maxRank: info.maxRank || 'unrated',
    totalSolved,
    contribution: info.contribution || 0,
    ratingDistribution,
  };
}

function buildRatingDistribution(accepted) {
  const ratings = {};
  accepted.forEach((s) => {
    const r = s.problem.rating;
    if (r) ratings[r] = (ratings[r] || 0) + 1;
  });
  return Object.entries(ratings)
    .sort((a, b) => a[0] - b[0])
    .map(([rating, count]) => ({ rating: parseInt(rating), count }));
}

module.exports = { fetchCodeforcesData };
