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
  CheckCircle,
  AlertCircle,
  Hotel,
  ArrowRight,
  Crown,
  UserCheck,
  Palette,
  Sun,
  Moon,
  Monitor
} from 'lucide-react'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeLeft, setBlockTimeLeft] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [theme, setTheme] = useState('dark')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    setError,
    clearErrors,
    watch
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur'
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

  const themes = {
    dark: {
      name: 'Dark Ocean',
      bg: 'from-slate-900 via-blue-900 to-slate-900',
      card: 'bg-slate-800/95',
      accent: 'from-blue-600 to-cyan-600',
      text: 'text-white',
      icon: Moon
    },
    light: {
      name: 'Light Sky',
      bg: 'from-blue-50 via-indigo-50 to-purple-50',
      card: 'bg-white/95',
      accent: 'from-blue-600 to-purple-600',
      text: 'text-slate-800',
      icon: Sun
    },
    purple: {
      name: 'Purple Dream',
      bg: 'from-purple-900 via-violet-900 to-indigo-900',
      card: 'bg-purple-800/95',
      accent: 'from-purple-600 to-pink-600',
      text: 'text-white',
      icon: Palette
    },
    green: {
      name: 'Forest Green',
      bg: 'from-emerald-900 via-teal-900 to-green-900',
      card: 'bg-emerald-800/95',
      accent: 'from-emerald-600 to-teal-600',
      text: 'text-white',
      icon: Monitor
    }
  }

  const currentTheme = themes[theme]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 360, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Theme Selector */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 right-6 z-20"
      >
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className={`p-3 ${currentTheme.card} backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl ${currentTheme.text} hover:shadow-3xl transition-all duration-300`}
          >
            <currentTheme.icon className="w-6 h-6" />
          </motion.button>

          <AnimatePresence>
            {showThemeSelector && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className={`absolute top-16 right-0 ${currentTheme.card} backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 min-w-[200px]`}
              >
                <h3 className={`${currentTheme.text} font-bold mb-3 text-sm`}>Choose Theme</h3>
                <div className="space-y-2">
                  {Object.entries(themes).map(([key, themeOption]) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setTheme(key)
                        setShowThemeSelector(false)
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        theme === key 
                          ? `bg-gradient-to-r ${themeOption.accent} text-white shadow-lg` 
                          : `${currentTheme.text} hover:bg-white/10`
                      }`}
                    >
                      <themeOption.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{themeOption.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main login container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 80,
          damping: 20
        }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Glass morphism card */}
        <div className={`${currentTheme.card} backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl`}>
          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(147, 51, 234, 0.4)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ 
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className={`mx-auto w-24 h-24 bg-gradient-to-br ${currentTheme.accent} rounded-2xl flex items-center justify-center mb-6 shadow-2xl`}
            >
              <Hotel className="w-12 h-12 text-white drop-shadow-lg" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-4xl font-bold bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent mb-3`}
            >
              Vila POS System
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={`${theme === 'light' ? 'text-slate-600' : 'text-slate-400'} flex items-center justify-center gap-2 mb-2`}
            >
              <Shield className="w-4 h-4" />
              Secure Hotel Management
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-slate-500'}`}
            >
              {currentTime.toLocaleString('en-LK', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </motion.div>
          </motion.div>

          {/* Security warning for blocked users */}
          <AnimatePresence>
            {isBlocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-red-200 font-semibold text-sm">Account Temporarily Locked</p>
                    <p className="text-red-300 text-sm">
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
            className="space-y-7"
          >
            {/* Username field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <label htmlFor="username" className={`block text-sm font-bold ${currentTheme.text} mb-3 flex items-center gap-2`}>
                <User className="w-4 h-4" />
                Username
              </label>
              <div className="relative group">
                <input
                  {...register('username')}
                  type="text"
                  id="username"
                  disabled={isBlocked}
                  className={`
                    w-full px-4 py-4 ${theme === 'light' ? 'bg-white/70' : 'bg-slate-700/50'} backdrop-blur-sm border rounded-xl
                    ${currentTheme.text} ${theme === 'light' ? 'placeholder-slate-400' : 'placeholder-slate-400'} font-medium text-lg
                    focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:bg-white/90' : 'focus:bg-slate-600/50'}
                    transition-all duration-300 ease-out
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${theme === 'light' ? 'hover:bg-white/80' : 'hover:bg-slate-600/30'}
                    ${getFieldStatus('username') === 'error' 
                      ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                      : getFieldStatus('username') === 'success'
                      ? 'border-green-500/50 focus:ring-green-500/50 focus:border-green-500'
                      : `${theme === 'light' ? 'border-slate-300/50' : 'border-slate-600/50'} focus:ring-blue-500/50 focus:border-blue-500`
                    }
                  `}
                  placeholder="Enter username"
                />
                
                {/* Field status indicator */}
                <AnimatePresence>
                  {touchedFields.username && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
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
                    className="mt-3 text-sm text-red-400 flex items-center gap-2 bg-red-900/20 p-2 rounded-lg"
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
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <label htmlFor="password" className={`block text-sm font-bold ${currentTheme.text} mb-3 flex items-center gap-2`}>
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative group">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  disabled={isBlocked}
                  className={`
                    w-full px-4 pr-16 py-4 ${theme === 'light' ? 'bg-white/70' : 'bg-slate-700/50'} backdrop-blur-sm border rounded-xl
                    ${currentTheme.text} ${theme === 'light' ? 'placeholder-slate-400' : 'placeholder-slate-400'} font-medium text-lg
                    focus:outline-none focus:ring-2 ${theme === 'light' ? 'focus:bg-white/90' : 'focus:bg-slate-600/50'}
                    transition-all duration-300 ease-out
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${theme === 'light' ? 'hover:bg-white/80' : 'hover:bg-slate-600/30'}
                    ${getFieldStatus('password') === 'error' 
                      ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' 
                      : getFieldStatus('password') === 'success'
                      ? 'border-green-500/50 focus:ring-green-500/50 focus:border-green-500'
                      : `${theme === 'light' ? 'border-slate-300/50' : 'border-slate-600/50'} focus:ring-blue-500/50 focus:border-blue-500`
                    }
                  `}
                  placeholder="Enter password"
                />
                
                {/* Password visibility toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-slate-600 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'} transition-all duration-300 disabled:opacity-50 hover:scale-110 z-10`}
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
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 z-10"
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
                    className="mt-3 text-sm text-red-400 flex items-center gap-2 bg-red-900/20 p-2 rounded-lg"
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
                  className="p-4 bg-yellow-900/50 border border-yellow-700/50 rounded-xl backdrop-blur-sm"
                >
                  <p className="text-yellow-200 text-sm flex items-center gap-2 font-medium">
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
                  className="p-4 bg-red-900/50 border border-red-700/50 rounded-xl backdrop-blur-sm"
                >
                  <p className="text-red-200 text-sm flex items-center gap-2 font-medium">
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
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: isBlocked ? 1 : 1.05 }}
                whileTap={{ scale: isBlocked ? 1 : 0.98 }}
                animate={!isBlocked && !isLoading ? {
                  boxShadow: [
                    "0 4px 20px rgba(59, 130, 246, 0.3)",
                    "0 8px 30px rgba(147, 51, 234, 0.4)",
                    "0 4px 20px rgba(59, 130, 246, 0.3)"
                  ]
                } : {}}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                type="submit"
                disabled={isLoading || isBlocked || !isValid}
                className={`
                  w-full py-5 px-6 rounded-2xl font-bold text-white text-lg
                  transition-all duration-300 ease-out
                  flex items-center justify-center gap-3
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-2xl
                  ${isBlocked 
                    ? `${theme === 'light' ? 'bg-slate-400/50' : 'bg-slate-600/50'}` 
                    : `bg-gradient-to-r ${currentTheme.accent} hover:shadow-3xl transform hover:-translate-y-1`
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>Authenticating...</span>
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
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mt-8 text-center space-y-6"
          >
            <div className={`flex items-center justify-center gap-2 ${theme === 'light' ? 'text-slate-600' : 'text-white/60'} text-sm font-medium`}>
              <Shield className="w-4 h-4" />
              <span className={theme === 'light' ? 'text-slate-600' : 'text-slate-400'}>Enterprise-Grade Security</span>
            </div>
            
            <div className={`${theme === 'light' ? 'bg-white/50' : 'bg-slate-800/50'} backdrop-blur-sm rounded-xl p-4 border ${theme === 'light' ? 'border-slate-200/50' : 'border-slate-700/50'}`}>
              <p className={`text-sm font-semibold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} mb-3 flex items-center justify-center gap-2`}>
                <UserCheck className="w-4 h-4" />
                Default Login Credentials
              </p>
              <div className="space-y-2 text-xs">
                <div className={`flex items-center justify-between ${theme === 'light' ? 'bg-slate-100/70' : 'bg-slate-700/30'} rounded-lg p-2`}>
                  <div className="flex items-center gap-2">
                    <Crown className="w-3 h-3 text-orange-400" />
                    <span className={`font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Admin:</span>
                  </div>
                  <span className={`font-mono ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>Admin / Admin@123</span>
                </div>
                <div className={`flex items-center justify-between ${theme === 'light' ? 'bg-slate-100/70' : 'bg-slate-700/30'} rounded-lg p-2`}>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-blue-400" />
                    <span className={`font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Cashier:</span>
                  </div>
                  <span className={`font-mono ${theme === 'light' ? 'text-slate-600' : 'text-slate-400'}`}>cashier1 / cashier123</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage