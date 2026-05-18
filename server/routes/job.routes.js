const express = require('express');
const router = express.Router();
const { createJob, getJobs, deleteJob } = require('../controllers/job.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, createJob);
router.get('/', protect, getJobs);
router.delete('/:id', protect, deleteJob);

module.exports = router;
