import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Users } from 'lucide-react'

export const CashierManagement = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-white">Cashier Management</h1>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Cashier
        </button>
      </div>

      <div className="card">
        <p className="text-slate-400 text-center py-8">
          Cashier management functionality will be implemented here.
        </p>
      </div>
    </motion.div>
  )
}