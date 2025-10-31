import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const ALLOWED_TYPES = [
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'zip', 'rar', '7z',
  'jpg', 'jpeg', 'png', 'gif', 'svg',
  'mp4', 'mov', 'avi',
  'mp3', 'wav',
  'exe', 'dmg', 'apk'
];

async function verifyUser(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return { error: 'Unauthorized', status: 401, user: null };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return { error: null, status: 200, user: { id: decoded.userId } };
  } catch (error) {
    return { error: 'Invalid token', status: 401, user: null };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'product' | 'preview' | 'thumbnail'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !ALLOWED_TYPES.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Determine upload directory based on type
    let directory = 'uploads';
    if (type === 'product') {
      directory = 'uploads/products';
    } else if (type === 'preview') {
      directory = 'uploads/previews';
    } else if (type === 'thumbnail') {
      directory = 'uploads/thumbnails';
    }

    // Generate unique filename
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    
    // Create full path
    const uploadDir = join(process.cwd(), 'public', directory);
    const filePath = join(uploadDir, uniqueFileName);
    
    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });
    
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write file
    await writeFile(filePath, buffer);
    
    // Return public URL
    const fileUrl = `${new URL(request.url).origin}/${directory}/${uniqueFileName}`;
    
    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      uniqueFileName,
      fileSize: file.size,
      fileType: fileExtension
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

