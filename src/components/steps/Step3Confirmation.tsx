import React from 'react'
import { FinancingData } from '../../types'
import { formatCurrency } from '../../utils/calculations'

interface Step3ConfirmationProps {
  data: FinancingData
  onNext: () => void
  onPrevious: () => void
}

const Step3Confirmation: React.FC<Step3ConfirmationProps> = ({ data, onNext, onPrevious }) => {
  const totalPropertyValue = data.financedAmount + data.downPayment

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirmação dos Dados</h2>
      
      <div className="space-y-6">
        {/* Financial Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Valor Total do Imóvel</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalPropertyValue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Valor de Entrada</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(data.downPayment)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Valor Financiado</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(data.financedAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taxa de Juros</p>
              <p className="text-lg font-semibold text-gray-900">12% ao ano</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Prazo</p>
              <p className="text-lg font-semibold text-gray-900">{data.termMonths} meses</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Valor da Parcela</p>
              <p className="text-lg font-semibold text-green">{formatCurrency(data.monthlyPayment)}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Valor Total a Pagar</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(data.totalAmount)}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome Completo</p>
              <p className="text-lg font-semibold text-gray-900">{data.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">CPF</p>
              <p className="text-lg font-semibold text-gray-900">{data.cpf}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">E-mail</p>
              <p className="text-lg font-semibold text-gray-900">{data.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telefone</p>
              <p className="text-lg font-semibold text-gray-900">{data.phone}</p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Importante
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Ao aceitar esta proposta, você estará concordando com os termos e condições do financiamento imobiliário. 
                  Certifique-se de que todas as informações estão corretas antes de prosseguir.
                </p>
              </div>
            </div>
          </div>
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
            type="button"
            onClick={onNext}
            className="px-8 py-3 bg-green text-white rounded-md font-semibold text-lg hover:bg-green-light transition-colors"
          >
            Aceitar Proposta
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step3Confirmation