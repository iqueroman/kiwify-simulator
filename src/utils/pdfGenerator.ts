import jsPDF from 'jspdf'
import { FinancingData } from '../types'
import { formatCurrency } from './calculations'

export const generatePDF = async (data: FinancingData, signatureData: string): Promise<Blob> => {
  const pdf = new jsPDF()
  
  // Set font
  pdf.setFont('helvetica')
  
  // Header
  pdf.setFontSize(20)
  pdf.setFont('helvetica', 'bold')
  pdf.text('PROPOSTA DE FINANCIAMENTO IMOBILIÁRIO', 105, 30, { align: 'center' })
  
  // Logo placeholder (you can add actual logo here)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Kiwify Simulador Imobiliário', 105, 40, { align: 'center' })
  
  // Line separator
  pdf.line(20, 50, 190, 50)
  
  // Personal Information
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DADOS DO PROPONENTE', 20, 65)
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Nome: ${data.fullName}`, 20, 75)
  pdf.text(`CPF: ${data.cpf}`, 20, 85)
  pdf.text(`E-mail: ${data.email}`, 20, 95)
  pdf.text(`Telefone: ${data.phone}`, 20, 105)
  
  // Financial Information
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('DADOS FINANCEIROS', 20, 125)
  
  const totalPropertyValue = data.financedAmount + data.downPayment
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Valor Total do Imóvel: ${formatCurrency(totalPropertyValue)}`, 20, 135)
  pdf.text(`Valor de Entrada: ${formatCurrency(data.downPayment)}`, 20, 145)
  pdf.text(`Valor Financiado: ${formatCurrency(data.financedAmount)}`, 20, 155)
  pdf.text(`Taxa de Juros: 12% ao ano`, 20, 165)
  pdf.text(`Prazo: ${data.termMonths} meses`, 20, 175)
  pdf.text(`Valor da Parcela: ${formatCurrency(data.monthlyPayment)}`, 20, 185)
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text(`VALOR TOTAL A PAGAR: ${formatCurrency(data.totalAmount)}`, 20, 200)
  
  // Terms and conditions
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('TERMOS E CONDIÇÕES', 20, 220)
  
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'normal')
  const terms = [
    'Esta proposta de financiamento está sujeita à análise de crédito e aprovação pela instituição financeira.',
    'As condições apresentadas podem sofrer alterações mediante análise documental.',
    'O proponente declara estar ciente das condições apresentadas e concorda com os termos desta proposta.',
    'A assinatura digital equivale à assinatura física para todos os efeitos legais.',
  ]
  
  let yPosition = 230
  terms.forEach(term => {
    const lines = pdf.splitTextToSize(term, 170)
    pdf.text(lines, 20, yPosition)
    yPosition += lines.length * 4
  })
  
  // Date and signature area
  const currentDate = new Date().toLocaleDateString('pt-BR')
  pdf.text(`Data: ${currentDate}`, 20, yPosition + 10)
  
  // Add signature image
  if (signatureData) {
    pdf.text('Assinatura:', 20, yPosition + 25)
    try {
      pdf.addImage(signatureData, 'PNG', 20, yPosition + 30, 60, 20)
    } catch (error) {
      console.error('Error adding signature to PDF:', error)
      pdf.text('(Assinatura digital aplicada)', 20, yPosition + 35)
    }
  }
  
  // Footer
  pdf.setFontSize(8)
  pdf.text('Documento gerado automaticamente pelo Kiwify Simulador Imobiliário', 105, 280, { align: 'center' })
  
  // Return PDF as blob
  return pdf.output('blob')
}