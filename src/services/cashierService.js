// Mock cashier service for offline functionality
class CashierService {
  getStoredCashiers() {
    const users = localStorage.getItem('vila-pos-users')
    const allUsers = users ? JSON.parse(users) : []
    return allUsers.filter(user => user.role === 'cashier')
  }

  saveUser(user) {
    const users = localStorage.getItem('vila-pos-users')
    const allUsers = users ? JSON.parse(users) : []
    
    if (user.id) {
      // Update existing user
      const index = allUsers.findIndex(u => u.id === user.id)
      if (index !== -1) {
        allUsers[index] = { ...allUsers[index], ...user, updated_at: new Date().toISOString() }
      }
    } else {
      // Add new user
      const newId = Math.max(...allUsers.map(u => u.id), 0) + 1
      allUsers.push({
        ...user,
        id: newId,
        role: 'cashier',
        created_at: new Date().toISOString()
      })
    }
    
    localStorage.setItem('vila-pos-users', JSON.stringify(allUsers))
    return user.id ? allUsers.find(u => u.id === user.id) : allUsers[allUsers.length - 1]
  }

  async getAllCashiers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cashiers = this.getStoredCashiers()
        resolve(cashiers.map(({ password, ...cashier }) => cashier)) // Remove password from response
      }, 500)
    })
  }

  async createCashier(cashierData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = localStorage.getItem('vila-pos-users')
          const allUsers = users ? JSON.parse(users) : []
          
          // Check if username already exists
          if (allUsers.some(u => u.username === cashierData.username)) {
            reject(new Error('Username already exists'))
            return
          }

          const newCashier = this.saveUser(cashierData)
          const { password, ...cashierResponse } = newCashier
          resolve(cashierResponse)
        } catch (error) {
          reject(error)
        }
      }, 500)
    })
  }

  async updateCashier(id, cashierData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = localStorage.getItem('vila-pos-users')
          const allUsers = users ? JSON.parse(users) : []
          
          // Check if username already exists (excluding current user)
          if (allUsers.some(u => u.username === cashierData.username && u.id !== id)) {
            reject(new Error('Username already exists'))
            return
          }

          const updatedCashier = this.saveUser({ ...cashierData, id })
          const { password, ...cashierResponse } = updatedCashier
          resolve(cashierResponse)
        } catch (error) {
          reject(error)
        }
      }, 500)
    })
  }

  async deleteCashier(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = localStorage.getItem('vila-pos-users')
          const allUsers = users ? JSON.parse(users) : []
          const filteredUsers = allUsers.filter(u => u.id !== id)
          localStorage.setItem('vila-pos-users', JSON.stringify(filteredUsers))
          resolve()
        } catch (error) {
          reject(error)
        }
      }, 500)
    })
  }
}

export const cashierService = new CashierService()