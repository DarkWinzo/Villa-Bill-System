import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Eye, EyeOff, LogIn, Hotel, Crown, User, Sparkles, Shield } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { loginSchema } from '../utils/validation'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: yupResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    await login(data)
  }

  const fillCredentials = (username, password) => {
    setValue('username', username)
    setValue('password', password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-primary-500/30 to-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.4, 0.2, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            x: [-100, 100, -100],
            y: [-50, 50, -50],
            scale: [0.8, 1.1, 0.8],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Login Card */}
        <motion.div 
          className="backdrop-blur-xl bg-dark-900/40 border border-primary-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(124, 58, 237, 0.25)",
            borderColor: "rgba(124, 58, 237, 0.4)"
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Card glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-transparent to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 opacity-20 blur-sm animate-pulse" />
          </div>
          
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1 }}
              transition={{ 
                delay: 0.3, 
                type: 'spring', 
                stiffness: 200,
                damping: 15
              }}
              className="w-24 h-24 bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 relative shadow-lg"
              whileHover={{ 
                scale: 1.05,
                rotate: 5,
                boxShadow: "0 20px 40px rgba(124, 58, 237, 0.4)"
              }}
            >
              <Hotel className="w-12 h-12 text-white drop-shadow-lg" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-primary-200 to-purple-200 bg-clip-text text-transparent mb-3">
                Vila POS System
              </h1>
              <div className="flex items-center justify-center gap-2 text-slate-300 mb-2">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <p className="text-lg font-medium">Premium Hotel Management</p>
                <Sparkles className="w-4 h-4 text-primary-400" />
              </div>
              <p className="text-sm text-slate-400">Secure • Fast • Reliable</p>
            </motion.div>
          </div>

          {/* Login Form */}
          <motion.form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {/* Username Field */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register('username')}
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:border-dark-500"
                  placeholder="Enter your username"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-focus-within:from-primary-500/10 group-focus-within:via-purple-500/5 group-focus-within:to-primary-500/10 transition-all duration-300 pointer-events-none" />
              </div>
              {errors.username && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 flex items-center gap-1"
                >
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.username.message}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative group">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-400 transition-colors duration-200" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-11 pr-12 py-3 bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 hover:border-dark-500"
                  placeholder="Enter your password"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-primary-400 transition-colors duration-200 p-1 rounded-lg hover:bg-primary-500/10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 via-primary-500/0 to-primary-500/0 group-focus-within:from-primary-500/10 group-focus-within:via-purple-500/5 group-focus-within:to-primary-500/10 transition-all duration-300 pointer-events-none" />
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-red-400 flex items-center gap-1"
                >
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="white" />
                  <span className="text-lg">Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-6 h-6" />
                  <span className="text-lg">Sign In</span>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Demo Credentials */}
          <motion.div 
            className="mt-8 pt-6 border-t border-dark-700/50 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent flex-1"></div>
              <h3 className="text-sm font-medium text-slate-300 px-3">Demo Credentials</h3>
              <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent flex-1"></div>
            </div>
            
            <div className="space-y-3">
              {/* Admin Credentials */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fillCredentials('Admin', 'Admin@123')}
                className="w-full p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl text-left hover:from-amber-500/30 hover:to-orange-500/30 transition-all duration-300 backdrop-blur-sm hover:shadow-lg group"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg group-hover:bg-amber-500/30 transition-colors duration-200">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Administrator Access</div>
                    <div className="text-xs text-slate-400">Admin • Admin@123</div>
                  </div>
                </div>
              </motion.button>

              {/* Cashier Credentials */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fillCredentials('cashier1', 'cashier123')}
                className="w-full p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl text-left hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 backdrop-blur-sm hover:shadow-lg group"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors duration-200">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">Cashier Access</div>
                    <div className="text-xs text-slate-400">cashier1 • cashier123</div>
                  </div>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Currency Info */}
          <motion.div 
            className="mt-6 text-center relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800/30 backdrop-blur-sm rounded-full border border-dark-600/50">
              <span className="text-lg">🇱🇰</span>
              <p className="text-xs text-slate-400 font-medium">
                Currency: Sri Lankan Rupees (Rs.)
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}