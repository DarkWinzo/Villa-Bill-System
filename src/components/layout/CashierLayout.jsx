import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  PlusCircle, 
  Receipt, 
  Hotel, 
  LogOut, 
  Menu, 
  User
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { cn } from '../../utils/cn'

const navigation = [
  { name: 'Overview', href: '/cashier', icon: LayoutDashboard },
  { name: 'Create Bill', href: '/cashier/create-bill', icon: PlusCircle },
  { name: 'Bills', href: '/cashier/bills', icon: Receipt },
  { name: 'Rooms', href: '/cashier/rooms', icon: Hotel },
]

export const CashierLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col lg:flex-row">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 lg:w-56 md:w-48">
        <motion.div
          initial={false}
          animate={{ x: sidebarOpen ? 0 : '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-dark-900/95 backdrop-blur-xl border-r border-dark-700/50 overflow-y-auto lg:w-56 md:w-48',
            'xl:relative xl:translate-x-0 xl:z-auto lg:relative lg:translate-x-0 lg:z-auto'
          )}
        >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-dark-700/50">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Vila POS</h1>
              <p className="text-xs text-slate-400">Cashier Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-dark-800'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-dark-700/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-white">{user?.username}</p>
                <p className="text-xs text-slate-400">Cashier</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-dark-900/50 backdrop-blur-xl border-b border-dark-700/50 px-8 py-4 lg:px-6 md:px-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors xl:hidden lg:hidden"
            >
              <Menu className="w-6 h-6 lg:w-5 lg:h-5" />
            </button>
            
            <div className="flex items-center gap-4 lg:gap-3 md:gap-2">
              <div className="text-right">
                <p className="text-sm font-medium text-white lg:text-xs">
                  Welcome, {user?.username}
                </p>
                <p className="text-xs text-slate-400 md:hidden">
                  {new Date().toLocaleDateString('en-LK', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 lg:p-6 md:p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}