# Vila POS System - Offline Windows Application

A comprehensive hotel management and billing system built with Electron and React, designed to work completely offline on Windows.

## Features

- **Complete Offline Operation** - No internet connection required
- **User Management** - Admin and Cashier roles with secure authentication
- **Room Management** - Add, edit, and manage hotel rooms
- **Billing System** - Create and manage customer bills
- **Print Support** - Print bills directly from the application
- **Data Persistence** - All data stored locally using browser storage
- **Responsive Design** - Works on different screen sizes
- **Modern UI** - Beautiful, intuitive interface with animations

## System Requirements

- Windows 10 or later (64-bit)
- 4GB RAM minimum (8GB recommended)
- 500MB free disk space
- No internet connection required after installation

## Installation

### Option 1: Download Pre-built Application
1. Download the latest release from the releases page
2. Run the installer (`Vila-POS-System-Setup.exe`)
3. Follow the installation wizard
4. Launch the application from the Start Menu or Desktop

### Option 2: Build from Source

#### Prerequisites
- Node.js 18 or later
- npm or yarn package manager

#### Build Steps
1. Clone or download the project
2. Open terminal/command prompt in the project folder
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the application:
   ```bash
   npm run build
   ```
5. Run the application:
   ```bash
   npm run app
   ```

#### Create Windows Installer
To create a Windows installer:
```bash
npm run build-win
```

The installer will be created in the `dist-electron` folder.

## Usage

### Default Login Credentials

**Administrator Account:**
- Username: `Admin`
- Password: `Admin@123`

**Cashier Account:**
- Username: `cashier1`
- Password: `cashier123`

### Getting Started

1. **Launch the Application**
   - Double-click the desktop icon or find it in the Start Menu

2. **Login**
   - Use the default credentials above
   - Admin users have full access to all features
   - Cashier users can create bills and view rooms

3. **Admin Features**
   - Manage cashier accounts
   - View all bills and reports
   - Manage room inventory
   - System administration

4. **Cashier Features**
   - Create new customer bills
   - View and print existing bills
   - Check room availability

### Creating a Bill

1. Navigate to "Create Bill" from the sidebar
2. Fill in customer information
3. Select a room and dates
4. Review the calculated total
5. Click "Create Bill"
6. Print the bill if needed

### Managing Rooms

1. Go to "Rooms" in the admin panel
2. Click "Add Room" to create new rooms
3. Set room number, type (AC/Non-AC), and daily rate
4. Edit or delete existing rooms as needed

## Data Storage

All application data is stored locally on your computer:
- User accounts and authentication data
- Room information and availability
- Customer bills and transaction history
- Application settings and preferences

**Data Location:** The application uses browser localStorage, which is stored in the Electron user data directory.

## Backup and Recovery

### Manual Backup
1. Close the application
2. Navigate to the user data folder
3. Copy the entire folder to a safe location

### Restore from Backup
1. Close the application
2. Replace the user data folder with your backup
3. Restart the application

## Troubleshooting

### Application Won't Start
- Ensure you have built the application: `npm run build`
- Check that all dependencies are installed: `npm install`
- Try running: `npm run build-and-run`

### Data Not Saving
- Ensure the application has write permissions
- Check available disk space
- Restart the application

### Print Issues
- Ensure you have a printer installed and configured
- Check printer drivers are up to date
- Try printing from another application to verify printer works

## Development

### Project Structure
```
vila-pos-system/
├── public/           # Electron main process files
├── src/             # React application source
├── dist/            # Built web application
├── dist-electron/   # Built Electron application
├── build/           # Build resources (icons, etc.)
└── package.json     # Project configuration
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build the React application
- `npm run app` - Run the Electron application
- `npm run build-win` - Build Windows installer
- `npm run clean-cache` - Clean build cache

### Adding Features
1. Modify React components in the `src/` folder
2. Update Electron main process in `public/electron.js`
3. Rebuild the application: `npm run build`
4. Test with: `npm run app`

## Security

- All authentication is handled locally
- No data is transmitted over the internet
- User passwords are stored securely
- Application runs in a sandboxed environment

## Support

For technical support or feature requests:
1. Check the troubleshooting section above
2. Review the application logs
3. Contact the development team

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Version History

### v1.0.0
- Initial release
- Complete offline functionality
- User management system
- Room and billing management
- Print support
- Windows installer