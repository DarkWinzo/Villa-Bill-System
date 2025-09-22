import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cashierService } from '../services/cashierService'
import toast from 'react-hot-toast'

export const useCashierStore = create(
  persist(
    (set, get) => ({
      cashiers: [],
      isLoading: false,
      error: null,

      fetchCashiers: async () => {
        set({ isLoading: true, error: null })
        try {
          const cashiers = await cashierService.getAllCashiers()
          set({ cashiers, isLoading: false })
          return cashiers
        } catch (error) {
          const errorMessage = error.message || 'Failed to fetch cashiers'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      addCashier: async (cashierData) => {
        set({ isLoading: true, error: null })
        try {
          const newCashier = await cashierService.createCashier(cashierData)
          set(state => ({
            cashiers: [...state.cashiers, newCashier],
            isLoading: false
          }))
          toast.success('Cashier added successfully')
          return newCashier
        } catch (error) {
          const errorMessage = error.message || 'Failed to add cashier'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      updateCashier: async (id, cashierData) => {
        set({ isLoading: true, error: null })
        try {
          const updatedCashier = await cashierService.updateCashier(id, cashierData)
          set(state => ({
            cashiers: state.cashiers.map(c => c.id === id ? updatedCashier : c),
            isLoading: false
          }))
          toast.success('Cashier updated successfully')
          return updatedCashier
        } catch (error) {
          const errorMessage = error.message || 'Failed to update cashier'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      deleteCashier: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await cashierService.deleteCashier(id)
          set(state => ({
            cashiers: state.cashiers.filter(c => c.id !== id),
            isLoading: false
          }))
          toast.success('Cashier deleted successfully')
        } catch (error) {
          const errorMessage = error.message || 'Failed to delete cashier'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'vila-pos-cashiers',
      partialize: (state) => ({ cashiers: state.cashiers }),
    }
  )
)