import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'

// Layouts
import MainLayout from './components/MainLayout'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard'
import JobRequirement from './pages/Job/JobRequirement'
import AddCandidate from './pages/Candidate/AddCandidate'
import CandidateManagement from './pages/Candidate/CandidateManagement'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)
  if (loading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/app" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="jobs" element={<JobRequirement />} />
        <Route path="add-candidate" element={<AddCandidate />} />
        <Route path="candidates" element={<CandidateManagement />} />
      </Route>
    </Routes>
  )
}

export default App
