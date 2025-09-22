import React from 'react'
import { motion } from 'framer-motion'
import { Receipt, Search } from 'lucide-react'

export const BillHistory = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Receipt className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-white">Bill History</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search bills..."
            className="input-field pl-10 w-64"
          />
        </div>
      </div>

      <div className="card">
        <p className="text-slate-400 text-center py-8">
          Bill history functionality will be implemented here.
        </p>
      </div>
    </motion.div>
  )
}