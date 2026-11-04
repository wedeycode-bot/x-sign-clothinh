-- ==============================================================================
-- X-SIGN STREETWEAR ATELIER - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. Create the products table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  category TEXT DEFAULT 'all',
  garment_type TEXT DEFAULT 'tshirt',
  price_ghs NUMERIC NOT NULL DEFAULT 0,
  price_usd NUMERIC DEFAULT 0,
  price_gbp NUMERIC DEFAULT 0,
  price_eur NUMERIC DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_sold_out BOOLEAN DEFAULT false,
  stock_count INTEGER DEFAULT 50,
  drop_name TEXT DEFAULT 'X-SIGN DROP 01',
  images JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '["S", "M", "L", "XL"]'::jsonb,
  description TEXT DEFAULT '',
  fabric_details JSONB DEFAULT '{"composition": "100% Combed Heavy Cotton", "weight": "320 GSM", "finish": "Precision Screenprint & DTF", "origin": "Atelier Crafted in Accra"}'::jsonb,
  features JSONB DEFAULT '["Heavyweight atelier construction", "Crafted with heart, worn with purpose."]'::jsonb,
  care_instructions JSONB DEFAULT '["Machine wash cold inside-out", "Do not iron directly over artwork", "Hang dry in shade"]'::jsonb,
  model3d_config JSONB DEFAULT '{"garmentType": "tshirt", "defaultColor": "#18181b", "roughness": 0.85, "metalness": 0.05, "fabricPattern": "heavy-terry"}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'GHS',
  status TEXT DEFAULT 'pending',
  items JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Products
-- Anyone can view products
CREATE POLICY "Public read products"
  ON public.products
  FOR SELECT
  USING (true);

-- Anyone can insert/update/delete products with anon/service key
CREATE POLICY "Allow public/anon product insert"
  ON public.products
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public/anon product update"
  ON public.products
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public/anon product delete"
  ON public.products
  FOR DELETE
  USING (true);

-- 5. Create Policies for Orders
CREATE POLICY "Public read orders"
  ON public.orders
  FOR SELECT
  USING (true);

CREATE POLICY "Public insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

-- 6. Setup Storage Bucket for Camera Roll & Product Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy to allow anyone to read uploaded product photos
CREATE POLICY "Public Access Products Bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- Policy to allow uploads to products bucket
CREATE POLICY "Allow Uploads To Products Bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products');

CREATE POLICY "Allow Updates In Products Bucket"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products');
