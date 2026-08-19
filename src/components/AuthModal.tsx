import { useEffect, useState } from 'react'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLogin, useRegister, authKeys } from '../api/hooks'
import { useToast } from './toast'
import { Spinner } from './Spinner'
import type { LoginRequest, RegisterRequest } from '../api/auth'
import type { UserResource } from '../lib/apiClient'

type Mode = 'signin' | 'register' | 'sso'

const BENEFITS = [
  {
    icon: 'emerald',
    title: 'ORCID Auto-Attribution',
    desc: 'Syncs papers to Loop/ORCID',
  },
  {
    icon: 'blue',
    title: 'Interactive Review Forum',
    desc: 'Direct author–editor chat',
  },
  {
    icon: 'purple',
    title: 'Institutional APC Coverage',
    desc: 'Auto-waiver validation',
  },
]

const SSO_UNIVERSITIES = ['ETH Zürich', 'EPFL', 'Harvard', 'MIT', 'Oxford', 'Cambridge']

function getApiError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const detail = err.response?.data
    if (detail && typeof detail === 'object') {
      const body = detail as Record<string, unknown>
      if (typeof body.message === 'string') return body.message
      if (typeof body.detail === 'string') return body.detail
      if (Array.isArray(body.detail)) {
        return body.detail.map((e) => (e as { msg?: string }).msg ?? 'Invalid input').join(', ')
      }
      if (body.errors && typeof body.errors === 'object') {
        const messages = Object.values(body.errors as Record<string, unknown>).flat()
        if (messages.length) return messages.join(', ')
      }
    }
  }
  return 'Something went wrong. Please try again.'
}

function useDemoSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => Promise.resolve(),
    onSuccess: () => {
      const demo: UserResource = {
        id: 999,
        name: 'Demo Scholar',
        email: 'demo@emergentscience.org',
        status: 'active',
        created_at: new Date().toISOString(),
      }
      queryClient.setQueryData(authKeys.me, demo)
    },
  })
}

interface AuthModalProps {
  onClose: () => void
  onAuthenticated: (user: UserResource) => void
}

export function AuthModal({ onClose, onAuthenticated }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('signin')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl md:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT: Brand canvas */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 text-white md:col-span-5 md:p-10">
          <p className="text-2xl font-black tracking-tight">
            EmergentSci<span className="text-red-600">.</span>
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-200">
            <ShieldIcon />
            Single Sign-On for Science
          </div>

          <h2 className="mt-5 text-2xl font-bold leading-snug">
            One Unified Account
            <br />
            for Open Science
          </h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-slate-300">
            Access collaborative peer review forums, track submissions, and claim verified ORCID
            credits.
          </p>

          <div className="mt-8 space-y-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="flex items-start gap-3">
                <CheckBadgeIcon color={benefit.icon} />
                <div>
                  <p className="text-sm font-bold">{benefit.title}</p>
                  <p className="text-xs font-light text-slate-400">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 border-t border-white/10 pt-4 text-[11px] font-medium tracking-wide text-slate-400">
            COPE Member & DOAJ Indexed • Basel, Switzerland
          </p>
        </div>

        {/* RIGHT: Auth controller */}
        <div className="flex flex-col p-8 md:col-span-7 md:p-10">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900 md:right-6 md:top-6"
            aria-label="Close"
          >
            <XIcon />
          </button>

          {/* Mode tabs */}
          <div className="flex gap-6 border-b border-slate-200 pr-12">
            {(
              [
                ['signin', 'Sign In'],
                ['register', 'Register Account'],
                ['sso', 'Institutional SSO'],
              ] as [Mode, string][]
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`-mb-px border-b-2 pb-3 text-sm font-bold transition-colors ${
                  mode === key
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex-1">
            {mode === 'signin' && <SignInForm onAuthenticated={onAuthenticated} />}
            {mode === 'register' && <RegisterForm onAuthenticated={onAuthenticated} />}
            {mode === 'sso' && <SsoForm onAuthenticated={onAuthenticated} />}
          </div>
        </div>
      </div>
    </div>
  )
}

function SignInForm({ onAuthenticated }: { onAuthenticated: (user: UserResource) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()
  const toast = useToast()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await login.mutateAsync({ email, password } as LoginRequest)
      toast.success('Welcome back! You are signed in.')
      onAuthenticated(res.data)
    } catch (err) {
      toast.error(getApiError(err))
    }
  }

  return (
    <>
      <button
        disabled={login.isPending}
        onClick={() => {
          login.mutate(
            { email: 'orcid.demo@emergentscience.org', password: 'orcid-demo' } as LoginRequest,
            {
              onSuccess: (res) => {
                toast.success('Welcome back! You are signed in.')
                onAuthenticated(res.data)
              },
              onError: (err) => toast.error(getApiError(err)),
            },
          )
        }}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-emerald-600/30 bg-emerald-50 py-2.5 text-sm font-bold text-emerald-900 transition-colors hover:bg-emerald-100"
      >
        <OrcidBadge />
        Sign in with ORCID
      </button>

      <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        or with email
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <Field icon="mail" label="Institutional or Academic Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="researcher@university.edu"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            required
          />
        </Field>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-red-600">
              Forgot password?
            </a>
          </div>
          <Field icon="lock">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••••••"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              required
            />
            <ShowPasswordButton show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 accent-red-600" />
          Keep me signed in for 30 days
        </label>

        <button
          type="submit"
          disabled={login.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {login.isPending ? (
            <>
              <Spinner className="text-white" />
              Signing in…
            </>
          ) : (
            'Sign In to EmergentSci.'
          )}
        </button>
      </form>

      <QuickDemo onAuthenticated={onAuthenticated} />
    </>
  )
}

function RegisterForm({ onAuthenticated }: { onAuthenticated: (user: UserResource) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const register = useRegister()
  const toast = useToast()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== passwordConfirmation) {
      toast.error('Passwords do not match.')
      return
    }
    try {
      const res = await register.mutateAsync({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      } as RegisterRequest)
      toast.success('Account created. Welcome to EmergentSci!')
      onAuthenticated(res.data)
    } catch (err) {
      toast.error(getApiError(err))
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field icon="user" label="Full Name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Dr. Jane Smith"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </Field>
      <Field icon="mail" label="Academic Email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="name@university.edu"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field icon="lock" label="Password">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="••••••••"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <ShowPasswordButton show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
        </Field>
        <Field icon="lock" label="Confirm Password">
          <input
            type={showConfirmation ? 'text' : 'password'}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            minLength={8}
            placeholder="••••••••"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <ShowPasswordButton
            show={showConfirmation}
            onToggle={() => setShowConfirmation(!showConfirmation)}
          />
        </Field>
      </div>
      <button
        type="submit"
        disabled={register.isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {register.isPending ? (
          <>
            <Spinner className="text-white" />
            Creating account…
          </>
        ) : (
          'Create Account'
        )}
      </button>
      <QuickDemo onAuthenticated={onAuthenticated} />
    </form>
  )
}

function SsoForm({ onAuthenticated }: { onAuthenticated: (user: UserResource) => void }) {
  return (
    <>
      <p className="mb-4 text-sm font-medium text-slate-600">
        Select your institution to sign in via federated Shibboleth / eduGAIN. Institutional APC
        waivers are applied automatically.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {SSO_UNIVERSITIES.map((uni) => (
          <button
            key={uni}
            disabled
            title="Coming soon"
            className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-bold text-slate-400"
          >
            <BuildingIcon />
            {uni}
            <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              Soon
            </span>
          </button>
        ))}
      </div>
      <QuickDemo onAuthenticated={onAuthenticated} />
    </>
  )
}

function QuickDemo({ onAuthenticated }: { onAuthenticated: (user: UserResource) => void }) {
  const demo = useDemoSignIn()
  const toast = useToast()
  const presets = [
    { role: 'Author', affiliation: 'EPFL' },
    { role: 'Reviewer', affiliation: 'Cambridge' },
    { role: 'Editor', affiliation: 'Tokyo Tech' },
  ]
  return (
    <div className="mt-6 border-t border-slate-100 pt-4">
      <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Quick demo sign-in
      </p>
      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.role}
            onClick={() =>
              demo.mutate(undefined, {
                onSuccess: () => {
                  toast.success('Signed in as Demo Scholar.')
                  onAuthenticated(getDemoUser())
                },
              })
            }
            className="rounded-lg border border-slate-200 px-2 py-2 text-center text-[11px] font-semibold text-slate-700 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            {preset.role}
            <span className="block text-[10px] font-normal text-slate-400">{preset.affiliation}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function getDemoUser(): UserResource {
  return {
    id: 999,
    name: 'Demo Scholar',
    email: 'demo@emergentscience.org',
    status: 'active',
    created_at: new Date().toISOString(),
  }
}

function ShowPasswordButton({
  show,
  onToggle,
}: {
  show: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
      aria-label={show ? 'Hide password' : 'Show password'}
      aria-pressed={show}
    >
      {show ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  )
}

function Field({
  icon,
  label,
  children,
}: {
  icon: string
  label?: string
  children: React.ReactNode
}) {
  return (
    <div>
      {label && <label className="mb-1 block text-xs font-bold text-slate-700">{label}</label>}
      <div
        className={`flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition-colors focus-within:border-red-600 ${
          icon === 'orcid' ? 'bg-emerald-50' : ''
        }`}
      >
        <FieldIcon name={icon} />
        {children}
      </div>
    </div>
  )
}

function FieldIcon({ name }: { name: string }) {
  const cls = 'h-4 w-4 shrink-0 text-slate-400'
  switch (name) {
    case 'mail':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 6L2 7" />
        </svg>
      )
    case 'lock':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    case 'user':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      )
    case 'orcid':
      return <OrcidBadge small />
    default:
      return null
  }
}

function ShieldIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2 3 6v6c0 5.5 3.8 9.7 9 10 5.2-.3 9-4.5 9-10V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function CheckBadgeIcon({ color }: { color: string }) {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-500/15 text-emerald-400',
    blue: 'bg-sky-500/15 text-sky-400',
    purple: 'bg-purple-500/15 text-purple-400',
  }
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${map[color]}`}>
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  )
}

function OrcidBadge({ small }: { small?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#A6CE39] font-black text-white ${small ? 'h-4 w-4 text-[9px]' : 'h-6 w-6 text-xs'}`}
    >
      iD
    </span>
  )
}

function BuildingIcon() {
  return (
    <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="m1 1 22 22M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}