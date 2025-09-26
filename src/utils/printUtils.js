import { formatCurrency } from './currency'
import { formatDisplayDate } from './dateHelpers'

export const generateBillHTML = (bill) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Bill ${bill.bill_number}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            background: white !important;
            color: #1e293b !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            font-size: 14px;
          }
          
          .print-container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            box-sizing: border-box;
          }
          
          .print-header {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%) !important;
            color: white !important;
            padding: 30px 25px !important;
            text-align: center !important;
            position: relative;
            overflow: hidden;
            border-radius: 15px;
            margin-bottom: 25px;
          }
          
          .print-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          }
          
          .print-logo {
            width: 70px !important;
            height: 70px !important;
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%) !important;
            border-radius: 20px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin-bottom: 20px !important;
            box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4) !important;
            position: relative;
            z-index: 2;
          }
          
          .print-logo::after {
            content: '🏨';
            font-size: 28px;
            color: white;
          }
          
          .print-title {
            font-size: 32px !important;
            font-weight: 800 !important;
            margin: 0 0 10px 0 !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
            position: relative;
            z-index: 2;
          }
          
          .print-subtitle {
            font-size: 18px !important;
            font-weight: 600 !important;
            opacity: 0.9 !important;
            margin: 0 0 10px 0 !important;
            position: relative;
            z-index: 2;
          }
          
          .bill-number {
            font-size: 14px !important;
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            margin-top: 10px;
            position: relative;
            z-index: 2;
          }
          
          .print-content {
            padding: 0 !important;
          }
          
          .print-section {
            margin-bottom: 25px !important;
            padding: 25px !important;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
            border-radius: 15px !important;
            border-left: 5px solid #1e40af !important;
            position: relative;
            overflow: hidden;
          }
          
          .print-section::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(30, 64, 175, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(30px, -30px);
          }
          
          .print-section h3 {
            color: #1e40af !important;
            font-size: 20px !important;
            font-weight: 700 !important;
            margin: 0 0 20px 0 !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            position: relative;
            z-index: 2;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            position: relative;
            z-index: 2;
          }
          
          .info-item {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          
          .info-label {
            font-size: 13px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .info-value {
            font-size: 15px;
            font-weight: 700;
            color: #1e293b;
          }
          
          .print-table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 20px 0 !important;
            background: white !important;
            border-radius: 15px !important;
            overflow: hidden !important;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
          }
          
          .print-table th {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%) !important;
            color: white !important;
            padding: 15px 12px !important;
            text-align: left !important;
            font-weight: 700 !important;
            font-size: 14px !important;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .print-table td {
            padding: 12px !important;
            border-bottom: 1px solid #e2e8f0 !important;
            font-size: 14px !important;
            color: #334155 !important;
            font-weight: 500;
          }
          
          .print-table tr:nth-child(even) td {
            background: #f8fafc !important;
          }
          
          .print-total {
            background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%) !important;
            color: white !important;
            padding: 25px !important;
            border-radius: 20px !important;
            text-align: center !important;
            margin: 25px 0 !important;
            box-shadow: 0 12px 30px rgba(30, 64, 175, 0.4) !important;
            position: relative;
            overflow: hidden;
          }
          
          .print-total::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
          }
          
          .total-label {
            font-size: 16px !important;
            font-weight: 600 !important;
            margin-bottom: 10px !important;
            position: relative;
            z-index: 2;
          }
          
          .total-amount {
            font-size: 32px !important;
            font-weight: 900 !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
            position: relative;
            z-index: 2;
          }
          
          .print-footer {
            text-align: center !important;
            margin-top: 30px !important;
            padding: 25px !important;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%) !important;
            border-radius: 15px !important;
            border: 2px dashed #1e40af !important;
            position: relative;
          }
          
          .print-footer p {
            color: #1e40af !important;
            font-weight: 700 !important;
            font-size: 16px !important;
            margin: 0 !important;
          }
          
          .print-date {
            position: absolute;
            top: 20px;
            right: 30px;
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 12px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 600;
            z-index: 2;
          }
          
          @media print {
            body { 
              margin: 0 !important; 
              padding: 0 !important;
            }
            .print-container { 
              box-shadow: none !important;
              padding: 15mm;
            }
            @page {
              size: A4;
              margin: 10mm;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-header">
            <div class="print-date">${formatDisplayDate(new Date())}</div>
            <div class="print-logo"></div>
            <h1 class="print-title">Moon Light Villa</h1>
            <h2 class="print-subtitle">Smart Villa Experience</h2>
            <div class="bill-number">Bill #${bill.bill_number}</div>
          </div>
          
          <div class="print-content">
            <div class="print-section">
              <h3>👤 Customer Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Customer Name</span>
                  <span class="info-value">${bill.customer_name}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone Number</span>
                  <span class="info-value">${bill.customer_phone || 'Not provided'}</span>
                </div>
                <div class="info-item" style="grid-column: 1 / -1;">
                  <span class="info-label">Address</span>
                  <span class="info-value">${bill.customer_address || 'Not provided'}</span>
                </div>
              </div>
            </div>
            
            <div class="print-section">
              <h3>🏨 Booking Details</h3>
              <table class="print-table">
                <thead>
                  <tr>
                    <th>🚪 Room</th>
                    <th>📅 Check-in</th>
                    <th>📅 Check-out</th>
                    <th>⏰ Days</th>
                    <th>💰 Rate/Day</th>
                    <th>🧮 Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>${bill.room_number || 'N/A'}</strong><br><small>${bill.room_type === 'ac' ? 'AC Room' : 'Non-AC Room'}</small></td>
                    <td>${formatDisplayDate(bill.check_in_date)}</td>
                    <td>${formatDisplayDate(bill.check_out_date)}</td>
                    <td><strong>${bill.days}</strong></td>
                    <td><strong>${formatCurrency(bill.price_per_day)}</strong></td>
                    <td><strong>${formatCurrency(bill.total_amount)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="print-total">
              <div class="total-label">Total Amount</div>
              <div class="total-amount">${formatCurrency(bill.total_amount)}</div>
            </div>
            
            <div class="print-footer">
              <p>Thank you for choosing Moon Light Villa!</p>
              <p style="font-size: 14px; margin-top: 10px; font-weight: 500;">We appreciate your business and hope you enjoyed your stay.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

export const printBill = (bill) => {
  // Use browser printing for web application
  return printBillInBrowser(bill)
}

export const printBillInBrowser = (bill) => {
  return new Promise((resolve, reject) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    
    if (!printWindow) {
      reject(new Error('Please allow popups to print bills'))
      return
    }

    const htmlContent = generateBillHTML(bill)
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        
        printWindow.onafterprint = () => {
          printWindow.close()
          resolve({ success: true })
        }
        
        // Fallback: close window after 5 seconds if onafterprint doesn't fire
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close()
            resolve({ success: true })
          }
        }, 5000)
      }, 500)
    }
    
    printWindow.onerror = (error) => {
      printWindow.close()
      reject(new Error('Failed to print bill: ' + error))
    }
  })
}