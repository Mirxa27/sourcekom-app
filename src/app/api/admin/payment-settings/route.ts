import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization token required', status: 401, user: null };
  }

  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive || user.role !== 'ADMIN') {
      return { error: 'Admin access required', status: 403, user: null };
    }

    return { error: null, status: 200, user };
  } catch (error) {
    return { error: 'Invalid or expired token', status: 401, user: null };
  }
}

// GET /api/admin/payment-settings
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    // Get the first (and only) payment settings record
    const settings = await db.paymentSettings.findFirst();

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        webhookEnabled: true,
        webhookEndpoint: '',
        webhookSecretEnabled: true,
        webhookSecretKey: '',
        webhookEvents: [],
        signingVersion: 'v2',
        numberOfRetries: 5,
        delayBetweenRetries: 180,
        enabledGateways: [],
        countryCode: 'SAU',
        isTest: false
      });
    }

    // Parse JSON fields
    const webhookEvents = JSON.parse(settings.webhookEvents);
    const enabledGateways = JSON.parse(settings.enabledGateways);

    return NextResponse.json({
      ...settings,
      webhookEvents,
      enabledGateways,
      // Don't expose API key
      apiKey: undefined
    });
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment settings' },
      { status: 500 }
    );
  }
}

// POST /api/admin/payment-settings
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (body.apiKey && typeof body.apiKey !== 'string') {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 400 }
      );
    }

    // Prepare webhook events as JSON string
    const webhookEvents = Array.isArray(body.webhookEvents) 
      ? JSON.stringify(body.webhookEvents)
      : '[]';

    // Prepare enabled gateways as JSON string
    const enabledGateways = Array.isArray(body.enabledGateways)
      ? JSON.stringify(body.enabledGateways)
      : '[]';

    // Check if settings exist
    const existingSettings = await db.paymentSettings.findFirst();

    let settings;
    if (existingSettings) {
      // Update existing settings
      settings = await db.paymentSettings.update({
        where: { id: existingSettings.id },
        data: {
          ...(body.apiKey && { apiKey: body.apiKey }),
          countryCode: body.countryCode || 'SAU',
          isTest: body.isTest ?? false,
          webhookEnabled: body.webhookEnabled ?? true,
          webhookEndpoint: body.webhookEndpoint || null,
          webhookSecretEnabled: body.webhookSecretEnabled ?? true,
          webhookSecretKey: body.webhookSecretKey || null,
          webhookEvents,
          signingVersion: body.signingVersion || 'v2',
          numberOfRetries: body.numberOfRetries ?? 5,
          delayBetweenRetries: body.delayBetweenRetries ?? 180,
          enabledGateways,
          cardPaymentStyle: body.cardPaymentStyle || null,
          stcPayStyle: body.stcPayStyle || null,
          updatedBy: auth.user!.id
        }
      });
    } else {
      // Create new settings
      if (!body.apiKey) {
        return NextResponse.json(
          { error: 'API key is required for initial setup' },
          { status: 400 }
        );
      }

      settings = await db.paymentSettings.create({
        data: {
          apiKey: body.apiKey,
          countryCode: body.countryCode || 'SAU',
          isTest: body.isTest ?? false,
          webhookEnabled: body.webhookEnabled ?? true,
          webhookEndpoint: body.webhookEndpoint || null,
          webhookSecretEnabled: body.webhookSecretEnabled ?? true,
          webhookSecretKey: body.webhookSecretKey || null,
          webhookEvents,
          signingVersion: body.signingVersion || 'v2',
          numberOfRetries: body.numberOfRetries ?? 5,
          delayBetweenRetries: body.delayBetweenRetries ?? 180,
          enabledGateways,
          cardPaymentStyle: body.cardPaymentStyle || null,
          stcPayStyle: body.stcPayStyle || null,
          updatedBy: auth.user!.id
        }
      });
    }

    return NextResponse.json({
      message: 'Payment settings saved successfully',
      settings: {
        ...settings,
        apiKey: undefined, // Don't expose API key
        webhookEvents: JSON.parse(settings.webhookEvents),
        enabledGateways: JSON.parse(settings.enabledGateways)
      }
    });
  } catch (error) {
    console.error('Error saving payment settings:', error);
    return NextResponse.json(
      { error: 'Failed to save payment settings' },
      { status: 500 }
    );
  }
}

