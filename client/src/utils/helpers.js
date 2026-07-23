export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateStr);
}

export function getSkillLevel(value, max) {
  return Math.min(100, Math.round((value / max) * 100));
}

export function getBadgeColor(status) {
  switch (status) {
    case 'Ready':
      return 'bg-emerald-100 text-emerald-700';
    case 'Almost':
      return 'bg-amber-100 text-amber-700';
    case 'Not yet':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

export function getScoreColor(score) {
  if (score >= 70) return 'text-emerald-500';
  if (score >= 40) return 'text-amber-500';
  return 'text-red-500';
}

export function generateWeeklyReport(githubData, leetcodeData) {
  const recommendations = [];

  if (leetcodeData) {
    const total = leetcodeData.total || 0;
    const hard = leetcodeData.hard || 0;
    if (total < 50) {
      recommendations.push('Focus on solving at least 10 problems this week to build momentum in DSA.');
    } else if (hard < 5) {
      recommendations.push('Challenge yourself with more Hard-level problems to improve problem-solving depth.');
    } else {
      recommendations.push('Great work on LeetCode! Start participating in weekly contests to improve speed.');
    }

    const weakTopics = leetcodeData.topics ? leetcodeData.topics[leetcodeData.topics.length - 1] : null;
    if (weakTopics) {
      recommendations.push(`Strengthen your "${weakTopics.name}" skills — it has the lowest solve count.`);
    }
  } else {
    recommendations.push('Connect your LeetCode account to track problem-solving progress.');
    recommendations.push('Start with Arrays and Strings — they are the most frequently asked topics.');
  }

  if (githubData) {
    const commits = githubData.totalCommits || 0;
    if (commits < 100) {
      recommendations.push('Increase your commit frequency. Aim for at least 1 commit per day.');
    } else {
      const lang = Object.entries(githubData.languages || {}).sort((a, b) => b[1] - a[1])[0];
      if (lang) {
        recommendations.push(`Your strongest language is ${lang[0]}. Build a project that showcases it end-to-end.`);
      } else {
        recommendations.push('Build a full-stack project to showcase both frontend and backend skills.');
      }
    }
  } else {
    recommendations.push('Connect your GitHub account to start tracking contributions.');
  }

  return recommendations.slice(0, 3);
}

export function generateActionPlan(score, breakdown) {
  const plan = [];
  const sorted = Object.entries(breakdown).sort((a, b) => a[1] - b[1]);

  sorted.forEach(([key, value]) => {
    if (value === 0) {
      switch (key) {
        case 'leetcodeSolved':
          plan.push('Solve 50+ LeetCode problems to improve your score by 10-20 points.');
          break;
        case 'hardProblems':
          plan.push('Tackle more Hard problems to unlock 15 extra points.');
          break;
        case 'githubRepos':
          plan.push('Create more GitHub repositories with diverse projects.');
          break;
        case 'githubCommits':
          plan.push('Increase commit frequency — aim for consistent daily contributions.');
          break;
        case 'projects':
          plan.push('Build projects using React and Node.js for a 20-point boost.');
          break;
        case 'streak':
          plan.push('Maintain a consistent coding streak of 7+ days.');
          break;
      }
    }
  });

  return plan.slice(0, 3);
}
