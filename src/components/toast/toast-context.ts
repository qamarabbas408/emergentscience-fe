import { createContext, useContext } from 'react'
import type { ToastOptions } from './toast-store'

export interface ToastApi {
  success: (message: string, options?: ToastOptions) => number
  error: (message: string, options?: ToastOptions) => number
  warning: (message: string, options?: ToastOptions) => number
  info: (message: string, options?: ToastOptions) => number
  dismiss: (id: number) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}