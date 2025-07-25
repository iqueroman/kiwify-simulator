import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      financing_proposals: {
        Row: {
          id: string
          created_at: string
          updated_at: string
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
          signature_data: string | null
          pdf_url: string | null
          status: 'pending' | 'signed' | 'approved' | 'rejected'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
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
          signed_at?: string | null
          signature_data?: string | null
          pdf_url?: string | null
          status?: 'pending' | 'signed' | 'approved' | 'rejected'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          financed_amount?: number
          down_payment?: number
          interest_rate?: number
          term_months?: number
          monthly_payment?: number
          total_amount?: number
          full_name?: string
          cpf?: string
          email?: string
          phone?: string
          signed_at?: string | null
          signature_data?: string | null
          pdf_url?: string | null
          status?: 'pending' | 'signed' | 'approved' | 'rejected'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}