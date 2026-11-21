'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Sparkles,
  ArrowRight,
  Layers,
  Smartphone,
  Laptop,
  Camera,
  Watch,
  Shirt,
  Home,
  Car,
  Dumbbell,
  Baby,
  Cigarette,
  Zap,
} from 'lucide-react'
import { Category } from '@/types'

function getCategoryIcon(slug: string) {
  const s = slug.toLowerCase()
  if (s.includes('phone') || s.includes('audio')) return Smartphone
  if (s.includes('computer') || s.includes('laptop')) return Laptop
  if (s.includes('camera')) return Camera
  if (s.includes('watch') || s.includes('wearable')) return Watch
  if (s.includes('fashion')) return Shirt
  if (s.includes('home') || s.includes('living')) return Home
  if (s.includes('auto') || s.includes('car')) return Car
  if (s.includes('sport') || s.includes('fitness')) return Dumbbell
  if (s.includes('kid') || s.includes('toy')) return Baby
  if (s.includes('tobacco')) return Cigarette
  return Layers
}

interface CategoryCarouselProps {
  categories?: Category[]
}

export function CategoryCarousel({ categories = [] }: CategoryCarouselProps) {
  if (!categories || categories.length === 0) {
    return null
  }

  // Duplicate items for continuous infinite left-to-right flow
  const duplicatedCategories = [...categories, ...categories, ...categories]

  return (
    <div className="relative w-full py-3 select-none overflow-hidden">
      {/* Full-Width Moving Carousel from Left to Right */}
      <div className="relative w-full overflow-hidden">
        
        {/* Soft edge blur fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#07090F] via-[#07090F]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#07090F] via-[#07090F]/80 to-transparent z-20 pointer-events-none" />

        <div className="animate-carousel-ltr flex items-center gap-3 sm:gap-4 py-2 px-4">
          {duplicatedCategories.map((cat, idx) => {
            const Icon = getCategoryIcon(cat.slug)
            const count = cat.product_count ?? 12

            return (
              <Link
                key={`${cat.slug || cat.id}-${idx}`}
                href={`/shop?category=${cat.slug}`}
                className="group shrink-0 inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-white backdrop-blur-xl border border-white/[0.08] hover:border-[rgba(187,216,255,0.35)] shadow-[0_4px_20px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.06)_inset] hover:shadow-[0_8px_28px_rgba(36,123,255,0.25)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {/* Thumbnail Icon Pod */}
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#247BFF]/25 to-[#398BFF]/10 border border-[#247BFF]/30 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <Icon className="w-4 h-4 text-[#afc6ff]" />
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col text-left">
                  <span className="font-headline text-xs sm:text-sm font-semibold text-white group-hover:text-[#afc6ff] transition-colors whitespace-nowrap">
                    {cat.name}
                  </span>
                  <span className="font-mono text-[10px] text-[#8c90a0] whitespace-nowrap">
                    {count} Products
                  </span>
                </div>

                {/* Arrow */}
                <div className="w-6 h-6 rounded-lg bg-white/[0.05] group-hover:bg-[#247BFF] border border-white/[0.08] group-hover:border-[#247BFF] text-[#c2c6d7] group-hover:text-white flex items-center justify-center transition-all ml-1">
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>

      </div>

    </div>
  )
}
