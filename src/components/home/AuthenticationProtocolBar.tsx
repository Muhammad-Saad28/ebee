import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export function AuthenticationProtocolBar() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8 relative">
      <div className="relative overflow-hidden bg-white rounded-2xl p-6 sm:p-7 shadow-[0_12px_32px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,1)_inset,0_4px_0_#CBD5E1] flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200">
        
        {/* Diagonal Deep Blue Gaussian Blur Nodes matching Card Style */}
        <div className="absolute -top-16 -left-16 w-52 h-52 rounded-full bg-[#1e488f]/30 blur-[45px] pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full bg-[#204d96]/35 blur-[50px] pointer-events-none" />
        <div className="absolute inset-8 rounded-full bg-white/70 blur-[35px] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#247BFF] shadow-xs shrink-0">
            <ShieldCheck className="w-7 h-7 text-[#247BFF]" />
          </div>
          <div>
            <h4 className="font-headline text-base sm:text-lg font-bold text-[#146BFF]">
              Direct Cross-Border Authentication Protocol
            </h4>
            <p className="font-body text-xs sm:text-sm text-[#247BFF]/80 mt-0.5 font-medium">
              All shipments are sealed with cryptographic tamper-evident labels before clearing Karachi &amp; Lahore regional logistics hubs.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="font-mono text-[10px] text-[#247BFF]/70 block uppercase tracking-wider font-bold">
              CURRENT SYSTEM STATUS
            </span>
            <span className="font-mono text-xs text-[#0272e4] flex items-center gap-1.5 justify-end font-bold">
              <span className="w-2 h-2 rounded-full bg-[#0272e4] animate-ping" />
              99.98% Same-Day Dispatch
            </span>
          </div>

          <Link
            href="/shop"
            className="px-5 py-2.5 bg-[#247BFF] hover:bg-[#146BFF] text-white rounded-xl font-headline text-xs font-bold transition-all shadow-[0_2px_8px_rgba(36,123,255,0.35),0_2px_0_#0272e4] hover:scale-105"
          >
            Verify Tracker
          </Link>
        </div>

      </div>
    </section>
  )
}
