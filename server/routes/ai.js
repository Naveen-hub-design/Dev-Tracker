const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { chatWithAI, scanResumeATS } = require('../controllers/aiController');

router.post('/chat', auth, chatWithAI);
router.post('/ats-match', auth, scanResumeATS);

module.exports = router;
