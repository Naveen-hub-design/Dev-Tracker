const { getDashboardData, syncAllDashboardData } = require('../services/dashboardService');

const getDashboard = async (req, res, next) => {
  try {
    const data = await getDashboardData(req.user._id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const syncDashboard = async (req, res, next) => {
  try {
    const data = await syncAllDashboardData(req.user._id);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard, syncDashboard };
