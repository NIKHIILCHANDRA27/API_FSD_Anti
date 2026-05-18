const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const { generateInterviewQuestions } = require('../utils/ai');

exports.getInterviewQuestions = async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;
    
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const questions = await generateInterviewQuestions(candidate, job);
    
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error generating questions', error: error.message });
  }
};
