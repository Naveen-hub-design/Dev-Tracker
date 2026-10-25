const { calculateDeveloperScore } = require('../utils/developerScore');

function calculateJobMatch({ github, leetcode, hackerrank, codeforces, codechef }) {
  const developerScore = calculateDeveloperScore({ github, leetcode, hackerrank, codeforces, codechef });
  const recommendations = generateRecommendations({ github, leetcode, hackerrank, codeforces, codechef });
  const jobMatch = computeJobMatch(github, leetcode, hackerrank, codeforces, codechef);

  return { developerScore, recommendations, jobMatch };
}

function computeJobMatch(github, leetcode, hackerrank, codeforces, codechef) {
  let score = 0;

  if (leetcode) {
    if (leetcode.solved > 100) score += 18;
    else if (leetcode.solved > 50) score += 9;
    if (leetcode.hard > 10) score += 12;
    else if (leetcode.hard > 5) score += 6;
  }

  if (codeforces) {
    const rating = codeforces.profile?.rating || 0;
    const cfSolved = codeforces.stats?.totalSolved || 0;
    if (rating >= 1600) score += 18; // Expert+ (High-tier Product Companies)
    else if (rating >= 1400) score += 12; // Specialist
    else if (rating >= 1200) score += 7; // Pupil

    if (cfSolved > 100) score += 8;
    else if (cfSolved > 50) score += 4;
  }

  if (codechef) {
    const rating = codechef.profile?.rating || codechef.rating || 0;
    const ccSolved = codechef.stats?.totalSolved || codechef.totalSolved || 0;
    if (rating >= 1800) score += 16; // 4★+
    else if (rating >= 1600) score += 12; // 3★
    else if (rating >= 1400) score += 7; // 2★

    if (ccSolved > 100) score += 8;
    else if (ccSolved > 50) score += 4;
  }

  if (github) {
    if (github.repositories > 5) score += 14;
    else if (github.repositories > 2) score += 7;
    if (github.commits > 200) score += 14;
    else if (github.commits > 100) score += 7;
    if (github.stars > 30) score += 9;
    else if (github.stars > 10) score += 4;
  }

  if (hackerrank) {
    if (hackerrank.solved > 100) score += 15;
    else if (hackerrank.solved > 50) score += 8;
    if (['DIAMOND', 'PLATINUM', 'GOLD'].includes(hackerrank.hackerBadge)) score += 10;
    else if (['SILVER', 'BRONZE'].includes(hackerrank.hackerBadge)) score += 5;
  }

  score = Math.min(100, score);

  let companyLevel;
  if (score >= 80) companyLevel = 'Product Companies';
  else if (score >= 60) companyLevel = 'Service Companies';
  else if (score >= 40) companyLevel = 'Startups';
  else companyLevel = 'Entry Level';

  return { score, companyLevel };
}

function generateRecommendations({ github, leetcode, hackerrank, codeforces, codechef }) {
  const recs = [];

  if (codeforces) {
    const rating = codeforces.profile?.rating || 0;
    const contests = codeforces.stats?.contestsCount || 0;
    if (rating < 1400 && rating > 0) {
      recs.push({
        title: 'Reach Codeforces Specialist (1400+)',
        description: `Current rating: ${rating}. Practice Div. 3 & Div. 2 rounds to achieve cyan specialist badge.`,
        priority: 'high',
      });
    }
    if (contests < 5) {
      recs.push({
        title: 'Compete in Codeforces contests',
        description: `You have completed ${contests} contests. Regular participation boosts speed and problem-solving.`,
        priority: 'medium',
      });
    }
  }

  if (codechef) {
    const rating = codechef.profile?.rating || codechef.rating || 0;
    const stars = codechef.profile?.stars || 1;
    if (rating < 1600 && rating > 0) {
      recs.push({
        title: 'Reach CodeChef 3-Star (1600+)',
        description: `Currently ${stars}★ (${rating} rating). Compete in weekly Starters to break into Div 2.`,
        priority: 'high',
      });
    }
  } else {
    recs.push({
      title: 'Connect CodeChef',
      description: 'Link CodeChef to showcase contest stars, global ranking, and speed solving.',
      priority: 'low',
    });
  }

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

  if (hackerrank) {
    if (hackerrank.solved < 80) {
      recs.push({
        title: 'Solve more HackerRank challenges',
        description: `You've solved ${hackerrank.solved} challenges. Target 80+ for stronger algorithm skills.`,
        priority: 'high',
      });
    }
    if (!['DIAMOND', 'PLATINUM', 'GOLD'].includes(hackerrank.hackerBadge)) {
      recs.push({
        title: 'Earn a HackerRank Gold badge',
        description: `Current badge: ${hackerrank.hackerBadge}. Solve more algorithmic problems to level up.`,
        priority: 'medium',
      });
    }
  } else {
    recs.push({
      title: 'Connect HackerRank',
      description: 'Link your HackerRank account to showcase your coding certifications.',
      priority: 'low',
    });
  }

  return recs.slice(0, 5);
}

module.exports = { calculateJobMatch };
