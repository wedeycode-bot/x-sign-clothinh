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


-- ==============================================================================
-- X-SIGN SEED DATA: Populates all initial products into Supabase
-- ==============================================================================

INSERT INTO public.products (
  id, slug, title, subtitle, category, garment_type,
  price_ghs, price_usd, price_gbp, price_eur,
  is_new, is_featured, is_sold_out, stock_count, drop_name,
  images, colors, sizes, description, fabric_details,
  features, care_instructions, model3d_config
) VALUES (
  'xsign-flex-tee', 'xsign-flex-tee', 'X-SIGN FLEX TEE', '100% Heavy Cotton • Glitter Gold, Silver, Glow-in-the-Dark & Reflective DTF', 't-shirts', 'tshirt',
  299, 23, 18, 21,
  true, true, false, 85, 'X-SIGN DROP 01',
  '["/campaign/models/IMG_4338.jpg","/products/shirts/IMG_4266.PNG","/campaign/models/IMG_4330.jpg","/products/shirts/IMG_4251.PNG","/campaign/models/IMG_4368.jpg","/products/shirts/IMG_4260.PNG","/campaign/models/IMG_4472.jpg","/products/shirts/IMG_4259.PNG","/campaign/models/IMG_4394.jpg"]'::jsonb, '[{"name":"Onyx Black / Glow in Dark & Reflective","hex":"#111113","modelHex":"#18181b","images":["/campaign/models/IMG_4338.jpg","/products/shirts/IMG_4266.PNG","/products/shirts/IMG_4252.PNG","/campaign/models/IMG_4323.jpg"]},{"name":"Chalk White / Glitter Silver & DTF","hex":"#f4f4f4","modelHex":"#f0ede6","images":["/campaign/models/IMG_4330.jpg","/products/shirts/IMG_4251.PNG","/products/shirts/IMG_4250.PNG","/campaign/models/IMG_4332.jpg"]},{"name":"Onyx Black / Sovereign Glitter Gold","hex":"#1a1813","modelHex":"#141416","images":["/campaign/models/IMG_4368.jpg","/products/shirts/IMG_4260.PNG","/products/shirts/IMG_4258.PNG","/campaign/models/IMG_4366.jpg"]},{"name":"Chalk White / Celestial Glitter Gold","hex":"#ece8e1","modelHex":"#f4f1ea","images":["/campaign/models/IMG_4472.jpg","/products/shirts/IMG_4259.PNG","/campaign/models/IMG_4475.jpg"]},{"name":"Onyx Black / Starlight Diamond","hex":"#0d0e12","modelHex":"#121318","images":["/campaign/models/IMG_4394.jpg","/products/shirts/IMG_4267.PNG","/products/shirts/IMG_4263.PNG","/campaign/models/IMG_4390.jpg"]}]'::jsonb, '["S","M","L","XL","XXL"]'::jsonb, 'Crafted with heart, worn with purpose. Engineered from custom 320 GSM heavyweight 100% combed cotton, the X-SIGN Flex Tee combines architectural drop-shoulder streetwear tailoring with hand-finished metallic glitter gold, silver foil, and light-reactive reflective accents.', '{"composition":"Heavy fabric of 100% Cotton","weight":"320 GSM compact streetwear jersey","finish":"Glitter Gold, Glitter Silver, Glow in Dark, Reflective and Fine Finished DTF","origin":"Atelier Crafted in Accra"}'::jsonb,
  '["X-SIGN FLEX TEE: Crafted with heart, worn with purpose.","Fine materials: Glitter Gold & Glitter Silver metallic shimmer accents","Glow in the Dark & Reflective light-activated elements","Fine Finished Direct-to-Film (DTF) precision detailing","Heavy fabric constructed from 100% premium cotton"]'::jsonb, '["Machine wash cold inside out on gentle cycle","Hang dry in shade to preserve artwork vibrancy","Do not iron directly over printed graphics"]'::jsonb, '{"garmentType":"tshirt","defaultColor":"#1a1a1a","roughness":0.9,"metalness":0.05,"fabricPattern":"smooth","scale":[1,1,1]}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  price_ghs = EXCLUDED.price_ghs,
  price_usd = EXCLUDED.price_usd,
  price_gbp = EXCLUDED.price_gbp,
  price_eur = EXCLUDED.price_eur,
  is_sold_out = EXCLUDED.is_sold_out,
  stock_count = EXCLUDED.stock_count,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description;

INSERT INTO public.products (
  id, slug, title, subtitle, category, garment_type,
  price_ghs, price_usd, price_gbp, price_eur,
  is_new, is_featured, is_sold_out, stock_count, drop_name,
  images, colors, sizes, description, fabric_details,
  features, care_instructions, model3d_config
) VALUES (
  'xsign-beanie-classic', 'xsign-ribbed-beanie-classic', 'X-SIGN RIBBED BEANIE (Embroidered Crest)', '7-Gauge Chunky Rib Knit • Raised 3D Embroidered Crest', 'accessories', 'accessory',
  149, 12, 9, 11,
  true, true, false, 50, 'X-SIGN DROP 01',
  '["/products/caps/IMG_3375.PNG","/products/caps/IMG_4228.PNG","/products/caps/xsign-white-beanie-street-look.jpg","/products/caps/IMG_4216.PNG","/products/caps/IMG_4220.PNG"]'::jsonb, '[{"name":"Pitch Black / White Crest","hex":"#0f0f10","modelHex":"#171718","images":["/products/caps/IMG_3375.PNG","/products/caps/IMG_4225.PNG","/products/caps/IMG_4237.PNG"]},{"name":"Chalk White / Obsidian Crest","hex":"#f0f0f2","modelHex":"#f0ede6","images":["/products/caps/IMG_4228.PNG","/products/caps/xsign-white-beanie-street-look.jpg","/products/caps/IMG_4231.PNG","/products/caps/IMG_4226.PNG","/products/caps/IMG_4227.PNG","/products/caps/IMG_4246.PNG"]},{"name":"Heather Grey / White Crest","hex":"#9e9e9e","modelHex":"#888888","images":["/products/caps/IMG_4216.PNG","/products/caps/IMG_4217.PNG","/products/caps/IMG_4219.PNG","/products/caps/IMG_4199.PNG"]},{"name":"Mocha Camel / White Crest","hex":"#b5927b","modelHex":"#ba9a83","images":["/products/caps/IMG_4220.PNG","/products/caps/IMG_4221.PNG","/products/caps/IMG_4223.PNG","/products/caps/IMG_4240.PNG"]}]'::jsonb, '["ONE SIZE"]'::jsonb, 'Chunky 7-gauge double-cuffed fisherman beanie knitted from ultra-soft non-itch thermal acrylic blend. Features the iconic high-density white or obsidian X-SIGN oval crest embroidery.', '{"composition":"100% Soft-Spun Thermal Acrylic Knit","weight":"Chunky 7-gauge double-fold","finish":"High-density multi-pass 3D embroidery","origin":"Atelier Crafted in Accra"}'::jsonb,
  '["High-contrast dense embroidery oval crest","Double-ply folding cuff for adjustable depth","Retains snug shape without sagging","Ultra soft next-to-skin touch"]'::jsonb, '["Hand wash cold with mild detergent","Dry flat on a clean surface"]'::jsonb, '{"garmentType":"accessory","defaultColor":"#171718","roughness":0.9,"metalness":0.05,"fabricPattern":"heavy-terry","scale":[0.8,0.8,0.8]}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  price_ghs = EXCLUDED.price_ghs,
  price_usd = EXCLUDED.price_usd,
  price_gbp = EXCLUDED.price_gbp,
  price_eur = EXCLUDED.price_eur,
  is_sold_out = EXCLUDED.is_sold_out,
  stock_count = EXCLUDED.stock_count,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description;

INSERT INTO public.products (
  id, slug, title, subtitle, category, garment_type,
  price_ghs, price_usd, price_gbp, price_eur,
  is_new, is_featured, is_sold_out, stock_count, drop_name,
  images, colors, sizes, description, fabric_details,
  features, care_instructions, model3d_config
) VALUES (
  'xsign-beanie-glitter-gold', 'xsign-ribbed-beanie-glitter-gold', 'X-SIGN RIBBED BEANIE (Glitter Gold Crest)', '7-Gauge Chunky Rib Knit • Radiant Gold Shimmer Emblem', 'accessories', 'accessory',
  149, 12, 9, 11,
  true, true, false, 35, 'X-SIGN DROP 01',
  '["/products/caps/IMG_4195.PNG","/products/caps/IMG_4202.PNG","/products/caps/IMG_4197.PNG","/products/caps/IMG_4203.PNG","/products/caps/IMG_4242.PNG","/products/caps/IMG_4244.PNG"]'::jsonb, '[{"name":"Pitch Black / Gold Shimmer","hex":"#171718","modelHex":"#171718","images":["/products/caps/IMG_4195.PNG","/products/caps/IMG_4242.PNG","/products/caps/IMG_4209.PNG"]},{"name":"Chalk White / Gold Shimmer","hex":"#f0f0f2","modelHex":"#f0ede6","images":["/products/caps/IMG_4202.PNG","/products/caps/IMG_4244.PNG"]}]'::jsonb, '["ONE SIZE"]'::jsonb, 'Dark and light luxury headwear woven with ribbed thermal stitch and finished with the signature X-SIGN emblem in radiant gold shimmer embroidery.', '{"composition":"100% Soft-Spun Thermal Knit","weight":"Chunky 7-gauge double-fold","finish":"Lustrous metallic gold thread embroidery","origin":"Atelier Crafted in Accra"}'::jsonb,
  '["Glimmering gold embroidery oval emblem","Deep fold cuff for flexible styling","Ultra comfortable non-irritating fit","Deluxe atelier construction"]'::jsonb, '["Hand wash cold gently","Dry flat in shade"]'::jsonb, '{"garmentType":"accessory","defaultColor":"#171718","roughness":0.85,"metalness":0.25,"fabricPattern":"heavy-terry","scale":[0.8,0.8,0.8]}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  price_ghs = EXCLUDED.price_ghs,
  price_usd = EXCLUDED.price_usd,
  price_gbp = EXCLUDED.price_gbp,
  price_eur = EXCLUDED.price_eur,
  is_sold_out = EXCLUDED.is_sold_out,
  stock_count = EXCLUDED.stock_count,
  images = EXCLUDED.images,
  colors = EXCLUDED.colors,
  sizes = EXCLUDED.sizes,
  description = EXCLUDED.description;


-- ==============================================================================
-- 7. Site Content & Homepage CMS Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow public/anon update site_settings"
  ON public.site_settings FOR ALL
  USING (true)
  WITH CHECK (true);
