import { NextRequest, NextResponse } from 'next/server';
import {
  MFSettings,
  MFPaymentRequest,
  MFInitiatePayment,
  MFLanguage,
  MFCurrencyISO,
  Response,
} from 'myfatoorah-javascript';
import { getPaymentSettings, getMyFatoorahBaseUrl } from '@/lib/payment-settings';

export async function POST(request: NextRequest) {
  try {
    // Load payment settings from database
    const config = await getPaymentSettings();
    
    if (!config) {
      return NextResponse.json(
        { error: 'Payment settings not configured. Please configure payment settings in admin panel.' },
        { status: 503 }
      );
    }

    const { amount } = await request.json();

    // Configure MyFatoorah with database settings
    const baseURL = getMyFatoorahBaseUrl(config.isTest, config.countryCode);
    MFSettings.sharedInstance.configure(baseURL, config.apiKey);

    const initiatePaymentRequest = new MFInitiatePayment(amount, MFCurrencyISO.SAUDIARABIA_SAR);

    const paymentMethods = await new Promise<any>((resolve, reject) => {
      MFPaymentRequest.sharedInstance.initiatePayment(
        initiatePaymentRequest,
        MFLanguage.ENGLISH,
        (response: Response) => {
          if (response.getError()) {
            reject(new Error(response.getError().error));
          } else {
            resolve(response.getBodyJson());
          }
        }
      );
    });
    
    return NextResponse.json(paymentMethods.Data);

  } catch (error) {
    let errorMessage = 'Failed to initiate payment';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
