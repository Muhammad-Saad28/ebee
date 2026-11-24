'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  setAdminSession,
  clearAdminSession,
  isAdminAuthenticated,
} from '@/lib/adminAuth'

export type AdminLoginState = {
  error?: string
  success?: boolean
}

export async function adminLoginAction(
  prevState: AdminLoginState | undefined,
  formData: FormData
): Promise<AdminLoginState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = (formData.get('password') as string)?.trim()

  if (!email || !password) {
    return { error: 'Please enter both email and password.' }
  }

  if (email !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
    return { error: 'Invalid email or password.' }
  }

  await setAdminSession(email)
  redirect('/admin')
}

export async function adminLogoutAction() {
  await clearAdminSession()
  redirect('/admin/login')
}

// ----------------------------------------------------
// PRODUCT ACTIONS
// ----------------------------------------------------

export async function createProductAction(formData: FormData) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) throw new Error('Unauthorized')

  const title = (formData.get('title') as string)?.trim()
  const price = parseFloat(formData.get('price') as string) || 0
  const oldPriceRaw = formData.get('old_price') as string
  const oldPrice = oldPriceRaw ? parseFloat(oldPriceRaw) : null
  const skuInput = (formData.get('sku') as string)?.trim()
  const stock_quantity = parseInt(formData.get('stock_quantity') as string, 10) || 0
  const category_name = (formData.get('category_name') as string)?.trim() || 'General'
  const description = (formData.get('description') as string)?.trim() || ''
  const imageUrl = (formData.get('image_url') as string)?.trim() || '/logo.jpeg'
  const is_featured = formData.get('is_featured') === 'true'
  const is_bestseller = formData.get('is_bestseller') === 'true'
  const is_trending = formData.get('is_trending') === 'true'

  if (!title) {
    return { error: 'Title is required' }
  }

  const sku = skuInput || `EBEE-${Date.now().toString().slice(-6)}`
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Date.now().toString().slice(-4)}`

  const supabase = await createClient()

  // 1. Insert product
  const { data: product, error: prodErr } = await supabase
    .from('products')
    .insert([
      {
        title,
        slug,
        sku,
        price,
        old_price: oldPrice,
        stock_quantity,
        category_name,
        description,
        is_featured,
        is_bestseller,
        is_trending,
        in_stock: stock_quantity > 0,
      },
    ])
    .select()
    .single()

  if (prodErr) {
    console.error('Error inserting product:', prodErr)
    return { error: prodErr.message }
  }

  // 2. Insert image
  if (product && imageUrl) {
    await supabase.from('product_images').insert([
      {
        product_id: product.id,
        url: imageUrl,
        is_thumbnail: true,
        display_order: 0,
      },
    ])
  }

  revalidatePath('/admin')
  revalidatePath('/shop')
  revalidatePath('/')
  return { success: true, product }
}

export async function updateProductAction(data: {
  id: string
  title: string
  price: number
  old_price?: number | null
  stock_quantity: number
  category_name?: string
  description?: string
  image_url?: string
  is_featured?: boolean
  is_bestseller?: boolean
  is_trending?: boolean
}) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) throw new Error('Unauthorized')

  const supabase = await createClient()

  const { error: prodErr } = await supabase
    .from('products')
    .update({
      title: data.title,
      price: data.price,
      old_price: data.old_price,
      stock_quantity: data.stock_quantity,
      category_name: data.category_name,
      description: data.description,
      is_featured: data.is_featured,
      is_bestseller: data.is_bestseller,
      is_trending: data.is_trending,
      in_stock: data.stock_quantity > 0,
      updated_at: new Date().toISOString(),
    })
    .eq('id', data.id)

  if (prodErr) {
    console.error('Error updating product:', prodErr)
    return { error: prodErr.message }
  }

  // Update thumbnail image if provided
  if (data.image_url) {
    const { data: existingImg } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', data.id)
      .eq('is_thumbnail', true)
      .maybeSingle()

    if (existingImg) {
      await supabase
        .from('product_images')
        .update({ url: data.image_url })
        .eq('id', existingImg.id)
    } else {
      await supabase.from('product_images').insert([
        {
          product_id: data.id,
          url: data.image_url,
          is_thumbnail: true,
          display_order: 0,
        },
      ])
    }
  }

  revalidatePath('/admin')
  revalidatePath('/shop')
  revalidatePath('/')
  return { success: true }
}

export async function deleteProductAction(id: string) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/shop')
  revalidatePath('/')
  return { success: true }
}

// ----------------------------------------------------
// CATEGORY ACTIONS
// ----------------------------------------------------

export async function createCategoryAction(formData: FormData) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) throw new Error('Unauthorized')

  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || ''
  const image_url = (formData.get('image_url') as string)?.trim() || ''

  if (!name) return { error: 'Category name is required' }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name, slug, description, image_url, is_active: true }])
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/shop')
  revalidatePath('/')
  return { success: true, category: data }
}

export async function deleteCategoryAction(id: string) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) throw new Error('Unauthorized')

  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}

// ----------------------------------------------------
// POS (POINT OF SALE) ACTIONS
// ----------------------------------------------------

export interface POSCartItem {
  id: string
  title: string
  price: number
  sku: string
  quantity: number
  thumbnail: string
}

export async function submitPOSSaleAction(data: {
  customerName: string
  customerPhone?: string
  paymentMethod: 'cash' | 'card' | 'bank_transfer'
  discountAmount?: number
  items: POSCartItem[]
}) {
  const isAuth = await isAdminAuthenticated()
  if (!isAuth) throw new Error('Unauthorized')

  if (!data.items || data.items.length === 0) {
    return { error: 'Cart is empty' }
  }

  // Use service role client to ensure RLS does not block POS order recording
  const supabase = createAdminClient()

  const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = data.discountAmount || 0
  const total = Math.max(0, subtotal - discount)
  const orderNumber = `POS-${Date.now().toString().slice(-6)}`

  // 1. Create order record in orders table
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert([
      {
        order_number: orderNumber,
        customer_name: data.customerName || 'Walk-in Customer',
        customer_phone: data.customerPhone || 'Walk-in',
        status: 'delivered',
        payment_method: data.paymentMethod === 'cash' ? 'cod' : data.paymentMethod,
        payment_status: 'paid',
        subtotal,
        discount_amount: discount,
        shipping_fee: 0,
        total_amount: total,
        shipping_address: {
          address: 'Store Counter POS (Walk-in Purchase)',
          city: 'In-Store',
        },
        notes: `In-Store Point of Sale Checkout (Paid via ${data.paymentMethod.toUpperCase()})`,
      },
    ])
    .select()
    .single()

  if (orderErr) {
    console.error('POS order error:', orderErr)
    return { error: orderErr.message }
  }

  // 2. Create order items & deduct stock
  for (const item of data.items) {
    await supabase.from('order_items').insert([
      {
        order_id: order.id,
        product_id: item.id,
        product_name: item.title,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      },
    ])

    // Decrement stock quantity
    const { data: prod } = await supabase
      .from('products')
      .select('stock_quantity')
      .eq('id', item.id)
      .single()

    if (prod) {
      const newStock = Math.max(0, (prod.stock_quantity || 0) - item.quantity)
      await supabase
        .from('products')
        .update({
          stock_quantity: newStock,
          in_stock: newStock > 0,
        })
        .eq('id', item.id)
    }
  }

  revalidatePath('/admin')
  revalidatePath('/shop')
  return { success: true, orderNumber, total }
}
