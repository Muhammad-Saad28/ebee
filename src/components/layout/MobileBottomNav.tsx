'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { toggleCart, getTotalItems } = useCartStore()
  const { getTotalItems: getWishlistTotal } = useWishlistStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const cartCount = mounted ? getTotalItems() : 0
  const wishlistCount = mounted ? getWishlistTotal() : 0

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080B12]/95 backdrop-blur-xl border-t border-white/[0.08] md:hidden">
      <div className="grid grid-cols-5 h-16 items-center">
        
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
            pathname === '/' ? 'text-[#3478F6]' : 'text-[#929EAF]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
            pathname.startsWith('/shop') ? 'text-[#3478F6]' : 'text-[#929EAF]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Catalog</span>
        </Link>

        <Link
          href="/account/wishlist"
          className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
            pathname.startsWith('/account/wishlist') ? 'text-[#3478F6]' : 'text-[#929EAF]'
          }`}
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute top-1 right-5 w-4 h-4 rounded-full bg-[#3478F6] text-[9px] font-bold text-white flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span>Saved</span>
        </Link>

        <button
          onClick={toggleCart}
          className="relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-[#929EAF] transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-5 w-4 h-4 rounded-full bg-[#3478F6] text-[9px] font-bold text-white flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span>Cart</span>
        </button>

        <Link
          href="/account"
          className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
            pathname.startsWith('/account') ? 'text-[#3478F6]' : 'text-[#929EAF]'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Account</span>
        </Link>

      </div>
    </nav>
  )
}
