import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateLicenseKey, createLicenseEmail } from '@/lib/license-generator';
import { sendEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.redirect(new URL('/payment/error', request.url));
    }

    // Get payment details
    const payment = await db.payment.findUnique({
      where: { externalId: paymentId },
      include: {
        resource: true,
        user: true
      }
    });

    if (!payment) {
      return NextResponse.redirect(new URL('/payment/error', request.url));
    }

    // Check if payment is successful
    if (payment.paymentStatus === 'COMPLETED') {
      // Check if purchase record exists
      let purchase = await db.purchase.findFirst({
        where: {
          userId: payment.userId,
          resourceId: payment.resourceId
        }
      });

      // Create purchase if doesn't exist
      if (!purchase) {
        purchase = await db.purchase.create({
          data: {
            amount: payment.amount,
            currency: payment.currency,
            paymentMethod: payment.paymentMethod,
            paymentId: payment.id,
            paymentStatus: 'COMPLETED',
            userId: payment.userId,
            resourceId: payment.resourceId,
            activationLimit: 1
          },
          include: {
            resource: true,
            user: true
          }
        });
      }

      // Generate license if not already generated
      if (!purchase.licenseKey) {
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
          where: { id: purchase.id },
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
            createdAt: new Date()
          }, purchase.resource.title, downloadUrl);

          await sendEmail({
            to: purchase.user.email,
            subject: `Your License Key - ${purchase.resource.title}`,
            html: emailContent
          });
        } catch (emailError) {
          console.error('Failed to send license email:', emailError);
        }
      }

      // Redirect to success page with purchase ID
      return NextResponse.redirect(
        new URL(`/purchase/success?id=${purchase.id}`, request.url)
      );
    } else {
      return NextResponse.redirect(new URL('/payment/error', request.url));
    }
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.redirect(new URL('/payment/error', request.url));
  }
}
