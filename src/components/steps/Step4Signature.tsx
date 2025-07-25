import React, { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { FinancingData } from '../../types'
import { formatCurrency } from '../../utils/calculations'
import { generatePDF } from '../../utils/pdfGenerator'
import { supabase } from '../../lib/supabase'

interface Step4SignatureProps {
  data: FinancingData
  onPrevious: () => void
  onComplete: () => void
}

const Step4Signature: React.FC<Step4SignatureProps> = ({ data, onPrevious, onComplete }) => {
  const signatureRef = useRef<SignatureCanvas>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearSignature = () => {
    signatureRef.current?.clear()
  }

  const handleSubmit = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      setError('Por favor, assine o documento antes de continuar.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get signature data
      const signatureData = signatureRef.current.toDataURL()
      
      // Generate PDF
      const pdfBlob = await generatePDF(data, signatureData)
      
      // Upload PDF to Supabase
      const fileName = `financing_proposal_${Date.now()}.pdf`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(fileName, pdfBlob)

      if (uploadError) {
        throw new Error('Erro ao fazer upload do PDF: ' + uploadError.message)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pdfs')
        .getPublicUrl(fileName)

      // Save proposal to database
      const { error: dbError } = await supabase
        .from('financing_proposals')
        .insert({
          financed_amount: data.financedAmount,
          down_payment: data.downPayment,
          interest_rate: 0.12,
          term_months: data.termMonths,
          monthly_payment: data.monthlyPayment,
          total_amount: data.totalAmount,
          full_name: data.fullName,
          cpf: data.cpf,
          email: data.email,
          phone: data.phone,
          signed_at: new Date().toISOString(),
          signature_data: signatureData,
          pdf_url: urlData.publicUrl,
          status: 'signed'
        })

      if (dbError) {
        throw new Error('Erro ao salvar proposta: ' + dbError.message)
      }

      // Download PDF for user
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Proposta_Financiamento_${data.fullName.replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      onComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }

  const totalPropertyValue = data.financedAmount + data.downPayment

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Assinatura Digital</h2>
      
      <div className="space-y-6">
        {/* PDF Preview */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-center mb-6">PROPOSTA DE FINANCIAMENTO IMOBILIÁRIO</h3>
          
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Proponente:</strong> {data.fullName}
              </div>
              <div>
                <strong>CPF:</strong> {data.cpf}
              </div>
              <div>
                <strong>E-mail:</strong> {data.email}
              </div>
              <div>
                <strong>Telefone:</strong> {data.phone}
              </div>
            </div>
            
            <hr className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Valor Total do Imóvel:</strong> {formatCurrency(totalPropertyValue)}
              </div>
              <div>
                <strong>Valor de Entrada:</strong> {formatCurrency(data.downPayment)}
              </div>
              <div>
                <strong>Valor Financiado:</strong> {formatCurrency(data.financedAmount)}
              </div>
              <div>
                <strong>Taxa de Juros:</strong> 12% ao ano
              </div>
              <div>
                <strong>Prazo:</strong> {data.termMonths} meses
              </div>
              <div>
                <strong>Valor da Parcela:</strong> {formatCurrency(data.monthlyPayment)}
              </div>
            </div>
            
            <hr className="my-4" />
            
            <div className="text-center">
              <strong>VALOR TOTAL A PAGAR: {formatCurrency(data.totalAmount)}</strong>
            </div>
            
            <div className="mt-6 text-xs text-gray-600">
              <p>Esta proposta de financiamento está sujeita à análise de crédito e aprovação pela instituição financeira.</p>
              <p>As condições apresentadas podem sofrer alterações mediante análise documental.</p>
              <p>Data: {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assinatura</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                width: 500,
                height: 200,
                className: 'w-full h-48 border border-gray-200 rounded'
              }}
            />
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={clearSignature}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Limpar Assinatura
              </button>
              <p className="text-xs text-gray-500">Assine com o mouse ou toque na tela</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-400 transition-colors disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`
              px-8 py-3 rounded-md font-semibold text-lg transition-colors
              ${isLoading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-green text-white hover:bg-green-light'
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : (
              'Assinar Digitalmente'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step4Signature