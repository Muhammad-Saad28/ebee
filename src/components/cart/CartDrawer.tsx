'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPKR, calculateShipping } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = getSubtotal()
  const shippingFee = calculateShipping(subtotal)
  const total = subtotal + shippingFee
  const freeShippingThreshold = 2999
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#101725] border-l border-white/[0.08] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#3478F6]" />
              <h2 className="text-base font-bold text-[#F4F7FC]">Your Shopping Cart</h2>
              <span className="text-xs text-[#929EAF]">({items.length} items)</span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-[#929EAF] hover:text-[#F4F7FC] hover:bg-white/[0.06] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#080B12] px-5 py-3 border-b border-white/[0.06]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#929EAF] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#3478F6]" />
                {remainingForFree > 0 ? (
                  <>Add <strong className="text-[#A9D4FF]">{formatPKR(remainingForFree)}</strong> for Free Delivery</>
                ) : (
                  <span className="text-[#36C98F] font-semibold">You unlocked Free Delivery!</span>
                )}
              </span>
              <span className="font-mono text-[11px] text-[#A9D4FF]">{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3478F6] to-[#A9D4FF] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-white/[0.06]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#080B12] border border-white/[0.08] flex items-center justify-center text-[#929EAF]">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <div>
                  <p className="text-base font-semibold text-[#F4F7FC]">Your cart is empty</p>
                  <p className="text-xs text-[#929EAF] mt-1 max-w-xs">
                    Explore our electronics, gadgets, and everyday lifestyle essentials.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-full bg-[#3478F6] text-white text-xs font-semibold hover:bg-[#2563EB] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <div className="relative w-20 h-20 rounded-xl bg-[#080B12] border border-white/[0.06] overflow-hidden flex-shrink-0">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="text-xs font-medium text-[#F4F7FC] hover:text-[#3478F6] line-clamp-2 leading-snug transition-colors"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-[#929EAF] hover:text-red-400 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-[#929EAF] font-mono mt-0.5">SKU: {item.sku}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-white/[0.1] rounded-lg bg-[#080B12]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1.5 text-[#929EAF] hover:text-[#F4F7FC] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#F4F7FC] min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-1.5 text-[#929EAF] hover:text-[#F4F7FC] transition-colors disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="text-xs font-bold text-[#F4F7FC]">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 bg-[#080B12] border-t border-white/[0.08] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#929EAF]">
                  <span>Subtotal</span>
                  <span className="text-[#F4F7FC] font-medium">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#929EAF]">
                  <span>Estimated Delivery</span>
                  <span className={shippingFee === 0 ? 'text-[#36C98F] font-semibold' : 'text-[#F4F7FC] font-medium'}>
                    {shippingFee === 0 ? 'Free' : formatPKR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#F4F7FC] pt-2 border-t border-white/[0.06]">
                  <span>Total Amount</span>
                  <span className="text-[#3478F6]">{formatPKR(total)}</span>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="py-3 px-4 rounded-xl border border-white/[0.1] text-xs font-semibold text-center text-[#F4F7FC] hover:bg-white/[0.04] transition-colors"
                >
                  View Full Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="py-3 px-4 rounded-xl bg-[#3478F6] hover:bg-[#2563EB] text-xs font-semibold text-center text-white flex items-center justify-center gap-1.5 shadow-lg shadow-[#3478F6]/25 transition-all"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-[10px] text-center text-[#929EAF]">
                Cash on Delivery • Safe & Verified Checkout
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
