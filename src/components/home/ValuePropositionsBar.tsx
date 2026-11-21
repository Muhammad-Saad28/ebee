import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
} from 'lucide-react'

export function ValuePropositionsBar() {
  const values = [
    {
      icon: Truck,
      title: 'Fast Nationwide Delivery',
      desc: 'Direct Express Dispatch Across Pakistan',
    },
    {
      icon: ShieldCheck,
      title: '100% Authentic Tech',
      desc: 'Verified Serial Numbers & Genuine Seals',
    },
    {
      icon: RotateCcw,
      title: '7-Day Easy Returns',
      desc: 'Zero Friction Instant Replacement',
    },
    {
      icon: Headphones,
      title: '24/7 Dedicated Support',
      desc: 'WhatsApp & Live Technical Hotline',
    },
  ]

  return (
    <section className="w-full bg-[#07090F] py-6 sm:py-8 border-y border-[rgba(187,216,255,0.12)] relative overflow-hidden select-none">
      {/* Background Gaussian ambient spotlights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-32 rounded-full bg-[#398BFF]/15 blur-[60px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-32 rounded-full bg-white/10 blur-[60px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {values.map((v, i) => {
            const Icon = v.icon
            return (
              <div
                key={i}
                className="group relative p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-[0_6px_16px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,1)_inset,0_3px_0_#CBD5E1] hover:shadow-[0_8px_20px_rgba(36,123,255,0.25),0_1px_0_rgba(255,255,255,1)_inset,0_4px_0_#247BFF] hover:border-[#247BFF]/40 hover:-translate-y-1 active:translate-y-0.5 active:shadow-[0_2px_4px_rgba(0,0,0,0.2),0_1px_0_#94A3B8] transition-all duration-300 cursor-pointer flex items-center gap-3.5 overflow-hidden"
              >
                {/* Diagonal Deep Blue Gaussian Blur Nodes matching Card Style */}
                <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-[#1e488f]/30 blur-[24px] pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-[#204d96]/35 blur-[28px] pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute inset-2 rounded-full bg-white/60 blur-[18px] pointer-events-none" />

                {/* 3D Elevated Icon Pod */}
                <div className="relative z-10 w-11 h-11 rounded-xl bg-gradient-to-b from-[#FFFFFF] to-[#EEF4FF] border border-[#BFDBFE] flex items-center justify-center text-[#247BFF] shrink-0 shadow-[0_2px_4px_rgba(36,123,255,0.12),0_1px_0_rgba(255,255,255,0.8)_inset,0_2px_0_#93C5FD] group-hover:scale-105 group-hover:bg-[#247BFF] group-hover:text-white group-hover:border-[#247BFF] group-hover:shadow-[0_4px_12px_rgba(36,123,255,0.4)] transition-all duration-200">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="relative z-10 flex-1 min-w-0">
                  <h4 className="font-headline text-xs sm:text-sm font-bold text-[#146BFF] group-hover:text-[#0052CC] transition-colors leading-snug">
                    {v.title}
                  </h4>
                  <p className="font-body text-[11px] sm:text-xs text-[#247BFF]/80 mt-0.5 leading-snug truncate font-medium">
                    {v.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
