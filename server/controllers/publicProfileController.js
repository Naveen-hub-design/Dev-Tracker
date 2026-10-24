const User = require('../models/User');
const Project = require('../models/Project');
const Certificate = require('../models/Certificate');
const Goal = require('../models/Goal');
const { calculateJobMatch } = require('../services/jobMatchService');

const getPublicProfile = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    const user = await User.findByIdentifier(identifier);

    if (!user) {
      return res.status(404).json({ message: 'Developer profile not found' });
    }

    const [projects, certificates, goals] = await Promise.all([
      Project.find({ userId: user._id }),
      Certificate.find({ userId: user._id }),
      Goal.findOne({ userId: user._id }),
    ]);

    const github = user.githubData || null;
    const leetcode = user.leetcodeData || null;
    const hackerrank = user.hackerRankData || null;
    const codeforces = user.codeforcesData || null;

    const { developerScore, jobMatch, recommendations } = calculateJobMatch({
      github,
      leetcode,
      hackerrank,
      codeforces,
    });

    const publicProjects = (projects || [])
      .filter((p) => p.status !== 'archived')
      .map((p) => ({
        id: p._id,
        name: p.name,
        description: p.description,
        techStack: p.techStack || [],
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        stars: p.stars || 0,
        status: p.status,
      }));

    const publicCertificates = (certificates || []).map((c) => ({
      id: c._id,
      name: c.name,
      issuer: c.issuer,
      issueDate: c.issueDate,
      credentialUrl: c.credentialUrl,
      category: c.category,
    }));

    res.json({
      user: {
        id: user._id,
        name: user.name,
        githubUsername: user.githubUsername || '',
        leetcodeUsername: user.leetcodeUsername || '',
        hackerRankUsername: user.hackerRankUsername || '',
        codeforcesUsername: user.codeforcesUsername || '',
        avatar: github?.profile?.avatar || '',
      },
      score: {
        developerScore,
        companyLevel: jobMatch?.companyLevel || 'Entry Level',
        matchScore: jobMatch?.score || 0,
      },
      platforms: {
        github: github ? {
          repos: github.repositories || 0,
          commits: github.commits || 0,
          stars: github.stars || 0,
          languages: github.languages || {},
        } : null,
        leetcode: leetcode ? {
          solved: leetcode.solved || 0,
          easy: leetcode.easy || 0,
          medium: leetcode.medium || 0,
          hard: leetcode.hard || 0,
          acceptanceRate: leetcode.acceptanceRate || 0,
        } : null,
        codeforces: codeforces ? {
          rating: codeforces.profile?.rating || 0,
          rank: codeforces.profile?.rank || 'unranked',
          maxRating: codeforces.profile?.maxRating || 0,
          solved: codeforces.stats?.totalSolved || 0,
        } : null,
        hackerrank: hackerrank ? {
          solved: hackerrank.solved || 0,
          badge: hackerrank.hackerBadge || '',
        } : null,
      },
      projects: publicProjects,
      certificates: publicCertificates,
      achievements: goals?.achievements || [],
      streaks: goals?.streaks || {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicProfile,
};
