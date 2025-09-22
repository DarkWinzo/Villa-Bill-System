import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/LoginPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { CashierDashboard } from './pages/CashierDashboard'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { LoadingSpinner } from './components/common/LoadingSpinner'

function App() {
  const { user, isLoading } = useAuthStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950">
      <AnimatePresence mode="wait">
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin' : '/cashier'} replace />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginPage />
                </motion.div>
              )
            } 
          />
          
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <AdminDashboard />
                </motion.div>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/cashier/*"
            element={
              <ProtectedRoute requiredRole="cashier">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CashierDashboard />
                </motion.div>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/"
            element={
              <Navigate 
                to={user ? (user.role === 'admin' ? '/admin' : '/cashier') : '/login'} 
                replace 
              />
            }
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App