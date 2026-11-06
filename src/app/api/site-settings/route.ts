import { NextResponse } from 'next/server';
import { getStoredSiteSettings, updateStoredSiteSettings } from '@/utils/siteSettingsStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const settings = await getStoredSiteSettings();
    return NextResponse.json({ success: true, settings }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('Failed to get site settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve site settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const settings = await updateStoredSiteSettings(body.settings || body);
    return NextResponse.json({
      success: true,
      message: 'Site content & homepage settings updated successfully',
      settings,
    });
  } catch (error: any) {
    console.error('Failed to update site settings:', error);
    return NextResponse.json({ success: false, message: 'Failed to update site settings' }, { status: 500 });
  }
}
