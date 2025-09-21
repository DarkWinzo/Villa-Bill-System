const bcrypt = require('bcryptjs');
const config = require('../config');

class AuthService {
  constructor(dbService) {
    this.db = dbService;
  }

  async createDefaultAdmin() {
    try {
      const existingAdmin = await this.db.get(
        'SELECT * FROM users WHERE role = ? LIMIT 1',
        ['admin']
      );

      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(config.admin.password, 10);
        await this.db.run(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          [config.admin.username, hashedPassword, 'admin']
        );
        console.log(`Default admin user created: ${config.admin.username}/${config.admin.password}`);
      }
    } catch (error) {
      console.error('Error creating default admin:', error);
    }
  }

  async login(username, password) {
    try {
      const user = await this.db.get(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      return {
        id: user.id,
        username: user.username,
        role: user.role
      };
    } catch (error) {
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const result = await this.db.run(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [userData.username, hashedPassword, userData.role]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await this.db.all('SELECT id, username, role, created_at FROM users');
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;