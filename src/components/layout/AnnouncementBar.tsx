import Link from 'next/link'
import { Zap, Sparkles } from 'lucide-react'

export function AnnouncementBar() {
  return (
    <aside aria-label="Announcement" className="relative z-50 bg-[#11131a] text-[#c2c6d7] overflow-hidden border-b border-[#414754]/30 py-2 select-none">
      <div className="flex w-full overflow-hidden">
        {/* Animated Marquee with Obsidian Electric Styling */}
        <div className="animate-marquee-ltr flex items-center shrink-0 whitespace-nowrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-4 font-mono text-[11px] uppercase tracking-wider text-[#d7e2ff]">
              <span className="inline-flex items-center gap-1.5 font-bold text-white">
                <Zap className="w-3.5 h-3.5 text-[#afc6ff] fill-current" />
                FLASH TECH WEEK — UP TO 45% OFF NEXT-GEN GEAR
              </span>
              <span className="text-[#8c90a0]">•</span>
              <span className="text-[#c2c6d7]">
                FREE EXPRESS SHIPPING ON ALL ORDERS OVER PKR 5,000
              </span>
              <Link
                href="/shop"
                className="text-[10px] font-bold text-[#00275f] bg-[#afc6ff] hover:bg-white px-2.5 py-0.5 rounded transition-colors uppercase tracking-wider shadow-sm font-sans"
              >
                Claim Deal
              </Link>
              <span className="text-[#414754]">•</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
