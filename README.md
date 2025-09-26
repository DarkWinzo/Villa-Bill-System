# Vila POS System - Web Application

A comprehensive hotel management and billing system built with React and Vite, designed as a modern web application.

## Features

- **Modern Web Application** - Runs in any modern web browser
- **User Management** - Admin and Cashier roles with secure authentication
- **Room Management** - Add, edit, and manage hotel rooms
- **Billing System** - Create and manage customer bills
- **Print Support** - Print bills directly from the browser
- **Data Persistence** - All data stored locally using browser storage
- **Responsive Design** - Works on different screen sizes and devices
- **Modern UI** - Beautiful, intuitive interface with animations
- **PWA Ready** - Can be installed as a Progressive Web App

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Local storage support
- No internet connection required after initial load

## Installation & Development

### Prerequisites
- Node.js 18 or later
- npm or yarn package manager

### Development Setup
1. Clone or download the project
2. Open terminal/command prompt in the project folder
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`

### Production Build
To create a production build:
```bash
npm run build
```

The built files will be in the `dist` folder, ready to be deployed to any web server.

### Preview Production Build
To preview the production build locally:
```bash
npm run preview
```

## Usage

### Default Login Credentials

**Administrator Account:**
- Username: `Admin`
- Password: `Admin@123`

**Cashier Account:**
- Username: `cashier1`
- Password: `cashier123`

### Getting Started

1. **Access the Application**
   - Open your web browser and navigate to the application URL
   - For development: `http://localhost:5173`

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

All application data is stored locally in your browser:
- User accounts and authentication data
- Room information and availability
- Customer bills and transaction history
- Application settings and preferences

**Data Location:** The application uses browser localStorage, which persists across browser sessions.

## Deployment

### Static Web Hosting
The application can be deployed to any static web hosting service:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder to your hosting service:**
   - Netlify
   - Vercel
   - GitHub Pages
   - AWS S3
   - Any web server

### Web Server Configuration
For single-page applications, configure your web server to serve `index.html` for all routes:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Application Won't Load
- Ensure JavaScript is enabled in your browser
- Check browser console for errors
- Try clearing browser cache and localStorage

### Data Not Saving
- Ensure localStorage is enabled in your browser
- Check available storage space
- Try using an incognito/private window to test

### Print Issues
- Ensure your browser allows printing
- Check printer settings and drivers
- Try printing from another website to verify printer works

## Development

### Project Structure
```
vila-pos-system/
├── src/             # React application source
├── public/          # Static assets
├── dist/            # Built application (after build)
├── index.html       # Main HTML file
└── package.json     # Project configuration
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run clean` - Clean build artifacts

### Adding Features
1. Modify React components in the `src/` folder
2. Test with: `npm run dev`
3. Build for production: `npm run build`

## Security

- All authentication is handled locally in the browser
- No data is transmitted over the internet
- User passwords are stored securely in localStorage
- Application runs entirely client-side

## Progressive Web App (PWA)

The application is PWA-ready and can be installed on devices:
- Look for the "Install" button in your browser
- Add to home screen on mobile devices
- Works offline after initial load

## Support

For technical support or feature requests:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Contact the development team

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Version History

### v2.0.0 (Web Application)
- Converted from Electron to web application
- Improved browser compatibility
- Added PWA support
- Enhanced responsive design
- Optimized for web deployment

### v1.0.0 (Electron)
- Initial Electron desktop application
- Complete offline functionality
- User management system
- Room and billing management
- Print support