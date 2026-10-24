const express = require('express');
const router = express.Router();
const { getGitHubProfile, getRateLimitStatus } = require('../controllers/githubController');

router.get('/rate-limit', getRateLimitStatus);
router.get('/:username', getGitHubProfile);

module.exports = router;
