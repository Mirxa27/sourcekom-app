/**
 * Setup Payment Configuration Script
 * This script initializes MyFatoorah payment settings for testing
 */

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// MyFatoorah Demo/Test API Key
const DEMO_API_KEY = 'rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSbsSDyaM3c0RBFzMmcPsmaPd7gIgPFX0hY7iZPEf-J5EW7Q59y0V0cJUKoEJm7RnDFO2v6sCe7Ywo2qrw2zB_hLwTCiSuXOEj-M_I1XPHBBQggHW2rQlbP3hojr1G4ihbwcX_ETZDXZ62mzYSV5qsHjq_z3o4OW7lhcw5YG35yWnN2VwLPOx2c0nUEqMB3iRkPwE0RJ8MqbMxSnVwcBEgZnVa3j96yI45phtXQZfIlQn-7b4zNT2yLJX_l61lv-bw9cQp6KF8Gew5vHD-YcPSLrLqALOsE1DLBaZ0MFm7YYj01yJVzF_GrYNrRNgDAu56Eg1mjUBdhjgOAo8mA';

async function setupPaymentConfig() {
  try {
    console.log('🔧 Setting up MyFatoorah payment configuration...\n');

    // Generate a secure webhook secret
    const webhookSecret = crypto.randomBytes(64).toString('hex');

    // Check if settings exist
    const existing = await prisma.paymentSettings.findFirst();

    const webhookEvents = [
      'TransactionStatusChanged',
      'RefundStatusChanged',
      'BalanceTransferred',
      'SupplierUpdateRequestChanged',
      'RecurringStatusChanged',
      'DisputeStatusChanged',
      'SupplierBankDetailsChanged'
    ];

    const settings = {
      apiKey: DEMO_API_KEY,
      countryCode: 'SAU',
      isTest: true,
      webhookEnabled: true,
      webhookEndpoint: 'https://sourcekom.com/?wc-api=myfatoorah_webhook',
      webhookSecretEnabled: true,
      webhookSecretKey: webhookSecret,
      webhookEvents: JSON.stringify(webhookEvents),
      signingVersion: 'v2',
      numberOfRetries: 5,
      delayBetweenRetries: 180,
      enabledGateways: JSON.stringify([]),
      updatedBy: null
    };

    if (existing) {
      // Update existing
      await prisma.paymentSettings.update({
        where: { id: existing.id },
        data: settings
      });
      console.log('✅ Updated existing payment settings');
    } else {
      // Create new
      await prisma.paymentSettings.create({
        data: settings
      });
      console.log('✅ Created new payment settings');
    }

    console.log('\n📊 Configuration Summary:');
    console.log('   API Key: Demo/Test Key (configured)');
    console.log('   Country: Saudi Arabia (SAU)');
    console.log('   Mode: TEST');
    console.log('   Webhook Endpoint: https://sourcekom.com/?wc-api=myfatoorah_webhook');
    console.log('   Webhook Secret: Generated (128 characters)');
    console.log('   Webhook Events: 7 events enabled');
    console.log('   Signing Version: v2');
    console.log('   Retries: 5 attempts');
    console.log('   Retry Delay: 180 seconds');

    console.log('\n✨ Payment configuration complete!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Run payment tests: npm run test:payment');
    console.log('   2. Or manually test at: http://localhost:3000/dashboard/admin/payment-settings');
    console.log('   3. Try a direct payment at: /api/payment/direct');
    console.log('\n💡 Using MyFatoorah Demo API Key for testing');
    console.log('   Replace with production key when deploying!\n');

  } catch (error) {
    console.error('❌ Error setting up payment configuration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupPaymentConfig();

