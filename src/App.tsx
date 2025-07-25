import { useState, useEffect } from 'react'
import Topbar from './components/Topbar'
import AdminPanel from './components/AdminPanel'
import LoginScreen from './components/LoginScreen'
import ProgressBar from './components/ProgressBar'
import Step1Financial from './components/steps/Step1Financial'
import Step2Personal from './components/steps/Step2Personal'
import Step3Confirmation from './components/steps/Step3Confirmation'
import Step4Signature from './components/steps/Step4Signature'
import type { FinancingData, FormStep } from './types'
import { calculateMortgage } from './utils/calculations'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isCompleted, setIsCompleted] = useState(false)
  const [currentView, setCurrentView] = useState<'simulator' | 'admin' | 'login'>('simulator')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [data, setData] = useState<FinancingData>({
    financedAmount: 0,
    downPayment: 0,
    interestRate: 0.12,
    termMonths: 0,
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    monthlyPayment: 0,
    totalAmount: 0
  })

  const steps: FormStep[] = [
    { id: 1, title: 'Dados Financeiros', isCompleted: currentStep > 1, isActive: currentStep === 1 },
    { id: 2, title: 'Dados Pessoais', isCompleted: currentStep > 2, isActive: currentStep === 2 },
    { id: 3, title: 'Confirmação', isCompleted: currentStep > 3, isActive: currentStep === 3 },
    { id: 4, title: 'Assinatura', isCompleted: isCompleted, isActive: currentStep === 4 }
  ]

  const updateData = (newData: Partial<FinancingData>) => {
    setData(prev => ({ ...prev, ...newData }))
  }

  // Recalculate mortgage when financial data changes
  useEffect(() => {
    if (data.financedAmount > 0 && data.termMonths > 0) {
      const { monthlyPayment, totalAmount } = calculateMortgage(
        data.financedAmount,
        data.interestRate,
        data.termMonths
      )
      setData(prev => ({ ...prev, monthlyPayment, totalAmount }))
    }
  }, [data.financedAmount, data.termMonths, data.interestRate])

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const completeProcess = () => {
    setIsCompleted(true)
  }

  const showAdminPanel = () => {
    if (isAuthenticated) {
      setCurrentView('admin')
    } else {
      setCurrentView('login')
    }
  }

  const showSimulator = () => {
    setCurrentView('simulator')
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
    setCurrentView('admin')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentView('simulator')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Financial
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
          />
        )
      case 2:
        return (
          <Step2Personal
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        )
      case 3:
        return (
          <Step3Confirmation
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        )
      case 4:
        return (
          <Step4Signature
            data={data}
            onPrevious={previousStep}
            onComplete={completeProcess}
          />
        )
      default:
        return null
    }
  }

  // Show Login Screen
  if (currentView === 'login') {
    return <LoginScreen onLogin={handleLogin} />
  }

  // Show Admin Panel
  if (currentView === 'admin') {
    return <AdminPanel onBackToSimulator={showSimulator} onLogout={handleLogout} />
  }

  // Show Completion Screen
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[var(--color-app-bg)]">
        <Topbar onAdminClick={showAdminPanel} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-[var(--color-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Proposta Assinada com Sucesso!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Sua proposta de financiamento foi processada e salva em nosso sistema. 
              O PDF assinado foi baixado automaticamente para seu computador.
            </p>
            <p className="text-sm text-gray-500">
              Em breve entraremos em contato para dar continuidade ao processo.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-[var(--color-green)] text-white rounded-md font-medium hover:bg-[var(--color-green-light)] transition-colors"
            >
              Nova Simulação
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show Simulator
  return (
    <div className="min-h-screen bg-app-bg">
      <Topbar onAdminClick={showAdminPanel} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProgressBar steps={steps} />
        {renderStep()}
      </div>
    </div>
  )
}

export default App