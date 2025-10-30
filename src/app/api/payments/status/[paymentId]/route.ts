import { NextRequest, NextResponse } from 'next/server';
import { myfatoorahService } from '@/lib/myfatoorah';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { paymentId } = params;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        resource: {
          select: {
            id: true,
            title: true,
            slug: true,
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    let paymentStatus = payment.paymentStatus;
    let myfatoorahData = null;

    // If payment has external ID, verify status with MyFatoorah
    if (payment.externalId && myfatoorahService.isConfigured()) {
      try {
        const statusResponse = await myfatoorahService.getPaymentStatus(
          parseInt(payment.externalId)
        );

        if (statusResponse.IsSuccess) {
          myfatoorahData = statusResponse.Data;
          paymentStatus = myfatoorahData.InvoiceStatus === 'Paid' ? 'completed' :
                        myfatoorahData.InvoiceStatus === 'Failed' ? 'failed' : 'pending';

          // Update payment record with latest status
          await db.payment.update({
            where: { id: paymentId },
            data: {
              paymentStatus: paymentStatus === 'completed' ? 'COMPLETED' : 
                            paymentStatus === 'failed' ? 'FAILED' : 'PENDING',
              metadata: JSON.stringify({
                ...JSON.parse(payment.metadata || '{}'),
                lastCheckedAt: new Date().toISOString(),
                myfatoorahStatus: myfatoorahData.InvoiceStatus,
                myfatoorahData: myfatoorahData,
              }),
            },
          });

          // If payment is completed and no purchase exists, create one
          if (paymentStatus === 'COMPLETED') {
            const existingPurchase = await db.purchase.findFirst({
              where: {
                userId: payment.userId,
                resourceId: payment.resourceId,
                paymentId: payment.id,
              }
            });

            if (!existingPurchase) {
              await db.purchase.create({
                data: {
                  userId: payment.userId,
                  resourceId: payment.resourceId,
                  paymentId: payment.id,
                  amount: payment.amount,
                  currency: payment.currency,
                  paymentStatus: 'COMPLETED',
                  paymentMethod: payment.paymentMethod,
                  downloadExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                },
              });

              // Update resource download count
              await db.resource.update({
                where: { id: payment.resourceId },
                data: {
                  downloadCount: {
                    increment: 1
                  }
                }
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to verify payment status with MyFatoorah:', error);
        // Continue with local status if verification fails
      }
    }

    // Check if user has access to the resource
    let hasAccess = false;
    if (paymentStatus === 'COMPLETED' || paymentStatus === 'completed') {
      const purchase = await db.purchase.findFirst({
        where: {
          userId: payment.userId,
          resourceId: payment.resourceId,
          paymentStatus: 'COMPLETED',
        }
      });
      hasAccess = !!purchase;
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        status: paymentStatus === 'COMPLETED' ? 'completed' : 
               paymentStatus === 'FAILED' ? 'failed' : 'pending',
        amount: payment.amount,
        currency: payment.currency,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        resource: payment.resource,
        hasAccess,
      },
      myfatoorah: myfatoorahData ? {
        invoiceId: myfatoorahData.InvoiceId,
        invoiceStatus: myfatoorahData.InvoiceStatus,
        transactionDate: myfatoorahData.TransactionDate,
        paymentGateway: myfatoorahData.PaymentGateway,
        referenceId: myfatoorahData.ReferenceId,
        trackId: myfatoorahData.TrackId,
        paymentId: myfatoorahData.PaymentId,
        authorizationId: myfatoorahData.AuthorizationId,
      } : null,
    });

  } catch (error: any) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const { paymentId } = params;
    const body = await request.json();
    const { action } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    // Find the payment record
    const payment = await db.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Handle different actions
    switch (action) {
      case 'cancel':
        // Cancel pending payment
        if (payment.paymentStatus === 'PENDING') {
          await db.payment.update({
            where: { id: paymentId },
            data: {
              paymentStatus: 'CANCELLED',
              metadata: JSON.stringify({
                ...JSON.parse(payment.metadata || '{}'),
                cancelledAt: new Date().toISOString(),
                cancelledBy: 'user',
              }),
            },
          });
        }
        break;

      case 'retry':
        // Reset payment to pending for retry
        if (payment.paymentStatus === 'FAILED') {
          await db.payment.update({
            where: { id: paymentId },
            data: {
              paymentStatus: 'PENDING',
              metadata: JSON.stringify({
                ...JSON.parse(payment.metadata || '{}'),
                retryAttemptedAt: new Date().toISOString(),
              }),
            },
          });
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Payment ${action} successful`,
      paymentId,
    });

  } catch (error: any) {
    console.error('Payment action error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}