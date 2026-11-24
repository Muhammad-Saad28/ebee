'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  ChevronDown,
  Zap,
  Headphones,
  Watch,
  Car,
  Camera,
  Layers,
  ArrowRight,
  Sparkles,
  Smartphone,
  Laptop,
  Shirt,
  Flame,
  User,
  ShieldCheck,
  Home,
  Dumbbell,
  Baby,
  Cigarette
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { Product, Category } from '@/types'
import { formatPKR } from '@/lib/utils'

interface HeaderProps {
  categories: Category[]
}

export function Header({ categories }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toggleCart, getTotalItems } = useCartStore()
  const { getTotalItems: getWishlistTotal } = useWishlistStore()

  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const catalogMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Live search suggestion debouncer
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=5`)
        if (res.ok) {
          const data = await res.json()
          setSuggestions(data.products || [])
        }
      } catch (err) {
        console.error('Failed to fetch search suggestions:', err)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
      if (catalogMenuRef.current && !catalogMenuRef.current.contains(event.target as Node)) {
        setIsCatalogOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      setIsCatalogOpen(false)
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const cartCount = mounted ? getTotalItems() : 0
  const wishlistCount = mounted ? getWishlistTotal() : 0

  function getDynamicCategoryIcon(slug: string) {
    const s = slug.toLowerCase()
    if (s.includes('phone') || s.includes('tablet')) return Smartphone
    if (s.includes('computer') || s.includes('laptop')) return Laptop
    if (s.includes('camera')) return Camera
    if (s.includes('watch') || s.includes('wearable')) return Watch
    if (s.includes('fashion')) return Shirt
    if (s.includes('home') || s.includes('living')) return Home
    if (s.includes('auto') || s.includes('car')) return Car
    if (s.includes('sport') || s.includes('fitness')) return Dumbbell
    if (s.includes('kid') || s.includes('toy')) return Baby
    if (s.includes('tobacco')) return Cigarette
    if (s.includes('appliance')) return Zap
    return Layers
  }

  const dynamicCatalogItems = categories && categories.length > 0
    ? categories.map((cat) => ({
        name: cat.name,
        slug: cat.slug,
        icon: getDynamicCategoryIcon(cat.slug),
        desc: cat.product_count !== undefined ? `${cat.product_count} products` : 'Browse collection',
      }))
    : [
        { name: 'Automotive', slug: 'automotive', icon: Car, desc: 'Car accessories & parts' },
        { name: 'Fashion', slug: 'fashion', icon: Shirt, desc: 'Jewelry & accessories' },
        { name: 'Home And Living', slug: 'home-and-living', icon: Home, desc: 'Home essentials' },
        { name: 'Computer And Laptop', slug: 'computer-and-laptop', icon: Laptop, desc: 'Gadgets & peripherals' },
        { name: 'Home Appliances', slug: 'home-appliances', icon: Zap, desc: 'Smart appliances' },
      ]

  const catalogItems = [
    { name: 'All Products (Full Catalog)', slug: '', icon: Layers, desc: 'Browse complete inventory' },
    ...dynamicCatalogItems,
  ]

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#07090F]/75 backdrop-blur-2xl border-b border-[rgba(187,216,255,0.18)] shadow-[0_12px_40px_rgba(0,0,0,0.85),0_1px_0_rgba(255,255,255,0.06)_inset]'
          : 'bg-[#07090F]/60 backdrop-blur-xl border-b border-[rgba(187,216,255,0.12)] shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 lg:gap-6">
          
          {/* Official Brand Logo with Rounded Square Glass Card & Gaussian Blur */}
          <Link href="/" className="flex items-center shrink-0 group">
            <div className="relative h-12 px-3.5 rounded-2xl bg-white p-1.5 border border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,1)_inset,0_3px_0_#CBD5E1] hover:shadow-[0_12px_28px_rgba(36,123,255,0.35),0_0_20px_rgba(36,123,255,0.25),0_3px_0_#247BFF] hover:border-[#247BFF]/60 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-all duration-300">
              
              {/* Gaussian Blur Glow System matching Product Cards */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-0">
                {/* Top-Left Diagonal Deep Blue Gaussian Node */}
                <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-[#1e488f]/35 blur-[16px] group-hover:scale-125 transition-transform duration-500" />
                {/* Bottom-Right Diagonal Deep Blue Gaussian Node */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-[#204d96]/40 blur-[18px] group-hover:scale-125 transition-transform duration-500" />
                {/* Central Luminous White Glow Node */}
                <div className="absolute inset-1 rounded-xl bg-white/75 blur-[10px]" />
              </div>

              {/* Logo Image */}
              <div className="relative h-8 w-24 sm:w-28 z-10 flex items-center justify-center">
                <Image
                  src="/logo-cropped.png"
                  alt="EBEE.PK Official Logo"
                  fill
                  priority
                  sizes="(max-width: 640px) 96px, 112px"
                  className="object-contain"
                />
              </div>
            </div>
          </Link>

          {/* Frosted Glass Navigation Dock (Obsidian Electric Pill Capsule) */}
          <nav className="hidden xl:flex items-center gap-1.5 p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.1] backdrop-blur-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.08)_inset] transition-all">
            
            {/* Products */}
            <Link
              href="/shop"
              className={`px-3.5 py-1.5 rounded-full text-xs font-headline font-semibold transition-all duration-200 ${
                pathname === '/shop' && !pathname.includes('bestseller') && !isCatalogOpen
                  ? 'bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                  : 'text-[#c2c6d7] hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              Products
            </Link>

            {/* Catalog Dropdown Capsule */}
            <div className="relative" ref={catalogMenuRef}>
              <button
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-headline font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                  isCatalogOpen
                    ? 'bg-[#247BFF] text-white shadow-[0_0_16px_rgba(36,123,255,0.6)]'
                    : 'text-[#c2c6d7] hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Catalogue</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isCatalogOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Glass Dropdown Menu for Catalog */}
              {isCatalogOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 rounded-2xl bg-[#0c0e14]/95 border border-[rgba(187,216,255,0.22)] backdrop-blur-2xl shadow-[0_25px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(36,123,255,0.2)] p-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="text-[10px] font-mono text-[#afc6ff] uppercase px-3 py-1.5 font-bold tracking-wider border-b border-white/[0.08] flex items-center justify-between">
                    <span>Explore Department</span>
                    <Sparkles className="w-3 h-3 text-[#247BFF]" />
                  </div>
                  <div className="py-1.5 space-y-0.5">
                    {catalogItems.map((item, idx) => {
                      const Icon = item.icon
                      const href = item.slug ? `/shop?category=${item.slug}` : '/shop'
                      return (
                        <Link
                          key={idx}
                          href={href}
                          onClick={() => setIsCatalogOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#247BFF]/15 border border-[#247BFF]/30 flex items-center justify-center text-[#247BFF] group-hover:bg-[#247BFF] group-hover:text-white transition-all shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-xs font-headline font-semibold text-white group-hover:text-[#afc6ff] transition-colors leading-tight truncate">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#247BFF] group-hover:translate-x-1 transition-all" />
                        </Link>
                      )
                    })}
                  </div>
                  <div className="pt-2 border-t border-white/[0.08] px-2 flex items-center justify-between">
                    <Link
                      href="/shop?deals=true"
                      onClick={() => setIsCatalogOpen(false)}
                      className="text-[11px] font-mono font-bold text-[#afc6ff] hover:text-white flex items-center gap-1.5"
                    >
                      <Zap className="w-3 h-3 text-[#247BFF] fill-current" />
                      <span>View Deals Vault</span>
                    </Link>
                    <span className="text-[10px] text-slate-400 font-mono">100% COD</span>
                  </div>
                </div>
              )}
            </div>

            {/* Best Sellers */}
            <Link
              href="/shop?bestseller=true"
              className={`px-3.5 py-1.5 rounded-full text-xs font-headline font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                pathname.includes('bestseller=true')
                  ? 'bg-[#247BFF] text-white shadow-[0_0_14px_rgba(36,123,255,0.5)]'
                  : 'text-[#afc6ff] bg-[#247BFF]/15 hover:bg-[#247BFF]/25 border border-[#247BFF]/30'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#398BFF] fill-current" />
              <span>Best Sellers</span>
            </Link>

            {/* About */}
            <Link
              href="/about"
              className={`px-3.5 py-1.5 rounded-full text-xs font-headline font-semibold transition-all duration-200 ${
                pathname === '/about'
                  ? 'bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                  : 'text-[#c2c6d7] hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              About
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className={`px-3.5 py-1.5 rounded-full text-xs font-headline font-semibold transition-all duration-200 ${
                pathname === '/contact'
                  ? 'bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                  : 'text-[#c2c6d7] hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Glass Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative flex items-center bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.12] hover:border-[rgba(187,216,255,0.35)] focus-within:border-[#247BFF] focus-within:ring-2 focus-within:ring-[#247BFF]/25 backdrop-blur-xl rounded-full px-4 py-2 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.3),0_1px_0_rgba(255,255,255,0.06)_inset]">
                <Search className="w-4 h-4 text-[#8c90a0] mr-2 shrink-0 group-hover:text-white" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsSearchOpen(true)
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search products, brands and tech..."
                  className="w-full bg-transparent text-xs sm:text-sm text-[#e1e2eb] placeholder:text-[#8c90a0] outline-none font-body"
                />
                <kbd className="font-mono text-[9px] bg-white/[0.08] text-[#c2c6d7] px-2 py-0.5 rounded-full border border-white/[0.1] shadow-xs">
                  ⌘K
                </kbd>
              </div>
            </form>

            {/* Dropdown Predictive Search Results */}
            {isSearchOpen && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-[#0c0e14]/95 border border-[rgba(187,216,255,0.2)] rounded-2xl backdrop-blur-2xl shadow-[0_25px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(36,123,255,0.2)] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] font-mono text-[#afc6ff] uppercase px-3 py-1.5 font-bold tracking-wider border-b border-white/[0.08]">
                  Instant Matches
                </div>
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="relative w-10 h-10 rounded-lg bg-white p-1 border border-white/[0.1] overflow-hidden shrink-0">
                      <Image src={p.thumbnail} alt={p.title} fill className="object-contain p-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-headline font-semibold text-white truncate">{p.title}</p>
                      <p className="text-[11px] font-mono font-bold text-[#247BFF]">{formatPKR(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Glass Pods */}
          <div className="flex items-center gap-2.5">
            {/* Admin / Portal Login Button */}
            <Link
              href="/admin"
              className="relative hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-[#247BFF]/15 border border-white/[0.1] hover:border-[#247BFF]/40 text-[#c2c6d7] hover:text-[#BBD8FF] text-xs font-mono font-medium transition-all duration-200 shadow-sm"
              title="Admin & POS Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#247BFF]" />
              <span>Admin Login</span>
            </Link>

            {/* Glass Wishlist Pod */}
            <Link
              href="/account/wishlist"
              className="relative p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[rgba(187,216,255,0.3)] backdrop-blur-xl text-[#c2c6d7] hover:text-white transition-all shadow-sm"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-[#0272e4] text-white font-mono text-[9px] rounded-full flex items-center justify-center font-bold shadow-[0_0_8px_rgba(2,114,228,0.8)]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Glowing Glass Cart Pod */}
            <button
              onClick={toggleCart}
              className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#247BFF] hover:bg-[#398BFF] text-white font-headline text-xs font-bold transition-all duration-300 shadow-[0_0_24px_rgba(36,123,255,0.55)] hover:shadow-[0_0_32px_rgba(57,139,255,0.75)] hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Open Cart"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <ShoppingBag className="w-3 h-3 text-white" />
              </div>
              <span>Cart ({cartCount})</span>
            </button>

            {/* Mobile Menu Toggle Glass Pill */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] backdrop-blur-xl text-[#c2c6d7] hover:text-white"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Slide-Down Frosted Glass Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-[rgba(187,216,255,0.12)] space-y-3 animate-in fade-in slide-in-from-top-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
              <div className="flex items-center bg-white/[0.05] border border-white/[0.1] rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-[#8c90a0] mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent text-xs text-[#e1e2eb] outline-none"
                />
              </div>
            </form>
            <div className="flex flex-col space-y-1.5 font-body text-xs text-[#c2c6d7]">
              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-white/[0.08] hover:text-white flex items-center justify-between font-semibold"
              >
                <span>Products</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#247BFF]" />
              </Link>
              <Link
                href="/shop?bestseller=true"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg bg-[#247BFF]/15 text-[#afc6ff] font-bold flex items-center justify-between border border-[#247BFF]/30"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-[#398BFF] fill-current" />
                  <span>Best Sellers</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#247BFF]" />
              </Link>
              {catalogItems.map((item, idx) => {
                const href = item.slug ? `/shop?category=${item.slug}` : '/shop'
                return (
                  <Link
                    key={idx}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2 px-3 rounded-lg hover:bg-white/[0.08] hover:text-white flex items-center justify-between pl-6 text-slate-300"
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#247BFF]" />
                  </Link>
                )
              })}
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-white/[0.08] hover:text-white flex items-center justify-between"
              >
                <span>About</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#247BFF]" />
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-white/[0.08] hover:text-white flex items-center justify-between"
              >
                <span>Contact</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#247BFF]" />
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl bg-[#247BFF]/15 border border-[#247BFF]/30 text-[#BBD8FF] hover:bg-[#247BFF]/25 font-mono text-xs font-semibold flex items-center justify-between mt-2"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#247BFF]" />
                  <span>Admin & POS Portal</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#247BFF]" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  )
}
