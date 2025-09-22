import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Calendar } from 'lucide-react'

export const AdminReports = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-slate-400" />
          <input
            type="date"
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Revenue Report</h3>
          </div>
          <p className="text-slate-400">
            Revenue analytics will be displayed here.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Occupancy Report</h3>
          </div>
          <p className="text-slate-400">
            Room occupancy statistics will be shown here.
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Monthly Summary</h3>
          </div>
          <p className="text-slate-400">
            Monthly performance summary will be displayed here.
          </p>
        </div>
      </div>
    </motion.div>
  )
}