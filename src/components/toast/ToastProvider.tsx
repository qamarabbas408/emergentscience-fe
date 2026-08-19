import { useMemo, type ReactNode } from 'react'
import { toast as toastFn, dismissToast } from './toast-store'
import { ToastContext, type ToastApi } from './toast-context'
import { ToastViewport } from './ToastViewport'

export function ToastProvider({ children }: { children: ReactNode }) {
  const api = useMemo<ToastApi>(
    () => ({
      success: (message, options) => toastFn.success(message, options),
      error: (message, options) => toastFn.error(message, options),
      warning: (message, options) => toastFn.warning(message, options),
      info: (message, options) => toastFn.info(message, options),
      dismiss: dismissToast,
    }),
    [],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  )
}