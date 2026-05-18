const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  requiredSkills: [{ type: String }],
  preferredSkills: [{ type: String }],
  minExperience: { type: Number, required: true },
  salaryRange: { type: String },
  location: { type: String },
  workType: { type: String, enum: ['Remote', 'Hybrid', 'Onsite'], default: 'Onsite' },
  description: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
