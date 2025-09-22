// Browser-only authentication service for React frontend
class AuthService {
  constructor() {
    // Only initialize if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      this.initializeDefaultUsers()
    }
  }

  initializeDefaultUsers() {
    const users = this.getStoredUsers()
    if (users.length === 0) {
      const defaultUsers = [
        {
          id: 1,
          username: 'Admin',
          password: 'Admin@123',
          role: 'admin',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          username: 'cashier1',
          password: 'cashier123',
          role: 'cashier',
          created_at: new Date().toISOString()
        }
      ]
      localStorage.setItem('vila-pos-users', JSON.stringify(defaultUsers))
    }
  }

  getStoredUsers() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return []
    }
    const users = localStorage.getItem('vila-pos-users')
    return users ? JSON.parse(users) : []
  }

  saveUsers(users) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('vila-pos-users', JSON.stringify(users))
    }
  }

  async login(credentials) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = this.getStoredUsers()
        const user = users.find(u => 
          u.username === credentials.username && 
          u.password === credentials.password
        )

        if (user) {
          resolve({
            success: true,
            user: {
              id: user.id,
              username: user.username,
              role: user.role
            }
          })
        } else {
          resolve({
            success: false,
            message: 'Invalid username or password'
          })
        }
      }, 1000) // Simulate network delay
    })
  }

  async getCurrentUser() {
    // This would typically validate a token
    return null
  }
}

export const authService = new AuthService()