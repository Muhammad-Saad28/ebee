import Link from 'next/link'
import { ShieldCheck, Truck, Clock, Headphones, Award, Globe, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-sky-950/60 text-sky-300 border border-sky-400/30">
            About EBEE.PK
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Pakistan’s Premier Smart Lifestyle & Tech Marketplace
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            EBEE.PK is built to deliver cutting-edge technology, authentic consumer electronics, automobile accessories, and daily lifestyle essentials with guaranteed reliability and direct Cash on Delivery across Pakistan.
          </p>
        </div>

        {/* Story / Mission Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 rounded-3xl bg-sky-950/30 border border-sky-400/20 backdrop-blur-xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">100% Authentic Quality</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Every gadget and product featured on EBEE is rigorously vetted for quality, durability, and authenticity before dispatch.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-sky-950/30 border border-sky-400/20 backdrop-blur-xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Fast Nationwide Shipping</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Express delivery network connecting Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Faisalabad, and all cities nationwide.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-sky-950/30 border border-sky-400/20 backdrop-blur-xl relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mb-6">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Dedicated Customer Care</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Real human support via WhatsApp and phone to guide your purchases and ensure smooth resolution for order queries.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="rounded-3xl bg-sky-950/20 border border-sky-400/20 p-8 sm:p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-sky-400">Our Commitment</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-4">
                Redefining Online Shopping Confidence
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                We understand that trusting an online store starts with transparent policies and reliable fulfillment. That is why EBEE offers Cash on Delivery on all orders, transparent tracking, and active order updates straight to your phone.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Free shipping on orders above PKR 2,000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Doorstep parcel inspection on delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Direct manufacturer & brand warranty backing</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-black/60 border border-sky-400/20 text-center">
                <p className="text-3xl font-black text-white">1000+</p>
                <p className="text-xs text-slate-400 mt-1">Curated Products</p>
              </div>
              <div className="p-5 rounded-2xl bg-black/60 border border-sky-400/20 text-center">
                <p className="text-3xl font-black text-white">99%</p>
                <p className="text-xs text-slate-400 mt-1">Satisfied Deliveries</p>
              </div>
              <div className="p-5 rounded-2xl bg-black/60 border border-sky-400/20 text-center">
                <p className="text-3xl font-black text-white">24-48h</p>
                <p className="text-xs text-slate-400 mt-1">Fast Dispatch</p>
              </div>
              <div className="p-5 rounded-2xl bg-black/60 border border-sky-400/20 text-center">
                <p className="text-3xl font-black text-white">24/7</p>
                <p className="text-xs text-slate-400 mt-1">WhatsApp Assist</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-bold text-sm transition-all shadow-[0_0_24px_rgba(56,189,248,0.4)]"
          >
            Explore Catalog
          </Link>
        </div>

      </div>
    </div>
  )
}
