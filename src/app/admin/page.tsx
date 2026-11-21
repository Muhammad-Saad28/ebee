import { getProducts, getCategories } from '@/lib/products'
import { AdminDashboardClient } from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [products, categories] = await Promise.all([
    getProducts({ limit: 100 }),
    getCategories(),
  ])

  return (
    <AdminDashboardClient initialProducts={products} categories={categories} />
  )
}
