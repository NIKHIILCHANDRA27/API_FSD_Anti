import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Target, Zap, Users, BarChart } from 'lucide-react'

export default function Landing() {
  const features = [
    { icon: Bot, title: 'AI-Powered Shortlisting', desc: 'Instantly rank candidates using advanced AI models based on job requirements.' },
    { icon: Zap, title: 'Smart Resume Parsing', desc: 'Automatically extract skills and experience from PDF resumes.' },
    { icon: Target, title: 'Precision Matching', desc: 'Calculates a match score considering skills, experience, and keywords.' },
    { icon: Users, title: 'Candidate Management', desc: 'Organize, search, and manage your talent pool effortlessly.' },
    { icon: BarChart, title: 'Hiring Analytics', desc: 'Visualize your hiring pipeline and success rates with interactive charts.' },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[120px] opacity-50 animate-pulse delay-1000"></div>
      </div>

      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold gradient-text tracking-tight">HireGenius AI</div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2.5 text-sm font-medium hover:text-primary transition-colors">Log In</Link>
          <Link to="/register" className="px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95">Get Started</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mt-16 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Hire the <span className="gradient-text">Top 1%</span> faster with AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              The premium candidate shortlisting platform for modern recruitment teams. Automate resume screening, generate technical interview questions, and rank talent with open AI models.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                Start Hiring Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-full hover:bg-secondary/80 transition-all">
                View Demo
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Teams</h2>
            <p className="text-muted-foreground">Everything you need to streamline your hiring pipeline.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
