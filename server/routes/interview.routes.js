const express = require('express');
const router = express.Router();
const { getInterviewQuestions } = require('../controllers/interview.controller');
const { protect } = require('../middleware/auth');

router.post('/questions', protect, getInterviewQuestions);

module.exports = router;
