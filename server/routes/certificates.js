const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} = require('../controllers/certificateController');

router.get('/', auth, getCertificates);
router.post('/', auth, createCertificate);
router.put('/:id', auth, updateCertificate);
router.delete('/:id', auth, deleteCertificate);

module.exports = router;
