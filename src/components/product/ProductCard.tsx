'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star, Check } from 'lucide-react'
import { Product } from '@/types'
import { formatPKR } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { SafeImage } from '@/components/ui/SafeImage'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const [isAdded, setIsAdded] = useState(false)

  const isFavorited = isInWishlist(product.id)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <div className="relative rounded-2xl bg-white p-3.5 sm:p-4 text-[#247BFF] border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,1)_inset,0_3px_0_#CBD5E1] hover:shadow-[0_16px_36px_rgba(36,123,255,0.3),0_0_24px_rgba(36,123,255,0.2),0_4px_0_#247BFF] hover:border-[#247BFF]/50 transition-all duration-300 group flex flex-col justify-between overflow-hidden hover:-translate-y-2 cursor-pointer">
      
      {/* Full-Card Clickable Hyperlink */}
      <Link
        href={`/product/${product.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${product.title}`}
      />
      
      {/* 
        Gaussian Blur Texture & Corner Gradient System
        Matches the uploaded reference: soft white canvas with blurred deep blue gaussian spots in the opposite corners
      */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-2xl">
        {/* Soft Background Image Overlay */}
        <div className="absolute inset-0 opacity-25 mix-blend-multiply">
          <Image
            src="/card-blur-bg.jpg"
            alt="Card Gaussian Blur Background"
            fill
            sizes="300px"
            className="object-cover object-center"
          />
        </div>

        {/* Top-Left Diagonal Deep Blue Gaussian Node */}
        <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-[#1e488f]/40 blur-[38px] group-hover:scale-125 transition-transform duration-500" />
        
        {/* Bottom-Right Diagonal Deep Blue Gaussian Node */}
        <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-[#204d96]/45 blur-[42px] group-hover:scale-125 transition-transform duration-500" />

        {/* Central Luminous White Glow Node */}
        <div className="absolute inset-6 rounded-full bg-white/70 blur-[30px]" />
      </div>

      {/* Product Image Stage (Clean inset canvas) */}
      <div className="relative w-full aspect-square bg-[#F8FAFC]/90 backdrop-blur-md rounded-xl p-3 pt-8 pb-3 flex items-center justify-center overflow-hidden mb-3 border border-slate-100/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] z-10">
        
        {/* Holographic Status Pill */}
        {product.is_featured ? (
          <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-[#07090F]/90 backdrop-blur-sm text-[#247BFF] border border-[#247BFF]/40 font-mono text-[9px] font-bold tracking-wider uppercase shadow-xs">
            FLAGSHIP
          </span>
        ) : product.is_bestseller ? (
          <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-[#247BFF] text-white font-mono text-[9px] font-bold tracking-wider uppercase shadow-xs">
            BESTSELLER
          </span>
        ) : product.discount > 0 ? (
          <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-[#247BFF] text-white font-mono text-[9px] font-bold tracking-wider uppercase shadow-xs">
            -{product.discount}%
          </span>
        ) : (
          <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-[#07090F]/90 backdrop-blur-sm text-[#247BFF] border border-[#247BFF]/40 font-mono text-[9px] font-bold tracking-wider uppercase shadow-xs">
            AUTHENTIC
          </span>
        )}

        {/* Wishlist Glass Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 hover:bg-white text-[#247BFF] shadow-sm flex items-center justify-center transition-all border border-slate-200 z-20"
          title="Save to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-[#247BFF] text-[#247BFF]' : ''}`} />
        </button>

        <Link href={`/product/${product.slug}`} className="relative w-full h-full flex items-center justify-center">
          <SafeImage
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="max-h-full object-contain p-2 transform group-hover:scale-108 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Product Details Section */}
      <div className="flex-1 flex flex-col relative z-10">
        <span className="font-mono text-[10px] text-rose-500 uppercase mb-1 tracking-wider font-bold">
          {product.category || 'Hardware Matrix'}
        </span>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-headline text-sm font-bold text-[#07090F] hover:text-[#247BFF] transition-colors line-clamp-1 mb-1.5 leading-snug">
            {product.title}
          </h3>
        </Link>

        {/* Star Rating in Yellow */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="font-mono text-[10px] text-slate-500 font-bold">
            (48)
          </span>
        </div>

        {/* Price & 3D Instant Buy Trigger */}
        <div className="mt-auto pt-2.5 flex items-center justify-between border-t border-slate-200/60">
          <div>
            <span className="font-mono text-[9px] text-slate-500 block leading-none uppercase font-bold">Price</span>
            <span className="font-headline text-base text-[#07090F] font-black">
              {formatPKR(product.price)}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.in_stock}
            className={`relative z-20 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : product.in_stock
                ? 'bg-[#247BFF] hover:bg-[#146BFF] text-white shadow-[0_2px_8px_rgba(36,123,255,0.4),0_2px_0_#0272e4] hover:scale-105 active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Quick Add"
          >
            {isAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>

      </div>

    </div>
  )
}
