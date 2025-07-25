import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { formatCurrency } from '../utils/calculations'

interface FinancingProposal {
  id: string
  created_at: string
  financed_amount: number
  down_payment: number
  interest_rate: number
  term_months: number
  monthly_payment: number
  total_amount: number
  full_name: string
  cpf: string
  email: string
  phone: string
  signed_at: string | null
  pdf_url: string | null
  status: string
}

interface AdminPanelProps {
  onBackToSimulator: () => void
  onLogout?: () => void
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToSimulator, onLogout }) => {
  const [proposals, setProposals] = useState<FinancingProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('financing_proposals')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setProposals(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async (pdfUrl: string) => {
    try {
      // If it's a Supabase URL, get the signed URL
      if (pdfUrl.includes('supabase')) {
        const fileName = pdfUrl.split('/').pop()
        if (fileName) {
          const { data } = await supabase.storage
            .from('pdfs')
            .createSignedUrl(fileName, 60)
          
          if (data?.signedUrl) {
            window.open(data.signedUrl, '_blank')
            return
          }
        }
      }
      
      // For blob URLs or direct URLs, open directly
      window.open(pdfUrl, '_blank')
    } catch (err) {
      console.error('Erro ao abrir PDF:', err)
      alert('Erro ao abrir o PDF. Tente novamente.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
      signed: { label: 'Assinado', color: 'bg-green-100 text-green-800' },
      approved: { label: 'Aprovado', color: 'bg-blue-100 text-blue-800' },
      rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-app-bg)]">
      {/* Admin Topbar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="block sm:hidden">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center min-w-0 flex-1">
                <img
                  src="https://kiwify.com.br/.netlify/images?url=_astro%2Flogo.0cuMVBav.png"
                  alt="Kiwify"
                  className="h-6 w-auto flex-shrink-0"
                />
                <span className="ml-2 text-sm font-semibold text-gray-900 truncate">
                  Admin
                </span>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button 
                  onClick={onBackToSimulator}
                  className="bg-[var(--color-green)] text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-[var(--color-green-light)] transition-colors"
                >
                  Simulador
                </button>
                {onLogout && (
                  <button 
                    onClick={onLogout}
                    className="bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-gray-700 transition-colors"
                  >
                    Sair
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://kiwify.com.br/.netlify/images?url=_astro%2Flogo.0cuMVBav.png"
                alt="Kiwify"
                className="h-8 w-auto"
              />
              <span className="ml-3 text-lg font-semibold text-gray-900">
                Painel Administrativo
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={onBackToSimulator}
                className="bg-[var(--color-green)] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[var(--color-green-light)] transition-colors"
              >
                Simulador Financeiro
              </button>
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Sair
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-6 w-6 text-[var(--color-green)]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg text-gray-700">Carregando propostas...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Propostas de Financiamento</h1>
              <p className="mt-2 text-gray-600">
                Total de propostas: <span className="font-semibold text-[var(--color-green)]">{proposals.length}</span>
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Erro ao carregar dados</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {proposals.length === 0 && !error ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma proposta encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">Não há propostas de financiamento no sistema.</p>
              </div>
            ) : (
              /* Table */
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Financiamento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Parcela
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {proposals.map((proposal) => (
                        <tr key={proposal.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{proposal.full_name}</div>
                              <div className="text-sm text-gray-500">{proposal.cpf}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">{proposal.email}</div>
                              <div className="text-sm text-gray-500">{proposal.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{formatCurrency(proposal.financed_amount)}</div>
                              <div className="text-sm text-gray-500">Entrada: {formatCurrency(proposal.down_payment)}</div>
                              <div className="text-sm text-gray-500">{proposal.term_months} meses</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-[var(--color-green)]">
                              {formatCurrency(proposal.monthly_payment)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Total: {formatCurrency(proposal.total_amount)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(proposal.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">{formatDate(proposal.created_at)}</div>
                              {proposal.signed_at && (
                                <div className="text-sm text-gray-500">
                                  Assinado: {formatDate(proposal.signed_at)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {proposal.pdf_url ? (
                              <button
                                onClick={() => handleDownloadPDF(proposal.pdf_url!)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[var(--color-green)] rounded-md hover:bg-[var(--color-green-light)] transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                PDF
                              </button>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminPanel