const Candidate = require('../models/Candidate');
const Job = require('../models/Job');
const { calculateMatchScore } = require('../utils/matchScore');
const { rankCandidatesAI } = require('../utils/ai');

exports.basicMatch = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const candidates = await Candidate.find();
    
    const matchedCandidates = candidates.map(candidate => {
      const matchData = calculateMatchScore(candidate, job);
      return {
        ...candidate._doc,
        matchScore: matchData.score,
        rankingLevel: matchData.ranking,
        matchBreakdown: matchData.breakdown
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedCandidates);
  } catch (error) {
    res.status(500).json({ message: 'Error in basic matching', error: error.message });
  }
};

exports.aiMatch = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // For performance, we might want to only send the top N basic-matched candidates to AI
    const allCandidates = await Candidate.find();
    
    // Sort by basic match first to limit the AI payload
    const sortedByBasic = allCandidates.map(c => ({
      candidate: c,
      score: calculateMatchScore(c, job).score
    })).sort((a, b) => b.score - a.score).slice(0, 10).map(item => item.candidate); // top 10

    if (sortedByBasic.length === 0) {
      return res.json([]);
    }

    const aiResults = await rankCandidatesAI(sortedByBasic, job);
    
    // Combine AI results with candidate data
    const finalResults = aiResults.map(aiRes => {
      const dbCandidate = sortedByBasic.find(c => c.name === aiRes.candidateName);
      return {
        ...dbCandidate?._doc,
        aiScore: aiRes.aiScore,
        aiReason: aiRes.reason,
        aiMissingSkills: aiRes.missingSkills
      };
    }).sort((a, b) => b.aiScore - a.aiScore);

    res.json(finalResults);
  } catch (error) {
    res.status(500).json({ message: 'Error in AI matching', error: error.message });
  }
};
