import { createClient } from './supabase/server'
import { Product, Category } from '@/types'

// Map database row + joined images to the frontend Product model
function mapDbProduct(row: any): Product {
  const images = (row.product_images || [])
    .sort((a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map((img: any) => img.url)
    .filter(Boolean)

  const thumbnailImg = (row.product_images || []).find((img: any) => img.is_thumbnail)
  const thumbnail = thumbnailImg?.url || images[0] || '/logo.jpeg'

  return {
    id: row.id,
    title: row.title || '',
    slug: row.slug || '',
    sku: row.sku || '',
    category: row.category_name || row.category || 'General',
    category_slug: row.category_slug || (row.category_name ? row.category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'general'),
    subcategory: row.subcategory_name || row.subcategory || null,
    price: Number(row.price) || 0,
    old_price: row.old_price ? Number(row.old_price) : null,
    discount: Number(row.discount_percentage) || Number(row.discount) || 0,
    in_stock: row.in_stock ?? true,
    stock_quantity: Number(row.stock_quantity) || 0,
    rating: Number(row.rating) || 4.5,
    review_count: Number(row.review_count) || 0,
    description: row.description || '',
    images: images.length > 0 ? images : [thumbnail],
    thumbnail,
    is_featured: Boolean(row.is_featured),
    is_bestseller: Boolean(row.is_bestseller),
    is_trending: Boolean(row.is_trending),
    created_at: row.created_at || new Date().toISOString(),
  }
}

// Dynamic query directly against Supabase PostgreSQL
export async function getProducts(options?: {
  category?: string
  subcategory?: string
  featured?: boolean
  bestseller?: boolean
  trending?: boolean
  search?: string
  limit?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price-asc' | 'price-desc' | 'rating' | 'newest'
}): Promise<Product[]> {
  try {
    const supabase = await createClient()
    let query = supabase.from('products').select('*, product_images(*)')

    if (options?.category) {
      const cleanCat = options.category.replace(/-/g, ' ')
      query = query.or(`category_name.ilike.%${cleanCat}%,slug.ilike.%${options.category}%`)
    }

    if (options?.subcategory) {
      query = query.ilike('subcategory_name', `%${options.subcategory}%`)
    }

    if (options?.featured) {
      query = query.eq('is_featured', true)
    }

    if (options?.bestseller) {
      query = query.eq('is_bestseller', true)
    }

    if (options?.trending) {
      query = query.eq('is_trending', true)
    }

    if (options?.minPrice !== undefined) {
      query = query.gte('price', options.minPrice)
    }

    if (options?.maxPrice !== undefined) {
      query = query.lte('price', options.maxPrice)
    }

    if (options?.search) {
      const q = options.search.trim()
      query = query.or(`title.ilike.%${q}%,sku.ilike.%${q}%,category_name.ilike.%${q}%`)
    }

    if (options?.sortBy) {
      switch (options.sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true })
          break
        case 'price-desc':
          query = query.order('price', { ascending: false })
          break
        case 'rating':
          query = query.order('rating', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }
    } else {
      query = query.order('created_at', { ascending: false })
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query
    if (error || !data) {
      console.error('Error fetching products:', error)
      return []
    }

    return data.map(mapDbProduct)
  } catch (err) {
    console.error('getProducts failed:', err)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*)')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single()

    if (error || !data) return null
    return mapDbProduct(data)
  } catch {
    return null
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*, product_count:products(count)')
      .is('parent_id', null)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error || !data || data.length === 0) {
      const fallback = await supabase.from('categories').select('*').is('parent_id', null)
      if (!fallback.error && fallback.data) return fallback.data as Category[]
      return []
    }

    // Also fetch one representative product image for each category if category.image_url is empty
    const { data: sampleProducts } = await supabase
      .from('products')
      .select('category_id, product_images(url)')
      .limit(60)

    const catThumbMap: Record<string, string> = {}
    if (sampleProducts) {
      for (const p of sampleProducts) {
        if (p.category_id && p.product_images && p.product_images.length > 0 && !catThumbMap[p.category_id]) {
          catThumbMap[p.category_id] = p.product_images[0].url
        }
      }
    }

    return data.map((cat: any) => {
      let count = 0
      if (Array.isArray(cat.product_count) && cat.product_count[0]?.count !== undefined) {
        count = cat.product_count[0].count
      }
      return {
        ...cat,
        product_count: count,
        image_url: cat.image_url || catThumbMap[cat.id] || null,
      } as Category
    })
  } catch {
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) return null
    return data as Category
  } catch {
    return null
  }
}

export async function getRelatedProducts(product: Product, limit: number = 4): Promise<Product[]> {
  try {
    const products = await getProducts({
      category: product.category_slug || product.category,
      limit: limit + 1,
    })
    return products.filter((p) => p.id !== product.id).slice(0, limit)
  } catch {
    return []
  }
}
