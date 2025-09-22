import React from 'react'
import { motion } from 'framer-motion'
import { Hotel, Search, Filter } from 'lucide-react'

export const CashierRooms = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Hotel className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-white">Room Availability</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              className="input-field pl-10 w-64"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Hotel className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-slate-400 text-sm">Available</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Hotel className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-slate-400 text-sm">Occupied</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Hotel className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-slate-400 text-sm">AC Rooms</p>
          </div>
        </div>

        <div className="card">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Hotel className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-slate-400 text-sm">Non-AC Rooms</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <Hotel className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No Rooms Available</h3>
          <p className="text-slate-500">
            Room data will be displayed here once rooms are added to the system.
          </p>
        </div>
      </div>
    </motion.div>
  )
}