import { NextRequest, NextResponse } from 'next/server';
import {
  MFSettings,
  MFDirectPaymentRequest,
  MFPaymentRequest,
  MFLanguage,
  MFCurrencyISO,
  Response,
} from 'myfatoorah-javascript';
import { getPaymentSettings, getMyFatoorahBaseUrl } from '@/lib/payment-settings';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify user authentication
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
    // Verify user
    const auth = await verifyUser(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Load payment settings from database
    const config = await getPaymentSettings();
    
    if (!config) {
      return NextResponse.json(
        { error: 'Payment settings not configured. Please configure payment settings in admin panel.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      amount,
      currency = 'SAR',
      resourceId,
      paymentMethodId,
      cardNumber,
      cardHolderName,
      expiryMonth,
      expiryYear,
      cvv,
      saveCard = false
    } = body;

    // Validate required fields
    if (!amount || !resourceId) {
      return NextResponse.json(
        { error: 'Amount and resource ID are required' },
        { status: 400 }
      );
    }

    if (!paymentMethodId && (!cardNumber || !cardHolderName || !expiryMonth || !expiryYear || !cvv)) {
      return NextResponse.json(
        { error: 'Either payment method ID or card details are required' },
        { status: 400 }
      );
    }

    // Configure MyFatoorah with database settings
    const baseURL = getMyFatoorahBaseUrl(config.isTest, config.countryCode);
    MFSettings.sharedInstance.configure(baseURL, config.apiKey);

    // Prepare direct payment request
    const directPaymentRequest = new MFDirectPaymentRequest();
    directPaymentRequest.invoiceValue = amount;
    directPaymentRequest.customerName = auth.user!.name || 'Customer';
    directPaymentRequest.customerEmail = auth.user!.email;
    directPaymentRequest.customerMobile = '0000000000'; // Should come from user profile
    directPaymentRequest.customerReference = resourceId;
    directPaymentRequest.displayCurrencyIso = currency as any;
    directPaymentRequest.mobileCountryCode = '+966';
    directPaymentRequest.language = MFLanguage.ENGLISH;
    directPaymentRequest.callBackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`;
    directPaymentRequest.errorUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/error`;

    if (paymentMethodId) {
      // Use saved payment method
      directPaymentRequest.paymentMethodId = paymentMethodId;
    } else {
      // Use new card details
      directPaymentRequest.paymentMethodId = 2; // Card payment
      directPaymentRequest.cardNumber = cardNumber;
      directPaymentRequest.cardHolderName = cardHolderName;
      directPaymentRequest.expiryMonth = expiryMonth;
      directPaymentRequest.expiryYear = expiryYear;
      directPaymentRequest.cardSecurityCode = cvv;
      
      if (saveCard) {
        directPaymentRequest.saveCard = true;
      }
    }

    // Execute direct payment
    const result = await new Promise<any>((resolve, reject) => {
      MFPaymentRequest.sharedInstance.directPayment(
        directPaymentRequest,
        (response: Response) => {
          if (response.getError()) {
            reject(new Error(response.getError().error));
          } else {
            resolve(response.getBodyJson());
          }
        }
      );
    });

    if (result.IsSuccess) {
      // Create payment record in database
      await db.payment.create({
        data: {
          amount: amount,
          currency: currency,
          paymentMethod: 'direct_card',
          paymentStatus: result.Data.InvoiceStatus === 'Paid' ? 'COMPLETED' : 'PENDING',
          externalId: result.Data.InvoiceId.toString(),
          paymentUrl: result.Data.PaymentURL || null,
          customerReference: resourceId,
          metadata: JSON.stringify({
            paymentId: result.Data.PaymentId,
            authorizationId: result.Data.AuthorizationId,
            transactionId: result.Data.TransactionId,
            referenceId: result.Data.ReferenceId
          }),
          userId: auth.user!.id,
          resourceId: resourceId
        }
      });

      return NextResponse.json({
        success: true,
        invoiceId: result.Data.InvoiceId,
        invoiceStatus: result.Data.InvoiceStatus,
        paymentId: result.Data.PaymentId,
        authorizationId: result.Data.AuthorizationId,
        transactionId: result.Data.TransactionId,
        referenceId: result.Data.ReferenceId,
        trackId: result.Data.TrackId,
        paymentURL: result.Data.PaymentURL,
        customerReference: result.Data.CustomerReference,
        userDefinedField: result.Data.UserDefinedField,
        comment: result.Data.Comment,
        cardToken: saveCard ? result.Data.CardToken : undefined
      });
    } else {
      return NextResponse.json(
        { 
          error: result.Message || 'Direct payment failed',
          validationErrors: result.ValidationErrors 
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Direct payment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

