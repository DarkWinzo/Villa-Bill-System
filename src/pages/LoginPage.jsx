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
  Sparkles,
  Heart,
  Star,
  Coffee,
  Moon,
  Sun,
  Zap,
  Palette,
  Music,
  Camera,
  Gift
} from 'lucide-react'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeLeft, setBlockTimeLeft] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [theme, setTheme] = useState('gradient')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [particles, setParticles] = useState([])
  const [greeting, setGreeting] = useState('')
  
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 5
        })
      }
      setParticles(newParticles)
    }
    generateParticles()
  }, [theme])

  // Update current time and greeting
  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date()
      setCurrentTime(now)
      
      const hour = now.getHours()
      if (hour < 12) setGreeting('Good Morning')
      else if (hour < 17) setGreeting('Good Afternoon')
      else if (hour < 21) setGreeting('Good Evening')
      else setGreeting('Good Night')
    }
    
    updateTimeAndGreeting()
    const timer = setInterval(updateTimeAndGreeting, 1000)
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
        setLoginAttempts(0)
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
    gradient: {
      name: 'Ocean Gradient',
      bg: 'from-blue-900 via-purple-900 to-pink-900',
      card: 'bg-white/10',
      accent: 'from-blue-500 to-purple-600',
      text: 'text-white',
      icon: Sparkles,
      particles: 'bg-white/20'
    },
    sunset: {
      name: 'Sunset Dream',
      bg: 'from-orange-400 via-red-500 to-pink-600',
      card: 'bg-white/15',
      accent: 'from-yellow-400 to-red-500',
      text: 'text-white',
      icon: Sun,
      particles: 'bg-yellow-300/30'
    },
    forest: {
      name: 'Forest Magic',
      bg: 'from-green-800 via-emerald-700 to-teal-600',
      card: 'bg-white/10',
      accent: 'from-green-400 to-emerald-600',
      text: 'text-white',
      icon: Coffee,
      particles: 'bg-green-300/25'
    },
    midnight: {
      name: 'Midnight Sky',
      bg: 'from-indigo-900 via-purple-900 to-gray-900',
      card: 'bg-white/8',
      accent: 'from-indigo-400 to-purple-500',
      text: 'text-white',
      icon: Moon,
      particles: 'bg-indigo-300/20'
    },
    candy: {
      name: 'Candy Pop',
      bg: 'from-pink-400 via-purple-400 to-indigo-400',
      card: 'bg-white/15',
      accent: 'from-pink-500 to-purple-600',
      text: 'text-white',
      icon: Heart,
      particles: 'bg-pink-300/30'
    },
    electric: {
      name: 'Electric Vibe',
      bg: 'from-cyan-400 via-blue-500 to-purple-600',
      card: 'bg-white/12',
      accent: 'from-cyan-400 to-blue-600',
      text: 'text-white',
      icon: Zap,
      particles: 'bg-cyan-300/25'
    }
  }

  const currentTheme = themes[theme]

  const floatingIcons = [Star, Heart, Sparkles, Gift, Music, Camera]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-2 h-2 ${currentTheme.particles} rounded-full blur-sm`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(particle.id) * 50, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Floating icons */}
        {floatingIcons.map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute text-white/10"
            style={{
              left: `${10 + index * 15}%`,
              top: `${20 + (index % 2) * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              delay: index * 0.5,
              ease: "easeInOut"
            }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        ))}

        {/* Gradient orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.2, 1],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 rounded-full blur-3xl"
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
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className={`p-4 ${currentTheme.card} backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl ${currentTheme.text} hover:shadow-3xl transition-all duration-300`}
          >
            <currentTheme.icon className="w-6 h-6" />
          </motion.button>

          <AnimatePresence>
            {showThemeSelector && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className={`absolute top-20 right-0 ${currentTheme.card} backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-4 min-w-[220px]`}
              >
                <h3 className={`${currentTheme.text} font-bold mb-4 text-sm flex items-center gap-2`}>
                  <Palette className="w-4 h-4" />
                  Choose Your Vibe
                </h3>
                <div className="space-y-2">
                  {Object.entries(themes).map(([key, themeOption]) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setTheme(key)
                        setShowThemeSelector(false)
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        theme === key 
                          ? `bg-gradient-to-r ${themeOption.accent} text-white shadow-lg transform scale-105` 
                          : `${currentTheme.text} hover:bg-white/10`
                      }`}
                    >
                      <themeOption.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{themeOption.name}</span>
                      {theme === key && <CheckCircle className="w-4 h-4 ml-auto" />}
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
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 1,
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Glass morphism card */}
        <div className={`${currentTheme.card} backdrop-blur-2xl border border-white/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden`}>
          {/* Card background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>

          {/* Header section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-8 relative z-10"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  "0 0 30px rgba(255, 255, 255, 0.3)",
                  "0 0 50px rgba(255, 255, 255, 0.5)",
                  "0 0 30px rgba(255, 255, 255, 0.3)"
                ]
              }}
              transition={{ 
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className={`mx-auto w-28 h-28 bg-gradient-to-br ${currentTheme.accent} rounded-3xl flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <Hotel className="w-14 h-14 text-white drop-shadow-lg relative z-10" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border-2 border-white/30 rounded-2xl"
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className={`text-4xl font-bold bg-gradient-to-r ${currentTheme.accent} bg-clip-text text-transparent mb-2`}
            >
              Vila POS System
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className={`${currentTheme.text} flex items-center justify-center gap-2 mb-3 text-lg font-medium`}
            >
              <Shield className="w-5 h-5" />
              {greeting}! Welcome Back
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className={`text-sm ${currentTheme.text} opacity-80 flex items-center justify-center gap-2`}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.div>
              {currentTime.toLocaleString('en-LK', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                ✨
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Security warning for blocked users */}
          <AnimatePresence>
            {isBlocked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-2xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <AlertCircle className="w-6 h-6 text-red-300 flex-shrink-0" />
                  </motion.div>
                  <div>
                    <p className="text-red-200 font-semibold text-sm">Account Temporarily Locked 🔒</p>
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
            className="space-y-6 relative z-10"
          >
            {/* Username field */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <label htmlFor="username" className={`block text-sm font-bold ${currentTheme.text} mb-3 flex items-center gap-2`}>
                <User className="w-5 h-5" />
                Username
              </label>
              <div className="relative group">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  {...register('username')}
                  type="text"
                  id="username"
                  disabled={isBlocked}
                  className={`
                    w-full px-6 py-4 bg-white/10 backdrop-blur-sm border-2 rounded-2xl
                    ${currentTheme.text} placeholder-white/60 font-medium text-lg
                    focus:outline-none focus:ring-2 focus:bg-white/15
                    transition-all duration-300 ease-out
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:bg-white/15 hover:border-white/40
                    ${getFieldStatus('username') === 'error' 
                      ? 'border-red-400/60 focus:ring-red-400/50 focus:border-red-400' 
                      : getFieldStatus('username') === 'success'
                      ? 'border-green-400/60 focus:ring-green-400/50 focus:border-green-400'
                      : 'border-white/30 focus:ring-white/30 focus:border-white/50'
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
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                    >
                      {getFieldStatus('username') === 'success' ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </motion.div>
                      ) : getFieldStatus('username') === 'error' ? (
                        <motion.div
                          animate={{ shake: [0, -5, 5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <AlertCircle className="w-6 h-6 text-red-400" />
                        </motion.div>
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
                    className="mt-3 text-sm text-red-300 flex items-center gap-2 bg-red-500/20 p-3 rounded-xl backdrop-blur-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.username.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password field */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <label htmlFor="password" className={`block text-sm font-bold ${currentTheme.text} mb-3 flex items-center gap-2`}>
                <Lock className="w-5 h-5" />
                Password
              </label>
              <div className="relative group">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  disabled={isBlocked}
                  className={`
                    w-full px-6 pr-16 py-4 bg-white/10 backdrop-blur-sm border-2 rounded-2xl
                    ${currentTheme.text} placeholder-white/60 font-medium text-lg
                    focus:outline-none focus:ring-2 focus:bg-white/15
                    transition-all duration-300 ease-out
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:bg-white/15 hover:border-white/40
                    ${getFieldStatus('password') === 'error' 
                      ? 'border-red-400/60 focus:ring-red-400/50 focus:border-red-400' 
                      : getFieldStatus('password') === 'success'
                      ? 'border-green-400/60 focus:ring-green-400/50 focus:border-green-400'
                      : 'border-white/30 focus:ring-white/30 focus:border-white/50'
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
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${currentTheme.text} hover:text-white transition-all duration-300 disabled:opacity-50 z-10 p-1 rounded-lg hover:bg-white/10`}
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </motion.button>
                
                {/* Field status indicator */}
                <AnimatePresence>
                  {touchedFields.password && !showPassword && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute right-14 top-1/2 transform -translate-y-1/2 z-10"
                    >
                      {getFieldStatus('password') === 'success' ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </motion.div>
                      ) : getFieldStatus('password') === 'error' ? (
                        <motion.div
                          animate={{ shake: [0, -5, 5, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <AlertCircle className="w-6 h-6 text-red-400" />
                        </motion.div>
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
                    className="mt-3 text-sm text-red-300 flex items-center gap-2 bg-red-500/20 p-3 rounded-xl backdrop-blur-sm"
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
                  className="p-4 bg-yellow-500/20 border border-yellow-400/50 rounded-2xl backdrop-blur-sm"
                >
                  <p className="text-yellow-200 text-sm flex items-center gap-2 font-medium">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <AlertCircle className="w-5 h-5" />
                    </motion.div>
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
                  className="p-4 bg-red-500/20 border border-red-400/50 rounded-2xl backdrop-blur-sm"
                >
                  <p className="text-red-200 text-sm flex items-center gap-2 font-medium">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <AlertCircle className="w-5 h-5" />
                    </motion.div>
                    {errors.root.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: isBlocked ? 1 : 1.05, y: isBlocked ? 0 : -2 }}
                whileTap={{ scale: isBlocked ? 1 : 0.98 }}
                animate={!isBlocked && !isLoading ? {
                  boxShadow: [
                    "0 10px 30px rgba(255, 255, 255, 0.2)",
                    "0 15px 40px rgba(255, 255, 255, 0.3)",
                    "0 10px 30px rgba(255, 255, 255, 0.2)"
                  ]
                } : {}}
                transition={{ 
                  boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                type="submit"
                disabled={isLoading || isBlocked || !isValid}
                className={`
                  w-full py-5 px-8 rounded-2xl font-bold text-white text-lg
                  transition-all duration-300 ease-out
                  flex items-center justify-center gap-3
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-2xl relative overflow-hidden
                  ${isBlocked 
                    ? 'bg-gray-600/50' 
                    : `bg-gradient-to-r ${currentTheme.accent} hover:shadow-3xl transform hover:-translate-y-1`
                  }
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-3">
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" />
                      <span>Authenticating...</span>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ✨
                      </motion.div>
                    </>
                  ) : isBlocked ? (
                    <>
                      <Lock className="w-6 h-6" />
                      <span>Account Locked</span>
                      🔒
                    </>
                  ) : (
                    <>
                      <LogIn className="w-6 h-6" />
                      <span>Sign In</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="mt-8 text-center space-y-6 relative z-10"
          >
            <div className={`flex items-center justify-center gap-2 ${currentTheme.text} opacity-80 text-sm font-medium`}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-5 h-5" />
              </motion.div>
              <span>Enterprise-Grade Security</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                🛡️
              </motion.div>
            </div>
            
            <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20`}>
              <p className={`text-sm font-semibold ${currentTheme.text} mb-4 flex items-center justify-center gap-2`}>
                <UserCheck className="w-5 h-5" />
                Default Login Credentials
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔑
                </motion.div>
              </p>
              <div className="space-y-3 text-xs">
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`flex items-center justify-between bg-white/10 rounded-xl p-3 border border-white/20`}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    >
                      <Crown className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                    <span className={`font-medium ${currentTheme.text}`}>Admin:</span>
                  </div>
                  <span className={`font-mono ${currentTheme.text} opacity-90 bg-white/10 px-2 py-1 rounded-lg`}>Admin / Admin@123</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`flex items-center justify-between bg-white/10 rounded-xl p-3 border border-white/20`}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <User className="w-4 h-4 text-blue-400" />
                    </motion.div>
                    <span className={`font-medium ${currentTheme.text}`}>Cashier:</span>
                  </div>
                  <span className={`font-mono ${currentTheme.text} opacity-90 bg-white/10 px-2 py-1 rounded-lg`}>cashier1 / cashier123</span>
                </motion.div>
              </div>
            </div>

            {/* Fun footer message */}
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className={`${currentTheme.text} opacity-70 text-sm flex items-center justify-center gap-2`}
            >
              Made with 
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ❤️
              </motion.span>
              for Vila POS
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage