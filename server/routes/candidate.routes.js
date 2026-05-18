const express = require('express');
const router = express.Router();
const { addCandidate, getCandidates, getCandidateById, updateCandidate, deleteCandidate, uploadResume } = require('../controllers/candidate.controller');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.post('/', protect, addCandidate);
router.get('/', protect, getCandidates);
router.get('/:id', protect, getCandidateById);
router.put('/:id', protect, updateCandidate);
router.delete('/:id', protect, deleteCandidate);
router.post('/upload-resume', protect, upload.single('resume'), uploadResume);

module.exports = router;
