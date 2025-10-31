import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateLicenseKey, createLicenseEmail } from '@/lib/license-generator';
import { sendEmail } from '@/lib/email';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function verifyUser(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return { error: 'Unauthorized', status: 401, user: null };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      return { error: 'Unauthorized', status: 401, user: null };
    }

    return { error: null, status: 200, user };
  } catch (error) {
    return { error: 'Invalid token', status: 401, user: null };
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { purchaseId } = body;

    if (!purchaseId) {
      return NextResponse.json(
        { error: 'Purchase ID is required' },
        { status: 400 }
      );
    }

    // Get purchase details
    const purchase = await db.purchase.findUnique({
      where: { id: purchaseId },
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

    // Verify ownership
    if (purchase.userId !== auth.user!.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if license already exists
    if (purchase.licenseKey) {
      return NextResponse.json({
        licenseKey: purchase.licenseKey,
        message: 'License already exists'
      });
    }

    // Generate license key
    const licenseKey = generateLicenseKey({
      productId: purchase.resourceId,
      userId: purchase.userId,
      email: purchase.user.email,
      type: purchase.resource.licenseType as any,
      activationLimit: purchase.activationLimit || 1
    });

    // Generate download URL with expiry (7 days)
    const downloadExpires = new Date();
    downloadExpires.setDate(downloadExpires.getDate() + 7);

    // Create secure download token
    const downloadToken = Buffer.from(JSON.stringify({
      purchaseId: purchase.id,
      userId: purchase.userId,
      expires: downloadExpires.getTime()
    })).toString('base64');

    const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/resources/${purchase.resource.slug}/download?token=${downloadToken}`;

    // Update purchase with license
    await db.purchase.update({
      where: { id: purchaseId },
      data: {
        licenseKey,
        downloadUrl,
        downloadExpires,
        licenseStatus: 'ACTIVE'
      }
    });

    // Send license email
    try {
      const emailContent = createLicenseEmail({
        key: licenseKey,
        productId: purchase.resourceId,
        userId: purchase.userId,
        type: purchase.resource.licenseType,
        activationLimit: purchase.activationLimit || 1,
        createdAt: new Date(),
        expiresAt: undefined
      }, purchase.resource.title, downloadUrl);

      await sendEmail({
        to: purchase.user.email,
        subject: `Your License Key - ${purchase.resource.title}`,
        html: emailContent
      });
    } catch (emailError) {
      console.error('Failed to send license email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      licenseKey,
      downloadUrl,
      downloadExpires,
      message: 'License generated and sent via email'
    });
  } catch (error) {
    console.error('License generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate license' },
      { status: 500 }
    );
  }
}

