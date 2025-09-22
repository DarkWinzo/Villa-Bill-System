// Mock room service for offline functionality
class RoomService {
  constructor() {
    this.initializeDefaultRooms()
  }

  initializeDefaultRooms() {
    const rooms = this.getStoredRooms()
    if (rooms.length === 0) {
      const defaultRooms = [
        {
          id: 1,
          room_number: '101',
          room_type: 'ac',
          price_per_day: 8500.00,
          description: 'Deluxe AC Room with Sea View',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          room_number: '102',
          room_type: 'non_ac',
          price_per_day: 6500.00,
          description: 'Standard Non-AC Room',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          room_number: '201',
          room_type: 'ac',
          price_per_day: 12000.00,
          description: 'Premium AC Suite',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ]
      localStorage.setItem('vila-pos-rooms-data', JSON.stringify(defaultRooms))
    }
  }

  getStoredRooms() {
    const rooms = localStorage.getItem('vila-pos-rooms-data')
    return rooms ? JSON.parse(rooms) : []
  }

  saveRooms(rooms) {
    localStorage.setItem('vila-pos-rooms-data', JSON.stringify(rooms))
  }

  async getAllRooms() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rooms = this.getStoredRooms().filter(room => room.is_active)
        resolve(rooms)
      }, 500)
    })
  }

  async createRoom(roomData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const rooms = this.getStoredRooms()
          
          // Check if room number already exists
          if (rooms.some(r => r.room_number === roomData.room_number && r.is_active)) {
            reject(new Error('Room number already exists'))
            return
          }

          const newId = Math.max(...rooms.map(r => r.id), 0) + 1
          const newRoom = {
            ...roomData,
            id: newId,
            is_active: true,
            created_at: new Date().toISOString()
          }

          rooms.push(newRoom)
          this.saveRooms(rooms)
          resolve(newRoom)
        } catch (error) {
          reject(error)
        }
      }, 500)
    })
  }

  async updateRoom(id, roomData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const rooms = this.getStoredRooms()
          
          // Check if room number already exists (excluding current room)
          if (rooms.some(r => r.room_number === roomData.room_number && r.id !== id && r.is_active)) {
            reject(new Error('Room number already exists'))
            return
          }

          const index = rooms.findIndex(r => r.id === id)
          if (index !== -1) {
            rooms[index] = {
              ...rooms[index],
              ...roomData,
              updated_at: new Date().toISOString()
            }
            this.saveRooms(rooms)
            resolve(rooms[index])
          } else {
            reject(new Error('Room not found'))
          }
        } catch (error) {
          reject(error)
        }
      }, 500)
    })
  }

  async deleteRoom(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rooms = this.getStoredRooms()
        const index = rooms.findIndex(r => r.id === id)
        if (index !== -1) {
          rooms[index].is_active = false
          this.saveRooms(rooms)
        }
        resolve()
      }, 500)
    })
  }
}

export const roomService = new RoomService()