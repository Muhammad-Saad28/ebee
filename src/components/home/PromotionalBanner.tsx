'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, Check } from 'lucide-react'

export function PromotionalBanner() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('OBSIDIAN25')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="relative overflow-hidden rounded-xl bg-[#247BFF] p-6 lg:p-10 shadow-[0_12px_36px_rgba(36,123,255,0.38)]">
        {/* Graphic overlay circles */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-[#00275f]/25 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-white">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#07090F] px-3 py-1 rounded text-white font-mono text-[11px] uppercase tracking-wider font-semibold">
              <span className="text-[#afc6ff] font-bold">LIMITED TIME</span>
              <span className="text-[#8c90a0]">•</span>
              <span>HARDWARE SYNDICATE</span>
            </div>
            <h3 className="font-headline text-2xl sm:text-3xl lg:text-4xl text-white font-bold uppercase tracking-tight leading-tight pt-1">
              UPGRADE YOUR RIG — GET 25% OFF WIRELESS SOUND &amp; SMART GEAR
            </h3>
            <p className="font-body text-sm sm:text-base text-white/90">
              Unlock certified flagship grade hardware. Automatic express courier routing directly to Karachi, Lahore, Islamabad, and across Pakistan.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <div className="bg-[#07090F] px-4 py-2.5 rounded-lg flex items-center gap-4 shadow-inner border border-[rgba(187,216,255,0.15)]">
              <div>
                <span className="font-mono text-[9px] text-[#afc6ff] block uppercase tracking-wider">
                  Voucher Code
                </span>
                <span className="font-mono text-sm text-white tracking-widest font-bold">
                  OBSIDIAN25
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-[#247BFF] hover:bg-[#398BFF] text-white font-mono text-[10px] rounded transition-colors font-bold flex items-center gap-1"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" /> COPIED
                  </>
                ) : (
                  'COPY'
                )}
              </button>
            </div>

            <Link
              href="/shop?deals=true"
              className="px-6 py-3 bg-[#07090F] hover:bg-black text-white font-headline text-xs font-bold uppercase tracking-wider rounded transition-all shadow-lg flex items-center gap-2"
            >
              <span>Redeem Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
