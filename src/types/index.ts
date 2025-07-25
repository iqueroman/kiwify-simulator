export interface FinancingData {
  // Step 1: Financial Information
  financedAmount: number
  downPayment: number
  interestRate: number
  termMonths: number
  
  // Step 2: Personal Information
  fullName: string
  cpf: string
  email: string
  phone: string
  
  // Calculated values
  monthlyPayment: number
  totalAmount: number
}

export interface FormStep {
  id: number
  title: string
  isCompleted: boolean
  isActive: boolean
}