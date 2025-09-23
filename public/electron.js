const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow

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
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    },
    show: false,
    titleBarStyle: 'default',
    autoHideMenuBar: false,
    icon: path.join(__dirname, '../build/icon.ico'),
    frame: true,
    resizable: true,
    maximizable: true,
    fullscreenable: true,
    center: true,
    title: 'Vila POS System'
  })

  // Always load from built files for offline operation
  const indexPath = isDev 
    ? path.join(__dirname, '../dist/index.html')
    : path.join(__dirname, '../dist/index.html')

  mainWindow.loadFile(indexPath).catch((error) => {
    console.error('Failed to load application:', error)
    
    // Fallback: create a simple error page
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Vila POS System - Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              color: white;
              margin: 0;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .error-container {
              text-align: center;
              max-width: 500px;
              padding: 40px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              backdrop-filter: blur(10px);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .error-icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
            .error-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 16px;
              color: #ef4444;
            }
            .error-message {
              font-size: 16px;
              margin-bottom: 24px;
              opacity: 0.8;
              line-height: 1.5;
            }
            .error-instructions {
              font-size: 14px;
              opacity: 0.7;
              background: rgba(0, 0, 0, 0.2);
              padding: 16px;
              border-radius: 8px;
              border-left: 4px solid #3b82f6;
            }
          </style>
        </head>
        <body>
          <div class="error-container">
            <div class="error-icon">⚠️</div>
            <h1 class="error-title">Application Not Built</h1>
            <p class="error-message">
              The Vila POS System needs to be built before it can run offline.
            </p>
            <div class="error-instructions">
              <strong>To fix this issue:</strong><br>
              1. Open terminal/command prompt<br>
              2. Navigate to the project folder<br>
              3. Run: <code>npm run build</code><br>
              4. Then run: <code>npm run app</code>
            </div>
          </div>
        </body>
      </html>
    `
    
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`)
  })

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
  })

  // Set up menu
  createMenu()
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Refresh',
          accelerator: 'F5',
          click: () => {
            if (mainWindow) {
              mainWindow.reload()
            }
          }
        },
        { type: 'separator' },
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
              message: 'Moon Light Villa POS System v1.0.0',
              detail: 'A comprehensive hotel management and billing system.\n\nBuilt with Electron and React for offline operation.\n\nNo internet connection required.',
              buttons: ['OK']
            })
          }
        },
        {
          label: 'System Information',
          click: () => {
            const { dialog } = require('electron')
            const os = require('os')
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'System Information',
              message: 'Moon Light Villa POS System Information',
              detail: `Platform: ${os.platform()}\nArchitecture: ${os.arch()}\nNode Version: ${process.versions.node}\nElectron Version: ${process.versions.electron}\nChrome Version: ${process.versions.chrome}`,
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
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  app.quit()
})

// IPC handlers for application functionality
ipcMain.handle('app:getVersion', () => {
  return app.getVersion()
})

ipcMain.handle('app:getName', () => {
  return app.getName()
})

ipcMain.handle('app:getPlatform', () => {
  return process.platform
})

ipcMain.handle('app:getPath', (event, name) => {
  return app.getPath(name)
})

// Data persistence handlers
ipcMain.handle('storage:get', (event, key) => {
  // In a real application, you might want to use a proper database
  // For now, we'll use the renderer's localStorage through IPC
  return null
})

ipcMain.handle('storage:set', (event, key, value) => {
  // In a real application, you might want to use a proper database
  return true
})

// Print handler for bills
ipcMain.handle('print:bill', (event, billData) => {
  return new Promise((resolve) => {
    // Create a hidden window for printing
    const printWindow = new BrowserWindow({
      show: false,
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false
      }
    })

    const printHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill ${billData.bill_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .bill-info { margin-bottom: 20px; }
            .customer-info { margin-bottom: 20px; }
            .booking-details { margin-bottom: 20px; }
            .total { font-size: 18px; font-weight: bold; text-align: right; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            
            .print-container {
              width: 100%;
              max-width: 210mm;
              margin: 0 auto;
              background: white;
              padding: 20mm;
              box-sizing: border-box;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            
            .print-header {
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Vila POS System</h1>
            <h2>Bill #${billData.bill_number}</h2>
          </div>
          <div class="bill-info">
            <p><strong>Date:</strong> ${new Date(billData.created_at).toLocaleDateString()}</p>
          </div>
          <div class="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${billData.customer_name}</p>
            <p><strong>Phone:</strong> ${billData.customer_phone || 'N/A'}</p>
            <p><strong>Address:</strong> ${billData.customer_address || 'N/A'}</p>
          </div>
          <div class="booking-details">
            <h3>Booking Details</h3>
            <table>
              <tr>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Days</th>
                <th>Rate/Day</th>
                <th>Total</th>
              </tr>
              <tr>
                <td>${billData.room_number}</td>
                <td>${new Date(billData.check_in_date).toLocaleDateString()}</td>
                <td>${new Date(billData.check_out_date).toLocaleDateString()}</td>
                <td>${billData.days}</td>
                <td>Rs. ${billData.price_per_day.toFixed(2)}</td>
                <td>Rs. ${billData.total_amount.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          <div class="total">
            <p>Total Amount: Rs. ${billData.total_amount.toFixed(2)}</p>
          </div>
        </body>
      </html>
    `

    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(printHtml)}`)
    
    printWindow.webContents.once('did-finish-load', () => {
      // Add a small delay to ensure content is fully rendered
      setTimeout(() => {
        printWindow.webContents.print({
          silent: false,
          printBackground: true,
          color: true,
          margins: {
            marginType: 'minimum'
          },
          landscape: false,
          scaleFactor: 100
        }, (success, failureReason) => {
          printWindow.close()
          resolve({ success, failureReason })
        })
      }, 1000)
    })

    printWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Print window failed to load:', errorCode, errorDescription)
      printWindow.close()
      resolve({ 
        success: false, 
        failureReason: `Failed to load print content: ${errorDescription}` 
      })
    })
  })
})