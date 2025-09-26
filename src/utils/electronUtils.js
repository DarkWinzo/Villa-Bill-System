// Electron-specific utilities for the renderer process

export const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI && window.electronAPI.isElectron
}

export const getPlatform = () => {
  if (isElectron()) {
    return window.electronAPI.platform
  }
  return 'web'
}

export const getAppVersion = async () => {
  if (isElectron()) {
    try {
      return await window.electronAPI.getVersion()
    } catch (error) {
      console.error('Failed to get app version:', error)
      return '2.0.0'
    }
  }
  return '2.0.0 (Web)'
}

export const showSaveDialog = async () => {
  if (isElectron()) {
    try {
      return await window.electronAPI.showSaveDialog()
    } catch (error) {
      console.error('Failed to show save dialog:', error)
      return { canceled: true }
    }
  }
  return { canceled: true }
}

export const showOpenDialog = async () => {
  if (isElectron()) {
    try {
      return await window.electronAPI.showOpenDialog()
    } catch (error) {
      console.error('Failed to show open dialog:', error)
      return { canceled: true }
    }
  }
  return { canceled: true }
}

export const printDocument = () => {
  if (isElectron()) {
    window.electronAPI.print()
  } else {
    window.print()
  }
}

export const checkForUpdates = async () => {
  if (isElectron()) {
    try {
      return await window.electronAPI.checkForUpdates()
    } catch (error) {
      console.error('Failed to check for updates:', error)
      return { hasUpdate: false }
    }
  }
  return { hasUpdate: false }
}

// Enhanced localStorage for Electron with file system backup
export const electronStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value)
      // In a full implementation, you could also save to a file
      return true
    } catch (error) {
      console.error('Failed to save to storage:', error)
      return false
    }
  },

  getItem: (key) => {
    try {
      return localStorage.getItem(key)
    } catch (error) {
      console.error('Failed to read from storage:', error)
      return null
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Failed to remove from storage:', error)
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear storage:', error)
      return false
    }
  }
}