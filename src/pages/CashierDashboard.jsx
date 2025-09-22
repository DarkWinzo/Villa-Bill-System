import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CashierLayout } from '../components/layout/CashierLayout'
import { CashierOverview } from '../components/cashier/CashierOverview'
import { CreateBill } from '../components/cashier/CreateBill'
import { CashierBills } from '../components/cashier/CashierBills'
import { CashierRooms } from '../components/cashier/CashierRooms'
import { useBillStore } from '../stores/billStore'
import { useRoomStore } from '../stores/roomStore'

export const CashierDashboard = () => {
  const { fetchBills } = useBillStore()
  const { fetchRooms } = useRoomStore()

  useEffect(() => {
    // Initialize data on dashboard load
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchBills(),
          fetchRooms()
        ])
      } catch (error) {
        console.error('Failed to initialize cashier dashboard data:', error)
      }
    }

    initializeData()
  }, [fetchBills, fetchRooms])

  return (
    <CashierLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Routes>
          <Route index element={<CashierOverview />} />
          <Route path="create-bill" element={<CreateBill />} />
          <Route path="bills" element={<CashierBills />} />
          <Route path="rooms" element={<CashierRooms />} />
          <Route path="*" element={<Navigate to="/cashier" replace />} />
        </Routes>
      </motion.div>
    </CashierLayout>
  )
}