'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Lock
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPKR, calculateShipping } from '@/lib/utils'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = getSubtotal()
  const shippingFee = calculateShipping(subtotal)
  const finalTotal = Math.max(0, subtotal - discountAmount) + shippingFee
  const freeShippingThreshold = 2000
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal)
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    const code = couponInput.trim().toUpperCase()
    if (code === 'EBEE10') {
      const discount = Math.round(subtotal * 0.1)
      setDiscountAmount(discount)
      setAppliedCoupon(code)
    } else if (code === 'WELCOME500' && subtotal >= 3000) {
      setDiscountAmount(500)
      setAppliedCoupon(code)
    } else {
      alert('Invalid coupon code or minimum order amount not met.')
    }
  }

  return (
    <div className="min-h-screen bg-[#080B11] py-8 sm:py-12 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
              <ShoppingBag className="w-4 h-4" />
              <span>Review Order Items</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Guaranteed Authentic Products • Cash on Delivery</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-[#0D1322] border border-white/[0.08] p-12 text-center space-y-5 max-w-xl mx-auto shadow-2xl">
            <div className="w-20 h-20 rounded-2xl bg-blue-950/40 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
              <ShoppingBag className="w-10 h-10 opacity-70" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Your Cart is Currently Empty</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                Explore our electronics, cameras, auto accessories, smart watches, and everyday tech essentials.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
              >
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Free Delivery Incentive Bar */}
              <div className="p-4 rounded-2xl bg-[#0F172A] border border-blue-500/20 shadow-sm">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-300 font-medium flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    {remainingForFree > 0 ? (
                      <>
                        Add <strong className="text-white font-bold">{formatPKR(remainingForFree)}</strong> more to unlock <span className="text-blue-400 font-bold">Free Nationwide Delivery</span>
                      </>
                    ) : (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircleIcon className="w-4 h-4" /> Congratulations! You unlocked Free Nationwide Delivery
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs font-bold text-blue-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Table Card */}
              <div className="rounded-3xl bg-[#0D1322] border border-white/[0.08] divide-y divide-white/[0.06] overflow-hidden shadow-xl">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                    
                    {/* Item Details */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-20 h-20 rounded-2xl bg-[#080B11] border border-white/[0.08] overflow-hidden flex-shrink-0">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-sm font-bold text-white hover:text-blue-400 line-clamp-1 transition-colors leading-snug"
                        >
                          {item.title}
                        </Link>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">SKU: {item.sku}</p>
                        <p className="text-xs font-bold text-blue-400 mt-1 sm:hidden">
                          {formatPKR(item.price)} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-5">
                      <div className="flex items-center border border-white/[0.1] rounded-xl bg-[#080B11]">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 text-slate-400 hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-white min-w-[28px] text-center font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="p-2 text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <span className="text-sm font-black text-white font-mono block">
                          {formatPKR(item.price * item.quantity)}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden sm:block">
                          {formatPKR(item.price)} ea
                        </span>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Action Buttons below Items */}
              <div className="flex justify-between items-center px-2 pt-2">
                <Link
                  href="/shop"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Clear Shopping Cart
                </button>
              </div>

              {/* Trust Features Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <div className="p-3.5 rounded-2xl bg-[#0D1322] border border-white/[0.06] flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">2 to 4 Days Delivery</p>
                    <p className="text-[10px] text-slate-400">TCS / Trax / Leopards</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0D1322] border border-white/[0.06] flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">Cash on Delivery</p>
                    <p className="text-[10px] text-slate-400">Pay when order arrives</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0D1322] border border-white/[0.06] flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">7-Day Easy Check</p>
                    <p className="text-[10px] text-slate-400">Direct replacement guarantee</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary & Checkout Trigger */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* Coupon Box */}
              <div className="rounded-3xl bg-[#0D1322] border border-white/[0.08] p-5 shadow-lg">
                <label className="text-xs font-bold text-white block mb-2 uppercase tracking-wide">
                  Discount Code / Voucher
                </label>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. EBEE10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-[#080B11] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white uppercase outline-none focus:border-blue-500 font-mono tracking-wider"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
                    ✓ Voucher {appliedCoupon} applied successfully!
                  </p>
                )}
              </div>

              {/* Order Summary Card */}
              <div className="rounded-3xl bg-[#0D1322] border border-white/[0.08] p-6 space-y-4 shadow-xl">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span>Order Summary</span>
                  <span className="text-slate-400 font-mono font-normal">COD Checkout</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Cart Subtotal</span>
                    <span className="text-white font-bold font-mono">{formatPKR(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount Coupon</span>
                      <span className="font-bold font-mono">-{formatPKR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>Nationwide Express Shipping</span>
                    <span className={shippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white font-bold font-mono'}>
                      {shippingFee === 0 ? 'FREE' : formatPKR(shippingFee)}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-black text-white pt-4 border-t border-white/[0.08]">
                    <span>Estimated Total</span>
                    <span className="text-blue-400 font-mono text-lg">{formatPKR(finalTotal)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/checkout"
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Lock className="w-4 h-4" /> Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 space-y-1.5 text-center">
                  <p className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> No prepayment required • Cash on Delivery
                  </p>
                  <p>Next step: Enter phone, shipping address & receive order on WhatsApp.</p>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}
