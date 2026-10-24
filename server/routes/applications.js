const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getApplications,
  createApplication,
  updateApplication,
  updateStatus,
  deleteApplication,
} = require('../controllers/applicationController');

router.get('/', auth, getApplications);
router.post('/', auth, createApplication);
router.put('/:id', auth, updateApplication);
router.patch('/:id/status', auth, updateStatus);
router.delete('/:id', auth, deleteApplication);

module.exports = router;
