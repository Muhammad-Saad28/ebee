<div align="center">

# ⚡ EBEE.PK — Next-Gen E-Commerce Experience

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-blueviolet?style=for-the-badge)](#)

<p align="center">
  <strong>Pakistan’s Premier Smart Lifestyle & Consumer Tech Marketplace</strong><br />
  Engineered with Next.js 16 (App Router + Turbopack), frosted glass aesthetics, real-time database synchronization via Supabase, and complete Cash on Delivery (COD) workflows.
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-tech-stack--architecture">Tech Stack</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-database-schema">Database & Seed</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

</div>

## 🌟 Key Features

### 💎 Ultra-Modern Frosted Glass UI & Visual Art Direction
- **Midnight & Light-Blue Glass Aesthetic**: Deep black foundation (`#000000`) accented with frosted glass morphism (`backdrop-blur-2xl`), cyan/sky glows, and crisp white typography.
- **Continuous Left-to-Right Announcement Ticker**: Infinite smooth marquee broadcasting store updates like *"Free Delivery after PKR 2000"*.
- **Inset Rounded Hero Canvas**: Tailored framed showcase featuring ambient backdrop textures, high-converting taglines, and dual light-blue frosted action buttons.
- **Dynamic Category Pill Carousel**: Infinite smooth scrolling pill carousel moving left-to-right with live category counts, department icons, and pause-on-hover interaction.
- **Asymmetric Bento Grid Showcases**: Curated collections, featured launches, automobile essentials, and trending deals organized into modern Bento layout patterns.

### 🛍️ Comprehensive E-Commerce Architecture
- **Catalog Browsing & Multi-Faceted Filters**: Real-time filtering by category, search query, brand, discount, and sorting (price low-to-high, high-to-low, newest).
- **Type-Ahead Predictive Search**: Instant client debounced search suggestions with live product preview thumbnails and stock badges.
- **State Management via Zustand**:
  - `cartStore`: Persistent cart state with drawer sliders, item counter, quantities, and automated subtotal calculation.
  - `wishlistStore`: Quick-action bookmarking across product cards and detailed item views.
- **Localized Pakistani Checkout Flow**:
  - Full support for major cities (Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, Faisalabad, and 50+ nationwide areas).
  - Cash on Delivery (COD) guarantee, dynamic delivery fee calculations, and instant WhatsApp customer care links.
- **Order Tracking & Confirmation**: Dynamic order confirmation view (`/order-confirmation/[orderId]`) accompanied by celebratory confetti animations and order receipts.
- **Information Hub**: Dedicated **About Us** (`/about`) and **Contact Support** (`/contact`) pages with interactive contact forms and direct WhatsApp support integrations.

---

## 🛠 Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | High-performance React framework with Turbopack bundler |
| **Frontend Library** | [React 19](https://react.dev/) | Concurrent UI rendering and component primitives |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | End-to-end static typing and data modeling |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first styling with custom glassmorphism keyframes |
| **Database & Auth** | [Supabase (PostgreSQL)](https://supabase.com/) | Managed relational backend, row-level security & SSR client |
| **Global State** | [Zustand](https://github.com/pmndrs/zustand) | Lightweight, persistent client store (Cart & Wishlist) |
| **Icons & Micro-animations** | [Lucide React](https://lucide.dev/) + [Framer Motion](https://www.framer.com/motion/) | Consistent iconography and motion transitions |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Type-safe form validation and runtime schema assertion |
| **Interactive FX** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) | Delightful celebration effects on checkout completion |

---

## 📂 Project Structure

```bash
ebee/
├── public/                     # Static assets (optimized logos, hero banners, badges)
│   ├── hero-bg.png             # Modern hero section background canvas
│   ├── logo-white-text.png     # High-contrast official brand logo
│   └── favicon.ico             # Custom 32x32 RGBA branding icon
├── src/
│   ├── app/                    # Next.js App Router routes & API endpoints
│   │   ├── about/              # Brand story, mission, and fulfillment bento
│   │   ├── account/            # User account overview & saved wishlist
│   │   ├── admin/              # Management dashboard and order controls
│   │   ├── api/                # API route handlers (search suggestions, catalog)
│   │   ├── cart/               # Dedicated full-page shopping cart
│   │   ├── checkout/           # Multi-step COD checkout with city selection
│   │   ├── contact/            # Customer inquiry form & WhatsApp portal
│   │   ├── order-confirmation/ # Post-order invoice with confetti celebration
│   │   ├── product/[slug]/     # High-resolution product details & related items
│   │   ├── shop/               # Filterable catalog with search & sorting
│   │   ├── layout.tsx          # Root layout embedding Header, Footer & Ticker
│   │   └── page.tsx            # Curated homepage with Bento grids & carousels
│   ├── components/
│   │   ├── home/               # Hero, CategoryCarousel, Bento grids, Highlights
│   │   ├── layout/             # Header, Navigation Dock, AnnouncementBar, Footer
│   │   ├── shop/               # ShopFilters, ProductGrid, ProductCard
│   │   └── ui/                 # Reusable buttons, badges, modals, and pills
│   ├── lib/
│   │   ├── products.ts         # Server-side Supabase data access layer
│   │   ├── supabase.ts         # Database client initializers (Client & SSR)
│   │   └── utils.ts            # Formatting utilities (PKR currency, slugify, cn)
│   ├── store/                  # Zustand global stores (Cart & Wishlist)
│   └── types/                  # TypeScript interface definitions (Product, Order, Category)
├── supabase/
│   └── migrations/             # SQL schema migrations, triggers, and seed catalogs
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher recommended
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Database**: Active [Supabase](https://supabase.com) project or PostgreSQL database

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ebee.git
cd ebee
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

---

## 🗄 Database & Seed

The repository includes reproducible SQL schema migrations in `supabase/migrations/`:
- **`categories`**: Categorical hierarchy with slugification and metadata.
- **`products`**: Product specifications, SKU, brand, pricing, discount rates, inventory, and bestseller/trending flags.
- **`product_images`**: Multi-image association per product with primary thumbnail designations.
- **`orders` & `order_items`**: Complete order ledger capturing customer delivery addresses, city dispatch data, item quantities, and payment status.

To run migrations and seed products:
```bash
# Using Supabase CLI
supabase db reset
```

---

## 🏗 Production Build & Verification

To compile an optimized production build using Next.js Turbopack:

```bash
npm run build
npm run start
```

---

## 🤝 Support & Inquiries

For technical questions, business inquiries, or custom feature requests:
- 🌐 **Platform**: [EBEE.PK](https://ebee.pk)
- 💬 **WhatsApp**: [+92 305 4449151](https://wa.me/923054449151)
- ✉️ **Email**: [support@ebee.pk](mailto:support@ebee.pk)

---

<div align="center">
  <sub>Crafted with passion for the modern lifestyle and tech community in Pakistan.</sub>
</div>
