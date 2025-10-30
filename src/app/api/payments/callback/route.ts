import { NextRequest, NextResponse } from 'next/server';
import { myfatoorahService } from '@/lib/myfatoorah';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('MyFatoorah callback received:', body);

    // Extract payment details from callback
    const { 
      InvoiceId, 
      InvoiceStatus, 
      InvoiceValue, 
      CustomerName, 
      CustomerEmail,
      UserDefinedField, // Contains userId and resourceId
      CustomerReference,
      PaymentId,
      TransactionStatus,
      ErrorCode,
      Error
    } = body;

    // Find the payment record
    const payment = await db.payment.findFirst({
      where: {
        OR: [
          { externalId: InvoiceId?.toString() },
          { customerReference: CustomerReference },
        ]
      }
    });

    if (!payment) {
      console.error('Payment record not found for callback:', {
        InvoiceId,
        CustomerReference,
        PaymentId
      });
      return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
    }

    // Verify payment status with MyFatoorah for security
    let verifiedStatus = InvoiceStatus;
    try {
      if (InvoiceId) {
        const statusResponse = await myfatoorahService.getPaymentStatus(InvoiceId);
        if (statusResponse.IsSuccess) {
          verifiedStatus = statusResponse.Data.InvoiceStatus;
        }
      }
    } catch (error) {
      console.error('Failed to verify payment status:', error);
      // Continue with callback status if verification fails
    }

    // Update payment record
    const updatedPayment = await db.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: verifiedStatus === 'Paid' ? 'COMPLETED' : 
               verifiedStatus === 'Failed' ? 'FAILED' : 'PENDING',
        metadata: JSON.stringify({
          ...JSON.parse(payment.metadata || '{}'),
          callbackData: body,
          callbackReceivedAt: new Date().toISOString(),
          verifiedStatus,
          paymentId: PaymentId,
          transactionStatus: TransactionStatus,
          errorCode: ErrorCode,
          error: Error,
        }),
      },
    });

    // If payment is successful, create or update purchase record
    if (verifiedStatus === 'Paid') {
      let purchaseData: any = {
        userId: payment.userId,
        resourceId: payment.resourceId,
        paymentId: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        paymentStatus: 'COMPLETED',
        paymentMethod: payment.paymentMethod,
        downloadExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      };

      // Check if purchase already exists
      const existingPurchase = await db.purchase.findFirst({
        where: {
          userId: payment.userId,
          resourceId: payment.resourceId,
          paymentId: payment.id,
        }
      });

      if (existingPurchase) {
        await db.purchase.update({
          where: { id: existingPurchase.id },
          data: {
            ...purchaseData,
            paymentStatus: 'COMPLETED',
          }
        });
        console.log(`Purchase ${existingPurchase.id} updated successfully`);
      } else {
        await db.purchase.create({
          data: purchaseData
        });
        console.log(`New purchase created for payment ${payment.id}`);
      }

      // Update resource download count
      await db.resource.update({
        where: { id: payment.resourceId },
        data: {
          downloadCount: {
            increment: 1
          }
        }
      });

    } else if (verifiedStatus === 'Failed') {
      // Handle failed payment
      console.log(`Payment ${payment.id} failed:`, Error);
      
      // Update any existing purchase record
      const existingPurchase = await db.purchase.findFirst({
        where: {
          userId: payment.userId,
          resourceId: payment.resourceId,
          paymentId: payment.id,
        }
      });

      if (existingPurchase) {
        await db.purchase.update({
          where: { id: existingPurchase.id },
          data: {
            paymentStatus: 'FAILED',
          }
        });
      }
    }

    // Return success response to MyFatoorah
    return NextResponse.json({ 
      success: true,
      paymentId: payment.id,
      status: verifiedStatus 
    });

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Handle payment verification redirects
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    const invoiceId = searchParams.get('invoiceId');
    const status = searchParams.get('status');

    if (!paymentId && !invoiceId) {
      return NextResponse.redirect(new URL('/payments/error?message=Missing payment information', request.url));
    }

    // Find the payment record
    const payment = await db.payment.findFirst({
      where: {
        OR: [
          { id: paymentId || '' },
          { externalId: invoiceId?.toString() || '' }
        ]
      }
    });

    if (!payment) {
      return NextResponse.redirect(new URL('/payments/error?message=Payment not found', request.url));
    }

    // Verify payment status with MyFatoorah
    let finalStatus = status;
    if (invoiceId) {
      try {
        const statusResponse = await myfatoorahService.getPaymentStatus(parseInt(invoiceId));
        if (statusResponse.IsSuccess) {
          finalStatus = statusResponse.Data.InvoiceStatus;
          
          // Update payment record
          await db.payment.update({
            where: { id: payment.id },
            data: {
              paymentStatus: finalStatus === 'Paid' ? 'COMPLETED' : 
                     finalStatus === 'Failed' ? 'FAILED' : 'PENDING',
              metadata: JSON.stringify({
                ...JSON.parse(payment.metadata || '{}'),
                verifiedStatus: finalStatus,
                verifiedAt: new Date().toISOString(),
              }),
            },
          });
        }
      } catch (error) {
        console.error('Failed to verify payment status:', error);
      }
    }

    // Redirect based on payment status
    if (finalStatus === 'Paid') {
      return NextResponse.redirect(new URL(`/payments/success?paymentId=${payment.id}`, request.url));
    } else if (finalStatus === 'Failed') {
      return NextResponse.redirect(new URL(`/payments/error?paymentId=${payment.id}`, request.url));
    } else {
      return NextResponse.redirect(new URL(`/payments/pending?paymentId=${payment.id}`, request.url));
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.redirect(new URL('/payments/error?message=Verification failed', request.url));
  }
}