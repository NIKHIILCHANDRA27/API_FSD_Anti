/**
 * Calculates a match score between a candidate's profile and a job requirement
 */
exports.calculateMatchScore = (candidate, job) => {
  let skillMatchScore = 0;
  let experienceMatchScore = 0;
  let preferredSkillMatchScore = 0;
  let resumeKeywordScore = 0;

  // 1. Skill Match (50 points)
  if (job.requiredSkills && job.requiredSkills.length > 0) {
    const candidateSkills = (candidate.skills || []).map(s => s.toLowerCase());
    let matchedSkills = 0;
    job.requiredSkills.forEach(skill => {
      if (candidateSkills.includes(skill.toLowerCase())) {
        matchedSkills++;
      }
    });
    skillMatchScore = (matchedSkills / job.requiredSkills.length) * 50;
  } else {
    skillMatchScore = 50; // default if no required skills
  }

  // 2. Experience Match (20 points)
  const candidateExp = parseInt(candidate.experience) || 0;
  if (candidateExp >= job.minExperience) {
    experienceMatchScore = 20;
  } else {
    // Partial score for experience
    const expRatio = candidateExp / job.minExperience;
    experienceMatchScore = Math.floor(expRatio * 20);
  }

  // 3. Preferred Skills Match (20 points)
  if (job.preferredSkills && job.preferredSkills.length > 0) {
    const candidateSkills = (candidate.skills || []).map(s => s.toLowerCase());
    let matchedPrefSkills = 0;
    job.preferredSkills.forEach(skill => {
      if (candidateSkills.includes(skill.toLowerCase())) {
        matchedPrefSkills++;
      }
    });
    preferredSkillMatchScore = (matchedPrefSkills / job.preferredSkills.length) * 20;
  } else {
    preferredSkillMatchScore = 20;
  }

  // 4. Resume Keyword Score (10 points)
  // Basic implementation: check if job description words appear in resume/bio
  if (candidate.bio || candidate.projects || candidate.experience) {
    const combinedText = `${candidate.bio} ${candidate.projects} ${candidate.experience}`.toLowerCase();
    const jobKeywords = job.description.toLowerCase().split(/\W+/).filter(w => w.length > 4);
    let matchedKeywords = 0;
    jobKeywords.forEach(word => {
      if (combinedText.includes(word)) matchedKeywords++;
    });
    // Cap at 10 points
    resumeKeywordScore = Math.min((matchedKeywords / Math.max(jobKeywords.length, 1)) * 10 * 3, 10);
  }

  const finalScore = Math.round(skillMatchScore + experienceMatchScore + preferredSkillMatchScore + resumeKeywordScore);
  
  let ranking = 'Weak';
  if (finalScore >= 90) ranking = 'Excellent';
  else if (finalScore >= 70) ranking = 'Good';
  else if (finalScore >= 50) ranking = 'Average';

  return {
    score: finalScore,
    ranking,
    breakdown: {
      skillMatchScore,
      experienceMatchScore,
      preferredSkillMatchScore,
      resumeKeywordScore
    }
  };
};
