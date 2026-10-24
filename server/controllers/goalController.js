const Goal = require('../models/Goal');

function generateDemoHistory() {
  const hist = {};
  const now = new Date();
  for (let i = 0; i < 180; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (Math.random() > 0.25) {
      hist[key] = {
        commits: Math.floor(Math.random() * 8),
        problems: Math.floor(Math.random() * 5),
        hours: Math.round(Math.random() * 5 * 10) / 10,
      };
    }
  }
  return hist;
}

const getGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    let goal = await Goal.findByUserId(userId);

    if (!goal) {
      goal = await Goal.create({
        userId,
        dailyCommits: 3,
        dailyProblems: 2,
        dailyHours: 2,
        weeklyCommits: 15,
        weeklyProblems: 10,
        weeklyHours: 14,
        monthlyCommits: 60,
        monthlyProblems: 40,
        monthlyHours: 60,
        history: generateDemoHistory(),
      });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching goals' });
  }
};

const updateGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    const { daily, weekly, monthly } = req.body;

    const updatePayload = {};
    if (daily) {
      if (daily.commits !== undefined) updatePayload.dailyCommits = Number(daily.commits);
      if (daily.problems !== undefined) updatePayload.dailyProblems = Number(daily.problems);
      if (daily.hours !== undefined) updatePayload.dailyHours = Number(daily.hours);
    }
    if (weekly) {
      if (weekly.commits !== undefined) updatePayload.weeklyCommits = Number(weekly.commits);
      if (weekly.problems !== undefined) updatePayload.weeklyProblems = Number(weekly.problems);
      if (weekly.hours !== undefined) updatePayload.weeklyHours = Number(weekly.hours);
    }
    if (monthly) {
      if (monthly.commits !== undefined) updatePayload.monthlyCommits = Number(monthly.commits);
      if (monthly.problems !== undefined) updatePayload.monthlyProblems = Number(monthly.problems);
      if (monthly.hours !== undefined) updatePayload.monthlyHours = Number(monthly.hours);
    }

    const updated = await Goal.findOneAndUpdate({ userId }, updatePayload, { upsert: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error updating goals' });
  }
};

const logTodayActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { commits = 0, problems = 0, hours = 0 } = req.body;
    const today = new Date().toISOString().slice(0, 10);

    let goal = await Goal.findByUserId(userId);
    if (!goal) {
      goal = await Goal.create({
        userId,
        dailyCommits: 3,
        dailyProblems: 2,
        dailyHours: 2,
        weeklyCommits: 15,
        weeklyProblems: 10,
        weeklyHours: 14,
        monthlyCommits: 60,
        monthlyProblems: 40,
        monthlyHours: 60,
        history: {},
      });
    }

    const history = goal.history || {};
    const existing = history[today] || { commits: 0, problems: 0, hours: 0 };
    history[today] = {
      commits: Math.max(0, existing.commits + Number(commits)),
      problems: Math.max(0, existing.problems + Number(problems)),
      hours: Math.round(Math.max(0, existing.hours + Number(hours)) * 10) / 10,
    };

    const updated = await Goal.findOneAndUpdate({ userId }, { history });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error logging activity' });
  }
};

module.exports = {
  getGoals,
  updateGoals,
  logTodayActivity,
};
