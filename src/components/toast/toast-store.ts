import { useSyncExternalStore } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface Toast {
  id: number
  type: ToastType
  message: string
  duration: number
  action?: ToastAction
}

export interface ToastOptions {
  duration?: number
  action?: ToastAction
}

type Listener = () => void

const DEFAULT_DURATION = 4000
const ERROR_DURATION = 8000

const timers = new Map<number, ReturnType<typeof setTimeout>>()

let toasts: Toast[] = []
let nextId = 1

const listeners = new Set<Listener>()

function emit() {
  for (const listener of listeners) listener()
}

export function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getToasts() {
  return toasts
}

function clearTimer(id: number) {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

function scheduleDismiss(id: number, duration: number) {
  clearTimer(id)
  const timer = setTimeout(() => dismissToast(id), duration)
  timers.set(id, timer)
}

export function dismissToast(id: number) {
  clearTimer(id)
  toasts = toasts.filter((toast) => toast.id !== id)
  emit()
}

export function addToast(
  type: ToastType,
  message: string,
  options: ToastOptions = {},
): number {
  const id = nextId++
  const duration = options.duration ?? (type === 'error' ? ERROR_DURATION : DEFAULT_DURATION)
  const toast: Toast = { id, type, message, duration, action: options.action }

  toasts = [...toasts.slice(-3), toast]
  emit()
  scheduleDismiss(id, duration)
  return id
}

export function pauseTimer(id: number) {
  clearTimer(id)
}

export function resumeTimer(id: number, duration: number) {
  scheduleDismiss(id, duration)
}

export function toast(message: string, options?: ToastOptions) {
  return addToast('info', message, options)
}

toast.success = (message: string, options?: ToastOptions) =>
  addToast('success', message, options)
toast.error = (message: string, options?: ToastOptions) =>
  addToast('error', message, options)
toast.warning = (message: string, options?: ToastOptions) =>
  addToast('warning', message, options)
toast.info = (message: string, options?: ToastOptions) =>
  addToast('info', message, options)

export function useToasts() {
  return useSyncExternalStore(subscribe, getToasts)
}