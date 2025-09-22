import React from 'react'
import { motion } from 'framer-motion'
import { PlusCircle, Calculator } from 'lucide-react'

export const CreateBill = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PlusCircle className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-white">Create New Bill</h1>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Calculator className="w-5 h-5" />
          <span>Bill Calculator</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Customer Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Customer Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                className="input-field"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Address
              </label>
              <textarea
                className="input-field"
                rows="3"
                placeholder="Enter customer address"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-4">Booking Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Room Selection
              </label>
              <select className="input-field">
                <option value="">Select a room</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Check-in Date
                </label>
                <input
                  type="date"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Check-out Date
                </label>
                <input
                  type="date"
                  className="input-field"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Days
                </label>
                <input
                  type="number"
                  className="input-field"
                  readOnly
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Total Amount
                </label>
                <input
                  type="text"
                  className="input-field"
                  readOnly
                  placeholder="Rs. 0.00"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="btn-secondary">
          Cancel
        </button>
        <button className="btn-primary">
          Create Bill
        </button>
      </div>
    </motion.div>
  )
}