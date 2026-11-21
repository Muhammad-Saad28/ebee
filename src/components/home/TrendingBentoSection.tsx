'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Flame, ArrowRight } from 'lucide-react'

export function TrendingBentoSection() {
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { id: 'all', label: 'All Tech' },
    { id: 'audio', label: 'Flagship Audio' },
    { id: 'wearables', label: 'Smart Wearables' },
    { id: 'gaming', label: 'PC & Gaming' },
    { id: 'lifestyle', label: 'Creator Lifestyle' },
  ]

  const bentoCards = [
    {
      categoryBadge: 'Acoustic Mastery',
      title: 'Wireless Audio',
      desc: 'Lossless studio monitors, spatial earbuds & true wireless freedom with active ANC.',
      spec: '96kHz / 24-bit Lossless',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpJnH29ELdEKb8XXIQWQV0D0g2Jo9pqsI3A_4tCC7dDJYPJX5psbp_Em2AZUqqtJvmycNa5N9RldVRP7VNM53b3E-I1JqIxlsywhFKFlmvvxPhJkSXOADIOiFY7uHWouDquzmRHf0DFlMg7XLBbQhESbQJ-_4r6r8GePft53pb5VHZPjCHV8AkF7bPZ-3AICS1Dre_n3VMQxtl7ttJZ9TZ22ljmJ-JKY13QBnpY-n3',
      href: '/shop?category=phones-and-accessories',
    },
    {
      categoryBadge: 'Bio-Telemetry Matrix',
      title: 'Smart Watches',
      desc: 'AMOLED sapphire displays, ECG tracking & 14-day battery reserves in forged titanium.',
      spec: '1.96" Ultra AMOLED • 14D',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQnHcv4tMMX7kERQnPPQcQiixnxGSRCbsFt8KK_MJQvy2iCCtDUs2Ku0lCpLs-bU42to5Ee-1aRxVY42qhHVySYhM98fKkjbkdAVU7NnGE7WGvaUOi_vnKh4thJxZbKGA0ABGDw-d051WZ3_Vdg_wrGi9obMPLCcK-xbOKDVC4k9ReVilQ-SpSTXSNk4Pmbpwc0qI2MqQ_u4qKTesXsccbLK-UhDwBUPjVdORStJCL',
      href: '/shop?category=cameras',
    },
    {
      categoryBadge: 'High-Precision Peripherals',
      title: 'Lifestyle Tech & Gaming',
      desc: 'Magnetic switch keyboards, 8000Hz response mice & minimalist aluminum desk gear.',
      spec: '8000Hz Hyper-Polling',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmJxrNRCiKGoYiFeJT3Y-AQeRxXO3-Q6FoVI-3L7NEcwVXhdxJW8E9kgzXh9LN1oxGOd5c-AOy4khnlxVcJ68e4Cm2nmCochJVZxouqrxD42kZWswOD62WBRdPmUJfKaUcgEqKSbBS0PqXUD3VjYSzXsHW9JR_RA9YAZCotbuuxSRYX9T8ylPeiwvkcrVgLVfAOugO5Awv-g2vULrocJkJlCBewyKgCfx4_wocPuLR',
      href: '/shop?category=automobiles',
    },
  ]

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 select-none">
      
      {/* Background Interactive Ambient Lighting Nodes */}
      <div className="absolute -top-10 left-1/4 w-80 h-80 bg-[#247BFF]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-96 h-96 bg-[#398BFF]/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Header with Title + 3D Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827] border border-[rgba(187,216,255,0.18)] text-[11px] font-mono text-white uppercase tracking-wider mb-2 font-bold shadow-[0_0_15px_rgba(36,123,255,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#247BFF] animate-pulse" />
            <Flame className="w-3.5 h-3.5 fill-current text-[#247BFF]" />
            <span>TRENDING RIGHT NOW</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight">
            Discover your next favourite
          </h2>
        </div>

        {/* 3D Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-mono text-xs transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-[#247BFF] font-bold shadow-[0_4px_14px_rgba(0,0,0,0.5),0_2px_0_#247BFF] scale-105 border border-[#247BFF]/30'
                  : 'bg-[#111827] text-white hover:bg-white hover:text-[#146BFF] shadow-sm border border-[rgba(187,216,255,0.15)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Major Feature Bento Cards with Gaussian Corner Blur System (Whole Card is Clickable Link) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
        {bentoCards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="group relative rounded-3xl bg-white p-6 sm:p-7 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,1)_inset,0_4px_0_#CBD5E1] hover:shadow-[0_28px_60px_-10px_rgba(36,123,255,0.35),0_0_35px_rgba(36,123,255,0.2),0_4px_0_#247BFF] transition-all duration-500 flex flex-col justify-between overflow-hidden border border-slate-200 hover:border-[#247BFF]/70 hover:-translate-y-3 hover:scale-[1.01] cursor-pointer"
          >
            {/* Gaussian Blur Texture & Corner Glows from reference image */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-3xl">
              <div className="absolute inset-0 opacity-20 mix-blend-multiply">
                <Image
                  src="/card-blur-bg.jpg"
                  alt="Card Gaussian Texture"
                  fill
                  sizes="400px"
                  className="object-cover object-center"
                />
              </div>
              <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#1e488f]/35 blur-[45px] group-hover:scale-125 transition-transform duration-500" />
              <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full bg-[#204d96]/40 blur-[50px] group-hover:scale-125 transition-transform duration-500" />
              <div className="absolute inset-8 rounded-full bg-white/70 blur-[35px]" />
            </div>

            {/* Top Badge & Micro Spec Capsule */}
            <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
              <span className="font-mono text-[10px] text-rose-500 uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200/60 backdrop-blur-md">
                {card.categoryBadge}
              </span>
              <span className="font-mono text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {card.spec}
              </span>
            </div>

            {/* Title & Description in Bold Black */}
            <div className="relative z-10 space-y-1.5">
              <h3 className="font-headline text-xl sm:text-2xl text-[#07090F] font-bold tracking-tight leading-tight group-hover:text-[#247BFF] transition-colors">
                {card.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
                {card.desc}
              </p>
            </div>

            {/* Recessed Product Showcase Stage with Floating Visual */}
            <div className="relative w-full h-52 my-4 rounded-2xl bg-[#F8FAFC]/95 backdrop-blur-md border border-slate-200/80 shadow-[inset_0_2px_8px_rgba(0,0,0,0.06)] flex items-center justify-center overflow-hidden group-hover:border-[#247BFF]/30 transition-colors z-10">
              <Image
                src={card.image}
                alt={card.title}
                width={240}
                height={190}
                className="relative z-10 max-h-full object-contain transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out"
              />
            </div>

            {/* 3D Action Footer Pill */}
            <div className="relative z-10 pt-2 flex items-center justify-between border-t border-slate-200/60">
              <span className="font-mono text-[10px] text-[#247BFF]/70 uppercase tracking-wider font-bold">
                Certified Dispatch
              </span>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#247BFF] group-hover:bg-[#146BFF] text-white font-headline text-xs font-bold transition-all duration-300 shadow-[0_2px_8px_rgba(36,123,255,0.35),0_2px_0_#0272e4] group-hover:scale-105">
                <span>Shop now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </Link>
        ))}
      </div>

    </section>
  )
}
