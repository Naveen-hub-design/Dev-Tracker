const express = require('express');
const router = express.Router();
const { getJobMatchData } = require('../controllers/jobmatchController');

router.post('/', getJobMatchData);

module.exports = router;
