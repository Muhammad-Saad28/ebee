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
  Check,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  Printer,
  Receipt,
  Minus,
  Sparkles,
  CreditCard,
  Banknote,
  RotateCcw,
  ExternalLink,
  Tag,
  Boxes,
  Eye,
  X,
  Share2,
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  BarChart3
} from 'lucide-react'
import { Product, Category } from '@/types'
import { formatPKR } from '@/lib/utils'
import {
  adminLogoutAction,
  createProductAction,
  updateProductAction,
  deleteProductAction,
  createCategoryAction,
  deleteCategoryAction,
  submitPOSSaleAction,
  POSCartItem,
} from './actions'

interface AdminDashboardClientProps {
  initialProducts: Product[]
  totalProductsCount?: number
  categories: Category[]
  initialOrders: any[]
  stats?: {
    totalOrders: number
    totalRevenue: number
    totalUnitsSold: number
    totalCategories: number
  }
}

type TabType = 'overview' | 'pos' | 'products' | 'categories' | 'orders' | 'vendors'

export interface Vendor {
  id: string
  name: string
  company: string
  phone: string
  email: string
  suppliedCategory: string
  balanceDue: number
  notes?: string
}

export function AdminDashboardClient({
  initialProducts,
  totalProductsCount = 1708,
  categories: initialCategories,
  initialOrders,
  stats,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [orders, setOrders] = useState<any[]>(initialOrders)

  // Vendors state (stored in local state + persisted in browser localStorage)
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ebee_vendors')
      if (saved) {
        try { return JSON.parse(saved) } catch {}
      }
    }
    return [
      {
        id: 'v-1',
        name: 'Tariq Auto Imports',
        company: 'Tariq & Sons Autos Ltd',
        phone: '+92 321 8847291',
        email: 'tariq.auto@gmail.com',
        suppliedCategory: 'Automotive',
        balanceDue: 0,
        notes: 'Primary supplier for car compressors, jacks & detailing supplies',
      },
      {
        id: 'v-2',
        name: 'Alpha Electronics Hub',
        company: 'Alpha Tech Lahore',
        phone: '+92 300 4492019',
        email: 'supply@alphatech.pk',
        suppliedCategory: 'Computer And Laptop',
        balanceDue: 45000,
        notes: 'Supplies USB converters, hard drive docks, audio boxes',
      },
      {
        id: 'v-3',
        name: 'Glamour Crafts & Brooches',
        company: 'Glamour Imports',
        phone: '+92 333 5592817',
        email: 'glamour.fashion@gmail.com',
        suppliedCategory: 'Fashion',
        balanceDue: 12000,
        notes: 'Supplies brooches, pins, and body tattoos',
      },
    ]
  })

  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false)
  const [newVendor, setNewVendor] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    suppliedCategory: 'Automotive',
    balanceDue: 0,
    notes: '',
  })

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVendor.name) return
    const v: Vendor = {
      id: `v-${Date.now()}`,
      ...newVendor,
    }
    const updated = [v, ...vendors]
    setVendors(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ebee_vendors', JSON.stringify(updated))
    }
    setIsAddVendorOpen(false)
    setNewVendor({
      name: '',
      company: '',
      phone: '',
      email: '',
      suppliedCategory: 'Automotive',
      balanceDue: 0,
      notes: '',
    })
    showFeedback('Vendor saved successfully')
  }

  const handleDeleteVendor = (id: string) => {
    if (!confirm('Remove this vendor?')) return
    const updated = vendors.filter((v) => v.id !== id)
    setVendors(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('ebee_vendors', JSON.stringify(updated))
    }
    showFeedback('Vendor removed')
  }

  // Method 2: Share to Facebook Dialog Function
  const handleShareToFacebook = (product: Product) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.wishhub.pk'
    const productUrl = `${origin}/product/${product.slug}`
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
    
    // Open standard Facebook popup share window
    const width = 640
    const height = 600
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2
    
    window.open(
      shareUrl,
      'facebook-share-dialog',
      `width=${width},height=${height},top=${top},left=${left},toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1`
    )
    showFeedback(`Opened Facebook share dialog for "${product.title.slice(0, 30)}..."`)
  }

  // Status / Feedback
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type })
    setTimeout(() => setStatusMessage(null), 3000)
  }

  // ------------------------------------------------------------------------
  // POS (Point of Sale) State
  // ------------------------------------------------------------------------
  const [posCart, setPosCart] = useState<POSCartItem[]>([])
  const [posSearch, setPosSearch] = useState('')
  const [posCategory, setPosCategory] = useState('')
  const [customerName, setCustomerName] = useState('Walk-in Customer')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer'>('cash')
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [isProcessingPOS, setIsProcessingPOS] = useState(false)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [lastReceipt, setLastReceipt] = useState<{
    orderNumber: string
    subtotal: number
    discount: number
    total: number
    items: POSCartItem[]
    date: string
    customerName: string
    customerPhone?: string
    paymentMethod: string
  } | null>(null)

  const addToPOS = (product: Product) => {
    setPosCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          sku: product.sku,
          quantity: 1,
          thumbnail: product.thumbnail,
        },
      ]
    })
  }

  const updatePOSQuantity = (id: string, delta: number) => {
    setPosCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as POSCartItem[]
    )
  }

  const clearPOSCart = () => {
    setPosCart([])
    setDiscountAmount(0)
  }

  const posSubtotal = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const posTotal = Math.max(0, posSubtotal - (discountAmount || 0))

  const handlePOSCheckout = async () => {
    if (posCart.length === 0) return
    setIsProcessingPOS(true)
    try {
      const res = await submitPOSSaleAction({
        customerName,
        customerPhone,
        paymentMethod,
        discountAmount,
        items: posCart,
      })
      if (res.error) {
        showFeedback(res.error, 'error')
      } else {
        const receiptData = {
          orderNumber: res.orderNumber || `POS-${Date.now().toString().slice(-6)}`,
          subtotal: posSubtotal,
          discount: discountAmount || 0,
          total: res.total || posTotal,
          items: [...posCart],
          date: new Date().toLocaleString(),
          customerName: customerName || 'Walk-in Customer',
          customerPhone: customerPhone || 'N/A',
          paymentMethod: paymentMethod.toUpperCase(),
        }

        // Save receipt and immediately open receipt modal
        setLastReceipt(receiptData)
        setIsReceiptModalOpen(true)

        // Deduct local product stock
        setProducts((prev) =>
          prev.map((p) => {
            const sold = posCart.find((item) => item.id === p.id)
            if (sold) {
              const newQty = Math.max(0, p.stock_quantity - sold.quantity)
              return { ...p, stock_quantity: newQty, in_stock: newQty > 0 }
            }
            return p
          })
        )
        // Add to recent orders list
        setOrders((prev) => [
          {
            order_number: receiptData.orderNumber,
            customer_name: receiptData.customerName,
            customer_phone: receiptData.customerPhone,
            total_amount: receiptData.total,
            payment_method: paymentMethod,
            payment_status: 'paid',
            status: 'delivered',
            created_at: new Date().toISOString(),
          },
          ...prev,
        ])
        clearPOSCart()
        showFeedback(`Sale completed! Receipt #${receiptData.orderNumber}`)
      }
    } catch (err: any) {
      showFeedback(err?.message || 'Failed to complete sale', 'error')
    } finally {
      setIsProcessingPOS(false)
    }
  }

  // ------------------------------------------------------------------------
  // Product Management State
  // ------------------------------------------------------------------------
  const [productSearch, setProductSearch] = useState('')
  const [productCategoryFilter, setProductCategoryFilter] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isSavingProduct, setIsSavingProduct] = useState(false)

  // ------------------------------------------------------------------------
  // Category Management State
  // ------------------------------------------------------------------------
  const [newCatName, setNewCatName] = useState('')
  const [newCatDesc, setNewCatDesc] = useState('')
  const [newCatImage, setNewCatImage] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    setIsAddingCategory(true)
    const formData = new FormData()
    formData.append('name', newCatName)
    formData.append('description', newCatDesc)
    formData.append('image_url', newCatImage)

    const res = await createCategoryAction(formData)
    setIsAddingCategory(false)
    if (res.error) {
      showFeedback(res.error, 'error')
    } else {
      if (res.category) {
        setCategories((prev) => [...prev, res.category])
      }
      setNewCatName('')
      setNewCatDesc('')
      setNewCatImage('')
      showFeedback('Category added successfully')
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return
    const res = await deleteCategoryAction(id)
    if (res.error) {
      showFeedback(res.error, 'error')
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== id))
      showFeedback(`Category "${name}" removed`)
    }
  }

  // ------------------------------------------------------------------------
  // Product Create & Update Handlers
  // ------------------------------------------------------------------------
  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSavingProduct(true)
    const formData = new FormData(e.currentTarget)
    const res = await createProductAction(formData)
    setIsSavingProduct(false)
    if (res.error) {
      showFeedback(res.error, 'error')
    } else {
      showFeedback('Product created and saved to database!')
      setIsAddProductOpen(false)
      if (res.product) {
        // Construct visual product
        const newProd: Product = {
          ...res.product,
          thumbnail: (formData.get('image_url') as string) || '/logo.jpeg',
          images: [(formData.get('image_url') as string) || '/logo.jpeg'],
          category: res.product.category_name,
        }
        setProducts((prev) => [newProd, ...prev])
      }
    }
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    setIsSavingProduct(true)
    const res = await updateProductAction({
      id: editingProduct.id,
      title: editingProduct.title,
      price: editingProduct.price,
      old_price: editingProduct.old_price,
      stock_quantity: editingProduct.stock_quantity,
      category_name: editingProduct.category,
      description: editingProduct.description,
      image_url: editingProduct.thumbnail,
      is_featured: editingProduct.is_featured,
      is_bestseller: editingProduct.is_bestseller,
      is_trending: editingProduct.is_trending,
    })
    setIsSavingProduct(false)
    if (res.error) {
      showFeedback(res.error, 'error')
    } else {
      setProducts((prev) =>
        prev.map((item) => (item.id === editingProduct.id ? editingProduct : item))
      )
      setEditingProduct(null)
      showFeedback('Product updated successfully!')
    }
  }

  const handleDeleteProduct = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return
    const res = await deleteProductAction(id)
    if (res.error) {
      showFeedback(res.error, 'error')
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      showFeedback('Product deleted')
    }
  }

  // Filtered products for POS & Management
  const filteredProducts = products.filter((p) => {
    const query = (activeTab === 'pos' ? posSearch : productSearch).toLowerCase()
    const cat = activeTab === 'pos' ? posCategory : productCategoryFilter
    const matchQuery =
      p.title.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query)
    const matchCat = cat ? p.category === cat || p.category_slug === cat : true
    return matchQuery && matchCat
  })

  return (
    <div className="min-h-screen bg-[#080B12] text-[#e1e2eb] pb-16">
      
      {/* Top Banner / Navigation Bar */}
      <div className="bg-[#101725] border-b border-white/[0.08] sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#247BFF]/20 border border-[#247BFF]/40 flex items-center justify-center text-[#247BFF] shadow-[0_0_15px_rgba(36,123,255,0.4)]">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white font-headline">EBEE Control Hub</h1>
                <span className="px-2 py-0.5 rounded-full bg-[#398BFF]/15 text-[#BBD8FF] border border-[#398BFF]/30 font-mono text-[10px] font-bold">
                  POS & Inventory
                </span>
              </div>
              <p className="text-[11px] text-[#929EAF]">Manage sales, catalog, categories, and inventory</p>
            </div>
          </div>

          {/* Feedback Toast */}
          {statusMessage && (
            <div
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
                statusMessage.type === 'success'
                  ? 'bg-[#36C98F]/15 border border-[#36C98F]/40 text-[#36C98F]'
                  : 'bg-red-500/15 border border-red-500/40 text-red-400'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Actions & Tab Switcher */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="bg-[#080B12] p-1 rounded-xl border border-white/[0.08] flex items-center gap-1 text-xs font-semibold overflow-x-auto custom-scrollbar">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#247BFF] text-white shadow-[0_0_14px_rgba(36,123,255,0.5)]'
                    : 'text-[#929EAF] hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" /> Overview
              </button>
              <button
                onClick={() => setActiveTab('pos')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'pos'
                    ? 'bg-[#247BFF] text-white shadow-[0_0_14px_rgba(36,123,255,0.5)]'
                    : 'text-[#929EAF] hover:text-white'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" /> POS Register
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#247BFF] text-white shadow-[0_0_14px_rgba(36,123,255,0.5)]'
                    : 'text-[#929EAF] hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" /> Products ({totalProductsCount})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-[#247BFF] text-white shadow-[0_0_14px_rgba(36,123,255,0.5)]'
                    : 'text-[#929EAF] hover:text-white'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" /> Categories ({categories.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#247BFF] text-white shadow-[0_0_14px_rgba(36,123,255,0.5)]'
                    : 'text-[#929EAF] hover:text-white'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" /> Sales & Orders ({stats?.totalOrders ?? orders.length})
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'vendors'
                    ? 'bg-[#247BFF] text-white shadow-[0_0_14px_rgba(36,123,255,0.5)]'
                    : 'text-[#929EAF] hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> Vendors ({vendors.length})
              </button>
            </div>

            <form action={adminLogoutAction}>
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#080B12] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/40 text-[#929EAF] hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* KPI & Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#101725] border border-white/[0.08] space-y-1 relative overflow-hidden group hover:border-[#247BFF]/40 transition-colors">
            <div className="flex items-center justify-between text-[#929EAF]">
              <span className="text-xs font-medium">Total Live Products</span>
              <Package className="w-4 h-4 text-[#247BFF]" />
            </div>
            <p className="text-2xl font-black text-white">{totalProductsCount}</p>
            <p className="text-[11px] text-[#36C98F] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36C98F] animate-pulse" />
              Live in Supabase DB
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#101725] border border-white/[0.08] space-y-1 relative overflow-hidden group hover:border-[#247BFF]/40 transition-colors">
            <div className="flex items-center justify-between text-[#929EAF]">
              <span className="text-xs font-medium">Active Categories</span>
              <FolderTree className="w-4 h-4 text-[#A9D4FF]" />
            </div>
            <p className="text-2xl font-black text-white">{categories.length}</p>
            <p className="text-[11px] text-[#929EAF]">Department Hierarchy</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#101725] border border-white/[0.08] space-y-1 relative overflow-hidden group hover:border-[#247BFF]/40 transition-colors">
            <div className="flex items-center justify-between text-[#929EAF]">
              <span className="text-xs font-medium">Completed Orders</span>
              <Receipt className="w-4 h-4 text-[#36C98F]" />
            </div>
            <p className="text-2xl font-black text-white">{stats?.totalOrders ?? orders.length}</p>
            <p className="text-[11px] text-[#36C98F]">
              {stats?.totalUnitsSold ?? 0} Items Sold
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#101725] border border-white/[0.08] space-y-1 relative overflow-hidden group hover:border-[#247BFF]/40 transition-colors">
            <div className="flex items-center justify-between text-[#929EAF]">
              <span className="text-xs font-medium">Total Revenue</span>
              <Banknote className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <p className="text-2xl font-black text-white">
              {formatPKR(stats?.totalRevenue ?? 0)}
            </p>
            <p className="text-[11px] text-[#929EAF]">Gross Store & POS Sales</p>
          </div>
        </div>
        
        {/* ================================================================= */}
        {/* TAB 0: OVERVIEW & SALES ANALYTICS */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Sales & Department Performance Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Category Breakdown Panel */}
              <div className="p-6 rounded-3xl bg-[#101725] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-[#247BFF]" />
                    Products by Department
                  </h3>
                  <span className="text-[10px] text-[#929EAF]">11 Categories</span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {categories.map((c) => {
                    const count = c.product_count ?? 0
                    const pct = Math.round((count / (totalProductsCount || 1)) * 100)
                    return (
                      <div key={c.id || c.slug} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white font-medium">{c.name}</span>
                          <span className="text-[#929EAF] font-mono">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#247BFF] to-[#398BFF] rounded-full"
                            style={{ width: `${Math.max(5, pct)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Status & Financial Summary */}
              <div className="p-6 rounded-3xl bg-[#101725] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#36C98F]" />
                    Orders & Revenue Stream
                  </h3>
                  <span className="text-[10px] text-[#36C98F]">Active</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-[#080B12] border border-white/[0.06] space-y-1">
                    <span className="text-[10px] text-[#929EAF] uppercase font-bold tracking-wider">Gross Sales</span>
                    <p className="text-lg font-black text-white">{formatPKR(stats?.totalRevenue ?? 0)}</p>
                    <p className="text-[10px] text-[#36C98F]">Total Recorded</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#080B12] border border-white/[0.06] space-y-1">
                    <span className="text-[10px] text-[#929EAF] uppercase font-bold tracking-wider">Total Orders</span>
                    <p className="text-lg font-black text-white">{stats?.totalOrders ?? orders.length}</p>
                    <p className="text-[10px] text-[#398BFF]">Fulfillment Queue</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#080B12] border border-white/[0.06] space-y-1">
                    <span className="text-[10px] text-[#929EAF] uppercase font-bold tracking-wider">Items Sold</span>
                    <p className="text-lg font-black text-white">{stats?.totalUnitsSold ?? 0}</p>
                    <p className="text-[10px] text-[#F59E0B]">Total Units</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#080B12] border border-white/[0.06] space-y-1">
                    <span className="text-[10px] text-[#929EAF] uppercase font-bold tracking-wider">Active Vendors</span>
                    <p className="text-lg font-black text-white">{vendors.length}</p>
                    <p className="text-[10px] text-[#A9D4FF]">Supplier Directory</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab('pos')}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#247BFF] to-[#398BFF] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(36,123,255,0.3)] hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" /> Open POS Terminal Now
                  </button>
                </div>
              </div>

              {/* Vendor & Quick Supplier Balances */}
              <div className="p-6 rounded-3xl bg-[#101725] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#F59E0B]" />
                    Top Vendors & Payables
                  </h3>
                  <button
                    onClick={() => setActiveTab('vendors')}
                    className="text-[10px] text-[#247BFF] hover:underline font-bold"
                  >
                    Manage
                  </button>
                </div>

                <div className="space-y-3">
                  {vendors.slice(0, 3).map((v) => (
                    <div key={v.id} className="p-3 rounded-xl bg-[#080B12] border border-white/[0.06] flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{v.name}</p>
                        <p className="text-[10px] text-[#929EAF]">{v.suppliedCategory} â€¢ {v.phone}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-mono font-bold ${v.balanceDue > 0 ? 'text-[#F59E0B]' : 'text-[#36C98F]'}`}>
                          {formatPKR(v.balanceDue)}
                        </span>
                        <p className="text-[9px] text-[#929EAF]">{v.balanceDue > 0 ? 'Payable' : 'Settled'}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setIsAddVendorOpen(true)}
                  className="w-full py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Vendor
                </button>
              </div>

            </div>

            {/* Recent Orders Snapshot in Overview */}
            <div className="p-6 rounded-3xl bg-[#101725] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#247BFF]" />
                    Recent Live Transactions & Sales
                  </h3>
                  <p className="text-[11px] text-[#929EAF]">Latest storefront and in-store checkouts</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#247BFF] hover:underline font-bold"
                >
                  View All Orders
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#929EAF]">
                  No sales recorded yet. Process a sale via POS or place an order in the shop to see transactions here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#080B12] text-[#929EAF] text-[10px] uppercase font-semibold">
                      <tr>
                        <th className="p-3">Order Number</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Total Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] text-white">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-mono font-bold text-[#A9D4FF]">{o.order_number}</td>
                          <td className="p-3">{o.customer_name}</td>
                          <td className="p-3 font-bold text-[#36C98F] font-mono">{formatPKR(o.total_amount)}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#36C98F]/15 text-[#36C98F]">
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3 uppercase text-[10px] font-mono">{o.payment_method}</td>
                          <td className="p-3 text-right text-[#929EAF] text-[11px]">
                            {new Date(o.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 1: POINT OF SALE (POS) */}
        {/* ================================================================= */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Cols: POS Product Catalog & Quick Tap */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Search & Filter Bar */}
              <div className="p-4 rounded-2xl bg-[#101725] border border-white/[0.08] flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={posSearch}
                    onChange={(e) => setPosSearch(e.target.value)}
                    placeholder="Scan barcode, SKU, or search name..."
                    className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#929EAF]/50 outline-none focus:border-[#247BFF]"
                  />
                  <Search className="w-4 h-4 text-[#929EAF] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <select
                  value={posCategory}
                  onChange={(e) => setPosCategory(e.target.value)}
                  className="w-full sm:w-auto bg-[#080B12] border border-white/[0.1] text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-[#247BFF]"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Grid (Tap to Add) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[620px] overflow-y-auto pr-1">
                {filteredProducts.map((p) => {
                  const outOfStock = p.stock_quantity <= 0
                  return (
                    <button
                      key={p.id}
                      onClick={() => !outOfStock && addToPOS(p)}
                      disabled={outOfStock}
                      className={`p-3 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between group relative overflow-hidden ${
                        outOfStock
                          ? 'bg-[#101725]/40 border-white/[0.04] opacity-50 cursor-not-allowed'
                          : 'bg-[#101725] hover:bg-[#151f32] border-white/[0.08] hover:border-[#247BFF]/50 hover:shadow-[0_4px_20px_rgba(36,123,255,0.2)] active:scale-[0.98]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="relative w-full h-28 rounded-xl bg-[#080B12] overflow-hidden flex items-center justify-center p-2">
                          <Image
                            src={p.thumbnail}
                            alt={p.title}
                            fill
                            sizes="180px"
                            className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                          />
                          {outOfStock && (
                            <span className="absolute inset-0 bg-black/70 flex items-center justify-center font-bold text-xs text-red-400">
                              Out of Stock
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-[11px] font-mono text-[#929EAF]">{p.sku}</p>
                          <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-[#afc6ff]">
                            {p.title}
                          </h4>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="font-bold text-sm text-[#247BFF] font-mono">
                          {formatPKR(p.price)}
                        </span>
                        <span className="text-[10px] text-[#36C98F] bg-[#36C98F]/10 px-1.5 py-0.5 rounded-md font-mono">
                          {p.stock_quantity} left
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

            </div>

            {/* Right 5 Cols: POS Active Cart / Billing Register */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="rounded-3xl bg-[#101725] border border-white/[0.1] p-5 shadow-2xl flex flex-col h-[700px] justify-between">
                
                {/* Header */}
                <div className="pb-4 border-b border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#247BFF]" />
                    <h3 className="font-bold text-white text-base font-headline">Current Sale Register</h3>
                  </div>
                  {posCart.length > 0 && (
                    <button
                      onClick={clearPOSCart}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                    >
                      <RotateCcw className="w-3 h-3" /> Clear Cart
                    </button>
                  )}
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
                  {posCart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#929EAF] space-y-2">
                      <ShoppingBag className="w-12 h-12 text-[#929EAF]/30" />
                      <p className="text-sm font-semibold text-white">Cart is empty</p>
                      <p className="text-xs text-[#929EAF]">Tap or click products on the left to add items to this sale ticket.</p>
                    </div>
                  ) : (
                    posCart.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-[#080B12] border border-white/[0.06] flex items-center justify-between gap-3"
                      >
                        <div className="relative w-12 h-12 rounded-lg bg-white/5 overflow-hidden shrink-0">
                          <Image src={item.thumbnail} alt={item.title} fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-semibold text-white truncate">{item.title}</h5>
                          <p className="text-[11px] font-mono text-[#247BFF]">{formatPKR(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updatePOSQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold text-white w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updatePOSQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-lg bg-[#247BFF] hover:bg-[#398BFF] flex items-center justify-center text-white text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Customer Details & Payment Options */}
                <div className="pt-4 border-t border-white/[0.08] space-y-3 text-xs">
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-[#929EAF] uppercase tracking-wider block mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#247BFF]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-[#929EAF] uppercase tracking-wider block mb-1">Customer Phone</label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="03XXXXXXXXX"
                        className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#247BFF]"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="text-[10px] text-[#929EAF] uppercase tracking-wider block mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold ${
                          paymentMethod === 'cash'
                            ? 'bg-[#36C98F]/20 border-[#36C98F] text-[#36C98F]'
                            : 'bg-[#080B12] border-white/[0.08] text-[#929EAF]'
                        }`}
                      >
                        <Banknote className="w-3.5 h-3.5" /> Cash
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold ${
                          paymentMethod === 'card'
                            ? 'bg-[#247BFF]/20 border-[#247BFF] text-[#247BFF]'
                            : 'bg-[#080B12] border-white/[0.08] text-[#929EAF]'
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('bank_transfer')}
                        className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold ${
                          paymentMethod === 'bank_transfer'
                            ? 'bg-[#BBD8FF]/20 border-[#BBD8FF] text-[#BBD8FF]'
                            : 'bg-[#080B12] border-white/[0.08] text-[#929EAF]'
                        }`}
                      >
                        <DollarSign className="w-3.5 h-3.5" /> Transfer
                      </button>
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-1.5 pt-2 border-t border-white/[0.06] text-xs">
                    <div className="flex justify-between text-[#929EAF]">
                      <span>Subtotal</span>
                      <span className="font-mono text-white">{formatPKR(posSubtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-[#929EAF]">
                      <span>Discount (PKR)</span>
                      <input
                        type="number"
                        min="0"
                        value={discountAmount || ''}
                        onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-24 bg-[#080B12] border border-white/[0.08] rounded-lg px-2 py-0.5 text-right text-xs text-white outline-none focus:border-[#247BFF]"
                      />
                    </div>
                    <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/[0.08]">
                      <span>Total Due</span>
                      <span className="font-mono text-[#247BFF]">{formatPKR(posTotal)}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    disabled={posCart.length === 0 || isProcessingPOS}
                    onClick={handlePOSCheckout}
                    className="w-full py-3.5 rounded-2xl bg-[#247BFF] hover:bg-[#398BFF] disabled:opacity-40 text-white font-bold text-sm shadow-[0_0_24px_rgba(36,123,255,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessingPOS ? (
                      <span>Recording Sale...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Charge & Print Receipt ({formatPKR(posTotal)})</span>
                      </>
                    )}
                  </button>

                </div>

              </div>

              {/* Last Receipt Quick Preview Bar */}
              {lastReceipt && (
                <div className="p-4 rounded-2xl bg-[#101725] border border-[#36C98F]/40 text-xs space-y-2 animate-in fade-in shadow-[0_4px_20px_rgba(54,201,143,0.15)]">
                  <div className="flex items-center justify-between text-[#36C98F] font-bold">
                    <span className="flex items-center gap-1.5 text-sm">
                      <Receipt className="w-4 h-4" /> Receipt #{lastReceipt.orderNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsReceiptModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#247BFF] hover:bg-[#398BFF] text-white flex items-center gap-1 text-xs font-semibold cursor-pointer shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Receipt
                      </button>
                      <button
                        onClick={() => setIsReceiptModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#36C98F]/20 hover:bg-[#36C98F]/30 text-[#36C98F] flex items-center gap-1 text-xs font-semibold cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#929EAF] flex items-center justify-between pt-1 border-t border-white/[0.06]">
                    <span>Customer: <strong className="text-white">{lastReceipt.customerName}</strong></span>
                    <span>Total Paid: <strong className="text-[#36C98F] font-mono">{formatPKR(lastReceipt.total)}</strong></span>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
        {/* ================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products or SKU..."
                    className="w-full bg-[#101725] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#929EAF]/50 outline-none focus:border-[#247BFF]"
                  />
                  <Search className="w-4 h-4 text-[#929EAF] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-[#101725] border border-white/[0.08] text-xs text-white rounded-xl px-3 py-2 outline-none focus:border-[#247BFF]"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#247BFF] hover:bg-[#398BFF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(36,123,255,0.4)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            {/* Products Table */}
            <div className="rounded-3xl bg-[#101725] border border-white/[0.08] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080B12] text-[#929EAF] border-b border-white/[0.06] font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Product & Image</th>
                      <th className="p-4">SKU</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (PKR)</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Badges</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-white">
                    {filteredProducts.slice(0, 50).map((product) => (
                      <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-[#080B12] border border-white/[0.08] overflow-hidden shrink-0">
                            <Image
                              src={product.thumbnail}
                              alt={product.title}
                              fill
                              sizes="48px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-white line-clamp-1 max-w-xs block">
                              {product.title}
                            </span>
                            <span className="text-[10px] text-[#929EAF] line-clamp-1 max-w-xs block">
                              {product.description || 'No description provided'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[#929EAF]">{product.sku}</td>
                        <td className="p-4 text-[#A9D4FF]">{product.category}</td>
                        <td className="p-4 font-bold text-[#247BFF] font-mono">
                          {formatPKR(product.price)}
                          {product.old_price && (
                            <span className="block text-[10px] text-[#929EAF] line-through">
                              {formatPKR(product.old_price)}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              product.stock_quantity > 0
                                ? 'bg-[#36C98F]/15 text-[#36C98F]'
                                : 'bg-red-500/15 text-red-400'
                            }`}
                          >
                            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1 flex-wrap">
                            {product.is_featured && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px] font-bold">
                                Featured
                              </span>
                            )}
                            {product.is_bestseller && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[9px] font-bold">
                                Bestseller
                              </span>
                            )}
                            {product.is_trending && (
                              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[9px] font-bold">
                                Trending
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Method 2: Share to Facebook Button */}
                            <button
                              onClick={() => handleShareToFacebook(product)}
                              className="p-1.5 rounded-lg bg-[#1877F2]/20 hover:bg-[#1877F2] text-[#4267B2] hover:text-white transition-all border border-[#1877F2]/40"
                              title="Share to Facebook Page / Profile"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProduct({ ...product })}
                              className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-[#247BFF] text-white transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.title)}
                              className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-red-500 text-[#929EAF] hover:text-white transition-colors"
                              title="Delete Product"
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
                <span>Showing {filteredProducts.length} matching products</span>
                <span>Real Supabase PostgreSQL Database Records</span>
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {/* ================================================================= */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 4 Cols: Add Category Form */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl bg-[#101725] border border-white/[0.08] p-6 space-y-4">
                <h3 className="font-bold text-white text-base font-headline flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-[#247BFF]" />
                  Add New Category
                </h3>
                <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
                  <div>
                    <label className="text-[#929EAF] block mb-1">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="e.g. Smart Watches"
                      className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                    />
                  </div>
                  <div>
                    <label className="text-[#929EAF] block mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="Category highlights or brief summary..."
                      className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                    />
                  </div>
                  <div>
                    <label className="text-[#929EAF] block mb-1">Category Icon / Image URL</label>
                    <input
                      type="url"
                      value={newCatImage}
                      onChange={(e) => setNewCatImage(e.target.value)}
                      placeholder="https://... or /logo.png"
                      className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAddingCategory}
                    className="w-full py-3 rounded-xl bg-[#247BFF] hover:bg-[#398BFF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(36,123,255,0.4)] transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </form>
              </div>
            </div>

            {/* Right 8 Cols: Existing Categories Grid */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id || cat.slug}
                    className="p-5 rounded-2xl bg-[#101725] border border-white/[0.08] flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#080B12] border border-white/[0.08] flex items-center justify-center text-[#247BFF]">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-[#afc6ff] transition-colors">
                          {cat.name}
                        </h4>
                        <p className="text-[11px] font-mono text-[#929EAF]">/{cat.slug}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id || cat.slug, cat.name)}
                      className="p-2 rounded-xl bg-white/[0.05] hover:bg-red-500/20 text-[#929EAF] hover:text-red-400 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: ORDERS & RECENT TRANSACTIONS */}
        {/* ================================================================= */}
        {activeTab === 'orders' && (
          <div className="rounded-3xl bg-[#101725] border border-white/[0.08] overflow-hidden">
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Store Orders & POS Sales</h3>
                <p className="text-xs text-[#929EAF]">Real-time orders processed via COD, Card, and In-Store POS</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080B12] text-[#929EAF] border-b border-white/[0.06] font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment Status</th>
                    <th className="p-4">Fulfillment</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-white">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[#929EAF]">
                        No orders recorded yet. Complete a checkout in store or POS to see orders here.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord: any) => (
                      <tr key={ord.id || ord.order_number} className="hover:bg-white/[0.02]">
                        <td className="p-4 font-mono font-bold text-[#247BFF]">{ord.order_number}</td>
                        <td className="p-4">
                          <p className="font-semibold text-white">{ord.customer_name}</p>
                          <p className="text-[10px] text-[#929EAF]">{ord.customer_phone}</p>
                        </td>
                        <td className="p-4 uppercase font-mono text-[10px] text-[#A9D4FF]">{ord.payment_method}</td>
                        <td className="p-4 font-mono font-bold text-white">{formatPKR(ord.total_amount)}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.payment_status === 'paid'
                                ? 'bg-[#36C98F]/15 text-[#36C98F]'
                                : 'bg-amber-500/15 text-amber-400'
                            }`}
                          >
                            {ord.payment_status || 'pending'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-bold">
                            {ord.status || 'confirmed'}
                          </span>
                        </td>
                        <td className="p-4 text-[#929EAF] text-[11px]">
                          {new Date(ord.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 5: VENDORS & SUPPLIERS */}
        {/* ================================================================= */}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            
            {/* Header + Add Vendor Button */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#101725] border border-white/[0.08] flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#F59E0B]" />
                  Vendor & Supplier Directory
                </h3>
                <p className="text-xs text-[#929EAF] mt-0.5">
                  Track wholesale suppliers, contact information, category lines, and account payable balances.
                </p>
              </div>

              <button
                onClick={() => setIsAddVendorOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#247BFF] hover:bg-[#398BFF] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(36,123,255,0.4)] transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Vendor
              </button>
            </div>

            {/* Vendor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendors.map((v) => (
                <div
                  key={v.id}
                  className="p-5 rounded-2xl bg-[#101725] border border-white/[0.08] hover:border-white/[0.15] transition-all space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{v.name}</h4>
                      <p className="text-xs text-[#A9D4FF] flex items-center gap-1 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-[#247BFF]" />
                        {v.company}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 text-[10px] font-mono font-bold">
                      {v.suppliedCategory}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#929EAF]">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#36C98F]" />
                      <a href={`tel:${v.phone}`} className="hover:text-white transition-colors">
                        {v.phone}
                      </a>
                    </div>
                    {v.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#247BFF]" />
                        <a href={`mailto:${v.email}`} className="hover:text-white transition-colors truncate">
                          {v.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {v.notes && (
                    <p className="text-[11px] text-[#929EAF] bg-[#080B12] p-2.5 rounded-xl border border-white/[0.04]">
                      {v.notes}
                    </p>
                  )}

                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#929EAF] block">Payable Balance</span>
                      <span className={`text-sm font-mono font-bold ${v.balanceDue > 0 ? 'text-[#F59E0B]' : 'text-[#36C98F]'}`}>
                        {formatPKR(v.balanceDue)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteVendor(v.id)}
                      className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-red-500 text-[#929EAF] hover:text-white transition-colors"
                      title="Delete Vendor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* ================================================================= */}
      {/* MODAL: ADD VENDOR */}
      {/* ================================================================= */}
      {isAddVendorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl bg-[#101725] border border-white/[0.12] p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#F59E0B]" />
                Add Vendor / Supplier
              </h3>
              <button
                onClick={() => setIsAddVendorOpen(false)}
                className="p-1 rounded-lg hover:bg-white/[0.1] text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A9D4FF] font-medium block mb-1">Vendor Contact Person *</label>
                <input
                  type="text"
                  required
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                />
              </div>

              <div>
                <label className="text-[#A9D4FF] font-medium block mb-1">Company / Business Name *</label>
                <input
                  type="text"
                  required
                  value={newVendor.company}
                  onChange={(e) => setNewVendor({ ...newVendor, company: e.target.value })}
                  placeholder="e.g. Tariq Auto Parts Ltd"
                  className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A9D4FF] font-medium block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                  />
                </div>
                <div>
                  <label className="text-[#A9D4FF] font-medium block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                    placeholder="vendor@mail.com"
                    className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A9D4FF] font-medium block mb-1">Supplied Category</label>
                  <select
                    value={newVendor.suppliedCategory}
                    onChange={(e) => setNewVendor({ ...newVendor, suppliedCategory: e.target.value })}
                    className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#A9D4FF] font-medium block mb-1">Initial Balance Due (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={newVendor.balanceDue}
                    onChange={(e) => setNewVendor({ ...newVendor, balanceDue: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A9D4FF] font-medium block mb-1">Notes / Supply Details</label>
                <textarea
                  rows={2}
                  value={newVendor.notes}
                  onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
                  placeholder="Terms, delivery days, bank account numbers..."
                  className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddVendorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/[0.1] text-xs text-[#929EAF] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#247BFF] hover:bg-[#398BFF] text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(36,123,255,0.4)] cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Vendor
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: ADD NEW PRODUCT */}
      {/* ================================================================= */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl bg-[#101725] border border-white/[0.12] p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#247BFF]/15 border border-[#247BFF]/30 flex items-center justify-center text-[#247BFF]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-headline">Add New Product</h3>
                  <p className="text-xs text-[#929EAF]">Enter product details, pricing, and image URL to sync with live store.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="text-[#A9D4FF] font-medium block mb-1">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Ultra Fast Qi Wireless Charger"
                  className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#247BFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[#A9D4FF] font-medium block mb-1">Category *</label>
                  <select
                    name="category_name"
                    required
                    className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#247BFF]"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[#A9D4FF] font-medium block mb-1">SKU (Leave empty to auto-generate)</label>
                  <input
                    type="text"
                    name="sku"
                    placeholder="EBEE-XXXXXX"
                    className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#247BFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[#A9D4FF] font-medium block mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    placeholder="2500"
                    className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#247BFF]"
                  />
                </div>
                <div>
                  <label className="text-[#A9D4FF] font-medium block mb-1">Old Price / MSRP (PKR)</label>
                  <input
                    type="number"
                    name="old_price"
                    min="0"
                    placeholder="3500"
                    className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#247BFF]"
                  />
                </div>
                <div>
                  <label className="text-[#A9D4FF] font-medium block mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    required
                    min="0"
                    defaultValue="10"
                    className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#247BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A9D4FF] font-medium block mb-1">Product Picture URL *</label>
                <input
                  type="url"
                  name="image_url"
                  required
                  placeholder="https://images.unsplash.com/... or uploaded image URL"
                  className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#247BFF]"
                />
                <p className="text-[10px] text-[#929EAF] mt-1">Provide an image link. This will automatically become the product thumbnail & card picture.</p>
              </div>

              <div>
                <label className="text-[#A9D4FF] font-medium block mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Key features, specifications, box contents..."
                  className="w-full bg-[#080B12] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-[#247BFF]"
                />
              </div>

              {/* Flags */}
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#929EAF]">
                  <input type="checkbox" name="is_featured" value="true" className="rounded" />
                  <span>Featured Product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#929EAF]">
                  <input type="checkbox" name="is_bestseller" value="true" className="rounded" />
                  <span>Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#929EAF]">
                  <input type="checkbox" name="is_trending" value="true" className="rounded" />
                  <span>Trending</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-white/[0.1] text-[#929EAF] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 rounded-xl bg-[#247BFF] hover:bg-[#398BFF] text-white font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(36,123,255,0.4)] cursor-pointer"
                >
                  {isSavingProduct ? 'Saving...' : 'Publish Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: EDIT PRODUCT */}
      {/* ================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl bg-[#101725] border border-white/[0.12] p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#247BFF]" />
                Edit Product
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg hover:bg-white/[0.1] text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-[#929EAF] block mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                />
              </div>

              <div>
                <label className="text-[#929EAF] block mb-1">Product Picture URL</label>
                <input
                  type="url"
                  value={editingProduct.thumbnail}
                  onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
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
                    className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
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
                    className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#929EAF] block mb-1">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full bg-[#080B12] border border-white/[0.08] rounded-xl px-3 py-2 text-white outline-none focus:border-[#247BFF]"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
                  disabled={isSavingProduct}
                  className="px-5 py-2 rounded-xl bg-[#247BFF] hover:bg-[#398BFF] text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(36,123,255,0.4)]"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL: FULL THERMAL / POS RECEIPT DIALOG */}
      {/* ================================================================= */}
      {isReceiptModalOpen && lastReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#0e131f] border border-white/[0.15] p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <span className="text-xs font-mono font-bold text-[#36C98F] uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Sale Completed
              </span>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/[0.1] text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thermal Slip Body */}
            <div
              id="printable-pos-receipt"
              className="bg-white text-slate-900 rounded-2xl p-5 font-mono text-xs shadow-inner space-y-4"
            >
              {/* Store Header */}
              <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
                <h2 className="text-base font-black tracking-tight">EBEE ONLINE STORE</h2>
                <p className="text-[10px] text-slate-500">Official Store POS Terminal</p>
                <p className="text-[10px] text-slate-500">Support: ebee.pk@gmail.com</p>
                <p className="text-[10px] text-slate-400 font-sans mt-1">{lastReceipt.date}</p>
              </div>

              {/* Order Meta */}
              <div className="text-[11px] space-y-0.5 border-b border-dashed border-slate-300 pb-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-bold">{lastReceipt.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span>{lastReceipt.customerName}</span>
                </div>
                {lastReceipt.customerPhone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span>{lastReceipt.customerPhone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment:</span>
                  <span className="font-bold text-blue-700">{lastReceipt.paymentMethod}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-2 border-b border-dashed border-slate-300 pb-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Item & Qty</span>
                  <span>Amount</span>
                </div>
                {lastReceipt.items.map((item) => (
                  <div key={item.id} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] font-medium">
                      <span className="line-clamp-1 max-w-[180px]">{item.title}</span>
                      <span className="font-bold">{formatPKR(item.price * item.quantity)}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {item.quantity} x {formatPKR(item.price)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>{formatPKR(lastReceipt.subtotal)}</span>
                </div>
                {lastReceipt.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-{formatPKR(lastReceipt.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black border-t border-slate-300 pt-1.5 text-slate-900">
                  <span>TOTAL PAID:</span>
                  <span>{formatPKR(lastReceipt.total)}</span>
                </div>
              </div>

              {/* Barcode representation & Footer */}
              <div className="text-center pt-3 border-t border-dashed border-slate-300 space-y-1">
                <p className="text-[10px] font-bold text-slate-700">*** THANK YOU FOR SHOPPING! ***</p>
                <p className="text-[9px] text-slate-400">Goods once sold can be exchanged within 7 days.</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/[0.1] text-xs text-[#929EAF] hover:text-white transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#247BFF] hover:bg-[#398BFF] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(36,123,255,0.4)] cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
