import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { billingService } from '../services/billingService'
import toast from 'react-hot-toast'

export const useBillStore = create(
  persist(
    (set, get) => ({
      bills: [],
      isLoading: false,
      error: null,
      stats: {
        totalBills: 0,
        totalRevenue: 0,
        todayBills: 0,
        todayRevenue: 0,
      },

      fetchBills: async () => {
        set({ isLoading: true, error: null })
        try {
          const bills = await billingService.getAllBills()
          const stats = get().calculateStats(bills)
          set({ bills, stats, isLoading: false })
          return bills
        } catch (error) {
          const errorMessage = error.message || 'Failed to fetch bills'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      createBill: async (billData) => {
        set({ isLoading: true, error: null })
        try {
          const newBill = await billingService.createBill(billData)
          set(state => {
            const updatedBills = [...state.bills, newBill]
            const stats = state.calculateStats(updatedBills)
            return {
              bills: updatedBills,
              stats,
              isLoading: false
            }
          })
          toast.success('Bill created successfully')
          return newBill
        } catch (error) {
          const errorMessage = error.message || 'Failed to create bill'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      deleteBill: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await billingService.deleteBill(id)
          set(state => {
            const updatedBills = state.bills.filter(b => b.id !== id)
            const stats = state.calculateStats(updatedBills)
            return {
              bills: updatedBills,
              stats,
              isLoading: false
            }
          })
          toast.success('Bill deleted successfully')
        } catch (error) {
          const errorMessage = error.message || 'Failed to delete bill'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      calculateStats: (bills) => {
        const today = new Date().toDateString()
        const todayBills = bills.filter(bill => 
          new Date(bill.created_at).toDateString() === today
        )
        
        return {
          totalBills: bills.length,
          totalRevenue: bills.reduce((sum, bill) => sum + parseFloat(bill.total_amount), 0),
          todayBills: todayBills.length,
          todayRevenue: todayBills.reduce((sum, bill) => sum + parseFloat(bill.total_amount), 0),
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'vila-pos-bills',
      partialize: (state) => ({ bills: state.bills }),
    }
  )
)