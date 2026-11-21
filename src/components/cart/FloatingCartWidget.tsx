'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPKR } from '@/lib/utils'

export function FloatingCartWidget() {
  const { getTotalItems, getSubtotal, openCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const totalItems = getTotalItems()
  const subtotal = getSubtotal()

  if (totalItems === 0) return null

  return (
    <aside
      aria-label="Floating cart summary"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-[#0F172A]/95 hover:bg-[#1E293B] border border-blue-500/30 shadow-[0_12px_36px_rgba(0,0,0,0.65),0_0_20px_rgba(37,99,235,0.25)] backdrop-blur-xl transition-all hover:scale-[1.02]">
        
        {/* Cart Icon & Count Trigger */}
        <button
          onClick={openCart}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-white/[0.05] transition-colors"
          title="Open Cart Drawer"
        >
          <div className="relative w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shadow-md shadow-blue-600/50">
              {totalItems}
            </span>
          </div>

          <div className="hidden sm:block">
            <p className="text-[11px] font-semibold text-slate-300 leading-none">
              {totalItems} {totalItems === 1 ? 'Product' : 'Products'}
            </p>
            <p className="text-xs font-black text-white mt-1 leading-none font-mono">
              {formatPKR(subtotal)}
            </p>
          </div>
        </button>

        {/* View Cart / Checkout Action */}
        <div className="flex items-center gap-1.5 pl-1 border-l border-white/[0.1]">
          <Link
            href="/cart"
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all active:scale-95"
          >
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </aside>
  )
}
