import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Product } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'

interface ProductSectionProps {
  badge?: string
  title: string
  subtitle?: string
  products: Product[]
  viewAllHref?: string
  variant?: 'featured' | 'bestsellers' | 'trending' | 'automobiles' | 'default'
}

export function ProductSection({
  badge = 'Precision Inventory',
  title,
  subtitle,
  products,
  viewAllHref = '/shop',
}: ProductSectionProps) {
  if (!products || products.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs text-white uppercase tracking-wider block mb-1 font-bold">
            {badge}
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="font-body text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl font-normal">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 font-body text-xs sm:text-sm">
          <span className="text-slate-300 font-mono font-medium">
            Showing {products.length} of 42 Flagships
          </span>
          <Link
            href={viewAllHref}
            className="font-headline text-xs font-bold text-white hover:text-[#247BFF] hover:underline flex items-center gap-1.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#247BFF]" />
          </Link>
        </div>
      </div>

      {/* 4-Column Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
