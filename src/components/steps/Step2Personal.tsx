import React from 'react'
import type { FinancingData } from '../../types'
import { formatCPF, formatPhone, validateCPF, validateEmail, validateCompleteName, validateBrazilianPhone } from '../../utils/calculations'

interface Step2PersonalProps {
  data: FinancingData
  onUpdate: (data: Partial<FinancingData>) => void
  onNext: () => void
  onPrevious: () => void
}

const Step2Personal: React.FC<Step2PersonalProps> = ({ data, onUpdate, onNext, onPrevious }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) {
      onNext()
    }
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value)
    onUpdate({ cpf: formattedCPF })
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value)
    onUpdate({ phone: formattedPhone })
  }

  // Validation logic
  const isValidName = data.fullName ? validateCompleteName(data.fullName) : false
  const isValidCPF = data.cpf ? validateCPF(data.cpf) : false
  const isValidEmail = data.email ? validateEmail(data.email) : false
  const isValidPhone = data.phone ? validateBrazilianPhone(data.phone) : false
  
  const isValid = isValidName && isValidCPF && isValidEmail && isValidPhone

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Pessoais</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo *
          </label>
          <input
            type="text"
            inputMode="text"
            autoCapitalize="words"
            autoComplete="name"
            id="fullName"
            value={data.fullName || ''}
            onChange={(e) => onUpdate({ fullName: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              !isValidName && data.fullName ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[var(--color-green)]'
            }`}
            placeholder="Digite seu nome completo"
            required
          />
          {!isValidName && data.fullName && (
            <p className="mt-1 text-sm text-red-600">
              Digite nome e sobrenome (ex: João Silva)
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
            CPF *
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            id="cpf"
            value={data.cpf || ''}
            onChange={handleCPFChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              !isValidCPF && data.cpf ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[var(--color-green)]'
            }`}
            placeholder="000.000.000-00"
            maxLength={14}
            required
          />
          {!isValidCPF && data.cpf && (
            <p className="mt-1 text-sm text-red-600">CPF inválido</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-mail *
          </label>
          <input
            type="email"
            inputMode="email"
            autoCapitalize="none"
            autoComplete="email"
            id="email"
            value={data.email || ''}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              !isValidEmail && data.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[var(--color-green)]'
            }`}
            placeholder="seu@email.com"
            required
          />
          {!isValidEmail && data.email && (
            <p className="mt-1 text-sm text-red-600">E-mail inválido</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Telefone *
          </label>
          <input
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            id="phone"
            value={data.phone || ''}
            onChange={handlePhoneChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
              !isValidPhone && data.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-[var(--color-green)]'
            }`}
            placeholder="(11) 99999-9999"
            maxLength={15}
            required
          />
          {!isValidPhone && data.phone && (
            <p className="mt-1 text-sm text-red-600">
              Telefone inválido. Use formato brasileiro: (11) 99999-9999
            </p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 transition-colors"
          >
            Anterior
          </button>
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

export default Step2Personal