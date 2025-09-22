// Mock billing service for offline functionality
class BillingService {
  getStoredBills() {
    const bills = localStorage.getItem('vila-pos-bills-data')
    return bills ? JSON.parse(bills) : []
  }

  saveBills(bills) {
    localStorage.setItem('vila-pos-bills-data', JSON.stringify(bills))
  }

  generateBillNumber() {
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
    const bills = this.getStoredBills()
    const todayBills = bills.filter(bill => 
      bill.bill_number.startsWith(`VB${dateStr}`)
    )
    const sequence = todayBills.length + 1
    return `VB${dateStr}${sequence.toString().padStart(3, '0')}`
  }

  async getAllBills() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bills = this.getStoredBills()
        resolve(bills)
      }, 500)
    })
  }

  async createBill(billData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bills = this.getStoredBills()
        const newId = Math.max(...bills.map(b => b.id), 0) + 1
        
        // Calculate days and total
        const checkIn = new Date(billData.check_in_date)
        const checkOut = new Date(billData.check_out_date)
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
        const totalAmount = days * billData.price_per_day

        const newBill = {
          ...billData,
          id: newId,
          bill_number: billData.bill_number || this.generateBillNumber(),
          days,
          total_amount: totalAmount,
          created_at: new Date().toISOString()
        }

        bills.push(newBill)
        this.saveBills(bills)
        resolve(newBill)
      }, 500)
    })
  }

  async deleteBill(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bills = this.getStoredBills()
        const filteredBills = bills.filter(b => b.id !== id)
        this.saveBills(filteredBills)
        resolve()
      }, 500)
    })
  }

  async getBillById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bills = this.getStoredBills()
        const bill = bills.find(b => b.id === id)
        resolve(bill)
      }, 300)
    })
  }
}

export const billingService = new BillingService()