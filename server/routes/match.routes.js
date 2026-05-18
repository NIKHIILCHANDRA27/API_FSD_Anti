const express = require('express');
const router = express.Router();
const { basicMatch, aiMatch } = require('../controllers/match.controller');
const { protect } = require('../middleware/auth');

router.post('/basic', protect, basicMatch);
router.post('/ai', protect, aiMatch);

module.exports = router;
