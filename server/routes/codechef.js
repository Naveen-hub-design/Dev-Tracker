const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getCodeChefProfile,
  getMyCodeChef,
  updateCodeChefUsername,
  refreshCodeChef,
} = require('../controllers/codeChefController');

// Authenticated user endpoints
router.get('/profile', auth, getMyCodeChef);
router.get('/me', auth, getMyCodeChef);
router.put('/username', auth, updateCodeChefUsername);
router.post('/refresh', auth, refreshCodeChef);

// Public profile endpoint
router.get('/:username', getCodeChefProfile);

module.exports = router;
