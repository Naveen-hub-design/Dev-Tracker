const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getResume,
  saveResume,
} = require('../controllers/resumeController');

router.get('/', auth, getResume);
router.put('/', auth, saveResume);

module.exports = router;
