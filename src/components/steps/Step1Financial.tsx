import React, { useState, useEffect } from 'react'
import type { FinancingData } from '../../types'
import { formatCurrencyInput, parseCurrencyInput, formatCurrency } from '../../utils/calculations'

interface Step1FinancialProps {
  data: FinancingData
  onUpdate: (data: Partial<FinancingData>) => void
  onNext: () => void
}

const Step1Financial: React.FC<Step1FinancialProps> = ({ data, onUpdate, onNext }) => {
  const [financedAmountInput, setFinancedAmountInput] = useState('')
  const [downPaymentInput, setDownPaymentInput] = useState('')

  // Initialize input fields with formatted values when data changes
  useEffect(() => {
    if (data.financedAmount > 0) {
      setFinancedAmountInput(formatCurrencyInput((data.financedAmount * 100).toString()))
    }
  }, [data.financedAmount])

  useEffect(() => {
    if (data.downPayment > 0) {
      setDownPaymentInput(formatCurrencyInput((data.downPayment * 100).toString()))
    }
  }, [data.downPayment])

  const handleFinancedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value)
    setFinancedAmountInput(formatted)
    const numericValue = parseCurrencyInput(formatted)
    onUpdate({ financedAmount: numericValue })
  }

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value)
    setDownPaymentInput(formatted)
    const numericValue = parseCurrencyInput(formatted)
    onUpdate({ downPayment: numericValue })
  }

  // Validation logic
  const minimumDownPayment = data.financedAmount * 0.2
  const isDownPaymentValid = data.financedAmount > 0 ? 
    (data.downPayment >= minimumDownPayment) : true
  const downPaymentPercentage = data.financedAmount > 0 ? (data.downPayment / data.financedAmount) * 100 : 0

  const isValid = data.financedAmount > 0 && 
                  data.downPayment > 0 && 
                  isDownPaymentValid && 
                  data.termMonths > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext()
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Financeiras</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="financedAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Valor Financiado *
          </label>
          <input
            type="text"
            inputMode="numeric"
            id="financedAmount"
            value={financedAmountInput}
            onChange={handleFinancedAmountChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-green)] focus:border-transparent"
            placeholder="R$ 0,00"
            required
          />
        </div>

        <div>
          <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-2">
            Valor de Entrada *
          </label>
          <input
            type="text"
            inputMode="numeric"
            id="downPayment"
            value={downPaymentInput}
            onChange={handleDownPaymentChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              !isDownPaymentValid && data.financedAmount > 0 && data.downPayment > 0
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-[var(--color-green)]'
            }`}
            placeholder="R$ 0,00"
            required
          />
          
          {/* Informational note */}
          <p className="mt-1 text-sm text-gray-600">
            Valor de entrada: mínimo 20% do valor financiado
            {data.financedAmount > 0 && (
              <span className="block">
                (Mínimo: {formatCurrency(minimumDownPayment)})
              </span>
            )}
          </p>
          
          {/* Current percentage display */}
          {data.financedAmount > 0 && data.downPayment > 0 && (
            <p className={`mt-1 text-sm ${
              isDownPaymentValid ? 'text-[var(--color-green)]' : 'text-red-600'
            }`}>
              Entrada atual: {downPaymentPercentage.toFixed(1)}% do valor financiado
            </p>
          )}
          
          {/* Validation error messages */}
          {!isDownPaymentValid && data.financedAmount > 0 && data.downPayment > 0 && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              ⚠️ Valor de entrada deve ser pelo menos 20% do valor financiado ({formatCurrency(minimumDownPayment)})
            </p>
          )}
        </div>

        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
            Taxa de Juros (Anual) *
          </label>
          <input
            type="text"
            id="interestRate"
            value="12%"
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
          />
          <p className="mt-1 text-sm text-gray-600">Taxa fixa de 12% ao ano</p>
        </div>

        <div>
          <label htmlFor="termMonths" className="block text-sm font-medium text-gray-700 mb-2">
            Prazo (meses) *
          </label>
          <select
            id="termMonths"
            value={data.termMonths || ''}
            onChange={(e) => onUpdate({ termMonths: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-green)] focus:border-transparent"
            required
          >
            <option value="">Selecione o prazo</option>
            <option value="120">10 anos (120 meses)</option>
            <option value="180">15 anos (180 meses)</option>
            <option value="240">20 anos (240 meses)</option>
            <option value="300">25 anos (300 meses)</option>
            <option value="360">30 anos (360 meses)</option>
          </select>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={!isValid}
            className={`
              px-6 py-2 rounded-md text-white font-medium transition-colors
              ${isValid 
                ? 'bg-[var(--color-green)] hover:bg-[var(--color-green-light)]' 
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            Próximo
          </button>
        </div>
      </form>
    </div>
  )
}

export default Step1Financial