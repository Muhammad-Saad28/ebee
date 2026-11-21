import { getProducts, getCategories } from '@/lib/products'
import { Hero } from '@/components/home/Hero'
import { ValuePropositionsBar } from '@/components/home/ValuePropositionsBar'
import { CategoryCarousel } from '@/components/home/CategoryCarousel'
import { TrendingBentoSection } from '@/components/home/TrendingBentoSection'
import { PromotionalBanner } from '@/components/home/PromotionalBanner'
import { ProductSection } from '@/components/home/ProductSection'
import { AuthenticationProtocolBar } from '@/components/home/AuthenticationProtocolBar'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [
    categories,
    featuredProducts,
    trendingProducts,
  ] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ trending: true, limit: 8 }),
  ])

  return (
    <div className="w-full relative">
      {/* 1. Atmospheric Obsidian Electric Hero with hero-bg canvas */}
      <Hero featuredProducts={featuredProducts} />

      {/* 2. Value Propositions Bar (White 3D Buttons) */}
      <ValuePropositionsBar />

      {/* 3. Moving Category Carousel (Flows Left to Right) */}
      <div className="w-full pt-6 pb-4 border-b border-[rgba(187,216,255,0.12)]">
        <CategoryCarousel categories={categories} />
      </div>

      {/* 4. Marketplace Canvas: Translucent dark backdrop revealing studio Gaussian blur */}
      <div className="w-full text-[#247BFF] pt-12 pb-16 relative">
        
        {/* Additional Subtle Ambient Gaussian Blur Nodes behind the product cards and banners */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[850px] lg:w-[1200px] h-[500px] rounded-full bg-[#398BFF]/12 blur-[170px] pointer-events-none -z-10" />
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-[650px] lg:w-[900px] h-[350px] rounded-full bg-white/[0.06] blur-[140px] pointer-events-none -z-10" />

        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-[900px] lg:w-[1300px] h-[550px] rounded-full bg-[#247BFF]/12 blur-[180px] pointer-events-none -z-10" />
        <div className="absolute top-[68%] left-1/2 -translate-x-1/2 w-[700px] lg:w-[950px] h-[380px] rounded-full bg-white/[0.06] blur-[150px] pointer-events-none -z-10" />

        {/* 4.1 Trending Right Now: White 3D Bento Cards with Blue Text */}
        <TrendingBentoSection />

        {/* 4.2 High-Impact Kinetic Cobalt Promotional Banner */}
        <PromotionalBanner />

        {/* 4.3 Precision Inventory: Featured Flagships (White Cards with Blue Text) */}
        <ProductSection
          badge="Precision Inventory"
          title="Featured Flagships & New Arrivals"
          subtitle="Directly imported, verified authentic and ready for instant dispatch."
          products={featuredProducts.length > 0 ? featuredProducts : trendingProducts}
          viewAllHref="/shop"
        />

        {/* 4.4 Live Telemetry & Direct Cross-Border Authentication Protocol */}
        <AuthenticationProtocolBar />

      </div>
    </div>
  )
}
