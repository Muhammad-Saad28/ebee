'use client'

import { useActionState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import { adminLoginAction, AdminLoginState } from '../actions'

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<AdminLoginState, FormData>(
    adminLoginAction,
    {}
  )

  return (
    <div className="w-full max-w-md mx-auto relative z-10">
      {/* 3D Glassmorphic Container */}
      <div className="rounded-3xl bg-[#101725]/90 border border-white/[0.12] p-8 sm:p-10 shadow-[0_24px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(36,123,255,0.15)] backdrop-blur-xl space-y-6">
        
        {/* Branding & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#247BFF]/15 border border-[#247BFF]/30 text-[#247BFF] mb-2 shadow-[0_0_20px_rgba(36,123,255,0.35)]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="block font-mono text-[11px] font-bold text-[#398BFF] uppercase tracking-widest">
            Control Center
          </span>
          <h1 className="text-2xl font-black text-[#F4F7FC]">Admin Authentication</h1>
          <p className="text-xs text-[#929EAF]">
            Enter your administrative credentials to manage Ebee catalog and orders.
          </p>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Login Form */}
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A9D4FF]" htmlFor="email">
              Admin Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="ebee.pk@gmail.com"
                placeholder="ebee.pk@gmail.com"
                className="w-full bg-[#080B12] border border-white/[0.12] rounded-xl pl-10 pr-4 py-3 text-sm text-[#F4F7FC] placeholder-[#929EAF]/40 outline-none focus:border-[#247BFF] focus:ring-1 focus:ring-[#247BFF] transition-all"
              />
              <Mail className="w-4 h-4 text-[#929EAF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#A9D4FF]" htmlFor="password">
              Admin Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-[#080B12] border border-white/[0.12] rounded-xl pl-10 pr-4 py-3 text-sm text-[#F4F7FC] placeholder-[#929EAF]/40 outline-none focus:border-[#247BFF] focus:ring-1 focus:ring-[#247BFF] transition-all"
              />
              <Lock className="w-4 h-4 text-[#929EAF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#247BFF] hover:bg-[#398BFF] disabled:opacity-50 text-white font-bold text-sm tracking-wide shadow-[0_0_24px_rgba(36,123,255,0.5)] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Verifying Credentials...
              </span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Back to store */}
        <div className="pt-2 text-center border-t border-white/[0.06]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#929EAF] hover:text-[#F4F7FC] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Store
          </Link>
        </div>
      </div>
    </div>
  )
}
