require('dotenv').config();
const mongoose = require('mongoose');
const Recruiter = require('./models/Recruiter');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const rec = new Recruiter({ name: 'test', email: `test${Date.now()}@test.com`, password: 'test', company: 'test' });
      await rec.save();
      console.log('Saved');
    } catch (e) {
      console.error('Error saving:', e);
    }
    process.exit(0);
  });
