// Configuration file for Vila POS System
module.exports = {
  // Default Admin Credentials
  admin: {
    username: 'Admin',
    password: 'Admin@123'
  },
  
  // Application Settings
  app: {
    name: 'Vila POS System',
    version: '1.0.0',
    currency: 'LKR',
    currencySymbol: 'Rs. '
  },
  
  // Database Settings
  database: {
    name: 'vila_pos.db',
    path: './data/'
  },
  
  // UI Theme
  theme: {
    primary: '#7C3AED',
    secondary: '#8B5CF6',
    dark: '#1E1B4B',
    darker: '#0F0D2A',
    accent: '#A855F7',
    glass: 'rgba(124, 58, 237, 0.1)'
  }
};