-- ==============================================================================
-- EBEE - Premium E-Commerce PostgreSQL Database Schema & Row Level Security
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER ROLES
CREATE TYPE user_role_type AS ENUM ('customer', 'admin', 'staff');

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role_type NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Function to check admin status in RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category_name TEXT,
    subcategory_name TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    old_price NUMERIC(12, 2) CHECK (old_price > price),
    discount_percentage INT DEFAULT 0,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    rating NUMERIC(2, 1) DEFAULT 4.5,
    review_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);

-- 5. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_thumbnail BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- 6. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sku TEXT UNIQUE,
    price_override NUMERIC(12, 2),
    stock_quantity INT DEFAULT 0,
    attributes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    province TEXT NOT NULL,
    city TEXT NOT NULL,
    street_address TEXT NOT NULL,
    delivery_instructions TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);

-- 8. ORDERS
CREATE TYPE order_status_type AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_method_type AS ENUM ('cod', 'card', 'bank_transfer');
CREATE TYPE payment_status_type AS ENUM ('pending', 'paid', 'refunded', 'failed');

CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    status order_status_type DEFAULT 'pending',
    payment_method payment_method_type DEFAULT 'cod',
    payment_status payment_status_type DEFAULT 'pending',
    subtotal NUMERIC(12, 2) NOT NULL,
    shipping_fee NUMERIC(12, 2) DEFAULT 0,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL,
    coupon_code TEXT,
    shipping_address JSONB NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- 9. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    sku TEXT,
    price NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total NUMERIC(12, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- 10. CART ITEMS
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT cart_owner_check CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_session ON public.cart_items(session_id);

-- 11. WISHLIST ITEMS
CREATE TABLE IF NOT EXISTS public.wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist_items(user_id);

-- 12. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_verified_buyer BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);

-- 13. COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value NUMERIC(12, 2) NOT NULL CHECK (discount_value > 0),
    min_spend NUMERIC(12, 2) DEFAULT 0,
    max_discount NUMERIC(12, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    tagline TEXT,
    image_url TEXT NOT NULL,
    cta_text TEXT DEFAULT 'Shop Now',
    cta_link TEXT DEFAULT '/shop',
    display_location TEXT DEFAULT 'hero',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    announcement_text TEXT DEFAULT 'Free Nationwide Express Delivery on Orders Over Rs. 2,999 | Cash on Delivery Available',
    announcement_enabled BOOLEAN DEFAULT TRUE,
    free_shipping_threshold NUMERIC(12, 2) DEFAULT 2999.00,
    standard_shipping_fee NUMERIC(12, 2) DEFAULT 250.00,
    support_phone TEXT DEFAULT '+92 300 0000000',
    support_email TEXT DEFAULT 'support@ebee.pk',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default settings
INSERT INTO public.store_settings (id, announcement_text, free_shipping_threshold, standard_shipping_fee)
VALUES ('default', 'Free Nationwide Express Delivery on Orders Over Rs. 2,999 | Cash on Delivery Available', 2999.00, 250.00)
ON CONFLICT (id) DO NOTHING;

-- Seed default active coupons
INSERT INTO public.coupons (code, discount_type, discount_value, min_spend, is_active)
VALUES 
('EBEE10', 'percentage', 10, 1500, TRUE),
('WELCOME500', 'fixed', 500, 3000, TRUE)
ON CONFLICT (code) DO NOTHING;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS (For catalog, categories, banners, settings, approved reviews)
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Public can view product images" ON public.product_images FOR SELECT USING (TRUE);
CREATE POLICY "Public can view product variants" ON public.product_variants FOR SELECT USING (TRUE);
CREATE POLICY "Public can view approved reviews" ON public.reviews FOR SELECT USING (is_approved = TRUE OR public.is_admin());
CREATE POLICY "Public can view active banners" ON public.banners FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Public can view store settings" ON public.store_settings FOR SELECT USING (TRUE);
CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT USING (is_active = TRUE OR public.is_admin());

-- CUSTOMER ACCESS (Profiles, Addresses, Cart, Wishlist, Orders)
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON public.wishlist_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users and guests can manage cart items" ON public.cart_items FOR ALL USING (
    auth.uid() = user_id OR user_id IS NULL
);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (
    auth.uid() = user_id OR public.is_admin()
);
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
);
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Customers can add reviews" ON public.reviews FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
);

-- ADMIN ACCESS (Full CRUD on catalog, banners, settings, orders, inventory)
CREATE POLICY "Admins full access to categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to product images" ON public.product_images FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to product variants" ON public.product_variants FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to banners" ON public.banners FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to store settings" ON public.store_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to coupons" ON public.coupons FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to order items" ON public.order_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins full access to user roles" ON public.user_roles FOR ALL USING (public.is_admin());
