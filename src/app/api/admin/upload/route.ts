import { NextResponse } from 'next/server';
import { getSupabaseServer, isSupabaseServerConfigured } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Supabase is configured, upload to Supabase Storage bucket
    if (isSupabaseServerConfigured()) {
      const supabase = getSupabaseServer();
      if (supabase) {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(filePath, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true,
          });

        if (uploadError) {
          console.error('[Upload] Supabase storage upload error:', uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            fileName,
          });
        }
      }
    }

    // Fallback: Return Base64 data URL so image works immediately even before Supabase is connected
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      fileName: file.name,
      fallback: true,
    });
  } catch (error) {
    console.error('[Upload] Error uploading file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
