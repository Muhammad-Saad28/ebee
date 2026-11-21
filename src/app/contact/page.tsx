'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-sky-950/60 text-sky-300 border border-sky-400/30">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            We’re Here to Help
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Have questions about your order, tracking, or a specific product? Reach out to our customer care team anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-sky-950/30 border border-sky-400/20 backdrop-blur-xl space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">WhatsApp & Phone Support</h3>
                  <p className="text-xs text-slate-400 mt-1">Direct agent support 10:00 AM – 10:00 PM</p>
                  <a
                    href="https://wa.me/923054449151"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm font-mono font-semibold text-sky-400 hover:text-sky-300"
                  >
                    +92 305 4449151
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Email Us</h3>
                  <p className="text-xs text-slate-400 mt-1">For corporate inquiries, vendors, and formal assistance</p>
                  <a
                    href="mailto:support@ebee.pk"
                    className="inline-block mt-2 text-sm font-semibold text-sky-400 hover:text-sky-300"
                  >
                    support@ebee.pk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Fulfillment Hubs</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Warehouses and dispatch centers located in Lahore, Karachi, and Islamabad, Pakistan.
                  </p>
                </div>
              </div>

            </div>

            {/* Quick WhatsApp Action Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-black border border-emerald-500/20 text-center space-y-3">
              <MessageSquare className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Instant WhatsApp Help</h4>
              <p className="text-xs text-slate-400">
                Click below to start a live WhatsApp chat for faster order confirmation and tracking.
              </p>
              <a
                href="https://wa.me/923054449151"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)]"
              >
                Chat on WhatsApp Now
              </a>
            </div>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-sky-950/20 border border-sky-400/20 backdrop-blur-xl">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
                  <h3 className="text-2xl font-bold text-white">Message Received!</h3>
                  <p className="text-slate-400 text-sm max-w-md mx-auto">
                    Thank you for reaching out. Our customer support team will contact you shortly via email or phone.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-white/[0.08] text-white hover:bg-white/[0.15] text-xs font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-white mb-2">Send us a Message</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ali Ahmed"
                        className="w-full bg-black/60 border border-sky-400/20 focus:border-sky-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0300 1234567"
                        className="w-full bg-black/60 border border-sky-400/20 focus:border-sky-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="ali@example.com"
                        className="w-full bg-black/60 border border-sky-400/20 focus:border-sky-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Order inquiry, tracking, etc."
                        className="w-full bg-black/60 border border-sky-400/20 focus:border-sky-400 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your question, order number, or comment..."
                      className="w-full bg-black/60 border border-sky-400/20 focus:border-sky-400 rounded-xl p-4 text-xs text-white placeholder-slate-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)]"
                  >
                    <span>Send Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
