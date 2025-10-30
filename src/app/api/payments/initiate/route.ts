import { NextRequest, NextResponse } from 'next/server';
import { myfatoorahService } from '@/lib/myfatoorah';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Get user from session (simplified for now)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    // In a real app, verify the JWT token
    // For now, we'll use a simple user ID extraction
    let userId: string;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      userId = decoded.userId;
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { resourceId, amount, customerInfo } = body;

    // Validate required fields
    if (!resourceId || !amount || !customerInfo) {
      return NextResponse.json(
        { error: 'Missing required fields: resourceId, amount, customerInfo' },
        { status: 400 }
      );
    }

    // Validate customer info
    const { name, email, phone, countryCode } = customerInfo;
    if (!name || !email || !phone || !countryCode) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    // Check if MyFatoorah is configured
    if (!myfatoorahService.isConfigured()) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    // Get resource information
    const resource = await db.resource.findUnique({
      where: { id: resourceId },
      include: { category: true },
    });

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Check if resource is free
    if (resource.isFree) {
      return NextResponse.json(
        { error: 'Resource is free, no payment required' },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount !== resource.price) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Check if user already purchased this resource
    const existingPurchase = await db.purchase.findFirst({
      where: {
        userId: userId,
        resourceId: resourceId,
        status: 'completed',
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Resource already purchased' },
        { status: 400 }
      );
    }

    // Create payment record
    const payment = await db.payment.create({
      data: {
        userId: userId,
        resourceId: resourceId,
        amount: amount,
        currency: 'SAR',
        paymentStatus: 'PENDING',
        paymentMethod: 'myfatoorah',
        customerInfo: JSON.stringify(customerInfo),
        metadata: JSON.stringify({
          initiatedAt: new Date().toISOString(),
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || 'unknown',
        }),
      },
    });

    try {
      // Initiate payment with MyFatoorah
      const paymentResponse = await myfatoorahService.createResourcePayment(
        userId,
        resourceId,
        amount,
        customerInfo,
        {
          title: resource.title,
          description: resource.description || `Purchase of ${resource.title}`,
        }
      );

      if (!paymentResponse.IsSuccess) {
        // Update payment record with error
        await db.payment.update({
          where: { id: payment.id },
          data: {
            paymentStatus: 'FAILED',
            metadata: JSON.stringify({
              ...JSON.parse(payment.metadata || '{}'),
              error: paymentResponse.Message,
              failedAt: new Date().toISOString(),
            }),
          },
        });

        return NextResponse.json(
          { error: paymentResponse.Message || 'Failed to initiate payment' },
          { status: 400 }
        );
      }

      // Update payment record with MyFatoorah details
      await db.payment.update({
        where: { id: payment.id },
        data: {
          externalId: paymentResponse.Data.InvoiceId.toString(),
          paymentUrl: paymentResponse.Data.InvoiceURL,
          customerReference: paymentResponse.Data.CustomerReference,
          metadata: JSON.stringify({
            ...JSON.parse(payment.metadata || '{}'),
            invoiceId: paymentResponse.Data.InvoiceId,
            invoiceURL: paymentResponse.Data.InvoiceURL,
            customerReference: paymentResponse.Data.CustomerReference,
            expiryDate: paymentResponse.Data.ExpiryDate,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        paymentId: payment.id,
        invoiceId: paymentResponse.Data.InvoiceId,
        paymentUrl: paymentResponse.Data.InvoiceURL,
        customerReference: paymentResponse.Data.CustomerReference,
        expiryDate: paymentResponse.Data.ExpiryDate,
      });

    } catch (paymentError: any) {
      // Update payment record with error
      await db.payment.update({
        where: { id: payment.id },
        data: {
          paymentStatus: 'FAILED',
          metadata: JSON.stringify({
            ...JSON.parse(payment.metadata || '{}'),
            error: paymentError.message,
            failedAt: new Date().toISOString(),
          }),
        },
      });

      throw paymentError;
    }

  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get available payment methods
    const { searchParams } = new URL(request.url);
    const amount = parseFloat(searchParams.get('amount') || '0');

    if (!myfatoorahService.isConfigured()) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    const paymentMethods = await myfatoorahService.getPaymentMethods(amount);

    return NextResponse.json({
      success: true,
      paymentMethods: paymentMethods.Data?.PaymentMethods || [],
    });

  } catch (error: any) {
    console.error('Get payment methods error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}