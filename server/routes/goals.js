const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getGoals,
  updateGoals,
  logTodayActivity,
} = require('../controllers/goalController');

router.get('/', auth, getGoals);
router.put('/', auth, updateGoals);
router.post('/log', auth, logTodayActivity);

module.exports = router;
