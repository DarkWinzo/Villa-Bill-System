const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const { spawn } = require('child_process')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow
let viteProcess = null

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false,
    titleBarStyle: 'default',
    webSecurity: true,
    autoHideMenuBar: false,
    icon: path.join(__dirname, '../build/icon.ico'),
    frame: true,
    resizable: true,
    maximizable: true,
    fullscreenable: true,
    center: true,
    title: 'Vila POS System'
  })

  // Load the app
  if (isDev) {
    // Start Vite dev server programmatically
    startViteServer().then(() => {
      mainWindow.loadURL('http://localhost:5173')
    }).catch(() => {
      // Fallback to built files if dev server fails
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
    })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    
    // Maximize window for better desktop app experience
    mainWindow.maximize()
    
    if (isDev) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    if (viteProcess) {
      viteProcess.kill()
      viteProcess = null
    }
  })

  // Set up menu
  createMenu()
}

function startViteServer() {
  return new Promise((resolve, reject) => {
    if (viteProcess) {
      resolve()
      return
    }

    const isWindows = process.platform === 'win32'
    const npmCmd = isWindows ? 'npm.cmd' : 'npm'
    
    viteProcess = spawn(npmCmd, ['run', 'dev'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    })

    let serverStarted = false
    
    viteProcess.stdout.on('data', (data) => {
      const output = data.toString()
      console.log('Vite:', output)
      
      if (output.includes('Local:') && !serverStarted) {
        serverStarted = true
        setTimeout(resolve, 2000) // Wait a bit for server to be fully ready
      }
    })

    viteProcess.stderr.on('data', (data) => {
      console.error('Vite Error:', data.toString())
    })

    viteProcess.on('error', (error) => {
      console.error('Failed to start Vite server:', error)
      reject(error)
    })

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!serverStarted) {
        reject(new Error('Vite server failed to start within 30 seconds'))
      }
    }, 30000)
  })
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'actualSize' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'togglefullscreen' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Vila POS',
          click: () => {
            const { dialog } = require('electron')
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Vila POS System',
              message: 'Vila POS System v1.0.0',
              detail: 'A comprehensive hotel management and billing system.\n\nBuilt with Electron, React, and modern web technologies.',
              buttons: ['OK']
            })
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow)

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (viteProcess) {
    viteProcess.kill()
    viteProcess = null
  }
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Handle app termination
app.on('before-quit', () => {
  if (viteProcess) {
    viteProcess.kill()
    viteProcess = null
  }
})

// IPC handlers for future database operations
ipcMain.handle('app:getVersion', () => {
  return app.getVersion()
})

ipcMain.handle('app:getName', () => {
  return app.getName()
})