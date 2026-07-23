function calculateDeveloperScore({ github, leetcode, codeforces }) {
  const githubScore = calculateGithubScore(github);
  const leetcodeScore = calculateLeetcodeScore(leetcode);
  const codeforcesScore = calculateCodeforcesScore(codeforces);
  const consistencyScore = calculateConsistencyScore(github, leetcode, codeforces);
  const projectScore = calculateProjectScore(github);

  const total = Math.round(
    githubScore * 0.30 +
    leetcodeScore * 0.30 +
    codeforcesScore * 0.15 +
    consistencyScore * 0.15 +
    projectScore * 0.10
  );

  return Math.min(100, Math.max(0, total));
}

function calculateGithubScore(data) {
  if (!data) return 0;

  let score = 0;

  const repos = data.repositories || 0;
  if (repos >= 15) score += 30;
  else if (repos >= 10) score += 25;
  else if (repos >= 5) score += 15;
  else if (repos >= 2) score += 8;

  const commits = data.commits || 0;
  if (commits >= 500) score += 30;
  else if (commits >= 200) score += 25;
  else if (commits >= 100) score += 18;
  else if (commits >= 50) score += 10;

  const followers = data.followers || 0;
  if (followers >= 50) score += 20;
  else if (followers >= 20) score += 15;
  else if (followers >= 5) score += 8;

  const stars = data.stars || 0;
  if (stars >= 100) score += 20;
  else if (stars >= 50) score += 15;
  else if (stars >= 10) score += 8;

  return Math.min(100, score);
}

function calculateLeetcodeScore(data) {
  if (!data) return 0;

  let score = 0;

  const total = data.solved || 0;
  if (total >= 300) score += 35;
  else if (total >= 200) score += 28;
  else if (total >= 100) score += 20;
  else if (total >= 50) score += 12;
  else if (total >= 20) score += 5;

  const hard = data.hard || 0;
  if (hard >= 50) score += 25;
  else if (hard >= 30) score += 20;
  else if (hard >= 15) score += 14;
  else if (hard >= 5) score += 7;

  const acceptanceRate = data.acceptanceRate || 0;
  if (acceptanceRate >= 80) score += 20;
  else if (acceptanceRate >= 65) score += 15;
  else if (acceptanceRate >= 50) score += 10;
  else if (acceptanceRate >= 30) score += 5;

  const ranking = data.ranking || 0;
  if (ranking > 0 && ranking <= 100000) score += 20;
  else if (ranking <= 250000) score += 15;
  else if (ranking <= 500000) score += 10;
  else if (ranking <= 1000000) score += 5;

  return Math.min(100, score);
}

function calculateCodeforcesScore(data) {
  if (!data) return 0;

  let score = 0;

  const rating = data.rating || 0;
  if (rating >= 1900) score += 40;
  else if (rating >= 1600) score += 32;
  else if (rating >= 1400) score += 24;
  else if (rating >= 1200) score += 16;
  else if (rating >= 1000) score += 8;

  const contests = data.contests || 0;
  if (contests >= 30) score += 30;
  else if (contests >= 20) score += 24;
  else if (contests >= 10) score += 16;
  else if (contests >= 5) score += 8;

  const maxRating = data.maxRating || 0;
  if (maxRating >= 1900) score += 30;
  else if (maxRating >= 1600) score += 24;
  else if (maxRating >= 1400) score += 18;
  else if (maxRating >= 1200) score += 12;
  else if (maxRating >= 1000) score += 6;

  return Math.min(100, score);
}

function calculateConsistencyScore(github, leetcode, codeforces) {
  let activePlatforms = 0;
  let totalScore = 0;

  if (github && github.commits > 0) {
    activePlatforms++;
    const commits = github.commits;
    if (commits >= 200) totalScore += 100;
    else if (commits >= 100) totalScore += 75;
    else if (commits >= 50) totalScore += 50;
    else totalScore += 25;
  }

  if (leetcode && leetcode.solved > 0) {
    activePlatforms++;
    const solved = leetcode.solved;
    if (solved >= 200) totalScore += 100;
    else if (solved >= 100) totalScore += 75;
    else if (solved >= 50) totalScore += 50;
    else totalScore += 25;
  }

  if (codeforces && codeforces.contests > 0) {
    activePlatforms++;
    const contests = codeforces.contests;
    if (contests >= 20) totalScore += 100;
    else if (contests >= 10) totalScore += 75;
    else if (contests >= 5) totalScore += 50;
    else totalScore += 25;
  }

  if (activePlatforms === 0) return 0;
  return totalScore / activePlatforms;
}

function calculateProjectScore(data) {
  if (!data) return 0;

  let score = 0;

  const repos = data.repositories || 0;
  if (repos >= 10) score += 40;
  else if (repos >= 5) score += 25;
  else if (repos >= 2) score += 15;

  const stars = data.stars || 0;
  if (stars >= 50) score += 30;
  else if (stars >= 20) score += 20;
  else if (stars >= 5) score += 10;

  const languages = data.languages || [];
  const langCount = Array.isArray(languages) ? languages.length : Object.keys(languages).length;
  if (langCount >= 4) score += 30;
  else if (langCount >= 3) score += 22;
  else if (langCount >= 2) score += 15;
  else if (langCount >= 1) score += 8;

  return Math.min(100, score);
}

module.exports = { calculateDeveloperScore };
