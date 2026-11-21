'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  ArrowRight,
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full bg-[#0c0e14] pt-16 pb-12 text-[#c2c6d7] border-t border-[rgba(187,216,255,0.12)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo Row */}
        <div className="mb-10 pb-8 border-b border-[rgba(187,216,255,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link href="/" className="inline-block group">
            <div className="relative h-12 px-3.5 rounded-2xl bg-white p-1.5 border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,1)_inset,0_3px_0_#CBD5E1] hover:shadow-[0_12px_28px_rgba(36,123,255,0.35),0_0_20px_rgba(36,123,255,0.25),0_3px_0_#247BFF] hover:border-[#247BFF]/60 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-all duration-300">
              {/* Gaussian Blur Glow System matching Product Cards */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
                <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-[#1e488f]/35 blur-[16px] group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-[#204d96]/40 blur-[18px] group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute inset-1 rounded-xl bg-white/75 blur-[10px]" />
              </div>
              <div className="relative h-8 w-24 sm:w-28 z-10 flex items-center justify-center">
                <Image
                  src="/logo-cropped.png"
                  alt="EBEE.PK Official Logo"
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </div>
            </div>
          </Link>
          <p className="text-xs font-mono text-[#8c90a0] max-w-sm">
            Pakistan&apos;s verified technical hardware &amp; premium lifestyle marketplace.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Categories */}
          <div>
            <h4 className="font-headline text-base text-white font-semibold mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 font-body text-xs sm:text-sm">
              <li>
                <Link href="/shop?category=audio" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Wireless Audio
                </Link>
              </li>
              <li>
                <Link href="/shop?category=wearables" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Smart Watches
                </Link>
              </li>
              <li>
                <Link href="/shop?category=automobiles" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Automobile Gear
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cameras" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Security Vision &amp; Cameras
                </Link>
              </li>
              <li>
                <Link href="/shop?category=phones-and-accessories" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Mobile Tech &amp; Chargers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-headline text-base text-white font-semibold mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 font-body text-xs sm:text-sm">
              <li>
                <Link href="/account" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Shipping &amp; Express
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  30-Day Guarantee
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Warranty Hub
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Help Center &amp; WhatsApp
                </Link>
              </li>
            </ul>
          </div>

          {/* About Ebee.pk */}
          <div>
            <h4 className="font-headline text-base text-white font-semibold mb-4">
              About Ebee.pk
            </h4>
            <ul className="space-y-2.5 font-body text-xs sm:text-sm">
              <li>
                <Link href="/about" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Our Vision
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  100% Authentic Guarantee
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Corporate &amp; Enterprise
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Press &amp; Media
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#c2c6d7] hover:text-[#afc6ff] transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Dispatches & Payment Network */}
          <div className="lg:col-span-2">
            <h4 className="font-headline text-base text-white font-semibold mb-2">
              Tech Dispatches
            </h4>
            <p className="font-body text-xs sm:text-sm text-[#c2c6d7] mb-4">
              Subscribe to unlock early-access drops, private hardware flash sales, and cross-border firmware briefings.
            </p>

            <div className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-[#1d1f26] border border-[#414754]/40 px-3.5 py-2 rounded text-xs sm:text-sm font-body text-white placeholder:text-[#8c90a0] focus:outline-none focus:border-[#247BFF]"
              />
              <button className="bg-[#0272e4] hover:bg-[#247BFF] text-white px-4 py-2 rounded font-headline text-xs font-semibold transition-all shadow-[0_0_12px_rgba(2,114,228,0.4)]">
                Join
              </button>
            </div>

            <div>
              <span className="font-mono text-[10px] text-[#8c90a0] block mb-2 uppercase tracking-wider">
                Verified Payment Network in Pakistan
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Easypaisa', 'JazzCash', 'Visa 3D Secure', 'Mastercard', 'Cash on Delivery (COD)'].map((method, i) => (
                  <span
                    key={i}
                    className="bg-[#1d1f26] border border-[#414754]/30 px-2.5 py-1 rounded font-mono text-[10px] text-[#e1e2eb]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Legal / Copyright Row */}
        <div className="pt-6 border-t border-[rgba(187,216,255,0.08)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#8c90a0]">
          <p>© 2025 Ebee.pk. Next-Gen Cross-Border Technical Luxury Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Protocol</Link>
            <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-white transition-colors">Security Specs</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
