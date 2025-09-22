import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database and services
import DatabaseService from './services/DatabaseService.js';
import AuthService from './services/AuthService.js';
import RoomService from './services/RoomService.js';
import BillingService from './services/BillingService.js';

let mainWindow;
let currentUser = null;

// Initialize services
const dbService = new DatabaseService();
const authService = new AuthService(dbService);
const roomService = new RoomService(dbService);
const billingService = new BillingService(dbService);

const isDev = process.env.NODE_ENV === 'development';

async function createWindow() {
  // Initialize database
  await dbService.initialize();
  
  // Create default admin user if not exists
  await authService.createDefaultAdmin();

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false,
    titleBarStyle: 'default',
    webSecurity: true
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Set up menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Logout',
          click: () => {
            currentUser = null;
            if (mainWindow) {
              mainWindow.webContents.send('auth:logout');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers
ipcMain.handle('auth:login', async (event, { username, password }) => {
  try {
    const user = await authService.login(username, password);
    if (user) {
      currentUser = user;
      return { success: true, user: { id: user.id, username: user.username, role: user.role } };
    }
    return { success: false, message: 'Invalid credentials' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

ipcMain.handle('auth:getCurrentUser', () => {
  return currentUser ? { id: currentUser.id, username: currentUser.username, role: currentUser.role } : null;
});

ipcMain.handle('rooms:getAll', async () => {
  try {
    return await roomService.getAllRooms();
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('rooms:create', async (event, roomData) => {
  try {
    return await roomService.createRoom(roomData);
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('rooms:update', async (event, id, roomData) => {
  try {
    return await roomService.updateRoom(id, roomData);
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('rooms:delete', async (event, id) => {
  try {
    return await roomService.deleteRoom(id);
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('billing:generateBillNumber', async () => {
  try {
    return await billingService.generateBillNumber();
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('billing:create', async (event, billData) => {
  try {
    return await billingService.createBill(billData);
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('billing:getAll', async () => {
  try {
    return await billingService.getAllBills();
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('billing:print', async (event, billId) => {
  try {
    const bill = await billingService.getBillById(billId);
    if (bill) {
      // Create print window
      const printWindow = new BrowserWindow({
        width: 800,
        height: 1000,
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });

      printWindow.loadFile(path.join(__dirname, 'renderer/print.html'));
      
      printWindow.webContents.once('did-finish-load', () => {
        printWindow.webContents.send('print:setBillData', bill);
        printWindow.webContents.print({
          silent: false,
          printBackground: true,
          margins: {
            marginType: 'minimum'
          }
        }, (success, failureReason) => {
          if (!success) console.log('Print failed:', failureReason);
          printWindow.close();
        });
      });

      return { success: true };
    }
    return { success: false, message: 'Bill not found' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});