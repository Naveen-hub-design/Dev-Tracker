const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  updateUsernames,
  refreshGitHub,
  refreshLeetCode,
  refreshHackerRank,
  refreshCodeforces,
  refreshCodeChef,
  getProfile,
} = require('../controllers/profileController');

router.get('/', auth, getProfile);
router.put('/usernames', auth, updateUsernames);
router.post('/refresh/github', auth, refreshGitHub);
router.post('/refresh/leetcode', auth, refreshLeetCode);
router.post('/refresh/hackerrank', auth, refreshHackerRank);
router.post('/refresh/codeforces', auth, refreshCodeforces);
router.post('/refresh/codechef', auth, refreshCodeChef);

module.exports = router;
