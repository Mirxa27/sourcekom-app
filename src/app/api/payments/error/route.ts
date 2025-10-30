import { NextRequest, NextResponse } from 'next/server';
import { myfatoorahService } from '@/lib/myfatoorah';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('MyFatoorah error callback received:', body);

    // Extract payment details from error callback
    const { 
      InvoiceId, 
      InvoiceStatus, 
      Error,
      ErrorCode,
      CustomerReference,
      PaymentId,
      TransactionStatus
    } = body;

    // Find the payment record
    const payment = await db.payment.findFirst({
      where: {
        OR: [
          { externalId: InvoiceId?.toString() },
          { customerReference: CustomerReference },
          { id: CustomerReference }
        ]
      }
    });

    if (!payment) {
      console.error('Payment record not found for error callback:', {
        InvoiceId,
        CustomerReference,
        PaymentId
      });
      return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
    }

    // Update payment record with error information
    await db.payment.update({
      where: { id: payment.id },
      data: {
        status: 'failed',
        metadata: {
          ...payment.metadata,
          errorCallbackData: body,
          errorCallbackReceivedAt: new Date().toISOString(),
          error: Error,
          errorCode: ErrorCode,
          transactionStatus: TransactionStatus,
          paymentId: PaymentId,
        },
      },
    });

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
          status: 'failed',
          metadata: {
            ...existingPurchase.metadata,
            failedAt: new Date().toISOString(),
            error: Error,
            errorCode: ErrorCode,
            errorCallbackData: body,
          }
        }
      });
      console.log(`Purchase ${existingPurchase.id} failed: ${Error}`);
    }

    // Return success response to MyFatoorah
    return NextResponse.json({ 
      success: true,
      paymentId: payment.id,
      error: Error 
    });

  } catch (error) {
    console.error('Payment error callback error:', error);
    return NextResponse.json(
      { error: 'Error callback processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Handle payment error redirects
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('paymentId');
    const invoiceId = searchParams.get('invoiceId');
    const error = searchParams.get('error') || 'Payment failed';

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

    if (payment) {
      // Update payment record
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: 'failed',
          metadata: {
            ...payment.metadata,
            errorRedirectReceivedAt: new Date().toISOString(),
            error: error,
          },
        },
      });

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
            status: 'failed',
            metadata: {
              ...existingPurchase.metadata,
              failedAt: new Date().toISOString(),
              error: error,
            }
          }
        });
      }
    }

    // Redirect to error page
    return NextResponse.redirect(new URL(`/payments/error?paymentId=${paymentId}&message=${encodeURIComponent(error)}`, request.url));

  } catch (error) {
    console.error('Payment error redirect error:', error);
    return NextResponse.redirect(new URL('/payments/error?message=Error processing payment', request.url));
  }
}