import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Auth methods
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  getCurrentUser: () => ipcRenderer.invoke('auth:getCurrentUser'),
  
  // Room methods
  getAllRooms: () => ipcRenderer.invoke('rooms:getAll'),
  createRoom: (roomData) => ipcRenderer.invoke('rooms:create', roomData),
  updateRoom: (id, roomData) => ipcRenderer.invoke('rooms:update', id, roomData),
  deleteRoom: (id) => ipcRenderer.invoke('rooms:delete', id),
  
  // Billing methods
  generateBillNumber: () => ipcRenderer.invoke('billing:generateBillNumber'),
  createBill: (billData) => ipcRenderer.invoke('billing:create', billData),
  getAllBills: () => ipcRenderer.invoke('billing:getAll'),
  printBill: (billId) => ipcRenderer.invoke('billing:print', billId),
  
  // Event listeners
  onAuthLogout: (callback) => ipcRenderer.on('auth:logout', callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});