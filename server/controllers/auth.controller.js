const Recruiter = require('../models/Recruiter');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, company } = req.body;
    
    if (!name || !email || !password || !company) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const recruiterExists = await Recruiter.findOne({ email });
    if (recruiterExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const recruiter = await Recruiter.create({
      name,
      email,
      password,
      company
    });

    if (recruiter) {
      res.status(201).json({
        _id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        company: recruiter.company,
        token: generateToken(recruiter._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid recruiter data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const recruiter = await Recruiter.findOne({ email });

    if (recruiter && (await recruiter.comparePassword(password))) {
      res.json({
        _id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        company: recruiter.company,
        token: generateToken(recruiter._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.recruiter._id).select('-password');
    if (recruiter) {
      res.json(recruiter);
    } else {
      res.status(404).json({ message: 'Recruiter not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
