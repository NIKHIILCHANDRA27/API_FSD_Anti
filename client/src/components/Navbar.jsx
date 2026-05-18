import { Bell, Search, UserCircle } from 'lucide-react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useContext(AuthContext)

  return (
    <header className="h-16 bg-white/50 dark:bg-black/20 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidates, jobs..."
            className="w-full bg-secondary dark:bg-white/5 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-secondary dark:hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none">{user?.name || 'Recruiter'}</p>
            <p className="text-xs text-muted-foreground mt-1">{user?.company || 'Company'}</p>
          </div>
          <UserCircle className="w-8 h-8 text-primary" />
        </div>
      </div>
    </header>
  )
}
