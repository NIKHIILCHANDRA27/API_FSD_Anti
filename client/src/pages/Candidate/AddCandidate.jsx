import { useState } from 'react'
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function AddCandidate() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
    github: '',
    linkedin: '',
    bio: '',
    resumeUrl: ''
  })

  const handleFileChange = async (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    setFile(selected)
    
    // Auto upload and parse
    const data = new FormData()
    data.append('resume', selected)
    setUploading(true)
    const toastId = toast.loading('Parsing resume with AI...')
    try {
      const res = await api.post('/candidates/upload-resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Resume parsed successfully', { id: toastId })
      setFormData(prev => ({ ...prev, resumeUrl: res.data.resumeUrl }))
      if (res.data.extractedData && res.data.extractedData.skills.length > 0) {
        setExtractedData(res.data.extractedData)
        setFormData(prev => ({ 
          ...prev, 
          skills: res.data.extractedData.skills.join(', ')
        }))
        toast('Extracted skills auto-filled!', { icon: '✨' })
      }
    } catch (error) {
      toast.error('Resume parsing failed', { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value})

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      }
      await api.post('/candidates', payload)
      toast.success('Candidate profile saved')
      navigate('/app/candidates')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving candidate')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Candidate</h1>
        <p className="text-muted-foreground mt-1">Upload a resume to auto-fill details, or enter manually.</p>
      </div>

      <div className="bg-card border border-border p-8 rounded-3xl shadow-sm">
        
        {/* Upload Zone */}
        <div className="mb-10">
          <label className="block text-sm font-medium mb-3">Upload Resume (PDF/DOCX)</label>
          <div className="relative group">
            <div className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${file ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-border hover:border-primary/50 bg-secondary/30'}`}>
              <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={uploading} />
              
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-primary font-medium">Extracting data...</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-12 h-12 mb-3" />
                  <p className="font-semibold text-lg">{file.name}</p>
                  <p className="text-sm opacity-80 mt-1">Resume uploaded and parsed successfully</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                  <UploadCloud className="w-12 h-12 mb-4" />
                  <p className="text-lg font-medium mb-1">Click or drag resume to upload</p>
                  <p className="text-sm">Our AI will automatically extract skills and experience.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border mb-10"></div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="jane@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="+1 234 567 890" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Years of Experience</label>
            <input name="experience" value={formData.experience} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="e.g. 5" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium flex items-center gap-2">
              Skills (Comma separated)
              {extractedData && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">AI Extracted</span>}
            </label>
            <input required name="skills" value={formData.skills} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="React, Node.js, Python" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">LinkedIn Profile</label>
            <input name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="linkedin.com/in/janedoe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">GitHub / Portfolio</label>
            <input name="github" value={formData.github} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="github.com/janedoe" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Bio / Summary</label>
            <textarea rows="3" name="bio" value={formData.bio} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none resize-none" placeholder="Brief professional summary..."></textarea>
          </div>
          
          <div className="md:col-span-2 flex justify-end mt-4">
            <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md hover:-translate-y-0.5">
              Save Candidate Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
