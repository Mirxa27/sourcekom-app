import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Download token required' },
        { status: 400 }
      );
    }

    // Decode and verify token
    let tokenData;
    try {
      const decoded = Buffer.from(token, 'base64').toString();
      tokenData = JSON.parse(decoded);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid download token' },
        { status: 400 }
      );
    }

    // Check token expiry
    if (Date.now() > tokenData.expires) {
      return NextResponse.json(
        { error: 'Download link expired' },
        { status: 403 }
      );
    }

    // Get purchase and resource
    const purchase = await db.purchase.findUnique({
      where: { id: tokenData.purchaseId },
      include: {
        resource: true,
        user: true
      }
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      );
    }

    // Verify user ownership
    if (purchase.userId !== tokenData.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if license is active
    if (purchase.licenseStatus !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'License is not active' },
        { status: 403 }
      );
    }

    // Get file path
    const filePath = join(process.cwd(), 'public', purchase.resource.fileUrl!);
    
    try {
      const fileBuffer = await readFile(filePath);
      
      // Set appropriate headers
      const response = new NextResponse(fileBuffer);
      response.headers.set('Content-Type', 'application/octet-stream');
      response.headers.set(
        'Content-Disposition',
        `attachment; filename="${purchase.resource.title}.${purchase.resource.fileFormat}"`
      );
      response.headers.set('Content-Length', fileBuffer.length.toString());

      return response;
    } catch (fileError) {
      console.error('File read error:', fileError);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    );
  }
}
