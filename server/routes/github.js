const express = require('express');
const router = express.Router();
const { getGitHubProfile } = require('../controllers/githubController');

router.get('/:username', getGitHubProfile);

module.exports = router;
