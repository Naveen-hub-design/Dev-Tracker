const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  chatWithAI,
  scanResumeATS,
  startInterview,
  evaluateAnswer,
  finishInterview,
} = require('../controllers/aiController');

router.post('/chat', auth, chatWithAI);
router.post('/ats-match', auth, scanResumeATS);
router.post('/interview/start', auth, startInterview);
router.post('/interview/evaluate', auth, evaluateAnswer);
router.post('/interview/finish', auth, finishInterview);

module.exports = router;
