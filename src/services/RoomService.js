class RoomService {
  constructor(dbService) {
    this.db = dbService;
  }

  async getAllRooms() {
    try {
      return await this.db.all(
        'SELECT * FROM rooms WHERE is_active = 1 ORDER BY room_number'
      );
    } catch (error) {
      throw error;
    }
  }

  async getRoomById(id) {
    try {
      return await this.db.get('SELECT * FROM rooms WHERE id = ?', [id]);
    } catch (error) {
      throw error;
    }
  }

  async createRoom(roomData) {
    try {
      const result = await this.db.run(
        `INSERT INTO rooms (room_number, room_type, price_per_day, description) 
         VALUES (?, ?, ?, ?)`,
        [roomData.room_number, roomData.room_type, roomData.price_per_day, roomData.description]
      );
      return result;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Room number already exists');
      }
      throw error;
    }
  }

  async updateRoom(id, roomData) {
    try {
      const result = await this.db.run(
        `UPDATE rooms 
         SET room_number = ?, room_type = ?, price_per_day = ?, description = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [roomData.room_number, roomData.room_type, roomData.price_per_day, roomData.description, id]
      );
      return result;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Room number already exists');
      }
      throw error;
    }
  }

  async deleteRoom(id) {
    try {
      // Soft delete - set is_active to 0
      const result = await this.db.run(
        'UPDATE rooms SET is_active = 0 WHERE id = ?',
        [id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getRoomAvailability(roomId, checkInDate, checkOutDate) {
    try {
      const conflictingBills = await this.db.all(
        `SELECT * FROM bills 
         WHERE room_id = ? 
         AND ((check_in_date <= ? AND check_out_date > ?) 
              OR (check_in_date < ? AND check_out_date >= ?))`,
        [roomId, checkInDate, checkInDate, checkOutDate, checkOutDate]
      );
      return conflictingBills.length === 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RoomService;