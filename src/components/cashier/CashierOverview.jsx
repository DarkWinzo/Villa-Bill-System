import React from 'react'
import { motion } from 'framer-motion'
import { Receipt, TrendingUp, Clock, Hotel } from 'lucide-react'

export const CashierOverview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-row items-center justify-between gap-4 sm:flex-col sm:items-start sm:gap-3">
        <h1 className="text-3xl font-bold text-white sm:text-2xl">Cashier Dashboard</h1>
        <div className="text-left sm:text-right">
          <p className="text-sm text-slate-400">Today</p>
          <p className="text-lg font-semibold text-white">
            {new Date().toLocaleDateString('en-LK')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Receipt className="w-6 h-6 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-sm">Today's Bills</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-sm">Today's Revenue</p>
              <p className="text-2xl font-bold text-white">Rs. 0</p>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Hotel className="w-6 h-6 text-purple-400" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-sm">Available Rooms</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
          </div>
        </div>

        <div className="card card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-sm">Active Session</p>
              <p className="text-2xl font-bold text-white">
                {new Date().toLocaleTimeString('en-LK', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-3">
          <button className="btn-primary text-left p-4 h-auto">
            <div className="flex items-center gap-3">
              <Receipt className="w-6 h-6" />
              <div>
                <p className="font-semibold text-base">Create New Bill</p>
                <p className="text-sm opacity-80">Generate a new customer bill</p>
              </div>
            </div>
          </button>
          <button className="btn-secondary text-left p-4 h-auto">
            <div className="flex items-center gap-3">
              <Hotel className="w-6 h-6" />
              <div>
                <p className="font-semibold text-base">View Rooms</p>
                <p className="text-sm opacity-80">Check room availability</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  )
}