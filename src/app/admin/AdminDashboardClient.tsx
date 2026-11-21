'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Package,
  FolderTree,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Search,
  Plus,
  Edit2,
  Trash2,
  Save,
  Check
} from 'lucide-react'
import { Product, Category } from '@/types'
import { formatPKR } from '@/lib/utils'

interface AdminDashboardClientProps {
  initialProducts: Product[]
  categories: Category[]
}

export function AdminDashboardClient({
  initialProducts,
  categories,
}: AdminDashboardClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Quick stats
  const totalProducts = 1894
  const lowStockCount = products.filter((p) => p.stock_quantity <= 5).length
  const totalCategories = categories.length

  const filteredProducts = products.filter((p) => {
    const matchQuery =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = selectedCategory ? p.category_slug === selectedCategory : true
    return matchQuery && matchCat
  })

  const handleEditClick = (p: Product) => {
    setEditingProduct({ ...p })
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    setProducts((prev) =>
      prev.map((item) => (item.id === editingProduct.id ? editingProduct : item))
    )
    setEditingProduct(null)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2000)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this product from the catalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-[#080B12] py-8 sm:py-12 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#3478F6] uppercase tracking-widest">
              Store Administration
            </span>
            <h1 className="text-3xl font-black text-[#F4F7FC] mt-1">
              Catalog & Inventory Control Center
            </h1>
          </div>
          {savedSuccess && (
            <div className="px-4 py-2 rounded-xl bg-[#36C98F]/10 border border-[#36C98F]/30 text-xs font-semibold text-[#36C98F] flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-4 h-4" /> Changes Saved Successfully
            </div>
          )}
        </div>

        {/* Analytics Snapshot Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#101725] border border-white/[0.08] space-y-1">
            <div className="flex items-center justify-between text-[#929EAF]">
              <span className="text-xs">Live Catalog</span>
              <Package className="w-4 h-4 text-[#3478F6]" />
            </div>
            <p className="text-2xl font-black text-[#F4F7FC]">{totalProducts}</p>
            <p className="text-[11px] text-[#36C98F]">Active Products in PostgreSQL</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#101725] border border-white/[0.08] space-y-1">
            <div className="flex items-center justify-between text-[#929EAF]">
              <span className="text-xs">Categories</span>
              <FolderTree className="w-4 h-4 text-[#A9D4FF]" />
            </div>
            <p className="text-2xl font-black text-[#F4F7FC]">{totalCategories}</p>
            <p className="text-[11px] text-[#929EAF]">Hierarchical Departments</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#101725] border border-white/[0.08] space-y-1">
            <div className="flex items-center justify-between text-[#929EAF]">
              <span className="text-xs">COD Orders</span>
              <TrendingUp className="w-4 h-4 text-[#36C98F]" />
            </div>
            <p className="text-2xl font-black text-[#F4F7FC]">Active</p>
            <p className="text-[11px] text-[#36C98F]">Doorstep Delivery Pipeline</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#101725] border border-white/[0.08] space-y-1">
            <div className="flex items-center justify-between text-[#929EAF]">
              <span className="text-xs">Free Shipping Rule</span>
              <DollarSign className="w-4 h-4 text-[#3478F6]" />
            </div>
            <p className="text-2xl font-black text-[#F4F7FC]">Rs. 2,999</p>
            <p className="text-[11px] text-[#929EAF]">Configured Threshold</p>
          </div>
        </div>

        {/* Product Management Section */}
        <div className="rounded-3xl bg-[#101725] border border-white/[0.08] overflow-hidden">
          
          {/* Filter Bar */}
          <div className="p-5 border-b border-white/[0.08] flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search products or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F4F7FC] outline-none focus:border-[#3478F6]"
              />
              <Search className="w-4 h-4 text-[#929EAF] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#080B12] border border-white/[0.08] text-xs text-[#F4F7FC] rounded-xl px-3 py-2 outline-none focus:border-[#3478F6]"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080B12] text-[#929EAF] border-b border-white/[0.06] font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (PKR)</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-[#F4F7FC]">
                {filteredProducts.slice(0, 20).map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg bg-[#080B12] border border-white/[0.06] overflow-hidden flex-shrink-0">
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-medium line-clamp-1 max-w-xs">{product.title}</span>
                    </td>
                    <td className="p-4 font-mono text-[#929EAF]">{product.sku}</td>
                    <td className="p-4 text-[#929EAF]">{product.category}</td>
                    <td className="p-4 font-bold text-[#3478F6]">{formatPKR(product.price)}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#36C98F]/10 text-[#36C98F] text-[10px] font-bold">
                        {product.stock_quantity} in stock
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-[#3478F6] text-[#F4F7FC] transition-colors"
                          aria-label="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-red-500 text-[#929EAF] hover:text-white transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#080B12] border-t border-white/[0.06] text-[11px] text-[#929EAF] flex items-center justify-between">
            <span>Showing top 20 of {filteredProducts.length} matching products</span>
            <span>Real Ebee.pk Catalog Dataset</span>
          </div>

        </div>

      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#101725] border border-white/[0.08] p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-[#F4F7FC]">Edit Product</h3>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#929EAF] block mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-3 py-2 text-[#F4F7FC] outline-none focus:border-[#3478F6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#929EAF] block mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-3 py-2 text-[#F4F7FC] outline-none focus:border-[#3478F6]"
                  />
                </div>

                <div>
                  <label className="text-[#929EAF] block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock_quantity}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock_quantity: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-3 py-2 text-[#F4F7FC] outline-none focus:border-[#3478F6]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-white/[0.1] text-[#929EAF] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#3478F6] hover:bg-[#2563EB] text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
