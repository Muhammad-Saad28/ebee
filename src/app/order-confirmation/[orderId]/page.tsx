'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShieldCheck,
  Home,
  MessageCircle,
  ExternalLink,
  Phone
} from 'lucide-react'
import { Order } from '@/types'
import { formatPKR } from '@/lib/utils'

interface OrderConfirmationPageProps {
  params: Promise<{
    orderId: string
  }>
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderId } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const localOrders: Order[] = JSON.parse(localStorage.getItem('ebee-orders') || '[]')
    const found = localOrders.find((o) => o.orderNumber === orderId)
    if (found) {
      setOrder(found)
    }
  }, [orderId])

  if (!mounted) return null

  // Generate WhatsApp message URL if user needs to re-open WhatsApp
  const generateWhatsAppUrl = () => {
    if (!order) {
      return `https://wa.me/923054449151?text=${encodeURIComponent(`Hi EBEE.PK, I placed order #${orderId}. Please confirm dispatch.`)}`
    }
    const itemLines = order.items
      .map((item, idx) => `${idx + 1}. *${item.title}* (Qty: ${item.quantity}) - Rs ${(item.price * item.quantity).toLocaleString()}`)
      .join('\n')

    const msg = 
`🛍️ *ORDER CONFIRMATION - EBEE.PK*
Order ID: *${order.orderNumber}*
Name: *${order.shippingAddress.fullName}*
Phone: *${order.shippingAddress.phone}*
Address: *${order.shippingAddress.streetAddress}, ${order.shippingAddress.city}*

*Items:*
${itemLines}

*Total Payable:* *Rs ${order.totalAmount.toLocaleString()}* (Cash on Delivery)
Please confirm tracking status.`

    return `https://wa.me/923054449151?text=${encodeURIComponent(msg)}`
  }

  return (
    <div className="min-h-screen bg-[#080B11] py-12 sm:py-16 border-b border-white/[0.08]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Card */}
        <div className="rounded-3xl bg-[#0D1322] border border-white/[0.08] p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
              Order Placed Successfully
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
              Your Cash on Delivery order has been registered and forwarded to our official WhatsApp helpline (+92 3054449151).
            </p>
          </div>

          {/* Tracking Number Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#080B11] border border-blue-500/30 text-xs shadow-inner">
            <span className="text-slate-400 font-medium">Order Tracking ID:</span>
            <span className="font-mono font-black text-blue-400 tracking-wider text-sm">{orderId}</span>
          </div>

          {/* WhatsApp Direct Action Button */}
          <div className="pt-2">
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" /> Message Us on WhatsApp (+92 3054449151) <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Fulfillment Status Step Progression */}
          <div className="pt-6 border-t border-white/[0.06] text-left">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-4">
              Estimated Delivery Progression
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3.5 rounded-2xl bg-[#080B11] border border-blue-500/50">
                <Package className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
                <p className="font-bold text-white">Order Placed</p>
                <p className="text-[10px] text-emerald-400 mt-0.5 font-medium">Confirmed</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#080B11] border border-white/[0.06] opacity-75">
                <Truck className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                <p className="font-medium text-white">In Transit</p>
                <p className="text-[10px] text-slate-400 mt-0.5">TCS / Trax Courier</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#080B11] border border-white/[0.06] opacity-50">
                <ShieldCheck className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                <p className="font-medium text-slate-300">Delivered</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Pay Cash</p>
              </div>
            </div>
          </div>

          {/* Order Snapshot if available */}
          {order && (
            <div className="pt-6 border-t border-white/[0.06] text-left space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Order Summary Snapshot
              </h3>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-white/[0.04]">
                    <span className="text-slate-200 truncate max-w-xs font-medium">
                      {item.title} <strong className="text-blue-400 font-mono">×{item.quantity}</strong>
                    </span>
                    <span className="font-bold text-white font-mono">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm font-black pt-2">
                <span className="text-slate-400">Total Amount Payable (COD)</span>
                <span className="text-blue-400 font-mono text-base">{formatPKR(order.totalAmount)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#080B11] border border-white/[0.06] text-xs text-slate-400 space-y-1">
                <p className="font-bold text-white">Destination Shipping Address:</p>
                <p className="text-slate-200">{order.shippingAddress.fullName} • {order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.province}</p>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#080B11] border border-white/[0.1] text-xs font-bold text-white hover:bg-white/[0.06] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Home className="w-4 h-4" /> Return to Home
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all"
            >
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
