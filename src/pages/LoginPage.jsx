import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Eye, EyeOff, LogIn, Hotel, Crown, User } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-primary-950 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Login Card */}
        <div className="glass-morphism-dark rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Hotel className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Vila POS System
            </h1>
            <p className="text-slate-400">
              Premium Hotel Management Solution
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register('username')}
                  type="text"
                  className="input-field pl-11"
                  placeholder="Enter your username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 h-12"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-dark-700/50">
            <h3 className="text-sm font-medium text-slate-300 mb-4 text-center">
              Demo Credentials
            </h3>
            
            <div className="space-y-3">
              {/* Admin Credentials */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fillCredentials('Admin', 'Admin@123')}
                className="w-full p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl text-left hover:from-amber-500/30 hover:to-orange-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="font-medium text-white">Administrator</div>
                    <div className="text-xs text-slate-400">Username: Admin | Password: Admin@123</div>
                  </div>
                </div>
              </motion.button>

              {/* Cashier Credentials */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fillCredentials('cashier1', 'cashier123')}
                className="w-full p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl text-left hover:from-blue-500/30 hover:to-cyan-500/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-medium text-white">Cashier</div>
                    <div className="text-xs text-slate-400">Username: cashier1 | Password: cashier123</div>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Currency Info */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              🇱🇰 Currency: Sri Lankan Rupees (Rs.)
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}