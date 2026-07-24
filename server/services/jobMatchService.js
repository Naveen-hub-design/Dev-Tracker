const { calculateDeveloperScore } = require('../utils/developerScore');

function calculateJobMatch({ github, leetcode, codeforces }) {
  const developerScore = calculateDeveloperScore({ github, leetcode, codeforces });
  const recommendations = generateRecommendations({ github, leetcode, codeforces });
  const jobMatch = computeJobMatch(github, leetcode);

  return { developerScore, recommendations, jobMatch };
}

function computeJobMatch(github, leetcode) {
  let score = 0;

  if (leetcode) {
    if (leetcode.solved > 100) score += 20;
    else if (leetcode.solved > 50) score += 10;
    if (leetcode.hard > 10) score += 15;
    else if (leetcode.hard > 5) score += 8;
  }

  if (github) {
    if (github.repositories > 5) score += 15;
    else if (github.repositories > 2) score += 8;
    if (github.commits > 200) score += 15;
    else if (github.commits > 100) score += 8;
    if (github.stars > 30) score += 10;
    else if (github.stars > 10) score += 5;
  }

  score = Math.min(100, score);

  let companyLevel;
  if (score >= 80) companyLevel = 'Product Companies';
  else if (score >= 60) companyLevel = 'Service Companies';
  else if (score >= 40) companyLevel = 'Startups';
  else companyLevel = 'Entry Level';

  return { score, companyLevel };
}

function generateRecommendations({ github, leetcode, codeforces }) {
  const recs = [];

  if (leetcode) {
    if (leetcode.hard < 20) {
      recs.push({
        title: 'Solve more Hard problems',
        description: `You've solved ${leetcode.hard} hard problems. Aim for 20+ to strengthen problem-solving skills.`,
        priority: 'high',
      });
    }
    if (leetcode.acceptanceRate < 60 && leetcode.acceptanceRate > 0) {
      recs.push({
        title: 'Improve problem accuracy',
        description: `Your acceptance rate is ${leetcode.acceptanceRate}%. Focus on understanding patterns before coding.`,
        priority: 'medium',
      });
    }
    if (leetcode.solved < 100) {
      recs.push({
        title: 'Increase problem count',
        description: `You've solved ${leetcode.solved} problems. Target 100+ for stronger fundamentals.`,
        priority: 'high',
      });
    }
  } else {
    recs.push({
      title: 'Connect LeetCode',
      description: 'Link your LeetCode account to track problem-solving progress.',
      priority: 'low',
    });
  }

  if (github) {
    if (github.repositories < 5) {
      recs.push({
        title: 'Build more projects',
        description: `You have ${github.repositories} repositories. Create 5+ diverse projects.`,
        priority: 'high',
      });
    }
    if (github.commits < 15) {
      recs.push({
        title: 'Increase GitHub activity',
        description: `Only ${github.commits} commits detected. Aim for consistent daily contributions.`,
        priority: 'medium',
      });
    }
  } else {
    recs.push({
      title: 'Connect GitHub',
      description: 'Link your GitHub account to showcase your projects and contributions.',
      priority: 'low',
    });
  }

  if (codeforces) {
    if (codeforces.contests < 10) {
      recs.push({
        title: 'Participate in more contests',
        description: `You've joined ${codeforces.contests} contests. Regular participation improves rating.`,
        priority: 'medium',
      });
    }
    if (codeforces.rating < 1400) {
      recs.push({
        title: 'Work on competitive programming',
        description: `Current rating: ${codeforces.rating}. Practice rated problems to improve.`,
        priority: 'medium',
      });
    }
  }

  return recs.slice(0, 5);
}

module.exports = { calculateJobMatch };
