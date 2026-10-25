const express = require('express');
const router = express.Router();
const { getHackerRankProfile } = require('../controllers/hackerRankController');

// GET /api/hackerrank/:username
router.get('/:username', getHackerRankProfile);

module.exports = router;
