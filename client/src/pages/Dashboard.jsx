import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Briefcase, CalendarCheck, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import api from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ candidates: 0, jobs: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [candRes, jobRes] = await Promise.all([
          api.get('/candidates'),
          api.get('/jobs')
        ])
        setStats({ candidates: candRes.data.length, jobs: jobRes.data.length })
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Dummy data for charts
  const matchData = [
    { name: 'Excellent', value: 40, color: '#10b981' },
    { name: 'Good', value: 30, color: '#3b82f6' },
    { name: 'Average', value: 20, color: '#f59e0b' },
    { name: 'Weak', value: 10, color: '#ef4444' },
  ]
  const trendData = [
    { name: 'Jan', applicants: 40 },
    { name: 'Feb', applicants: 65 },
    { name: 'Mar', applicants: 50 },
    { name: 'Apr', applicants: 90 },
    { name: 'May', applicants: 120 },
  ]

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && <span className="text-sm font-medium text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">{trend}</span>}
      </div>
      <h3 className="text-3xl font-bold mb-1">{loading ? '-' : value}</h3>
      <p className="text-muted-foreground font-medium">{title}</p>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, Recruiter</h1>
        <p className="text-muted-foreground">Here is what's happening with your hiring pipeline today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Candidates" value={stats.candidates} icon={Users} trend="+12%" />
        <StatCard title="Active Jobs" value={stats.jobs} icon={Briefcase} trend="+2" />
        <StatCard title="Interviews Scheduled" value="14" icon={CalendarCheck} trend="+5" />
        <StatCard title="Avg. Time to Hire" value="18 days" icon={TrendingUp} trend="-2 days" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-3xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Application Trends</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="applicants" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Candidate Quality</h3>
          <div className="h-[300px] w-full flex flex-col items-center justify-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={matchData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {matchData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {matchData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
