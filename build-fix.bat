@echo off
echo ========================================
echo Vila POS System - Build Fix Script
echo ========================================
echo.

echo Step 1: Cleaning cache and old builds...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist "dist" rmdir /s /q "dist"
if exist "dist-electron" rmdir /s /q "dist-electron"
echo Cache cleaned.
echo.

echo Step 2: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed.
echo.

echo Step 3: Building React application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build React application
    pause
    exit /b 1
)
echo React application built successfully.
echo.

echo Step 4: Verifying build output...
if not exist "dist\index.html" (
    echo ERROR: Build output missing - dist\index.html not found
    pause
    exit /b 1
)
echo Build output verified.
echo.

echo Step 5: Building Windows executable...
call npm run build-win-only
if %errorlevel% neq 0 (
    echo ERROR: Failed to build Windows executable
    pause
    exit /b 1
)
echo Windows executable built successfully.
echo.

echo Step 6: Verifying executable...
if exist "dist-electron\*.exe" (
    echo SUCCESS: Executable files created in dist-electron folder
    dir "dist-electron\*.exe"
) else (
    echo ERROR: No executable files found in dist-electron folder
    pause
    exit /b 1
)
echo.

echo ========================================
echo BUILD COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Your executable files are in the 'dist-electron' folder.
echo You can now run the .exe file to test the application.
echo.
pause