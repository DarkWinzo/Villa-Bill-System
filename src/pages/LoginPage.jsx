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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"
        />
      </div>

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
          bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl
          transition-all duration-500 ease-out
          ${isFormFocused ? 'bg-white/15 border-purple-400/30 shadow-purple-500/20' : ''}
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
              className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25"
            >
              <Hotel className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-2"
            >
              Vila POS System
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/70 flex items-center justify-center gap-2"
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
                className="mb-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-red-200 font-medium text-sm">Account Temporarily Locked</p>
                    <p className="text-red-300/80 text-xs">
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
                    getFieldStatus('username') === 'success' ? 'text-green-400' : 'text-white/50'}
                `}>
                  <User className="w-5 h-5" />
                </div>
                
                <input
                  {...register('username')}
                  type="text"
                  id="username"
                  disabled={isBlocked}
                  className={`
                    w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border rounded-xl
                    text-white placeholder-white/50 font-medium
                    focus:outline-none focus:ring-2 focus:bg-white/15
                    transition-all duration-300 ease-out
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${getFieldStatus('username') === 'error' 
                      ? 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400' 
                      : getFieldStatus('username') === 'success'
                      ? 'border-green-400/50 focus:ring-green-400/50 focus:border-green-400'
                      : 'border-white/20 focus:ring-purple-400/50 focus:border-purple-400/50'
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
                    getFieldStatus('password') === 'success' ? 'text-green-400' : 'text-white/50'}
                `}>
                  <Lock className="w-5 h-5" />
                </div>
                
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  disabled={isBlocked}
                  className={`
                    w-full pl-12 pr-16 py-4 bg-white/10 backdrop-blur-sm border rounded-xl
                    text-white placeholder-white/50 font-medium
                    focus:outline-none focus:ring-2 focus:bg-white/15
                    transition-all duration-300 ease-out
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${getFieldStatus('password') === 'error' 
                      ? 'border-red-400/50 focus:ring-red-400/50 focus:border-red-400' 
                      : getFieldStatus('password') === 'success'
                      ? 'border-green-400/50 focus:ring-green-400/50 focus:border-green-400'
                      : 'border-white/20 focus:ring-purple-400/50 focus:border-purple-400/50'
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors duration-200 disabled:opacity-50"
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
                  className="p-3 bg-yellow-500/20 border border-yellow-400/30 rounded-lg backdrop-blur-sm"
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
                  className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm"
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
                  transition-all duration-300 ease-out
                  flex items-center justify-center gap-3
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isBlocked 
                    ? 'bg-gray-600/50' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
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
              <Sparkles className="w-4 h-4" />
              <span>Powered by Advanced Security</span>
            </div>
            
            <div className="text-xs text-white/40">
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