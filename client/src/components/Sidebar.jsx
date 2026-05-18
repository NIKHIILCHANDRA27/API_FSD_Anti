import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Briefcase, Users, PlusCircle, LogOut } from 'lucide-react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Sidebar() {
  const { logout } = useContext(AuthContext)

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Jobs', path: '/app/jobs', icon: Briefcase },
    { name: 'Candidates', path: '/app/candidates', icon: Users },
    { name: 'Add Candidate', path: '/app/add-candidate', icon: PlusCircle },
  ]

  return (
    <aside className="w-64 bg-white dark:bg-black/40 border-r border-border hidden md:flex flex-col shadow-sm relative z-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold gradient-text tracking-tight">HireGenius</h1>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">AI Platform</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-muted-foreground hover:bg-secondary dark:hover:bg-white/5 hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-all text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
