require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Recruiter = require('./models/Recruiter');
const Job = require('./models/Job');
const Candidate = require('./models/Candidate');

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
        console.error('Missing MONGODB_URI. Provide it in .env to seed the database.');
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Recruiter.deleteMany();
    await Job.deleteMany();
    await Candidate.deleteMany();
    console.log('Cleared existing data');

    // Add Recruiter
    const password = await bcrypt.hash('password123', 10);
    const recruiter = await Recruiter.create({
      name: 'Demo Admin',
      email: 'admin@hiregenius.ai',
      password: password,
      company: 'Tech Innovators Inc.',
      role: 'admin'
    });
    console.log('Created Demo Recruiter: admin@hiregenius.ai / password123');

    // Add Job
    const job = await Job.create({
      title: 'Senior Frontend Developer',
      requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux'],
      preferredSkills: ['Next.js', 'Framer Motion', 'GraphQL'],
      minExperience: 4,
      salaryRange: '$120k - $150k',
      location: 'San Francisco, CA',
      workType: 'Hybrid',
      description: 'We are looking for a Senior Frontend Developer to lead our UI engineering team. You will be building responsive, high-performance web applications using React and Tailwind CSS.'
    });
    console.log('Created Demo Job: Senior Frontend Developer');

    // Add Candidates
    await Candidate.insertMany([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1 234 567 8900',
        skills: ['React', 'JavaScript', 'Tailwind CSS', 'Node.js', 'Next.js'],
        experience: '5',
        bio: 'Passionate frontend developer with 5 years of experience building scalable SaaS applications.',
        projects: 'Built an e-commerce dashboard used by 10k+ users.',
        certifications: 'AWS Certified Developer',
        github: 'github.com/alicej',
        linkedin: 'linkedin.com/in/alicej',
        portfolio: 'alicej.dev',
        aiScore: 0
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+1 987 654 3210',
        skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML'],
        experience: '2',
        bio: 'Junior developer looking for my next big challenge.',
        projects: 'Simple todo app, weather dashboard.',
        github: 'github.com/bobsmith',
        linkedin: 'linkedin.com/in/bobsmith',
        aiScore: 0
      },
      {
        name: 'Charlie Davis',
        email: 'charlie@example.com',
        phone: '+1 555 123 4567',
        skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'Framer Motion', 'GraphQL'],
        experience: '6',
        bio: 'Senior UI engineer focused on highly interactive and accessible web experiences.',
        projects: 'Lead developer for a financial analytics platform.',
        github: 'github.com/cdavis',
        linkedin: 'linkedin.com/in/cdavis',
        portfolio: 'charliedavis.design',
        aiScore: 0
      }
    ]);
    console.log('Created 3 Demo Candidates');

    console.log('Database Seeding Completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
