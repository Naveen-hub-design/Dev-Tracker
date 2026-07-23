const getJobMatchData = async (req, res, next) => {
  try {
    const { githubData, leetcodeData } = req.body;

    let score = 0;
    const breakdown = {
      leetcodeSolved: 0,
      hardProblems: 0,
      githubRepos: 0,
      githubCommits: 0,
      projects: 0,
      streak: 0,
    };

    if (leetcodeData) {
      const totalSolved = leetcodeData.total || 0;
      const hardSolved = leetcodeData.hard || 0;
      if (totalSolved > 100) breakdown.leetcodeSolved = 20;
      else if (totalSolved > 50) breakdown.leetcodeSolved = 10;
      if (hardSolved > 10) breakdown.hardProblems = 15;
      else if (hardSolved > 5) breakdown.hardProblems = 8;
    }

    if (githubData) {
      const repoCount = githubData.public_repos || 0;
      const totalCommits = githubData.totalCommits || 0;
      if (repoCount > 5) breakdown.githubRepos = 15;
      else if (repoCount > 2) breakdown.githubRepos = 8;
      if (totalCommits > 200) breakdown.githubCommits = 15;
      else if (totalCommits > 100) breakdown.githubCommits = 8;

      const repos = githubData.repos || [];
      const namesAndLangs = repos.map((r) => ({
        name: r.name ? r.name.toLowerCase() : '',
        language: r.language ? r.language.toLowerCase() : '',
      }));

      if (namesAndLangs.some((r) => r.name.includes('react') || r.language.includes('react'))) {
        breakdown.projects += 10;
      }
      if (namesAndLangs.some((r) => r.name.includes('node') || r.language === 'javascript')) {
        breakdown.projects += 10;
      }

      // Simulated streak from commit activity
      const activity = githubData.commitActivity || [];
      const recentWeeksActive = activity.filter((c) => c > 0).length;
      if (recentWeeksActive > 7) breakdown.streak = 10;
      else if (recentWeeksActive > 3) breakdown.streak = 5;
    }

    score = Object.values(breakdown).reduce((a, b) => a + b, 0);
    score = Math.min(score, 100);

    const companies = [
      { company: 'Zoho', threshold: 55 },
      { company: 'Freshworks', threshold: 60 },
      { company: 'TCS/Infosys', threshold: 50 },
      { company: 'Wipro', threshold: 52 },
      { company: 'Flipkart', threshold: 72 },
      { company: 'Google/Amazon', threshold: 88 },
    ];

    const companyReadiness = companies.map((c) => {
      let status;
      if (score >= c.threshold) status = 'Ready';
      else if (score >= c.threshold - 10) status = 'Almost';
      else status = 'Not yet';
      return { ...c, status, score };
    });

    res.json({ totalScore: score, breakdown, companyReadiness });
  } catch (error) {
    next(error);
  }
};

module.exports = { getJobMatchData };
