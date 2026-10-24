const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getCodeforcesProfile, getMyCodeforces } = require('../controllers/codeforcesController');

router.get('/me', auth, getMyCodeforces);
router.get('/:username', getCodeforcesProfile);

module.exports = router;
