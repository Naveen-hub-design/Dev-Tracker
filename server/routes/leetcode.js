const express = require('express');
const router = express.Router();
const { auth, optionalAuth } = require('../middleware/auth');
const {
  getLeetCodeProfile,
  getDailyChallenge,
  toggleDailySolve,
} = require('../controllers/leetcodeController');

// LeetCode Daily Challenge & Streak Engine
router.get('/daily', optionalAuth, getDailyChallenge);
router.post('/daily/solve', auth, toggleDailySolve);

// Public or profile stats
router.get('/:username', getLeetCodeProfile);

module.exports = router;
