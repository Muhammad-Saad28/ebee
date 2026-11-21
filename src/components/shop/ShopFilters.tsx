'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X, ArrowUpDown, ChevronDown, Check, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { Category } from '@/types'

interface ShopFiltersProps {
  categories: Category[]
  activeCategory?: string
  activeSubcategory?: string
  activeSort: string
  searchQuery?: string
}

export function ShopFilters({
  categories,
  activeCategory,
  activeSubcategory,
  activeSort,
  searchQuery,
}: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const applyParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/shop?${params.toString()}`)
  }

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')

    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')

    router.push(`/shop?${params.toString()}`)
  }

  const handleResetFilters = () => {
    router.push('/shop')
  }

  const activeCatObj = categories.find((c) => c.slug === activeCategory)

  const filterContent = (
    <div className="space-y-5">
      
      {/* Sort By Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-4 shadow-[0_6px_16px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,1)_inset,0_3px_0_#CBD5E1]">
        {/* Diagonal Deep Blue Gaussian Nodes */}
        <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-[#1e488f]/25 blur-[28px] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#204d96]/30 blur-[32px] pointer-events-none" />
        <div className="absolute inset-4 rounded-full bg-white/60 blur-[20px] pointer-events-none" />

        <div className="relative z-10">
          <label className="text-xs font-bold text-[#146BFF] uppercase tracking-wider flex items-center gap-2 mb-3">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#146BFF]" />
            <span>Sort Products</span>
          </label>
          <div className="relative">
            <select
              value={activeSort}
              onChange={(e) => applyParam('sort', e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#BFDBFE]/60 text-xs text-[#0F172A] rounded-xl p-2.5 outline-none focus:border-[#146BFF] appearance-none cursor-pointer font-medium"
            >
              <option value="newest">Featured & Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#247BFF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Selection Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-4 shadow-[0_6px_16px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,1)_inset,0_3px_0_#CBD5E1]">
        {/* Diagonal Deep Blue Gaussian Nodes */}
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-[#1e488f]/25 blur-[28px] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-[#204d96]/30 blur-[32px] pointer-events-none" />
        <div className="absolute inset-4 rounded-full bg-white/60 blur-[20px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 border-b border-[#BFDBFE]/40 pb-2">
            <label className="text-xs font-bold text-[#146BFF] uppercase tracking-wider">
              Categories
            </label>
            {activeCategory && (
              <button
                onClick={() => applyParam('category', null)}
                className="text-[11px] font-semibold text-[#146BFF] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.slug
              return (
                <button
                  key={cat.slug}
                  onClick={() => {
                    applyParam('category', isSelected ? null : cat.slug)
                    applyParam('subcategory', null)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                    isSelected
                      ? 'bg-[#146BFF] text-white font-bold shadow-xs'
                      : 'text-[#247BFF]/90 font-medium hover:text-[#0052CC] hover:bg-blue-50/60'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#247BFF] font-bold'}`}>
                    {cat.product_count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Subcategory Filter */}
      {activeCatObj && (activeCatObj.subcategories?.length ?? 0) > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-4 shadow-[0_6px_16px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,1)_inset,0_3px_0_#CBD5E1]">
          {/* Diagonal Deep Blue Gaussian Nodes */}
          <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-[#1e488f]/25 blur-[28px] pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#204d96]/30 blur-[32px] pointer-events-none" />
          <div className="absolute inset-4 rounded-full bg-white/60 blur-[20px] pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 border-b border-[#BFDBFE]/40 pb-2">
              <label className="text-xs font-bold text-[#146BFF] uppercase tracking-wider">
                Subcategories
              </label>
              {activeSubcategory && (
                <button
                  onClick={() => applyParam('subcategory', null)}
                  className="text-[11px] font-semibold text-[#146BFF] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {activeCatObj.subcategories?.map((sub) => {
                const isSelected = activeSubcategory === sub
                return (
                  <button
                    key={sub}
                    onClick={() => applyParam('subcategory', isSelected ? null : sub)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-all text-left ${
                      isSelected
                        ? 'bg-[#146BFF]/10 text-[#146BFF] font-bold'
                        : 'text-[#247BFF]/90 font-medium hover:text-[#0052CC] hover:bg-blue-50/60'
                    }`}
                  >
                    <span className="truncate">{sub}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#146BFF]" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Price Range Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-4 shadow-[0_6px_16px_rgba(0,0,0,0.35),0_1px_0_rgba(255,255,255,1)_inset,0_3px_0_#CBD5E1]">
        {/* Diagonal Deep Blue Gaussian Nodes */}
        <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full bg-[#1e488f]/25 blur-[28px] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#204d96]/30 blur-[32px] pointer-events-none" />
        <div className="absolute inset-4 rounded-full bg-white/60 blur-[20px] pointer-events-none" />

        <div className="relative z-10">
          <label className="text-xs font-bold text-[#146BFF] uppercase tracking-wider block mb-3">
            Price Range (PKR)
          </label>
          <form onSubmit={handlePriceApply} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  placeholder="Min Rs."
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#BFDBFE]/60 rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-slate-400 outline-none focus:border-[#146BFF] font-mono font-medium"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max Rs."
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#BFDBFE]/60 rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-slate-400 outline-none focus:border-[#146BFF] font-mono font-medium"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#247BFF] hover:bg-[#146BFF] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_2px_8px_rgba(36,123,255,0.35),0_2px_0_#0272e4] hover:scale-[1.02] active:scale-95"
            >
              Apply Price Filter
            </button>
          </form>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={handleResetFilters}
        className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-[#146BFF] hover:bg-blue-50/50 flex items-center justify-center gap-2 transition-all shadow-[0_3px_8px_rgba(0,0,0,0.1),0_2px_0_#CBD5E1] hover:scale-[1.02] active:scale-95"
      >
        <RotateCcw className="w-3.5 h-3.5 text-[#146BFF]" />
        <span>Reset All Filters</span>
      </button>

    </div>
  )

  return (
    <>
      {/* Desktop Filters Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
        <div className="sticky top-28">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Filter Trigger Button */}
      <div className="lg:hidden mb-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex-1 py-3 px-4 rounded-xl bg-white border border-[#E2E8F0] text-xs font-bold text-[#0F172A] flex items-center justify-center gap-2 shadow-xs"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#146BFF]" />
          <span>Filter & Sort Products</span>
        </button>

        {(activeCategory || activeSubcategory || minPrice || maxPrice) && (
          <button
            onClick={handleResetFilters}
            className="py-3 px-4 rounded-xl bg-white border border-[#E2E8F0] text-xs font-semibold text-rose-500 hover:text-rose-600 shrink-0 shadow-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Mobile Drawer Backdrop & Modal */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-[#F3F6FB] border-l border-[#E2E8F0] p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
                <span className="text-sm font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#146BFF]" /> Filter Store
                </span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-slate-500 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {filterContent}
            </div>

            <div className="pt-6 border-t border-[#E2E8F0] mt-6">
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full py-3.5 rounded-xl bg-[#146BFF] hover:bg-[#0056E0] text-white text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
