import { NextResponse } from 'next/server';
import { getStoredProducts } from '@/utils/productStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    console.log('[/api/products] GET request received');
    const products = await getStoredProducts();
    console.log(`[/api/products] Returning ${products.length} products`);
    return NextResponse.json({ success: true, products }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('[/api/products] Failed to fetch products:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
