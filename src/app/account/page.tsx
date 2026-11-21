'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Heart, User, MapPin, ExternalLink, ShieldCheck } from 'lucide-react'
import { Order, WishlistItem } from '@/types'
import { formatPKR } from '@/lib/utils'
import { useWishlistStore } from '@/store/wishlistStore'

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const { items: wishlistItems } = useWishlistStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const localOrders: Order[] = JSON.parse(localStorage.getItem('ebee-orders') || '[]')
    setOrders(localOrders)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#080B12] py-8 sm:py-12 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-[#3478F6] uppercase tracking-widest">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FC] mt-1">
              My Account & Order History
            </h1>
          </div>

          <Link
            href="/admin"
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#101725] border border-white/[0.08] text-xs font-semibold text-[#A9D4FF] hover:border-[#3478F6] transition-colors"
          >
            Admin Dashboard <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Account Hub Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card & Quick Stats */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-[#101725] border border-white/[0.08] p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#3478F6]/10 border border-[#3478F6]/30 flex items-center justify-center text-[#3478F6]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F4F7FC]">Valued Customer</h3>
                  <p className="text-xs text-[#929EAF]">Pakistan (Doorstep COD)</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-[#080B12] border border-white/[0.06]">
                  <p className="text-xl font-bold text-[#3478F6]">{orders.length}</p>
                  <p className="text-[11px] text-[#929EAF]">Total Orders</p>
                </div>
                <div className="p-3 rounded-2xl bg-[#080B12] border border-white/[0.06]">
                  <p className="text-xl font-bold text-[#A9D4FF]">{wishlistItems.length}</p>
                  <p className="text-[11px] text-[#929EAF]">Saved Items</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-3xl bg-[#101725] border border-white/[0.08] p-4 divide-y divide-white/[0.06] text-xs">
              <Link
                href="/account/wishlist"
                className="flex items-center justify-between p-3 text-[#F4F7FC] hover:text-[#3478F6] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#3478F6]" /> My Saved Wishlist
                </span>
                <span className="text-[#929EAF]">({wishlistItems.length})</span>
              </Link>
              <div className="flex items-center justify-between p-3 text-[#929EAF]">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#36C98F]" /> Verified COD Status
                </span>
                <span className="text-[#36C98F] font-semibold">Active</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl bg-[#101725] border border-white/[0.08] p-6 sm:p-8 space-y-6">
              <h2 className="text-base font-bold text-[#F4F7FC] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#3478F6]" />
                Recent Orders
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-12 h-12 text-[#929EAF] mx-auto opacity-30" />
                  <p className="text-sm font-semibold text-[#F4F7FC]">No orders placed yet</p>
                  <p className="text-xs text-[#929EAF]">
                    When you purchase items via Cash on Delivery, your tracking will appear here.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block mt-2 px-5 py-2.5 rounded-full bg-[#3478F6] text-white text-xs font-semibold hover:bg-[#2563EB]"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o.orderNumber}
                      className="p-5 rounded-2xl bg-[#080B12] border border-white/[0.06] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.04] pb-3 text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#3478F6] text-sm">
                            {o.orderNumber}
                          </span>
                          <span className="text-[#929EAF] ml-2">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-[#36C98F]/10 border border-[#36C98F]/30 text-[#36C98F] font-bold text-[10px] uppercase">
                          Confirmed (Cash on Delivery)
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        {o.items.map((i) => (
                          <div key={i.id} className="flex justify-between text-[#929EAF]">
                            <span className="truncate max-w-sm text-[#F4F7FC]">
                              {i.title} × {i.quantity}
                            </span>
                            <span>{formatPKR(i.price * i.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs">
                        <span className="text-[#929EAF]">Total Amount</span>
                        <span className="text-sm font-bold text-[#3478F6]">
                          {formatPKR(o.totalAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
