const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  skills: [{ type: String }],
  experience: { type: String },
  bio: { type: String },
  projects: { type: String },
  certifications: { type: String },
  github: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
  resumeUrl: { type: String },
  aiScore: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
