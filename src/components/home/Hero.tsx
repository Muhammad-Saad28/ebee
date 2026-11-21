'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Play,
} from 'lucide-react'
import { Product } from '@/types'

interface HeroProps {
  featuredProducts?: Product[]
}

export function Hero({ featuredProducts = [] }: HeroProps) {
  return (
    <section className="relative w-full overflow-hidden min-h-[580px] lg:min-h-[660px] flex items-center border-b border-[rgba(187,216,255,0.15)]">
      {/* Background Image: Lightened Blue /hero-bg-light.png with Luminous Cyan/Sky Blue Depth */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg-light.png"
          alt="Ebee Futuristic Marketplace Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.01]"
        />

        {/* Lighter, softer gradient overlays to let the blue shine through brightly */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090F]/85 via-[#07090F]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090F]/90 via-transparent to-[#07090F]/30" />

        {/* Lightened Electric Sky Blue & Ice Blue Radiant Bloom */}
        <div className="absolute top-1/4 right-1/4 w-[550px] h-[550px] rounded-full bg-[#398BFF]/25 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-[450px] h-[450px] rounded-full bg-[#afc6ff]/20 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-[#60a5fa]/20 blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 lg:py-24">
        <div className="max-w-2xl lg:max-w-3xl space-y-6 text-left">
          
          {/* Electric Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111827]/85 border border-[rgba(187,216,255,0.25)] backdrop-blur-xl shadow-[0_0_24px_rgba(36,123,255,0.35)] w-fit animate-in fade-in duration-500">
            <span className="w-2 h-2 rounded-full bg-[#247BFF] shadow-[0_0_8px_#398BFF] animate-pulse" />
            <span className="font-mono text-[11px] text-[#BBD8FF] uppercase tracking-wider font-semibold">
              EBEE ONLINE STORE
            </span>
            <span className="text-[#BBD8FF]/40 text-xs">/</span>
            <span className="font-mono text-[11px] text-[#afc6ff] uppercase tracking-wider font-semibold">
              FALL 2025 DROPS
            </span>
          </div>

          {/* Display Headline */}
          <div className="space-y-3">
            <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl text-white font-bold tracking-tight uppercase leading-[0.95] drop-shadow-lg">
              DISCOVER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#afc6ff] to-[#60a5fa]">
                WHAT&apos;S NEXT
              </span>
            </h1>
            <p className="font-body text-base sm:text-lg lg:text-xl text-[#d7e2ff] max-w-xl pt-1 leading-relaxed drop-shadow-md">
              Upgrade your everyday. Explore technology, lifestyle, automobile gear and everything in between.
            </p>
          </div>

          {/* Hero Metrics Micro-strip */}
          <div className="flex items-center gap-6 pt-2 text-white">
            <div>
              <p className="font-mono text-xs sm:text-sm text-[#60a5fa] font-bold">0.02ms</p>
              <p className="font-mono text-[11px] text-[#afc6ff]">Ultra-Low Latency</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="font-mono text-xs sm:text-sm text-[#afc6ff] font-bold">Hi-Res LDAC</p>
              <p className="font-mono text-[11px] text-[#afc6ff]">Lossless Certified</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="font-mono text-xs sm:text-sm text-[#BBD8FF] font-bold">54 Hours</p>
              <p className="font-mono text-[11px] text-[#afc6ff]">Active Playtime</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/shop"
              className="px-7 py-3.5 bg-[#247BFF] hover:bg-[#398BFF] text-white font-headline text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2.5 transition-all duration-300 shadow-[0_0_28px_rgba(36,123,255,0.6)] hover:shadow-[0_0_36px_rgba(57,139,255,0.85)] transform hover:-translate-y-0.5"
            >
              <span>Explore collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/shop?deals=true"
              className="px-6 py-3.5 bg-[#111827]/80 hover:bg-[#111827] border border-[rgba(187,216,255,0.25)] backdrop-blur-md text-[#BBD8FF] hover:text-white font-body text-xs sm:text-sm rounded-lg flex items-center gap-2.5 transition-all shadow-md"
            >
              <Play className="w-4 h-4 text-[#afc6ff] fill-current" />
              <span>Watch Keynote</span>
              <span className="font-mono text-[11px] text-[#afc6ff] ml-1">02:18</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}
