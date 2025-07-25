import React, { useRef, useState, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import type { FinancingData } from '../../types'
import { generatePDF } from '../../utils/pdfGenerator'
import { supabase } from '../../lib/supabase'

interface Step4SignatureProps {
  data: FinancingData
  onPrevious: () => void
  onComplete: () => void
}

const Step4Signature: React.FC<Step4SignatureProps> = ({ data, onPrevious, onComplete }) => {
  const signatureRef = useRef<SignatureCanvas>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 200 })

  // Update canvas size based on container
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const aspectRatio = 3 // width:height = 3:1
        const height = Math.max(150, Math.min(200, containerWidth / aspectRatio))
        const width = containerWidth
        
        setCanvasSize({ width, height })
        
        // Resize existing canvas if it exists
        if (signatureRef.current) {
          const canvas = signatureRef.current.getCanvas()
          const imageData = canvas.toDataURL()
          
          // Clear and resize
          signatureRef.current.clear()
          
          // If there was existing signature data, try to restore it
          if (imageData && imageData !== 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==') {
            const img = new Image()
            img.onload = () => {
              const ctx = canvas.getContext('2d')
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height)
              }
            }
            img.src = imageData
          }
        }
      }
    }

    // Initial size
    updateCanvasSize()

    // Update on resize
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

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
      
      // Generate PDF with signature
      const pdfBlob = await generatePDF(data, signatureData)
      
      // Upload PDF to Supabase
      const fileName = `financing_proposal_${Date.now()}.pdf`
      const { error: uploadError } = await supabase.storage
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

      // Download PDF for user - Mobile compatible
      const url = URL.createObjectURL(pdfBlob)
      const fileName = `Proposta_Financiamento_${data.fullName.replace(/\s+/g, '_')}.pdf`
      
      // Check if we're on mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        // Mobile: Open in new tab for download
        const newWindow = window.open()
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>${fileName}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
              </head>
              <body style="margin:0; padding:20px; font-family:Arial,sans-serif;">
                <div style="text-align:center;">
                  <h3>Seu PDF está pronto!</h3>
                  <p>Toque no botão abaixo para baixar:</p>
                  <a href="${url}" download="${fileName}" 
                     style="display:inline-block; padding:12px 24px; background:#10b981; color:white; text-decoration:none; border-radius:6px; margin:10px;">
                    📄 Baixar PDF
                  </a>
                  <br><br>
                  <small style="color:#666;">Se o download não funcionar, use o botão "Compartilhar" do seu navegador.</small>
                </div>
              </body>
            </html>
          `)
        } else {
          // Fallback: direct window.open
          window.open(url, '_blank')
        }
      } else {
        // Desktop: traditional download
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
      
      // Clean up after a delay to ensure download starts
      setTimeout(() => URL.revokeObjectURL(url), 5000)

      onComplete()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Assinatura Digital</h2>
      
      <div className="space-y-6">
        {/* PDF Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview da Proposta</h3>
          {data.pdfUrl ? (
            <div className="space-y-4">
              {/* Desktop iframe preview */}
              <div className="hidden md:block">
                <iframe
                  src={data.pdfUrl}
                  className="w-full h-96 border border-gray-300 rounded"
                  title="Preview da Proposta de Financiamento"
                />
              </div>
              
              {/* Mobile fallback with preview button */}
              <div className="md:hidden">
                <div className="w-full h-48 border border-gray-300 rounded flex flex-col items-center justify-center bg-gray-100 space-y-4">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 text-center text-sm">
                    Preview disponível após assinatura
                  </p>
                  <button
                    type="button"
                    onClick={() => window.open(data.pdfUrl, '_blank')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Visualizar PDF
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-48 md:h-96 border border-gray-300 rounded flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">PDF não disponível para preview</p>
            </div>
          )}
        </div>

        {/* Signature Area */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assinatura</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="relative" ref={containerRef}>
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  style: {
                    width: '100%',
                    height: `${canvasSize.height}px`,
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    touchAction: 'none',
                    display: 'block'
                  }
                }}
                backgroundColor="white"
                penColor="black"
                minWidth={window.innerWidth < 768 ? 2 : 1}
                maxWidth={window.innerWidth < 768 ? 4 : 3}
                velocityFilterWeight={0.7}
                throttle={16}
              />
            </div>
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={clearSignature}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Limpar Assinatura
              </button>
              <p className="text-xs text-gray-500">
                {window.innerWidth < 768 
                  ? 'Use o dedo para assinar. Mantenha o telefone estável.' 
                  : 'Assine com o mouse ou toque na tela'
                }
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">Erro</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
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
                : 'bg-[var(--color-green)] text-white hover:bg-[var(--color-green-light)]'
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