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
    currencySymbol: 'Rs.'
  },
  
  // Database Settings
  database: {
    name: 'vila_pos.db',
    path: './data/'
  },
  
  // UI Theme
  theme: {
    primary: '#8B5CF6',
    secondary: '#A855F7',
    dark: '#1E1B4B',
    accent: '#C084FC'
  }
};