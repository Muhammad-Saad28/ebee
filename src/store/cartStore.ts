'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.productId === product.id)
          if (existingIndex > -1) {
            const updated = [...state.items]
            const currentItem = updated[existingIndex]
            const newQty = Math.min(currentItem.quantity + quantity, currentItem.maxStock || 99)
            updated[existingIndex] = { ...currentItem, quantity: newQty }
            return { items: updated, isOpen: true }
          } else {
            const newItem: CartItem = {
              id: `${product.id}-${Date.now()}`,
              productId: product.id,
              title: product.title,
              slug: product.slug,
              sku: product.sku,
              price: product.price,
              thumbnail: product.thumbnail,
              quantity: Math.min(quantity, product.stock_quantity || 1),
              maxStock: product.stock_quantity || 10,
            }
            return { items: [...state.items, newItem], isOpen: true }
          }
        })
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      updateQuantity: (productId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.productId !== productId) }
          }
          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(quantity, item.maxStock) }
                : item
            ),
          }
        })
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'ebee-cart-storage',
    }
  )
)
