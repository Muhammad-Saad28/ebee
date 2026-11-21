'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIdx, setSelectedIdx] = useState(0)

  const activeImage = images[selectedIdx] || images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'

  return (
    <div className="space-y-4">
      {/* Main Preview Frame */}
      <div className="relative aspect-square w-full rounded-3xl bg-[#101725] border border-white/[0.08] overflow-hidden shadow-2xl">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-contain p-4"
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative w-20 h-20 rounded-2xl bg-[#101725] border overflow-hidden flex-shrink-0 transition-all ${
                selectedIdx === idx
                  ? 'border-[#3478F6] ring-2 ring-[#3478F6]/30'
                  : 'border-white/[0.08] opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
