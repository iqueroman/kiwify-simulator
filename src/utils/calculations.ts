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
  return numericValue
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
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