'use client'

import { useActionState } from 'react'
import { loginAction } from '@/actions/auth'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, { error: '' })

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-indigo-400">Admin Control Portal</h1>
          <p className="mt-2 text-sm text-slate-400">Authenticate to manage your portfolio</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="rounded-lg bg-red-950/50 border border-red-500/30 p-3 text-sm text-red-400">
              ⚠️ {state.error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 active:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
