import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExtension = path.extname(file.name) || '.jpg';
    const safeFilename = `product-${uniqueSuffix}${originalExtension}`;
    const filePath = path.join(uploadDir, safeFilename);

    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, url: `/uploads/${safeFilename}` });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'An error occurred during file upload' }, { status: 500 });
  }
}
