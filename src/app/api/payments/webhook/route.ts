import { NextRequest, NextResponse } from 'next/server';
import { myfatoorahService } from '@/lib/myfatoorah';
import { db } from '@/lib/db';
import crypto from 'crypto';

interface WebhookEvent {
  Event: string;
  DateTime: string;
  Data: {
    InvoiceId?: number;
    InvoiceStatus?: string;
    InvoiceValue?: number;
    CustomerName?: string;
    CustomerEmail?: string;
    CustomerReference?: string;
    PaymentId?: string;
    TransactionStatus?: string;
    RefundId?: string;
    RefundStatus?: string;
    RefundAmount?: number;
    BalanceAmount?: number;
    SupplierId?: string;
    SupplierName?: string;
    BankDetails?: any;
    RecurringPaymentId?: string;
    DisputeId?: string;
    DisputeStatus?: string;
    ErrorCode?: string;
    Error?: string;
    [key: string]: any;
  };
}

/**
 * Decrypt encrypted setting value
 */
function decrypt(encryptedText: string): string {
  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key-change-in-production', 'salt', 32);
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      return encryptedText; // Not encrypted, return as is
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText; // Return original if decryption fails
  }
}

/**
 * Get webhook settings from database
 */
async function getWebhookSettings() {
  try {
    const settings = await db.setting.findMany({
      where: {
        key: {
          in: [
            'webhook_enabled',
            'webhook_endpoint',
            'webhook_secret_enabled',
            'webhook_secret_key',
            'webhook_events',
            'webhook_signing_version',
            'webhook_retry_count',
            'webhook_retry_delay'
          ]
        }
      }
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach(setting => {
      // Decrypt if needed
      settingsMap[setting.key] = setting.isEncrypted 
        ? decrypt(setting.value) 
        : setting.value;
    });

    return {
      enabled: settingsMap['webhook_enabled'] === 'true',
      endpoint: settingsMap['webhook_endpoint'] || '',
      secretEnabled: settingsMap['webhook_secret_enabled'] === 'true',
      secretKey: settingsMap['webhook_secret_key'] || '',
      events: JSON.parse(settingsMap['webhook_events'] || '[]'),
      signingVersion: settingsMap['webhook_signing_version'] || 'v2',
      retryCount: parseInt(settingsMap['webhook_retry_count'] || '5'),
      retryDelay: parseInt(settingsMap['webhook_retry_delay'] || '180')
    };
  } catch (error) {
    console.error('Failed to get webhook settings:', error);
    return {
      enabled: false,
      endpoint: '',
      secretEnabled: false,
      secretKey: '',
      events: [],
      signingVersion: 'v2',
      retryCount: 5,
      retryDelay: 180
    };
  }
}

/**
 * Verify webhook signature
 */
function verifySignature(
  payload: string | object,
  signature: string | null,
  secretKey: string,
  signingVersion: string
): boolean {
  if (!signature || !secretKey) {
    return false;
  }

  try {
    if (signingVersion === 'v2') {
      return myfatoorahService.verifyWebhookSignatureV2(payload, signature, secretKey);
    } else {
      return myfatoorahService.verifyWebhookSignature(payload, signature, secretKey);
    }
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Handle Transaction Status Changed event
 */
async function handleTransactionStatusChanged(data: WebhookEvent['Data']) {
  const { InvoiceId, InvoiceStatus, CustomerReference, InvoiceValue } = data;

  if (!InvoiceId) {
    console.error('Transaction Status Changed: Missing InvoiceId');
    return;
  }

  try {
    // Find payment by external ID
    const payment = await db.payment.findFirst({
      where: {
        OR: [
          { externalId: InvoiceId.toString() },
          { customerReference: CustomerReference || '' }
        ]
      }
    });

    if (!payment) {
      console.error(`Payment not found for InvoiceId: ${InvoiceId}`);
      return;
    }

    // Map MyFatoorah status to our status
    let paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' = 'PENDING';
    if (InvoiceStatus === 'Paid') {
      paymentStatus = 'COMPLETED';
    } else if (InvoiceStatus === 'Failed') {
      paymentStatus = 'FAILED';
    } else if (InvoiceStatus === 'Canceled') {
      paymentStatus = 'CANCELLED';
    }

    // Update payment record
    await db.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus,
        metadata: JSON.stringify({
          ...JSON.parse(payment.metadata || '{}'),
          webhookEvent: 'TransactionStatusChanged',
          webhookData: data,
          webhookReceivedAt: new Date().toISOString()
        })
      }
    });

    // If payment is completed, create or update purchase
    if (paymentStatus === 'COMPLETED') {
      const existingPurchase = await db.purchase.findFirst({
        where: {
          userId: payment.userId,
          resourceId: payment.resourceId,
          paymentId: payment.id
        }
      });

      if (existingPurchase) {
        await db.purchase.update({
          where: { id: existingPurchase.id },
          data: {
            paymentStatus: 'COMPLETED',
            downloadExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
      } else {
        await db.purchase.create({
          data: {
            userId: payment.userId,
            resourceId: payment.resourceId,
            paymentId: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            paymentStatus: 'COMPLETED',
            paymentMethod: payment.paymentMethod,
            downloadExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        });
      }

      // Update resource download count
      await db.resource.update({
        where: { id: payment.resourceId },
        data: {
          downloadCount: { increment: 1 }
        }
      });
    }
  } catch (error) {
    console.error('Error handling Transaction Status Changed:', error);
    throw error;
  }
}

/**
 * Handle Refund Status Changed event
 */
async function handleRefundStatusChanged(data: WebhookEvent['Data']) {
  const { RefundId, RefundStatus, InvoiceId, RefundAmount } = data;

  if (!InvoiceId) {
    console.error('Refund Status Changed: Missing InvoiceId');
    return;
  }

  try {
    const payment = await db.payment.findFirst({
      where: { externalId: InvoiceId.toString() }
    });

    if (!payment) {
      console.error(`Payment not found for InvoiceId: ${InvoiceId}`);
      return;
    }

    // Update purchase refund status
    const purchase = await db.purchase.findFirst({
      where: { paymentId: payment.id }
    });

    if (purchase) {
      let refundStatus: 'NONE' | 'REQUESTED' | 'APPROVED' | 'REJECTED' = 'NONE';
      if (RefundStatus === 'Approved' || RefundStatus === 'Success') {
        refundStatus = 'APPROVED';
      } else if (RefundStatus === 'Rejected' || RefundStatus === 'Failed') {
        refundStatus = 'REJECTED';
      } else if (RefundStatus === 'Pending') {
        refundStatus = 'REQUESTED';
      }

      await db.purchase.update({
        where: { id: purchase.id },
        data: {
          refundStatus,
          refundReason: RefundStatus,
          paymentStatus: refundStatus === 'APPROVED' ? 'REFUNDED' : purchase.paymentStatus
        }
      });
    }

    // Update payment record
    await db.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: RefundStatus === 'Approved' ? 'REFUNDED' : payment.paymentStatus,
        metadata: JSON.stringify({
          ...JSON.parse(payment.metadata || '{}'),
          webhookEvent: 'RefundStatusChanged',
          refundId: RefundId,
          refundStatus: RefundStatus,
          refundAmount: RefundAmount,
          webhookReceivedAt: new Date().toISOString()
        })
      }
    });
  } catch (error) {
    console.error('Error handling Refund Status Changed:', error);
    throw error;
  }
}

/**
 * Handle Balance Transferred event
 */
async function handleBalanceTransferred(data: WebhookEvent['Data']) {
  // Log balance transfer events
  console.log('Balance Transferred event received:', data);
  
  try {
    const { InvoiceId, BalanceAmount } = data;
    
    if (InvoiceId) {
      const payment = await db.payment.findFirst({
        where: { externalId: InvoiceId.toString() }
      });

      if (payment) {
        await db.payment.update({
          where: { id: payment.id },
          data: {
            metadata: JSON.stringify({
              ...JSON.parse(payment.metadata || '{}'),
              webhookEvent: 'BalanceTransferred',
              balanceAmount: BalanceAmount,
              webhookReceivedAt: new Date().toISOString()
            })
          }
        });
      }
    }
  } catch (error) {
    console.error('Error handling Balance Transferred:', error);
  }
}

/**
 * Main webhook handler
 */
export async function POST(request: NextRequest) {
  try {
    const settings = await getWebhookSettings();

    // Check if webhook is enabled
    if (!settings.enabled) {
      return NextResponse.json(
        { success: false, error: 'Webhook is disabled' },
        { status: 403 }
      );
    }

    // Get raw body for signature verification
    const rawBody = await request.text();
    const body = JSON.parse(rawBody) as WebhookEvent;

    // Verify signature if secret is enabled
    if (settings.secretEnabled && settings.secretKey) {
      const signature = request.headers.get('x-myfatoorah-signature') ||
                       request.headers.get('x-signature') ||
                       request.headers.get('signature');

      if (!signature) {
        console.error('Webhook signature missing');
        return NextResponse.json(
          { success: false, error: 'Signature missing' },
          { status: 401 }
        );
      }

      const isValid = verifySignature(
        rawBody,
        signature,
        settings.secretKey,
        settings.signingVersion
      );

      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { success: false, error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Check if event type is enabled
    const eventType = body.Event || 'Unknown';
    if (settings.events.length > 0 && !settings.events.includes(eventType)) {
      console.log(`Event type ${eventType} is not enabled, skipping`);
      return NextResponse.json({ success: true, message: 'Event type not enabled' });
    }

    // Handle different event types
    switch (eventType) {
      case 'TransactionStatusChanged':
        if (settings.events.length === 0 || settings.events.includes('TransactionStatusChanged')) {
          await handleTransactionStatusChanged(body.Data);
        }
        break;

      case 'RefundStatusChanged':
        if (settings.events.length === 0 || settings.events.includes('RefundStatusChanged')) {
          await handleRefundStatusChanged(body.Data);
        }
        break;

      case 'BalanceTransferred':
        if (settings.events.length === 0 || settings.events.includes('BalanceTransferred')) {
          await handleBalanceTransferred(body.Data);
        }
        break;

      case 'SupplierUpdateRequestChanged':
      case 'RecurringStatusChanged':
      case 'DisputeStatusChanged':
      case 'SupplierBankDetailsChanged':
        // Log these events but don't process them yet
        console.log(`Received ${eventType} event:`, body.Data);
        break;

      default:
        console.log(`Unknown event type: ${eventType}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      event: eventType
    });

  } catch (error: any) {
    console.error('Webhook processing error:', error);

    // Retry logic would be handled by MyFatoorah based on HTTP status
    return NextResponse.json(
      {
        success: false,
        error: 'Webhook processing failed',
        message: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for webhook health check
 */
export async function GET(request: NextRequest) {
  const settings = await getWebhookSettings();
  
  return NextResponse.json({
    enabled: settings.enabled,
    endpoint: settings.endpoint,
    events: settings.events,
    signingVersion: settings.signingVersion
  });
}
