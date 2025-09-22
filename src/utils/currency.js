// Sri Lankan currency utilities
export const CURRENCY = {
  code: 'LKR',
  symbol: 'Rs.',
  name: 'Sri Lankan Rupee'
}

export const formatCurrency = (amount, options = {}) => {
  const {
    showSymbol = true,
    showCode = false,
    decimals = 2,
    locale = 'en-LK'
  } = options

  const formattedAmount = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(amount) || 0)

  let result = formattedAmount
  
  if (showSymbol) {
    result = `${CURRENCY.symbol} ${result}`
  }
  
  if (showCode) {
    result = `${result} ${CURRENCY.code}`
  }

  return result
}

export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0
  
  // Remove currency symbols and parse as float
  const cleanString = currencyString
    .replace(/Rs\.|LKR/g, '')
    .replace(/,/g, '')
    .trim()
  
  return parseFloat(cleanString) || 0
}

export const validateCurrencyInput = (value) => {
  const numValue = parseFloat(value)
  return !isNaN(numValue) && numValue >= 0
}