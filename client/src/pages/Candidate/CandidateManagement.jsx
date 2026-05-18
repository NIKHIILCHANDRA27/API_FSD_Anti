import { useState, useEffect } from 'react'
import { Search, BrainCircuit, ExternalLink, Bot, CheckCircle, AlertTriangle } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function CandidateManagement() {
  const [candidates, setCandidates] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState('')
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      const [candRes, jobRes] = await Promise.all([
        api.get('/candidates'),
        api.get('/jobs')
      ])
      setCandidates(candRes.data)
      setJobs(jobRes.data)
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleBasicMatch = async () => {
    if (!selectedJob) return toast.error('Please select a job first')
    const toastId = toast.loading('Calculating match scores...')
    try {
      const { data } = await api.post('/match/basic', { jobId: selectedJob })
      setCandidates(data)
      toast.success('Basic matching complete', { id: toastId })
    } catch (error) {
      toast.error('Matching failed', { id: toastId })
    }
  }

  const handleAiMatch = async () => {
    if (!selectedJob) return toast.error('Please select a job first')
    setAiLoading(true)
    const toastId = toast.loading('OpenRouter AI is analyzing profiles...')
    try {
      const { data } = await api.post('/match/ai', { jobId: selectedJob })
      setCandidates(data)
      toast.success('AI Analysis complete!', { id: toastId })
    } catch (error) {
      toast.error('AI Matching failed. Ensure API key is set.', { id: toastId })
    } finally {
      setAiLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (!score) return 'bg-secondary text-secondary-foreground'
    if (score >= 90) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
    if (score >= 70) return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
    if (score >= 50) return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30'
    return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talent Pool</h1>
          <p className="text-muted-foreground mt-1">Manage and rank candidates using OpenRouter AI.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedJob} 
            onChange={(e) => setSelectedJob(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-card border border-border outline-none min-w-[200px]"
          >
            <option value="">Select job to match against...</option>
            {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
          </select>
          
          <button 
            onClick={handleBasicMatch}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2.5 rounded-xl font-medium transition-colors"
          >
            Basic Match
          </button>
          
          <button 
            onClick={handleAiMatch}
            disabled={aiLoading}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-md disabled:opacity-50"
          >
            {aiLoading ? <span className="animate-pulse">Analyzing...</span> : <><BrainCircuit className="w-5 h-5" /> AI Rank</>}
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="px-6 py-4 font-medium text-sm text-muted-foreground">Candidate</th>
                <th className="px-6 py-4 font-medium text-sm text-muted-foreground">Experience</th>
                <th className="px-6 py-4 font-medium text-sm text-muted-foreground">Skills</th>
                <th className="px-6 py-4 font-medium text-sm text-muted-foreground">Match Score</th>
                <th className="px-6 py-4 font-medium text-sm text-muted-foreground">AI Insight</th>
                <th className="px-6 py-4 font-medium text-sm text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {candidates.map((c, i) => (
                <tr key={c._id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{c.experience} Yrs</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {c.skills?.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="text-[10px] uppercase font-bold bg-secondary px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                      {c.skills?.length > 3 && <span className="text-[10px] font-bold text-muted-foreground">+{c.skills.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {(c.matchScore !== undefined || c.aiScore !== undefined) ? (
                      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(c.aiScore || c.matchScore)}`}>
                        {c.aiScore ? `${c.aiScore}% (AI)` : `${c.matchScore}%`}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    {c.aiReason ? (
                      <div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1 flex items-start gap-1">
                          <Bot className="w-3 h-3 min-w-3 text-indigo-500 mt-0.5" />
                          {c.aiReason}
                        </p>
                        {c.aiMissingSkills && c.aiMissingSkills.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
                            <AlertTriangle className="w-3 h-3" />
                            Missing: {c.aiMissingSkills.join(', ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1">
                      View Profile <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && candidates.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
