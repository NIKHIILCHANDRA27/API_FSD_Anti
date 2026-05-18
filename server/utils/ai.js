const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.AI_MODEL || 'openai/gpt-4o';

exports.rankCandidatesAI = async (candidates, job) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is missing');
  }

  const prompt = `
  You are an expert technical recruiter and AI matching engine.
  I will provide you with a job description and a list of candidates.
  
  Job Title: ${job.title}
  Description: ${job.description}
  Required Skills: ${job.requiredSkills.join(', ')}
  Min Experience: ${job.minExperience} years
  
  Candidates:
  ${candidates.map((c, i) => `
    [Candidate ${i + 1}]
    Name: ${c.name}
    Skills: ${(c.skills || []).join(', ')}
    Experience: ${c.experience}
    Projects: ${c.projects}
    Bio: ${c.bio}
  `).join('\n')}
  
  Please rank these candidates based on their fit for the job. 
  For each candidate, provide:
  1. AI Score (1-100)
  2. Shortlist Reason
  3. Missing Skills
  
  Format the output as a valid JSON array of objects with keys: "candidateName", "aiScore", "reason", "missingSkills".
  Respond ONLY with the JSON array, no markdown formatting.
  `;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173', // Replace with your domain
          'X-Title': 'HireGenius AI',
        }
      }
    );

    let content = response.data.choices[0].message.content;
    
    // Clean up potential markdown formatting from the response
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('AI Ranking Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate AI ranking');
  }
};

exports.generateInterviewQuestions = async (candidate, job) => {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is missing');
  }

  const prompt = `
  You are a senior technical interviewer.
  Based on the following candidate and job role, generate 5 technical interview questions.
  The questions should evaluate their specific skills against the job requirements.
  
  Job Role: ${job.title}
  Candidate Skills: ${(candidate.skills || []).join(', ')}
  Experience Level: ${candidate.experience}
  
  Format the output as a JSON array of strings. ONLY output JSON.
  `;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'HireGenius AI',
        }
      }
    );

    let content = response.data.choices[0].message.content;
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('AI Interview Questions Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate interview questions');
  }
};
