import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, Receipt, TrendingUp } from 'lucide-react'

export const AdminOverview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card card-hover">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-sm">Total Cashiers</p>
              <p className="text-xl sm:text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Receipt className="w-6 h-6 text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-sm">Total Bills</p>
              <p className="text-xl sm:text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-sm">Total Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-white">Rs. 0</p>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-sm">This Month</p>
              <p className="text-xl sm:text-2xl font-bold text-white">Rs. 0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Welcome to Vila POS Admin Panel</h2>
        <p className="text-slate-400 text-sm sm:text-base">
          Manage your hotel operations efficiently with our comprehensive admin dashboard.
        </p>
      </div>
    </motion.div>
  )
}