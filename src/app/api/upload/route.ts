import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const validExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.heic'];
    const savedUrls: string[] = [];

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
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'File upload failed.' },
      { status: 500 }
    );
  }
}
