import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginSchema } from '../utils/validation'
import { useAuthStore } from '../stores/authStore'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { 
  LogIn, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Hotel,
  ArrowRight
} from 'lucide-react'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFormFocused, setIsFormFocused] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeLeft, setBlockTimeLeft] = useState(0)
  
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    setError,
    clearErrors,
    watch
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onChange'
  })

  const watchedUsername = watch('username')
  const watchedPassword = watch('password')

  // Security: Block after 5 failed attempts for 5 minutes
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsBlocked(true)
      setBlockTimeLeft(300) // 5 minutes
      
      const timer = setInterval(() => {
        setBlockTimeLeft(prev => {
          if (prev <= 1) {
            setIsBlocked(false)
            setLoginAttempts(0)
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [loginAttempts])

  const onSubmit = async (data) => {
    if (isBlocked) return

    try {
      clearErrors()
      const result = await login(data)
      
      if (result.success) {
        // Reset attempts on successful login
        setLoginAttempts(0)
        
        // Navigate based on user role
        const redirectPath = location.state?.from?.pathname || 
          (result.user.role === 'admin' ? '/admin' : '/cashier')
        navigate(redirectPath, { replace: true })
      } else {
        setLoginAttempts(prev => prev + 1)
        setError('root', {
          type: 'manual',
          message: result.message || 'Invalid credentials. Please try again.'
        })
      }
    } catch (error) {
      setLoginAttempts(prev => prev + 1)
      setError('root', {
        type: 'manual',
        message: error.message || 'Login failed. Please try again.'
      })
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getFieldStatus = (fieldName) => {
    if (!touchedFields[fieldName]) return 'default'
    if (errors[fieldName]) return 'error'
    return 'success'
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">

      {/* Main login container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glass morphism card */}
        <div className={`
          bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-lg
          transition-all duration-300 ease-out
          ${isFormFocused ? 'border-blue-500' : ''}
        `}>
          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="mx-auto w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg"
            >
              <Hotel className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-100 mb-2"
            >
              Vila POS System
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Secure Hotel Management
            </motion.p>
          </motion.div>

          {/* Security warning for blocked users */}
          <AnimatePresence>
            {isBlocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="mb-6 p-4 bg-red-800 border border-red-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-red-200 font-medium text-sm">Account Temporarily Locked</p>
                    <p className="text-red-300 text-xs">
                      Too many failed attempts. Try again in {formatTime(blockTimeLeft)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login form */}
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
            onFocus={() => setIsFormFocused(true)}
            onBlur={() => setIsFormFocused(false)}
          >
            {/* Username field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label htmlFor="username" className="block text-sm font-semibold text-white/90 mb-3">
                Username
              </label>
              <div className="relative group">
                <div className={`
                  absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200
                  ${getFieldStatus('username') === 'error' ? 'text-red-400' : 
                    getFieldStatus('username') === 'success' ? 'text-green-400' : 'text-gray-400'}
                `}>
                  <User className="w-5 h-5" />
                </div>
                
                <input
                  {...register('username')}
                  type="text"
                  id="username"
                  disabled={isBlocked}
                  className={`
                    w-full pl-12 pr-12 py-3 bg-gray-700 border rounded-lg
                    text-gray-100 placeholder-gray-400 font-medium
                    focus:outline-none focus:ring-2 focus:bg-gray-600
                    transition-all duration-200 ease-out
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${getFieldStatus('username') === 'error' 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : getFieldStatus('username') === 'success'
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    }
                  `}
                  placeholder="Enter your username"
                />
                
                {/* Field status indicator */}
                <AnimatePresence>
                  {touchedFields.username && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      {getFieldStatus('username') === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : getFieldStatus('username') === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <AnimatePresence>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 text-sm text-red-400 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.username.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <label htmlFor="password" className="block text-sm font-semibold text-white/90 mb-3">
                Password
              </label>
              <div className="relative group">
                <div className={`
                  absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200
                  ${getFieldStatus('password') === 'error' ? 'text-red-400' : 
                    getFieldStatus('password') === 'success' ? 'text-green-400' : 'text-gray-400'}
                `}>
                  <Lock className="w-5 h-5" />
                </div>
                
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  disabled={isBlocked}
                  className={`
                    w-full pl-12 pr-16 py-3 bg-gray-700 border rounded-lg
                    text-gray-100 placeholder-gray-400 font-medium
                    focus:outline-none focus:ring-2 focus:bg-gray-600
                    transition-all duration-200 ease-out
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${getFieldStatus('password') === 'error' 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : getFieldStatus('password') === 'success'
                      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                    }
                  `}
                  placeholder="Enter your password"
                />
                
                {/* Password visibility toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
                
                {/* Field status indicator */}
                <AnimatePresence>
                  {touchedFields.password && !showPassword && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2"
                    >
                      {getFieldStatus('password') === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : getFieldStatus('password') === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 text-sm text-red-400 flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Login attempts warning */}
            <AnimatePresence>
              {loginAttempts > 0 && loginAttempts < 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-3 bg-yellow-800 border border-yellow-700 rounded-lg"
                >
                  <p className="text-yellow-200 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {loginAttempts} failed attempt{loginAttempts > 1 ? 's' : ''}. 
                    {5 - loginAttempts} attempt{5 - loginAttempts > 1 ? 's' : ''} remaining.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Root error display */}
            <AnimatePresence>
              {errors.root && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="p-4 bg-red-800 border border-red-700 rounded-lg"
                >
                  <p className="text-red-200 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.root.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: isBlocked ? 1 : 1.02 }}
                whileTap={{ scale: isBlocked ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading || isBlocked || !isValid}
                className={`
                  w-full py-4 px-6 rounded-xl font-semibold text-white
                  transition-all duration-200 ease-out
                  flex items-center justify-center gap-3
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isBlocked 
                    ? 'bg-gray-600' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>Signing In...</span>
                  </>
                ) : isBlocked ? (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Account Locked</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <span className="text-gray-400">Powered by Advanced Security</span>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Default Credentials:</p>
              <p>Admin: Admin / Admin@123</p>
              <p>Cashier: cashier1 / cashier123</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage