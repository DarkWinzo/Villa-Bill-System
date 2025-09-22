import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { roomService } from '../services/roomService'
import toast from 'react-hot-toast'

export const useRoomStore = create(
  persist(
    (set, get) => ({
      rooms: [],
      isLoading: false,
      error: null,

      fetchRooms: async () => {
        set({ isLoading: true, error: null })
        try {
          const rooms = await roomService.getAllRooms()
          set({ rooms, isLoading: false })
          return rooms
        } catch (error) {
          const errorMessage = error.message || 'Failed to fetch rooms'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      addRoom: async (roomData) => {
        set({ isLoading: true, error: null })
        try {
          const newRoom = await roomService.createRoom(roomData)
          set(state => ({
            rooms: [...state.rooms, newRoom],
            isLoading: false
          }))
          toast.success('Room added successfully')
          return newRoom
        } catch (error) {
          const errorMessage = error.message || 'Failed to add room'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      updateRoom: async (id, roomData) => {
        set({ isLoading: true, error: null })
        try {
          const updatedRoom = await roomService.updateRoom(id, roomData)
          set(state => ({
            rooms: state.rooms.map(r => r.id === id ? updatedRoom : r),
            isLoading: false
          }))
          toast.success('Room updated successfully')
          return updatedRoom
        } catch (error) {
          const errorMessage = error.message || 'Failed to update room'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      deleteRoom: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await roomService.deleteRoom(id)
          set(state => ({
            rooms: state.rooms.filter(r => r.id !== id),
            isLoading: false
          }))
          toast.success('Room deleted successfully')
        } catch (error) {
          const errorMessage = error.message || 'Failed to delete room'
          set({ error: errorMessage, isLoading: false })
          toast.error(errorMessage)
          throw error
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'vila-pos-rooms',
      partialize: (state) => ({ rooms: state.rooms }),
    }
  )
)