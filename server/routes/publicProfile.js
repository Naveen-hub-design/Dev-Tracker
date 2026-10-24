const express = require('express');
const router = express.Router();
const { getPublicProfile } = require('../controllers/publicProfileController');

router.get('/u/:identifier', getPublicProfile);

module.exports = router;
