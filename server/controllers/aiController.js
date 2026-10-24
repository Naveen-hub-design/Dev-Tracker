const { getCareerAdvice, analyzeResumeATS } = require('../services/aiService');
const Project = require('../models/Project');
const Resume = require('../models/Resume');

async function buildUserContext(user) {
  const projects = await Project.find({ userId: user._id });
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    github: user.githubData || null,
    leetcode: user.leetcodeData || null,
    hackerrank: user.hackerRankData || null,
    projects: projects || [],
  };
}

const chatWithAI = async (req, res) => {
  try {
    const { message = '', history = [] } = req.body;
    if (!message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const userContext = await buildUserContext(req.user);
    const result = await getCareerAdvice({
      message,
      userContext,
      history,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error processing AI chat' });
  }
};

const scanResumeATS = async (req, res) => {
  try {
    const { jobDescription = '', resumeOverride } = req.body;
    if (!jobDescription.trim()) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    const userContext = await buildUserContext(req.user);
    let resume = resumeOverride;
    if (!resume) {
      resume = await Resume.findByUserId(req.user._id);
    }

    const result = await analyzeResumeATS({
      resume,
      jobDescription,
      userContext,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error analyzing resume with ATS' });
  }
};

module.exports = {
  chatWithAI,
  scanResumeATS,
};
