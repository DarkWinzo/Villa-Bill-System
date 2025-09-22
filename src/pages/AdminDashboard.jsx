import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AdminLayout } from '../components/layout/AdminLayout'
import { AdminOverview } from '../components/admin/AdminOverview'
import { CashierManagement } from '../components/admin/CashierManagement'
import { BillHistory } from '../components/admin/BillHistory'
import RoomManagement from '../components/admin/RoomManagement'
import { AdminReports } from '../components/admin/AdminReports'
import { useCashierStore } from '../stores/cashierStore'
import { useBillStore } from '../stores/billStore'
import { useRoomStore } from '../stores/roomStore'

export const AdminDashboard = () => {
  const { fetchCashiers } = useCashierStore()
  const { fetchBills } = useBillStore()
  const { fetchRooms } = useRoomStore()

  useEffect(() => {
    // Initialize data on dashboard load
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchCashiers(),
          fetchBills(),
          fetchRooms()
        ])
      } catch (error) {
        console.error('Failed to initialize admin dashboard data:', error)
      }
    }

    initializeData()
  }, [fetchCashiers, fetchBills, fetchRooms])

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Routes>
          <Route index element={<AdminOverview />} />
          <Route path="cashiers" element={<CashierManagement />} />
          <Route path="bills" element={<BillHistory />} />
          <Route path="rooms" element={<RoomManagement />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </motion.div>
    </AdminLayout>
  )
}