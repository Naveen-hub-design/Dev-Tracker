const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, changePassword } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getMe);
router.put('/change-password', auth, changePassword);

module.exports = router;
