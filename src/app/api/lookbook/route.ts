import { NextResponse } from 'next/server';
import { getLookbookItems, addLookbookItem, deleteLookbookItem } from '@/utils/lookbookStore';

export async function GET() {
  try {
    const items = getLookbookItems();
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('Error fetching lookbook items:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to load lookbook' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image, title, productSlug, productTitle, orientation } = body;

    if (!image || !title) {
      return NextResponse.json({ success: false, message: 'Image and title are required' }, { status: 400 });
    }

    const newItem = addLookbookItem({
      image,
      title,
      productSlug,
      productTitle,
      orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error('Error adding lookbook item:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to add lookbook item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Lookbook item ID is required' }, { status: 400 });
    }

    const deleted = deleteLookbookItem(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Lookbook item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Lookbook item deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting lookbook item:', error);
    return NextResponse.json({ success: false, message: error.message || 'Failed to delete lookbook item' }, { status: 500 });
  }
}
