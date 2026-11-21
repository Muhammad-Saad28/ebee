'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { formatPKR } from '@/lib/utils'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const { addItem, openCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleMoveToCart = (item: any) => {
    addItem({
      id: item.productId,
      title: item.title,
      slug: item.slug,
      sku: '',
      category: '',
      category_slug: '',
      price: item.price,
      discount: 0,
      in_stock: true,
      stock_quantity: 10,
      rating: 4.8,
      review_count: 5,
      description: '',
      images: [item.thumbnail],
      thumbnail: item.thumbnail,
      is_featured: false,
      is_bestseller: false,
      is_trending: false,
      created_at: '',
    })
    removeItem(item.productId)
    openCart()
  }

  return (
    <div className="min-h-screen bg-[#080B12] py-8 sm:py-12 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl sm:text-4xl font-black text-[#F4F7FC] mb-8">
          My Saved Wishlist ({items.length})
        </h1>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-[#101725] border border-white/[0.08] p-12 text-center space-y-4 max-w-md mx-auto">
            <Heart className="w-16 h-16 text-[#929EAF] mx-auto opacity-30" />
            <h2 className="text-xl font-bold text-[#F4F7FC]">Your Wishlist is Empty</h2>
            <p className="text-xs text-[#929EAF]">
              Tap the heart icon on any product to save items you wish to purchase later.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3478F6] text-white text-xs font-semibold hover:bg-[#2563EB]"
              >
                Explore Products <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="luxury-card rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-square bg-[#080B12]">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-[#101725]/80 text-[#929EAF] hover:text-red-400 backdrop-blur-md"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-xs font-semibold text-[#F4F7FC] hover:text-[#3478F6] line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm font-bold text-[#3478F6] mt-2">
                      {formatPKR(item.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full py-2.5 rounded-xl bg-[#3478F6] hover:bg-[#2563EB] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
