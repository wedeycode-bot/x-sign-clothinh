import { Product } from '@/types/product';
import initialProductsData from '@/data/products.json';
import { getSupabaseServer, isSupabaseServerConfigured } from '@/lib/supabaseServer';

function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    subtitle: row.subtitle || '',
    category: row.category || 'all',
    garmentType: row.garment_type || 'tshirt',
    priceGHS: Number(row.price_ghs) || 0,
    priceUSD: Number(row.price_usd) || 0,
    priceGBP: Number(row.price_gbp) || 0,
    priceEUR: Number(row.price_eur) || 0,
    isNew: Boolean(row.is_new),
    isFeatured: Boolean(row.is_featured),
    isSoldOut: Boolean(row.is_sold_out),
    stockCount: typeof row.stock_count === 'number' ? row.stock_count : 50,
    dropName: row.drop_name || 'X-SIGN DROP 01',
    images: Array.isArray(row.images) && row.images.length > 0
      ? row.images
      : (Array.isArray(row.colors) && row.colors[0]?.images?.length > 0 ? row.colors[0].images : []),
    colors: Array.isArray(row.colors) ? row.colors : [],
    sizes: Array.isArray(row.sizes) && row.sizes.length > 0 ? row.sizes : ['S', 'M', 'L', 'XL'],
    description: row.description || '',
    fabricDetails: row.fabric_details || {
      composition: '100% Combed Heavy Cotton',
      weight: '320 GSM',
      finish: 'Precision Screenprint & DTF',
      origin: 'Atelier Crafted in Accra',
    },
    features: Array.isArray(row.features) ? row.features : [],
    careInstructions: Array.isArray(row.care_instructions) ? row.care_instructions : [],
    model3DConfig: row.model3d_config || {
      garmentType: 'tshirt',
      defaultColor: '#18181b',
      roughness: 0.85,
      metalness: 0.05,
      fabricPattern: 'heavy-terry',
    },
  };
}

function mapProductToRow(p: Product): any {
  return {
    id: p.id,
    slug: p.slug || p.id,
    title: p.title,
    subtitle: p.subtitle || '',
    category: p.category || 'all',
    garment_type: p.garmentType || 'tshirt',
    price_ghs: p.priceGHS || 0,
    price_usd: p.priceUSD || 0,
    price_gbp: p.priceGBP || 0,
    price_eur: p.priceEUR || 0,
    is_new: Boolean(p.isNew),
    is_featured: Boolean(p.isFeatured),
    is_sold_out: Boolean(p.isSoldOut),
    stock_count: typeof p.stockCount === 'number' ? p.stockCount : 50,
    drop_name: p.dropName || 'X-SIGN DROP 01',
    images: p.images || [],
    colors: p.colors || [],
    sizes: p.sizes || ['S', 'M', 'L', 'XL'],
    description: p.description || '',
    fabric_details: p.fabricDetails || {},
    features: p.features || [],
    care_instructions: p.careInstructions || [],
    model3d_config: p.model3DConfig || {},
    updated_at: new Date().toISOString(),
  };
}

/**
 * ALWAYS reads from Supabase if configured. No in-memory caching.
 * Falls back to bundled products.json only if Supabase is not configured or query fails.
 */
export async function getStoredProducts(): Promise<Product[]> {
  // 1. Try fetching from Supabase — ALWAYS, no cache
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = getSupabaseServer();
      if (supabase) {
        console.log('[productStore] Querying Supabase for products...');
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          console.log(`[productStore] ✅ Got ${data.length} products from Supabase`);
          return data.map(mapRowToProduct);
        } else if (error) {
          console.error('[productStore] ❌ Supabase query error:', error.message);
        } else {
          console.warn('[productStore] ⚠️ Supabase returned empty data, falling back to local');
        }
      } else {
        console.warn('[productStore] ⚠️ Supabase client is null despite being configured');
      }
    } catch (err) {
      console.error('[productStore] ❌ Supabase connection error:', err);
    }
  } else {
    console.log('[productStore] Supabase not configured, using local data');
  }

  // 2. Fallback to bundled products.json (static import, no file system read needed)
  console.log('[productStore] Using bundled products.json as fallback');
  return [...(initialProductsData as Product[])];
}

export async function updateStoredProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const currentProducts = await getStoredProducts();
  const index = currentProducts.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) return null;

  const targetProduct = currentProducts[index];
  const updatedProduct: Product = {
    ...targetProduct,
    ...updates,
  };

  // 1. Update in Supabase if configured
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = getSupabaseServer();
      if (supabase) {
        const row = mapProductToRow(updatedProduct);
        console.log(`[productStore] Updating product "${targetProduct.id}" in Supabase...`);
        const { data, error } = await supabase
          .from('products')
          .update(row)
          .eq('id', targetProduct.id)
          .select()
          .single();

        if (error) {
          console.error('[productStore] ❌ Supabase update failed:', error.message);
        } else if (data) {
          console.log(`[productStore] ✅ Product "${data.title}" updated in Supabase`);
          return mapRowToProduct(data);
        }
      }
    } catch (err) {
      console.error('[productStore] ❌ Supabase update error:', err);
    }
  }

  // 2. Return the locally merged product as fallback
  return updatedProduct;
}

export async function addStoredProduct(newProduct: Product): Promise<Product> {
  const currentProducts = await getStoredProducts();

  let slug =
    newProduct.slug ||
    newProduct.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  let id = newProduct.id || slug;

  let count = 1;
  const originalSlug = slug;
  while (currentProducts.some((p) => p.slug === slug || p.id === id)) {
    slug = `${originalSlug}-${count}`;
    id = slug;
    count++;
  }

  const completeProduct: Product = {
    ...newProduct,
    id,
    slug,
    stockCount: typeof newProduct.stockCount === 'number' ? newProduct.stockCount : 50,
    isSoldOut: Boolean(newProduct.isSoldOut),
    images: Array.isArray(newProduct.images) && newProduct.images.length > 0
      ? newProduct.images
      : (Array.isArray(newProduct.colors) && newProduct.colors[0]?.images ? newProduct.colors[0].images : []),
    colors: Array.isArray(newProduct.colors) && newProduct.colors.length > 0 ? newProduct.colors : [],
    sizes: Array.isArray(newProduct.sizes) && newProduct.sizes.length > 0 ? newProduct.sizes : ['S', 'M', 'L', 'XL'],
  };

  // 1. Insert into Supabase if configured
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = getSupabaseServer();
      if (supabase) {
        const row = mapProductToRow(completeProduct);
        console.log(`[productStore] Inserting product "${completeProduct.title}" into Supabase...`);
        const { data, error } = await supabase
          .from('products')
          .insert(row)
          .select()
          .single();

        if (error) {
          console.error('[productStore] ❌ Supabase insert failed:', error.message);
        } else if (data) {
          console.log(`[productStore] ✅ Product "${data.title}" inserted into Supabase`);
          return mapRowToProduct(data);
        }
      }
    } catch (err) {
      console.error('[productStore] ❌ Supabase insert error:', err);
    }
  }

  // 2. Local fallback
  return completeProduct;
}

export async function deleteStoredProduct(id: string): Promise<boolean> {
  const currentProducts = await getStoredProducts();
  const target = currentProducts.find((p) => p.id === id || p.slug === id);
  if (!target) return false;

  // 1. Delete from Supabase if configured
  if (isSupabaseServerConfigured()) {
    try {
      const supabase = getSupabaseServer();
      if (supabase) {
        console.log(`[productStore] Deleting product "${target.id}" from Supabase...`);
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', target.id);

        if (error) {
          console.error('[productStore] ❌ Supabase delete failed:', error.message);
          return false;
        }
        console.log(`[productStore] ✅ Product "${target.id}" deleted from Supabase`);
        return true;
      }
    } catch (err) {
      console.error('[productStore] ❌ Supabase delete error:', err);
    }
  }

  return true;
}
