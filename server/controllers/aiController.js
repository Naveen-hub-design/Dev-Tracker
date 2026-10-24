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

const {
  startMockInterview,
  evaluateMockInterviewAnswer,
  generateInterviewReport,
} = require('../services/aiService');

const startInterview = async (req, res) => {
  try {
    const { role = 'frontend', level = 'mid' } = req.body;
    const userContext = await buildUserContext(req.user);
    const result = await startMockInterview({ role, level, userContext });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error starting interview' });
  }
};

const evaluateAnswer = async (req, res) => {
  try {
    const { role, level, questionNumber, question, answer, history } = req.body;
    if (!answer || !answer.trim()) {
      return res.status(400).json({ message: 'Answer is required' });
    }

    const result = await evaluateMockInterviewAnswer({
      role,
      level,
      questionNumber: Number(questionNumber) || 1,
      question,
      answer,
      history: history || [],
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error evaluating interview answer' });
  }
};

const finishInterview = async (req, res) => {
  try {
    const { role, level, exchanges = [] } = req.body;
    const result = generateInterviewReport({ role, level, exchanges });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error generating interview report' });
  }
};

const { reviewCodeSolution } = require('../services/aiService');

const reviewCode = async (req, res) => {
  try {
    const { code, language = 'javascript', problemTitle = 'Algorithm Challenge', testInput = '' } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({ message: 'Code is required for review' });
    }
    const result = await reviewCodeSolution({ code, language, problemTitle, testInput });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error reviewing code solution' });
  }
};

module.exports = {
  chatWithAI,
  scanResumeATS,
  startInterview,
  evaluateAnswer,
  finishInterview,
  reviewCode,
};
