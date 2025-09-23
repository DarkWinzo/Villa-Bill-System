const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getName: () => ipcRenderer.invoke('app:getName'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  getPath: (name) => ipcRenderer.invoke('app:getPath', name),
  
  // Platform info
  platform: process.platform,
  isElectron: true,
  isOffline: true,
  
  // Storage operations
  storage: {
    get: (key) => ipcRenderer.invoke('storage:get', key),
    set: (key, value) => ipcRenderer.invoke('storage:set', key, value)
  },
  
  // Print operations
  print: {
    bill: (billData) => ipcRenderer.invoke('print:bill', billData)
  },
  
  // System operations
  system: {
    showMessageBox: (options) => ipcRenderer.invoke('system:showMessageBox', options),
    showSaveDialog: (options) => ipcRenderer.invoke('system:showSaveDialog', options),
    showOpenDialog: (options) => ipcRenderer.invoke('system:showOpenDialog', options)
  }
})

// Prevent new window creation
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})