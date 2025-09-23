# Build Instructions for Vila POS System

## Quick Start (Recommended)

For users who just want to run the application:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build and Run**
   ```bash
   npm run build-and-run
   ```

This will build the React application and immediately launch the Electron app.

## Detailed Build Process

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build the React Application
```bash
npm run build
```
This creates the `dist/` folder with the compiled web application.

### Step 3: Run the Electron Application
```bash
npm run app
```

### Step 4: Create Windows Installer (Optional)
```bash
npm run build-win
```
This creates an installer in the `dist-electron/` folder.

## Build Scripts Explained

- `npm run build` - Compiles the React app to static files
- `npm run app` - Runs the Electron application using built files
- `npm run build-and-run` - Builds and runs in one command
- `npm run build-win` - Creates Windows installer (.exe)
- `npm run build-win-portable` - Creates portable Windows app
- `npm run dist` - Creates distribution packages for all platforms

## Troubleshooting Build Issues

### "Application Not Built" Error
If you see an error page when running the app:
1. Make sure you ran `npm run build` first
2. Check that the `dist/` folder exists and contains files
3. Try `npm run build-and-run`

### Build Fails
1. Delete `node_modules/` and `package-lock.json`
2. Run `npm install` again
3. Try building again

### Electron App Won't Start
1. Ensure Node.js version is 18 or later
2. Check that all dependencies installed correctly
3. Try running `npm run clean-cache` then rebuild

## File Structure After Build

```
project/
├── dist/                 # Built React application
│   ├── index.html       # Main HTML file
│   ├── assets/          # CSS, JS, and other assets
│   └── ...
├── dist-electron/       # Built Electron installers
│   ├── Vila POS System Setup 1.0.0.exe
│   └── ...
├── public/
│   ├── electron.js      # Electron main process
│   └── preload.js       # Electron preload script
└── ...
```

## Production Deployment

For distributing the application:

1. **Build the installer:**
   ```bash
   npm run build-win
   ```

2. **Find the installer:**
   - Location: `dist-electron/`
   - File: `Vila POS System Setup 1.0.0.exe`

3. **Distribute:**
   - Share the installer file with users
   - Users run the installer to install the application
   - No additional setup required

## Development vs Production

### Development Mode
- Uses `npm run app-dev`
- Shows developer tools
- Hot reload not available (uses built files)

### Production Mode
- Uses `npm run app`
- No developer tools
- Optimized performance
- Ready for distribution

## System Requirements for Building

- **Node.js:** Version 18 or later
- **npm:** Version 8 or later
- **Operating System:** Windows 10/11 (for Windows builds)
- **RAM:** 4GB minimum, 8GB recommended
- **Disk Space:** 2GB free space for build process

## Advanced Build Options

### Custom Build Configuration
Edit `electron-builder.yml` to customize:
- Application name and version
- Installer options
- File associations
- Auto-updater settings

### Environment Variables
Set these before building:
- `NODE_ENV=production` - Production build
- `NODE_ENV=development` - Development build

### Build for Different Architectures
```bash
# 64-bit Windows (default)
npm run build-win

# 32-bit Windows
npx electron-builder --win --ia32

# Both architectures
npx electron-builder --win --x64 --ia32
```

## Automated Build Script

Create a batch file (`build.bat`) for easy building:

```batch
@echo off
echo Building Vila POS System...
call npm install
call npm run build
call npm run app
pause
```

Save this as `build.bat` and double-click to build and run.