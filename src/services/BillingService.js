const moment = require('moment');

class BillingService {
  constructor(dbService) {
    this.db = dbService;
  }

  async generateBillNumber() {
    try {
      const today = moment().format('YYYYMMDD');
      const lastBill = await this.db.get(
        'SELECT bill_number FROM bills WHERE bill_number LIKE ? ORDER BY id DESC LIMIT 1',
        [`VB${today}%`]
      );

      let sequence = 1;
      if (lastBill) {
        const lastSequence = parseInt(lastBill.bill_number.slice(-3));
        sequence = lastSequence + 1;
      }

      return `VB${today}${sequence.toString().padStart(3, '0')}`;
    } catch (error) {
      throw error;
    }
  }

  async createBill(billData) {
    try {
      // Calculate days and total amount
      const checkIn = moment(billData.check_in_date);
      const checkOut = moment(billData.check_out_date);
      const days = checkOut.diff(checkIn, 'days');
      const totalAmount = days * billData.price_per_day;

      const result = await this.db.run(
        `INSERT INTO bills (
          bill_number, room_id, customer_name, customer_phone, customer_address,
          check_in_date, check_out_date, days, price_per_day, total_amount, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          billData.bill_number,
          billData.room_id,
          billData.customer_name,
          billData.customer_phone,
          billData.customer_address,
          billData.check_in_date,
          billData.check_out_date,
          days,
          billData.price_per_day,
          totalAmount,
          billData.created_by
        ]
      );

      return { ...result, days, totalAmount };
    } catch (error) {
      throw error;
    }
  }

  async getAllBills() {
    try {
      return await this.db.all(
        `SELECT b.*, r.room_number, r.room_type, u.username as created_by_name
         FROM bills b
         JOIN rooms r ON b.room_id = r.id
         JOIN users u ON b.created_by = u.id
         ORDER BY b.created_at DESC`
      );
    } catch (error) {
      throw error;
    }
  }

  async getBillById(id) {
    try {
      return await this.db.get(
        `SELECT b.*, r.room_number, r.room_type, u.username as created_by_name
         FROM bills b
         JOIN rooms r ON b.room_id = r.id
         JOIN users u ON b.created_by = u.id
         WHERE b.id = ?`,
        [id]
      );
    } catch (error) {
      throw error;
    }
  }

  calculateDays(checkInDate, checkOutDate) {
    const checkIn = moment(checkInDate);
    const checkOut = moment(checkOutDate);
    return checkOut.diff(checkIn, 'days');
  }

  calculateTotal(days, pricePerDay) {
    return days * pricePerDay;
  }
}

module.exports = BillingService;