import { NextResponse } from 'next/server';
import {
  getStoredProducts,
  updateStoredProduct,
  addStoredProduct,
  deleteStoredProduct,
} from '@/utils/productStore';
import { Product } from '@/types/product';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const products = await getStoredProducts();
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
    console.error('Failed to get products:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve products' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ success: false, message: 'Missing product ID or updates' }, { status: 400 });
    }

    const updated = await updateStoredProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Product "${updated.title}" updated successfully`,
      product: updated,
    });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ success: false, message: 'Failed to update product' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct: Product = body.product;

    if (!newProduct || !newProduct.title) {
      return NextResponse.json({ success: false, message: 'Invalid product details provided' }, { status: 400 });
    }

    // Default currency conversions if not provided
    const priceGHS = Number(newProduct.priceGHS) || 0;
    const priceUSD = newProduct.priceUSD || Math.round(priceGHS * 0.076);
    const priceGBP = newProduct.priceGBP || Math.round(priceGHS * 0.061);
    const priceEUR = newProduct.priceEUR || Math.round(priceGHS * 0.070);

    const formattedProduct: Product = {
      ...newProduct,
      priceGHS,
      priceUSD,
      priceGBP,
      priceEUR,
      isSoldOut: Boolean(newProduct.isSoldOut),
      stockCount: typeof newProduct.stockCount === 'number' ? newProduct.stockCount : 50,
      images: Array.isArray(newProduct.images) && newProduct.images.length > 0
        ? newProduct.images
        : ['/products/shirts/IMG_4266.PNG'],
      colors: Array.isArray(newProduct.colors) && newProduct.colors.length > 0
        ? newProduct.colors
        : [
            {
              name: 'Onyx Black',
              hex: '#111113',
              modelHex: '#18181b',
              images: newProduct.images || ['/products/shirts/IMG_4266.PNG'],
            },
          ],
      sizes: Array.isArray(newProduct.sizes) && newProduct.sizes.length > 0
        ? newProduct.sizes
        : ['S', 'M', 'L', 'XL'],
      fabricDetails: newProduct.fabricDetails || {
        composition: '100% Combed Heavy Cotton',
        weight: '320 GSM',
        finish: 'Precision Streetwear Screenprint & DTF',
        origin: 'Atelier Crafted in Accra',
      },
      features: Array.isArray(newProduct.features) && newProduct.features.length > 0
        ? newProduct.features
        : ['Heavyweight atelier construction', 'Crafted with heart, worn with purpose.'],
      careInstructions: Array.isArray(newProduct.careInstructions) && newProduct.careInstructions.length > 0
        ? newProduct.careInstructions
        : ['Machine wash cold inside out', 'Hang dry in shade'],
      model3DConfig: newProduct.model3DConfig || {
        garmentType: (newProduct.garmentType || 'tshirt') as any,
        defaultColor: '#1a1a1a',
        roughness: 0.9,
        metalness: 0.05,
        fabricPattern: 'smooth',
        scale: [1, 1, 1],
      },
    };

    const saved = await addStoredProduct(formattedProduct);

    return NextResponse.json({
      success: true,
      message: `Product "${saved.title}" created and published successfully!`,
      product: saved,
    });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ success: false, message: 'Failed to create product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Product ID required' }, { status: 400 });
    }

    const removed = await deleteStoredProduct(id);
    if (!removed) {
      return NextResponse.json({ success: false, message: 'Product not found or already removed' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product successfully removed from catalog',
    });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete product' }, { status: 500 });
  }
}
