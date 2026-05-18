import { useState, useEffect } from 'react'
import { Plus, Trash2, Briefcase } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function JobRequirement() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    minExperience: '',
    salaryRange: '',
    location: '',
    workType: 'Remote',
    description: '',
    requiredSkills: '',
    preferredSkills: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs')
      setJobs(data)
    } catch (error) {
      toast.error('Failed to fetch jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value})

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        minExperience: Number(formData.minExperience),
        requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        preferredSkills: formData.preferredSkills.split(',').map(s => s.trim()).filter(Boolean),
      }
      await api.post('/jobs', payload)
      toast.success('Job created successfully')
      setShowForm(false)
      fetchJobs()
      setFormData({
        title: '', minExperience: '', salaryRange: '', location: '', workType: 'Remote', description: '', requiredSkills: '', preferredSkills: ''
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating job')
    }
  }

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return
    try {
      await api.delete(`/jobs/${id}`)
      toast.success('Job deleted')
      fetchJobs()
    } catch (error) {
      toast.error('Error deleting job')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Requirements</h1>
          <p className="text-muted-foreground mt-1">Manage active job postings for AI matching.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'Cancel' : 'Create Job'}
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border p-6 md:p-8 rounded-3xl shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-semibold mb-6">Create New Job Posting</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="e.g. Senior React Developer" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Experience (Years)</label>
              <input required type="number" name="minExperience" value={formData.minExperience} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="e.g. 4" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Required Skills (Comma separated)</label>
              <input required name="requiredSkills" value={formData.requiredSkills} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="React, Node.js, TypeScript" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Preferred Skills (Comma separated)</label>
              <input name="preferredSkills" value={formData.preferredSkills} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="AWS, Docker, GraphQL" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Salary Range</label>
              <input name="salaryRange" value={formData.salaryRange} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none" placeholder="$100k - $120k" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Work Type</label>
              <select name="workType" value={formData.workType} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none">
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Job Description</label>
              <textarea required rows="4" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/50 outline-none resize-none" placeholder="Detail the responsibilities and requirements..."></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
                Save Job Requirement
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {jobs.map(job => (
          <div key={job._id} className="bg-card border border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-6 h-6" />
              </div>
              <button onClick={() => handleDelete(job._id)} className="text-muted-foreground hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold mb-1">{job.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
            <div className="flex flex-wrap gap-2 mb-4 mt-auto">
              {job.requiredSkills.slice(0, 3).map((skill, i) => (
                <span key={i} className="text-xs font-medium px-2 py-1 bg-secondary rounded-md text-secondary-foreground">{skill}</span>
              ))}
              {job.requiredSkills.length > 3 && <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md text-secondary-foreground">+{job.requiredSkills.length - 3}</span>}
            </div>
            <div className="pt-4 border-t border-border flex justify-between items-center text-sm font-medium">
              <span className="text-muted-foreground">{job.workType}</span>
              <span className="text-primary">{job.minExperience}+ Yrs</span>
            </div>
          </div>
        ))}
        {!loading && jobs.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-20 text-muted-foreground">
            No jobs found. Create one to start matching candidates!
          </div>
        )}
      </div>
    </div>
  )
}
