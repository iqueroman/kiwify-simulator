import React from 'react'
import { FinancingData } from '../../types'
import { formatCurrency } from '../../utils/calculations'

interface Step1FinancialProps {
  data: FinancingData
  onUpdate: (data: Partial<FinancingData>) => void
  onNext: () => void
}

const Step1Financial: React.FC<Step1FinancialProps> = ({ data, onUpdate, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (data.financedAmount > 0 && data.downPayment >= 0 && data.termMonths > 0) {
      onNext()
    }
  }

  const isValid = data.financedAmount > 0 && data.downPayment >= 0 && data.termMonths > 0

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Financeiras</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="financedAmount" className="block text-sm font-medium text-gray-700 mb-2">
            Valor Financiado *
          </label>
          <input
            type="number"
            id="financedAmount"
            value={data.financedAmount || ''}
            onChange={(e) => onUpdate({ financedAmount: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            placeholder="Ex: 300000"
            step="1000"
            min="1"
            required
          />
          {data.financedAmount > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              {formatCurrency(data.financedAmount)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-2">
            Valor de Entrada
          </label>
          <input
            type="number"
            id="downPayment"
            value={data.downPayment || ''}
            onChange={(e) => onUpdate({ downPayment: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            placeholder="Ex: 50000"
            step="1000"
            min="0"
          />
          {data.downPayment > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              {formatCurrency(data.downPayment)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
            Taxa de Juros (Anual)
          </label>
          <input
            type="number"
            id="interestRate"
            value={12}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            step="0.01"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
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
                ? 'bg-green hover:bg-green-light' 
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