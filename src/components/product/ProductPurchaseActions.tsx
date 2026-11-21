'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Minus, ShoppingBag, Zap, Heart, Check } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

interface ProductPurchaseActionsProps {
  product: Product
}

export function ProductPurchaseActions({ product }: ProductPurchaseActionsProps) {
  const router = useRouter()
  const { addItem, openCart } = useCartStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()

  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const isFavorited = isInWishlist(product.id)

  const handleAddToCart = () => {
    addItem(product, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
    openCart()
  }

  const handleBuyNow = () => {
    addItem(product, quantity)
    router.push('/checkout')
  }

  return (
    <div className="space-y-4 pt-2">
      
      {/* Quantity Selector & Wishlist */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-white/[0.1] rounded-2xl bg-[#101725] p-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 text-[#929EAF] hover:text-[#F4F7FC] transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-4 text-sm font-bold text-[#F4F7FC] min-w-[32px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock_quantity || 10, quantity + 1))}
            className="p-2 text-[#929EAF] hover:text-[#F4F7FC] transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => toggleWishlist(product)}
          className={`flex-1 py-3 px-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            isFavorited
              ? 'bg-[#3478F6]/10 border-[#3478F6] text-[#A9D4FF]'
              : 'border-white/[0.08] bg-[#101725] text-[#929EAF] hover:text-[#F4F7FC]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#3478F6] text-[#3478F6]' : ''}`} />
          {isFavorited ? 'Saved to Wishlist' : 'Add to Wishlist'}
        </button>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleAddToCart}
          className={`py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
            isAdded
              ? 'bg-[#36C98F] text-[#080B12]'
              : 'bg-[#101725] hover:bg-white/[0.06] border border-white/[0.1] text-[#F4F7FC]'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-[#3478F6]" /> Add to Cart
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          className="py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider bg-[#3478F6] hover:bg-[#2563EB] text-white flex items-center justify-center gap-2 shadow-xl shadow-[#3478F6]/25 transition-all"
        >
          <Zap className="w-4 h-4 fill-white" /> Buy Now (Cash on Delivery)
        </button>
      </div>

    </div>
  )
}
