export const calculateMortgage = (
  principal: number,
  annualRate: number,
  termMonths: number
): { monthlyPayment: number; totalAmount: number } => {
  if (principal <= 0 || annualRate <= 0 || termMonths <= 0) {
    return { monthlyPayment: 0, totalAmount: 0 }
  }

  const monthlyRate = annualRate / 12
  const monthlyPayment = 
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  
  const totalAmount = monthlyPayment * termMonths
  
  return {
    monthlyPayment: Number(monthlyPayment.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2))
  }
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatCurrencyInput = (value: string): string => {
  // Remove all non-digits
  const numericValue = value.replace(/\D/g, '')
  
  if (!numericValue) return ''
  
  // Convert to number and divide by 100 to get decimal places
  const numberValue = parseInt(numericValue) / 100
  
  // Format as currency
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(numberValue)
}

export const parseCurrencyInput = (formattedValue: string): number => {
  // Remove currency symbols and spaces, keep only digits and decimal separator
  const numericString = formattedValue
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '') // Remove thousand separators
    .replace(',', '.') // Convert decimal separator
  
  const value = parseFloat(numericString)
  return isNaN(value) ? 0 : value
}

export const formatCPF = (value: string): string => {
  const numericValue = value.replace(/\D/g, '')
  return numericValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const formatPhone = (value: string): string => {
  const numericValue = value.replace(/\D/g, '')
  
  if (numericValue.length <= 2) {
    return numericValue
  } else if (numericValue.length <= 6) {
    return numericValue.replace(/(\d{2})(\d+)/, '($1) $2')
  } else if (numericValue.length <= 10) {
    return numericValue.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3')
  } else {
    // 11 digits - mobile format: (11) 99999-9999
    return numericValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
}

export const validateCPF = (cpf: string): boolean => {
  const numericCPF = cpf.replace(/\D/g, '')
  
  if (numericCPF.length !== 11) return false
  
  // Check for known invalid patterns
  if (/^(\d)\1{10}$/.test(numericCPF)) return false
  
  // Validate first check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numericCPF.charAt(i)) * (10 - i)
  }
  let checkDigit = 11 - (sum % 11)
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0
  if (checkDigit !== parseInt(numericCPF.charAt(9))) return false
  
  // Validate second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numericCPF.charAt(i)) * (11 - i)
  }
  checkDigit = 11 - (sum % 11)
  if (checkDigit === 10 || checkDigit === 11) checkDigit = 0
  if (checkDigit !== parseInt(numericCPF.charAt(10))) return false
  
  return true
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateCompleteName = (name: string): boolean => {
  if (!name || name.trim().length < 3) return false
  
  // Remove extra spaces and split by space
  const nameParts = name.trim().replace(/\s+/g, ' ').split(' ')
  
  // Must have at least 2 parts (first name + last name)
  if (nameParts.length < 2) return false
  
  // Each part must have at least 2 characters and contain only letters
  return nameParts.every(part => {
    return part.length >= 2 && /^[a-zA-ZÀ-ÿ]+$/.test(part)
  })
}

export const validateBrazilianPhone = (phone: string): boolean => {
  // Remove all non-digits
  const numericPhone = phone.replace(/\D/g, '')
  
  // Brazilian phone formats:
  // Mobile: 11 digits (2 digit area code + 9 + 8 digits)
  // Landline: 10 digits (2 digit area code + 8 digits)
  if (numericPhone.length !== 10 && numericPhone.length !== 11) {
    return false
  }
  
  // Check if area code is valid (11-99)
  const areaCode = numericPhone.substring(0, 2)
  const areaCodeNum = parseInt(areaCode)
  if (areaCodeNum < 11 || areaCodeNum > 99) {
    return false
  }
  
  // For mobile numbers (11 digits), the third digit must be 9
  if (numericPhone.length === 11) {
    if (numericPhone[2] !== '9') {
      return false
    }
  }
  
  return true
}