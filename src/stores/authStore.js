import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.login(credentials)
          if (response.success) {
            set({ user: response.user, isLoading: false })
            toast.success(`Welcome back, ${response.user.username}!`)
            return response
          } else {
            set({ error: response.message, isLoading: false })
            toast.error(response.message)
            return response
          }
        } catch (error) {
          const errorMessage = error.message || 'Login failed'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          return { success: false, message: errorMessage }
        }
      },

      logout: () => {
        set({ user: null, error: null })
        toast.success('Logged out successfully')
      },

      clearError: () => set({ error: null }),

      initialize: () => {
        const storedUser = get().user
        if (storedUser) {
          set({ user: storedUser, isLoading: false })
        } else {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'vila-pos-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
)