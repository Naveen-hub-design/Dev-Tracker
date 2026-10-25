const User = require('../models/User');
const { calculateDeveloperScore } = require('../utils/developerScore');
const { calculateJobMatch } = require('../services/jobMatchService');
const { generateShieldBadge, generateProfileCard } = require('../services/badgeService');

const getBadge = async (req, res) => {
  try {
    const { identifier } = req.params;
    const style = (req.query.style || 'shield').toLowerCase();
    const theme = (req.query.theme || 'dark').toLowerCase();

    const user = await User.findByIdentifier(identifier);

    if (!user) {
      res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      if (style === 'card') {
        return res.send(
          generateProfileCard({
            name: identifier || 'User',
            score: 0,
            companyLevel: 'Profile Not Found',
            theme,
          })
        );
      }
      return res.send(generateShieldBadge({ name: identifier, score: 0, rankName: 'Not Found' }));
    }

    const github = user.githubData || null;
    const leetcode = user.leetcodeData || null;
    const hackerrank = user.hackerRankData || null;
    const codeforces = user.codeforcesData || null;
    const codechef = user.codeChefData || null;

    const { developerScore, jobMatch } = calculateJobMatch({
      github,
      leetcode,
      hackerrank,
      codeforces,
      codechef,
    });

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=1800');

    if (style === 'card') {
      const svg = generateProfileCard({
        name: user.name,
        githubUsername: user.githubUsername,
        score: developerScore,
        companyLevel: jobMatch?.companyLevel || 'Placement Ready',
        github,
        leetcode,
        codeforces,
        codechef,
        hackerrank,
        theme,
      });
      return res.send(svg);
    }

    const svg = generateShieldBadge({
      name: user.name,
      score: developerScore,
      rankName: jobMatch?.companyLevel,
    });
    return res.send(svg);
  } catch (error) {
    console.error('Badge generation error:', error);
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.send(generateShieldBadge({ name: 'DevTrack', score: 0, rankName: 'Error' }));
  }
};

const getCardBadge = (req, res) => {
  req.query.style = 'card';
  return getBadge(req, res);
};

module.exports = {
  getBadge,
  getCardBadge,
};
