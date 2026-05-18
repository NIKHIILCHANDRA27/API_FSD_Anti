import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', company: '' })
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value})

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(formData.name, formData.email, formData.password, formData.company)
      toast.success('Account created successfully!')
      navigate('/app')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 relative overflow-hidden p-4">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-8 md:p-10 rounded-3xl shadow-2xl relative z-10 border border-white/50 dark:border-white/10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join HireGenius today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Full Name</label>
            <input name="name" required onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-black/20 border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Company Name</label>
            <input name="company" required onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-black/20 border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" placeholder="Acme Corp" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Work Email</label>
            <input type="email" name="email" required onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-black/20 border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" placeholder="john@acme.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Password</label>
            <input type="password" name="password" required onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-white/50 dark:bg-black/20 border border-border focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" placeholder="••••••••" />
          </div>
          
          <button type="submit" className="w-full py-3.5 mt-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
            Create Account
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
