'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Phone,
  MessageCircle,
  MapPin,
  User,
  Mail,
  AlertCircle
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPKR, calculateShipping } from '@/lib/utils'

// Pakistani provinces and regions
const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
]

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  phone: z
    .string()
    .min(10, 'Valid Pakistani phone number required (e.g. 03001234567)')
    .regex(/^((\+92)|(0092)|(0)?)(3[0-9]{9})$/, 'Enter a valid Pakistani mobile number (03xx-xxxxxxx)'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  province: z.string().min(1, 'Select a province'),
  city: z.string().min(2, 'Enter your city (e.g. Lahore, Karachi, Islamabad)'),
  streetAddress: z.string().min(6, 'Enter complete address (House/Apartment #, Street, Area)'),
  deliveryInstructions: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, getSubtotal } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      province: 'Punjab',
      city: '',
      streetAddress: '',
      fullName: '',
      phone: '',
      email: '',
      deliveryInstructions: '',
    },
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = getSubtotal()
  const shippingFee = calculateShipping(subtotal)
  const total = subtotal + shippingFee

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#080B11] py-16 flex items-center justify-center p-4">
        <div className="rounded-3xl bg-[#0D1322] border border-white/[0.08] p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <p className="text-base font-bold text-white">Your shopping cart is empty</p>
          <p className="text-xs text-slate-400">Add products before proceeding to checkout.</p>
          <Link
            href="/shop"
            className="inline-block px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    try {
      const orderId = `EB-${Math.floor(100000 + Math.random() * 900000)}`
      const orderDate = new Date().toLocaleString('en-PK', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })

      // 1. Prepare Order Payload for localStorage (Order tracking / receipt)
      const orderPayload = {
        orderNumber: orderId,
        items,
        subtotal,
        shippingFee,
        totalAmount: total,
        paymentMethod: 'cod',
        shippingAddress: data,
        createdAt: new Date().toISOString(),
      }

      const existingOrders = JSON.parse(localStorage.getItem('ebee-orders') || '[]')
      localStorage.setItem('ebee-orders', JSON.stringify([orderPayload, ...existingOrders]))

      // 2. Format WhatsApp Message for +92 3054449151
      const itemLines = items
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.title}*\n   Qty: ${item.quantity} × Rs ${item.price.toLocaleString()} = Rs ${(
              item.price * item.quantity
            ).toLocaleString()}${item.sku ? ` (SKU: ${item.sku})` : ''}`
        )
        .join('\n\n')

      const waMessage = 
`🛍️ *NEW ORDER PLACED ON EBEE.PK*
━━━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* ${orderId}
📅 *Date:* ${orderDate}

👤 *CUSTOMER DETAILS:*
• *Name:* ${data.fullName}
• *Phone:* ${data.phone}
${data.email ? `• *Email:* ${data.email}\n` : ''}• *Delivery Address:* ${data.streetAddress}
• *City:* ${data.city}
• *Province:* ${data.province}
${data.deliveryInstructions ? `• *Special Note:* ${data.deliveryInstructions}\n` : ''}
📦 *ORDER ITEMS (${items.length}):*
${itemLines}

━━━━━━━━━━━━━━━━━━━━
💵 *PAYMENT SUMMARY (CASH ON DELIVERY):*
• *Subtotal:* Rs ${subtotal.toLocaleString()}
• *Delivery:* ${shippingFee === 0 ? 'FREE' : `Rs ${shippingFee.toLocaleString()}`}
• *TOTAL AMOUNT PAYABLE:* *Rs ${total.toLocaleString()}*
━━━━━━━━━━━━━━━━━━━━
Please confirm my order dispatch. Thank you!`

      const encodedMessage = encodeURIComponent(waMessage)
      const whatsappUrl = `https://wa.me/923054449151?text=${encodedMessage}`

      // Clear the Cart
      clearCart()

      // 3. Open WhatsApp in new tab/window for seamless order notification
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank')
      }

      // 4. Redirect to order confirmation page
      router.push(`/order-confirmation/${orderId}`)
    } catch (err) {
      console.error('Checkout error:', err)
      alert('An error occurred while placing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080B11] py-8 sm:py-12 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/cart"
              className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 mb-2 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Checkout & Delivery Details
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 bg-[#0D1322] border border-white/[0.08] px-4 py-2.5 rounded-2xl w-fit">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> 100% Cash on Delivery
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-blue-400">
              <MessageCircle className="w-4 h-4" /> WhatsApp Dispatch Support
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form: Customer & Delivery Info */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Section 1: Contact Details */}
              <div className="rounded-3xl bg-[#0D1322] border border-white/[0.08] p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3">
                  <User className="w-4 h-4 text-blue-400" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-white">
                    1. Contact Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      {...register('fullName')}
                      placeholder="e.g. Muhammad Bilal"
                      className="w-full bg-[#080B11] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                      <span>Mobile / WhatsApp Number *</span>
                      <span className="text-[10px] text-blue-400 font-normal">For courier & updates</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register('phone')}
                        placeholder="03001234567"
                        className="w-full bg-[#080B11] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono transition-colors"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                    <span>Email Address (Optional)</span>
                    <span className="text-[10px] text-slate-500">For digital invoice</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="bilal@example.com"
                    className="w-full bg-[#080B11] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Section 2: Delivery Destination */}
              <div className="rounded-3xl bg-[#0D1322] border border-white/[0.08] p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-white">
                    2. Shipping Address (Pakistan)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Province / Territory *
                    </label>
                    <select
                      {...register('province')}
                      className="w-full bg-[#080B11] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                    >
                      {PROVINCES.map((prov) => (
                        <option key={prov} value={prov} className="bg-[#0D1322] text-white">
                          {prov}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      City *
                    </label>
                    <input
                      {...register('city')}
                      placeholder="e.g. Lahore, Karachi, Rawalpindi"
                      className="w-full bg-[#080B11] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                    />
                    {errors.city && (
                      <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Complete Street Address (House #, Street #, Sector / Area) *
                  </label>
                  <textarea
                    {...register('streetAddress')}
                    rows={2}
                    placeholder="House / Flat #, Street #, Block / Phase, Nearby Landmark..."
                    className="w-full bg-[#080B11] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                  {errors.streetAddress && (
                    <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.streetAddress.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Special Rider Delivery Note (Optional)
                  </label>
                  <input
                    {...register('deliveryInstructions')}
                    placeholder="e.g. Call before arrival, leave at reception"
                    className="w-full bg-[#080B11] border border-white/[0.08] focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div className="rounded-3xl bg-[#0D1322] border border-white/[0.08] p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <h2 className="text-sm font-black uppercase tracking-wider text-white">
                    3. Payment Method
                  </h2>
                </div>

                <div className="p-4 rounded-2xl bg-[#080B11] border border-blue-500/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-2">
                        Cash on Delivery (COD)
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">
                          Recommended
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Pay in cash to courier rider upon doorstep package inspection.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 hidden sm:block">No Advance Fee</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl shadow-blue-600/40 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
              >
                <MessageCircle className="w-4 h-4" />
                {isSubmitting
                  ? 'Confirming Order & Opening WhatsApp...'
                  : `Place Cash on Delivery Order • ${formatPKR(total)}`}
              </button>

              <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Your order data is also routed directly to our WhatsApp support (+92 3054449151) for immediate confirmation.
              </p>

            </form>
          </div>

          {/* Right Summary: Items in Order & Total */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-[#0D1322] border border-white/[0.08] p-6 space-y-4 sticky top-28 shadow-xl">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center justify-between border-b border-white/[0.06] pb-3">
                <span>Order Summary</span>
                <span className="text-slate-400 font-mono font-normal">{items.length} items</span>
              </h3>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.06] pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl bg-[#080B11] border border-white/[0.08] overflow-hidden flex-shrink-0">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate leading-snug">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Qty: {item.quantity} × {formatPKR(item.price)}
                      </p>
                    </div>
                    <span className="text-xs font-black text-white font-mono">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/[0.08] space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold font-mono">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Nationwide Express Shipping</span>
                  <span className={shippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white font-bold font-mono'}>
                    {shippingFee === 0 ? 'FREE' : formatPKR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-3 border-t border-white/[0.06]">
                  <span>Total Payable</span>
                  <span className="text-blue-400 font-mono text-lg">{formatPKR(total)}</span>
                </div>
              </div>

              <div className="pt-2 p-3.5 rounded-2xl bg-[#080B11] border border-white/[0.06] flex items-center gap-2.5 text-[11px] text-slate-400">
                <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Estimated Doorstep Delivery: 2 to 4 working days</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs space-y-1">
                <p className="text-blue-300 font-bold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Direct Support Hotline:
                </p>
                <p className="text-white font-mono font-semibold">+92 3054449151</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
