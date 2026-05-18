const Candidate = require('../models/Candidate');
const pdfParse = require('pdf-parse');
const axios = require('axios'); // To download the pdf from Cloudinary if needed

exports.addCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.create(req.body);
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Error adding candidate', error: error.message });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidates', error: error.message });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching candidate', error: error.message });
  }
};

exports.updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: 'Error updating candidate', error: error.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting candidate', error: error.message });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const resumeUrl = req.file.path; // Cloudinary URL
    
    // Optional: Extract text using pdf-parse by downloading it
    let extractedText = '';
    try {
      const response = await axios.get(resumeUrl, { responseType: 'arraybuffer' });
      const data = await pdfParse(response.data);
      extractedText = data.text;
    } catch (parseError) {
      console.log('PDF Parse error (can be ignored if not PDF):', parseError.message);
    }

    // Basic extraction heuristics (In a real app, AI could parse this)
    const skillsList = ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Python', 'Java', 'AWS', 'Docker', 'SQL'];
    const extractedSkills = skillsList.filter(skill => 
      extractedText.toLowerCase().includes(skill.toLowerCase())
    );

    res.json({ 
      resumeUrl, 
      extractedData: {
        skills: extractedSkills,
        rawTextPreview: extractedText.substring(0, 500)
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading resume', error: error.message });
  }
};
