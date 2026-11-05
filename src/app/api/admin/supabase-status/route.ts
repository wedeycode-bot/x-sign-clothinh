import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const pubKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  const effectiveKey = serviceKey || anonKey || pubKey;

  const status = {
    hasSupabaseUrl: Boolean(url),
    urlPreview: url ? url.slice(0, 15) + '...' : null,
    hasAnonKey: Boolean(anonKey),
    hasPublishableKey: Boolean(pubKey),
    hasServiceKey: Boolean(serviceKey),
    hasEffectiveKey: Boolean(effectiveKey),
    supabaseConnected: false,
    productCount: 0,
    error: null as string | null,
  };

  try {
    const supabase = getSupabaseServer();
    if (!supabase) {
      status.error = 'Supabase client could not be initialized (missing URL or API key).';
      return NextResponse.json(status);
    }

    const { data, error } = await supabase.from('products').select('id, title, stock_count');
    if (error) {
      status.error = error.message;
    } else {
      status.supabaseConnected = true;
      status.productCount = Array.isArray(data) ? data.length : 0;
    }
  } catch (err: any) {
    status.error = err?.message || 'Unknown connection error';
  }

  return NextResponse.json(status);
}
