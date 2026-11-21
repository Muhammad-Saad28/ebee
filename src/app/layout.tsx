import type { Metadata } from 'next'
import Image from 'next/image'
import './globals.css'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { FloatingCartWidget } from '@/components/cart/FloatingCartWidget'
import { AppLoadingScreen } from '@/components/layout/AppLoadingScreen'
import { getCategories } from '@/lib/products'

export const metadata: Metadata = {
  title: 'EBEE.PK — Next-Gen Technical Luxury & Lifestyle Marketplace',
  description:
    'High-voltage tech, acoustic audio labs, smart wearables, automobile gear, and lifestyle products with instant express delivery across Pakistan.',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const categories = await getCategories()

  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#07090F] text-[#e1e2eb] font-body selection:bg-[#247BFF] selection:text-white relative">
        
        {/* Continuous Full-Page Studio Gaussian Blur Aura System */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Luminous High-Intensity Spotlight Texture */}
          <div className="absolute inset-0 opacity-40 mix-blend-screen scale-[1.05]">
            <Image
              src="/studio-spotlight-bg.jpg"
              alt="Studio Spotlight Gradient"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Upper Center Gaussian White Node */}
          <div className="absolute top-[12%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] lg:w-[1200px] h-[500px] lg:h-[700px] rounded-full bg-white/[0.10] blur-[160px] pointer-events-none" />

          {/* Upper Electric Sky Blue Gaussian Aura */}
          <div className="absolute top-[16%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] lg:w-[1400px] h-[600px] lg:h-[850px] rounded-full bg-[#398BFF]/18 blur-[180px] pointer-events-none" />

          {/* Mid-Section (Featured Flagships & Catalog) Gaussian Lighting */}
          <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] lg:w-[1300px] h-[600px] rounded-full bg-[#247BFF]/16 blur-[170px] pointer-events-none" />
          <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] lg:w-[950px] h-[400px] rounded-full bg-white/[0.08] blur-[150px] pointer-events-none" />

          {/* Lower Pedestal & Product Section Gaussian Spotlights */}
          <div className="absolute top-[78%] left-1/2 -translate-x-1/2 w-[800px] lg:w-[1200px] h-[450px] rounded-full bg-[#398BFF]/15 blur-[160px] pointer-events-none" />
          <div className="absolute top-[82%] left-1/2 -translate-x-1/2 w-[600px] lg:w-[900px] h-[300px] rounded-full bg-white/[0.08] blur-[140px] pointer-events-none" />

          {/* Soft Deep Vignette along extreme edges only */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#07090F]/40 to-[#07090F]/85 pointer-events-none" />
        </div>

        <AppLoadingScreen />
        <AnnouncementBar />
        <Header categories={categories} />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <MobileBottomNav />
        <CartDrawer />
        <FloatingCartWidget />
      </body>
    </html>
  )
}
