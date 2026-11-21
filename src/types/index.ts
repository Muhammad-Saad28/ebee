export interface Product {
  id: string
  title: string
  slug: string
  sku: string
  category: string
  category_slug: string
  subcategory?: string | null
  price: number
  old_price?: number | null
  discount: number
  in_stock: boolean
  stock_quantity: number
  rating: number
  review_count: number
  description: string
  images: string[]
  thumbnail: string
  is_featured: boolean
  is_bestseller: boolean
  is_trending: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  subcategories?: string[]
  product_count?: number
  sample_image?: string | null
  display_order?: number
  is_active?: boolean
}

export interface CartItem {
  id: string
  productId: string
  title: string
  slug: string
  sku: string
  price: number
  thumbnail: string
  quantity: number
  maxStock: number
}

export interface WishlistItem {
  productId: string
  title: string
  slug: string
  price: number
  thumbnail: string
  in_stock: boolean
}

export interface OrderAddress {
  fullName: string
  phone: string
  email?: string
  province: string
  city: string
  streetAddress: string
  deliveryInstructions?: string
}

export interface Order {
  id: string
  orderNumber: string
  items: CartItem[]
  subtotal: number
  shippingFee: number
  discountAmount: number
  totalAmount: number
  paymentMethod: 'cod' | 'card'
  paymentStatus: 'pending' | 'paid'
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: OrderAddress
  couponCode?: string
  createdAt: string
}

export interface StoreSettings {
  announcementText: string
  announcementEnabled: boolean
  freeShippingThreshold: number
  standardShippingFee: number
  supportPhone: string
  supportEmail: string
}
