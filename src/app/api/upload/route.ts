import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSupabaseServer, isSupabaseServerConfigured } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawFolder = (formData.get('folder') as string) || 'general';
    const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';

    // Collect all uploaded files (single or multiple)
    let files: File[] = [];
    const filesList = formData.getAll('files') as File[];
    if (filesList && filesList.length > 0) {
      files = filesList;
    } else {
      const single = formData.get('file') as File | null;
      if (single) files = [single];
    }

    if (files.length === 0) {
      return NextResponse.json({ success: false, message: 'No file received from camera roll.' }, { status: 400 });
    }

    const savedUrls: string[] = [];

    // 1. Upload to Supabase Storage if configured (Permanent cloud storage for Vercel)
    if (isSupabaseServerConfigured()) {
      const supabase = getSupabaseServer();
      if (supabase) {
        for (const file of files) {
          const ext = (path.extname(file.name) || '.jpg').toLowerCase();
          const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
          const uniqueFilename = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${baseName}${ext}`;
          const filePath = `${folder}/${uniqueFilename}`;

          const buffer = Buffer.from(await file.arrayBuffer());

          const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, buffer, {
              contentType: file.type || 'image/jpeg',
              upsert: true,
            });

          if (uploadError) {
            console.error('[Upload API] Supabase storage upload failed:', uploadError.message);
          } else {
            const { data } = supabase.storage
              .from('products')
              .getPublicUrl(filePath);

            if (data?.publicUrl) {
              savedUrls.push(data.publicUrl);
            }
          }
        }

        if (savedUrls.length > 0) {
          return NextResponse.json({
            success: true,
            url: savedUrls[0],
            urls: savedUrls,
            count: savedUrls.length,
            storage: 'supabase',
          });
        }
      }
    }

    // 2. Fallback to local filesystem (works on localhost development)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of files) {
      const ext = (path.extname(file.name) || '.jpg').toLowerCase();
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
      const uniqueFilename = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}_${baseName}${ext}`;
      const targetFilePath = path.join(uploadDir, uniqueFilename);

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(targetFilePath, buffer);
      savedUrls.push(`/uploads/${folder}/${uniqueFilename}`);
    }

    return NextResponse.json({
      success: true,
      url: savedUrls[0],
      urls: savedUrls,
      count: savedUrls.length,
      storage: 'local',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'File upload failed.' },
      { status: 500 }
    );
  }
}
