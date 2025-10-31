import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
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

// GET /api/payment/saved-methods - Get user's saved payment methods
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const savedMethods = await db.savedPaymentMethod.findMany({
      where: {
        userId: auth.user!.id
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      paymentMethods: savedMethods.map(method => ({
        id: method.id,
        cardNumber: method.cardNumber,
        cardBrand: method.cardBrand,
        cardHolderName: method.cardHolderName,
        expiryMonth: method.expiryMonth,
        expiryYear: method.expiryYear,
        isDefault: method.isDefault,
        createdAt: method.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching saved payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved payment methods' },
      { status: 500 }
    );
  }
}

// POST /api/payment/saved-methods - Save a new payment method
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const {
      cardToken,
      cardNumber,
      cardBrand,
      cardHolderName,
      expiryMonth,
      expiryYear,
      isDefault = false
    } = body;

    if (!cardToken || !cardNumber || !cardHolderName || !expiryMonth || !expiryYear) {
      return NextResponse.json(
        { error: 'Card token, number, holder name, and expiry are required' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await db.savedPaymentMethod.updateMany({
        where: {
          userId: auth.user!.id
        },
        data: {
          isDefault: false
        }
      });
    }

    const savedMethod = await db.savedPaymentMethod.create({
      data: {
        userId: auth.user!.id,
        cardToken,
        cardNumber,
        cardBrand: cardBrand || null,
        cardHolderName,
        expiryMonth,
        expiryYear,
        isDefault
      }
    });

    return NextResponse.json({
      message: 'Payment method saved successfully',
      paymentMethod: {
        id: savedMethod.id,
        cardNumber: savedMethod.cardNumber,
        cardBrand: savedMethod.cardBrand,
        cardHolderName: savedMethod.cardHolderName,
        expiryMonth: savedMethod.expiryMonth,
        expiryYear: savedMethod.expiryYear,
        isDefault: savedMethod.isDefault
      }
    });
  } catch (error) {
    console.error('Error saving payment method:', error);
    return NextResponse.json(
      { error: 'Failed to save payment method' },
      { status: 500 }
    );
  }
}

// DELETE /api/payment/saved-methods - Delete a saved payment method
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const methodId = searchParams.get('id');

    if (!methodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
    const method = await db.savedPaymentMethod.findFirst({
      where: {
        id: methodId,
        userId: auth.user!.id
      }
    });

    if (!method) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    await db.savedPaymentMethod.delete({
      where: {
        id: methodId
      }
    });

    return NextResponse.json({
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}

