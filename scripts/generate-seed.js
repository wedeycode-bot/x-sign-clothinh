const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'products.json'), 'utf8'));

let sql = '-- ==============================================================================\n';
sql += '-- X-SIGN SEED DATA: Populates all initial products into Supabase\n';
sql += '-- ==============================================================================\n\n';

for (const p of products) {
  const esc = (val) => (typeof val === 'string' ? `'${val.replace(/'/g, "''")}'` : (val === undefined ? 'NULL' : val));
  const jsonEsc = (val) => `'${JSON.stringify(val || []).replace(/'/g, "''")}'::jsonb`;

  sql += `INSERT INTO public.products (
  id, slug, title, subtitle, category, garment_type,
  price_ghs, price_usd, price_gbp, price_eur,
  is_new, is_featured, is_sold_out, stock_count, drop_name,
  images, colors, sizes, description, fabric_details,
  features, care_instructions, model3d_config
) VALUES (
  ${esc(p.id)}, ${esc(p.slug)}, ${esc(p.title)}, ${esc(p.subtitle || '')}, ${esc(p.category || 'all')}, ${esc(p.garmentType || 'tshirt')},
  ${p.priceGHS || 0}, ${p.priceUSD || 0}, ${p.priceGBP || 0}, ${p.priceEUR || 0},
  ${Boolean(p.isNew)}, ${Boolean(p.isFeatured)}, ${Boolean(p.isSoldOut)}, ${p.stockCount || 50}, ${esc(p.dropName || 'X-SIGN DROP 01')},
  ${jsonEsc(p.images)}, ${jsonEsc(p.colors)}, ${jsonEsc(p.sizes)}, ${esc(p.description || '')}, ${jsonEsc(p.fabricDetails)},
  ${jsonEsc(p.features)}, ${jsonEsc(p.careInstructions)}, ${jsonEsc(p.model3DConfig)}
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
  description = EXCLUDED.description;\n\n`;
}

fs.writeFileSync(path.join(__dirname, '..', 'supabase', 'seed.sql'), sql, 'utf8');
console.log('Seed SQL generated successfully for ' + products.length + ' products.');
