'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, WishlistItem } from '@/types'

interface WishlistStore {
  items: WishlistItem[]
  toggleWishlist: (product: Product) => void
  isInWishlist: (productId: string) => boolean
  removeItem: (productId: string) => void
  getTotalItems: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product: Product) => {
        set((state) => {
          const exists = state.items.some((item) => item.productId === product.id)
          if (exists) {
            return {
              items: state.items.filter((item) => item.productId !== product.id),
            }
          } else {
            const newItem: WishlistItem = {
              productId: product.id,
              title: product.title,
              slug: product.slug,
              price: product.price,
              thumbnail: product.thumbnail,
              in_stock: product.in_stock,
            }
            return { items: [...state.items, newItem] }
          }
        })
      },

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId)
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      getTotalItems: () => {
        return get().items.length
      },
    }),
    {
      name: 'ebee-wishlist-storage',
    }
  )
)
