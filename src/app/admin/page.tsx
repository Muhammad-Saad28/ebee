import { redirect } from 'next/navigation'
import { getProducts, getCategories } from '@/lib/products'
import { isAdminAuthenticated } from '@/lib/adminAuth'
import { createClient } from '@/lib/supabase/server'
import { AdminDashboardClient } from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const supabase = await createClient()

  const [productsCountRes, categories, ordersRes, salesMetricsRes] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    getCategories(),
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(50),
    supabase
      .from('orders')
      .select('status, total_amount, payment_status, order_items(quantity)'),
  ])

  // Fetch initial products for display & POS
  const initialProducts = await getProducts({ limit: 100 })

  const totalProductsCount = productsCountRes.count ?? 1708
  const initialOrders = ordersRes.data || []
  const allOrdersForStats = salesMetricsRes.data || []

  const totalRevenue = allOrdersForStats.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
  const totalUnitsSold = allOrdersForStats.reduce((sum, o) => {
    const items = o.order_items || []
    return sum + items.reduce((iSum: number, item: any) => iSum + (Number(item.quantity) || 0), 0)
  }, 0)

  return (
    <AdminDashboardClient
      initialProducts={initialProducts}
      totalProductsCount={totalProductsCount}
      categories={categories}
      initialOrders={initialOrders}
      stats={{
        totalOrders: allOrdersForStats.length,
        totalRevenue,
        totalUnitsSold,
        totalCategories: categories.length,
      }}
    />
  )
}
