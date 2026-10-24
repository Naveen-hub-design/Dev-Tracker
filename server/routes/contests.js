const express = require('express');
const router = express.Router();
const { getUpcoming } = require('../controllers/contestController');

router.get('/upcoming', getUpcoming);

module.exports = router;
