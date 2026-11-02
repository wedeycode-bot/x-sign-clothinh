import { NextResponse } from 'next/server';
import { getStoredProducts } from '@/utils/productStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getStoredProducts();
    return NextResponse.json({ success: true, products }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
