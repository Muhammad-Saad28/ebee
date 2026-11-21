import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug, getRelatedProducts } from '@/lib/products'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductPurchaseActions } from '@/components/product/ProductPurchaseActions'
import { ProductSection } from '@/components/home/ProductSection'
import { formatPKR } from '@/lib/utils'
import { Star, Truck, ShieldCheck, RotateCcw, Check } from 'lucide-react'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product, 4)

  return (
    <div className="min-h-screen bg-[#080B12] py-8 sm:py-12 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-[#929EAF] flex items-center gap-2 mb-8">
          <Link href="/" className="hover:text-[#F4F7FC]">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#F4F7FC]">Catalog</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category_slug}`} className="hover:text-[#F4F7FC]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#A9D4FF] truncate max-w-xs">{product.title}</span>
        </div>

        {/* Main Product Showcase: Left Gallery, Right Details & Purchase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Product Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} title={product.title} />
          </div>

          {/* Product Info & Purchase Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header: Category, SKU, Title, Rating */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#929EAF] mb-2">
                <span className="text-[#3478F6] font-semibold">{product.category}</span>
                <span className="font-mono text-[11px] bg-[#101725] px-2 py-0.5 rounded border border-white/[0.08]">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7FC] leading-snug">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="text-sm font-bold text-[#F4F7FC]">{product.rating}</span>
                <span className="text-xs text-[#929EAF]">({product.review_count} verified reviews)</span>
                <span className="text-white/20">•</span>
                <span className="text-xs text-[#36C98F] font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock
                </span>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="p-4 rounded-2xl bg-[#101725] border border-white/[0.08] space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#F4F7FC]">
                  {formatPKR(product.price)}
                </span>
                {product.old_price && (
                  <span className="text-base text-[#929EAF] line-through font-normal">
                    {formatPKR(product.old_price)}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[#3478F6] text-white text-xs font-black">
                    SAVE {product.discount}%
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#929EAF]">
                Taxes included. Cash on Delivery payable upon arrival.
              </p>
            </div>

            {/* Purchase Actions (Quantity, Add to Cart, Buy Now, Wishlist) */}
            <ProductPurchaseActions product={product} />

            {/* Value Guarantees Box */}
            <div className="p-4 rounded-2xl bg-[#111B2B] border border-white/[0.06] space-y-3 text-xs">
              <div className="flex items-center gap-3 text-[#F4F7FC]">
                <Truck className="w-4 h-4 text-[#3478F6] flex-shrink-0" />
                <span>Express Nationwide Courier Delivery (2-4 business days)</span>
              </div>
              <div className="flex items-center gap-3 text-[#F4F7FC]">
                <ShieldCheck className="w-4 h-4 text-[#3478F6] flex-shrink-0" />
                <span>100% Cash on Delivery across Pakistan</span>
              </div>
              <div className="flex items-center gap-3 text-[#F4F7FC]">
                <RotateCcw className="w-4 h-4 text-[#3478F6] flex-shrink-0" />
                <span>7-Day Replacement policy for damaged or defective units</span>
              </div>
            </div>

          </div>

        </div>

        {/* Product Description & Specifications Section */}
        <div className="mt-16 pt-12 border-t border-white/[0.08]">
          <div className="max-w-4xl space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#F4F7FC]">
              Product Overview & Details
            </h2>
            <div className="text-sm text-[#929EAF] leading-relaxed whitespace-pre-line space-y-4">
              <p>{product.description}</p>
            </div>

            {/* Specifications Snapshot */}
            <div className="mt-8 rounded-2xl bg-[#101725] border border-white/[0.08] p-6 space-y-4">
              <h3 className="text-sm font-bold text-[#F4F7FC] uppercase tracking-wider">
                Product Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-[#929EAF]">Stock Keeping Unit (SKU)</span>
                  <span className="text-[#F4F7FC] font-mono">{product.sku}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-[#929EAF]">Primary Category</span>
                  <span className="text-[#F4F7FC]">{product.category}</span>
                </div>
                {product.subcategory && (
                  <div className="flex justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-[#929EAF]">Subcategory</span>
                    <span className="text-[#F4F7FC]">{product.subcategory}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-[#929EAF]">Availability Status</span>
                  <span className="text-[#36C98F] font-semibold">Available for Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Recommendations */}
        <div className="mt-16">
          <ProductSection
            badge="Recommended"
            title="Related Products"
            subtitle={`Explore other popular items in ${product.category}`}
            products={relatedProducts}
            viewAllHref={`/shop?category=${product.category_slug}`}
          />
        </div>

      </div>
    </div>
  )
}
