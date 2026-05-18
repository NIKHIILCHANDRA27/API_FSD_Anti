# HireGenius AI – Smart Candidate Shortlisting Platform

HireGenius is a premium SaaS platform designed for modern recruitment teams. It leverages the MERN stack and OpenRouter AI to intelligently rank candidates, parse resumes, and provide actionable hiring insights.

## Features

- **AI Candidate Ranking**: Uses OpenRouter models (e.g. `openai/gpt-4o`, `anthropic/claude-3.5-sonnet`) to analyze candidate profiles against job requirements.
- **Smart Resume Parsing**: Extracts skills and text from PDF resumes using `pdf-parse`.
- **Cloudinary Integration**: Securely uploads and stores candidate resumes.
- **Premium UI**: Built with React, Tailwind CSS, Framer Motion, and Lucide Icons to resemble top-tier SaaS platforms like Stripe and Linear.
- **Interactive Dashboard**: Visualizes candidate quality and application trends using Recharts.

## Tech Stack

- **Frontend**: Vite + React, Tailwind CSS, React Router, Axios, Recharts, Framer Motion
- **Backend**: Node.js, Express, MongoDB Atlas, Mongoose
- **Authentication**: JWT & bcryptjs
- **AI**: OpenRouter API

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster URL
- OpenRouter API key
- Cloudinary account credentials

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory (see `.env.example` for required variables).
Seed the database with dummy data:
```bash
node seed.js
```
Start the backend:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
```
Start the frontend:
```bash
npm run dev
```

## Environment Variables

### Backend (`server/.env`)
- `PORT=5000`
- `MONGODB_URI=your_mongo_url`
- `JWT_SECRET=your_jwt_secret`
- `OPENROUTER_API_KEY=your_openrouter_api_key`
- `AI_MODEL=openai/gpt-4o`
- `CLOUDINARY_CLOUD_NAME=your_cloud_name`
- `CLOUDINARY_API_KEY=your_api_key`
- `CLOUDINARY_API_SECRET=your_api_secret`

## Deployment

1. **Frontend**: Deploy the `client` directory to Vercel. Ensure all environment variables are added to Vercel's settings.
2. **Backend**: Deploy the `server` directory to Render or Railway. Set environment variables.
3. **Database**: Use MongoDB Atlas.

## License
MIT License
