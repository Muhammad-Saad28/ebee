import { Suspense } from 'react'
import { getProducts, getCategories } from '@/lib/products'
import { ShopFilters } from '@/components/shop/ShopFilters'
import { ProductCard } from '@/components/product/ProductCard'
import { SlidersHorizontal } from 'lucide-react'

interface ShopPageProps {
  searchParams: Promise<{
    category?: string
    subcategory?: string
    featured?: string
    bestseller?: string
    trending?: string
    q?: string
    sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest'
    minPrice?: string
    maxPrice?: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams

  const category = params.category
  const subcategory = params.subcategory
  const featured = params.featured === 'true'
  const bestseller = params.bestseller === 'true'
  const trending = params.trending === 'true'
  const search = params.q
  const sortBy = params.sort || 'newest'
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      category,
      subcategory,
      featured,
      bestseller,
      trending,
      search,
      sortBy,
      minPrice,
      maxPrice,
      limit: 60,
    }),
  ])

  const activeCategoryObj = categories.find((c) => c.slug === category)

  return (
    <div className="min-h-screen py-8 sm:py-12 border-b border-[rgba(187,216,255,0.12)] relative">
      {/* Shop Page Local Studio Gaussian Spotlights */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] lg:w-[1200px] h-[450px] rounded-full bg-[#398BFF]/20 blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[600px] lg:w-[900px] h-[300px] rounded-full bg-white/[0.10] blur-[130px] pointer-events-none -z-10" />

      <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-[850px] lg:w-[1300px] h-[500px] rounded-full bg-[#247BFF]/20 blur-[170px] pointer-events-none -z-10" />
      <div className="absolute top-[58%] left-1/2 -translate-x-1/2 w-[650px] lg:w-[950px] h-[350px] rounded-full bg-white/[0.10] blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Page Title in Pure White */}
        <div className="mb-8">
          <div className="text-xs text-slate-400 flex items-center gap-2 mb-2 font-mono font-medium">
            <span className="hover:text-white cursor-pointer">Home</span>
            <span>/</span>
            <span className="text-white font-bold">Catalog</span>
            {activeCategoryObj && (
              <>
                <span>/</span>
                <span className="text-[#247BFF] font-bold">{activeCategoryObj.name}</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {search
                  ? `Search: "${search}"`
                  : activeCategoryObj
                  ? activeCategoryObj.name
                  : featured
                  ? 'Featured Flagships'
                  : bestseller
                  ? 'Best Sellers'
                  : trending
                  ? 'Trending Offers'
                  : 'All Products'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-normal">
                Showing <strong className="text-white font-bold">{products.length}</strong> available items
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div className="h-40 rounded-2xl bg-[#111827] animate-pulse" />}>
              <ShopFilters
                categories={categories}
                activeCategory={category}
                activeSubcategory={subcategory}
                activeSort={sortBy}
                searchQuery={search}
              />
            </Suspense>
          </div>

          {/* Product Grid (Pure White Cards with Gaussian Corner Blur & Blue Text) */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-4 shadow-[0_12px_32px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,1)_inset,0_4px_0_#CBD5E1]">
                {/* Diagonal Deep Blue Gaussian Nodes matching Card Style */}
                <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#1e488f]/30 blur-[45px] pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#204d96]/35 blur-[50px] pointer-events-none" />
                <div className="absolute inset-8 rounded-full bg-white/70 blur-[35px] pointer-events-none" />

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#247BFF] mx-auto mb-3 shadow-xs">
                    <SlidersHorizontal className="w-8 h-8 text-[#247BFF]" />
                  </div>
                  <h3 className="text-xl font-headline font-bold text-[#146BFF]">No products found</h3>
                  <p className="text-xs sm:text-sm text-[#247BFF]/80 max-w-sm mx-auto font-medium mt-1">
                    Try adjusting your search keywords, price filters, or category selection to find what you are looking for.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
