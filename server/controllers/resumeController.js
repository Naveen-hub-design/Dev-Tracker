const Resume = require('../models/Resume');

const getResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const resume = await Resume.findByUserId(userId);
    res.json(resume || null);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching resume' });
  }
};

const saveResume = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      activeTemplate = 'modern',
      personal = {},
      education = [],
      skills = {},
      experience = [],
      projects = [],
      achievements = [],
      codingProfiles = {},
    } = req.body;

    const updated = await Resume.findOneAndUpdate(
      { userId },
      {
        activeTemplate,
        personal,
        education,
        skills,
        experience,
        projects,
        achievements,
        codingProfiles,
      },
      { upsert: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error saving resume' });
  }
};

module.exports = {
  getResume,
  saveResume,
};
