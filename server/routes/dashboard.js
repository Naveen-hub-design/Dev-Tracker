const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getDashboard, syncDashboard } = require('../controllers/dashboardController');

router.get('/', auth, getDashboard);
router.post('/sync', auth, syncDashboard);

module.exports = router;
