const express = require('express');
const router = express.Router();
const { getBadge, getCardBadge } = require('../controllers/badgeController');

router.get('/:identifier', getBadge);
router.get('/:identifier/card', getCardBadge);
router.get('/:identifier/card.svg', getCardBadge);

module.exports = router;
