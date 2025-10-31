/**
 * MyFatoorah Payment Testing Script
 * 
 * This script tests the payment integration with MyFatoorah
 * Make sure to configure payment settings in admin panel first!
 */

const BASE_URL = 'http://localhost:3000';

// Test credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@sourcekom.com',
  password: 'Admin@2024!'
};

const TEST_CARD = {
  number: '5123450000000008',
  holderName: 'Test User',
  expiryMonth: '12',
  expiryYear: '25',
  cvv: '100'
};

async function login(email: string, password: string): Promise<string | null> {
  console.log('🔐 Logging in...');
  
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (response.ok) {
    const cookies = response.headers.get('set-cookie');
    const authToken = cookies?.match(/auth_token=([^;]+)/)?.[1];
    console.log('✅ Login successful');
    return authToken || null;
  } else {
    console.error('❌ Login failed');
    return null;
  }
}

async function testPaymentSettings() {
  console.log('\n📋 Testing Payment Settings Configuration...\n');
  
  const token = await login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
  if (!token) {
    console.error('Failed to authenticate');
    return;
  }

  // Get current settings
  console.log('📥 Fetching payment settings...');
  const response = await fetch(`${BASE_URL}/api/admin/payment-settings`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.ok) {
    const settings = await response.json();
    console.log('✅ Payment settings loaded:');
    console.log(`   - Webhook Enabled: ${settings.webhookEnabled}`);
    console.log(`   - Country Code: ${settings.countryCode}`);
    console.log(`   - Test Mode: ${settings.isTest}`);
    console.log(`   - Webhook Endpoint: ${settings.webhookEndpoint || 'Not set'}`);
    console.log(`   - Number of Retries: ${settings.numberOfRetries}`);
    console.log(`   - Delay Between Retries: ${settings.delayBetweenRetries}s`);
    
    if (!settings.apiKey && settings.webhookEndpoint === '') {
      console.log('\n⚠️  Payment settings not configured!');
      console.log('   Please configure at: http://localhost:3000/dashboard/admin/payment-settings');
      console.log('   You need to:');
      console.log('   1. Enter MyFatoorah API key');
      console.log('   2. Set webhook endpoint');
      console.log('   3. Generate webhook secret');
      console.log('   4. Click Save Settings');
      return false;
    }
    
    return true;
  } else {
    console.error('❌ Failed to fetch payment settings');
    return false;
  }
}

async function testPaymentInitiation() {
  console.log('\n💳 Testing Payment Initiation...\n');
  
  const response = await fetch(`${BASE_URL}/api/payment/initiate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: 100
    })
  });

  if (response.status === 503) {
    console.log('⚠️  Payment settings not configured');
    const error = await response.json();
    console.log(`   ${error.error}`);
    return false;
  }

  if (response.ok) {
    const data = await response.json();
    console.log('✅ Payment initiated successfully');
    console.log(`   Payment Methods Available: ${data.length || 0}`);
    
    // Find direct payment methods
    const directMethods = data.filter((m: any) => m.IsDirectPayment);
    console.log(`   Direct Payment Methods: ${directMethods.length}`);
    
    directMethods.forEach((method: any) => {
      console.log(`   - ${method.PaymentMethodEn} (ID: ${method.PaymentMethodId})`);
    });
    
    return true;
  } else {
    console.error('❌ Payment initiation failed');
    const error = await response.json();
    console.error('   Error:', error.error);
    return false;
  }
}

async function testDirectPayment() {
  console.log('\n💰 Testing Direct Payment (2D)...\n');
  
  const token = await login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
  if (!token) return false;

  console.log('📤 Sending direct payment request...');
  console.log(`   Card: ${TEST_CARD.number}`);
  console.log(`   Amount: 100 SAR`);
  
  const response = await fetch(`${BASE_URL}/api/payment/direct`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `auth_token=${token}`
    },
    body: JSON.stringify({
      amount: 100,
      currency: 'SAR',
      resourceId: 'test_resource_123',
      cardNumber: TEST_CARD.number,
      cardHolderName: TEST_CARD.holderName,
      expiryMonth: TEST_CARD.expiryMonth,
      expiryYear: TEST_CARD.expiryYear,
      cvv: TEST_CARD.cvv,
      saveCard: true
    })
  });

  if (response.status === 503) {
    console.log('⚠️  Payment settings not configured');
    return false;
  }

  if (response.ok) {
    const result = await response.json();
    console.log('✅ Direct payment processed successfully');
    console.log(`   Invoice ID: ${result.invoiceId}`);
    console.log(`   Status: ${result.invoiceStatus}`);
    console.log(`   Payment ID: ${result.paymentId}`);
    
    if (result.cardToken) {
      console.log(`   Card Token: ${result.cardToken.substring(0, 20)}...`);
      console.log('   ✅ Card saved for future use');
    }
    
    return true;
  } else {
    const error = await response.json();
    console.error('❌ Direct payment failed');
    console.error('   Error:', error.error);
    
    if (error.validationErrors) {
      console.error('   Validation Errors:');
      error.validationErrors.forEach((err: any) => {
        console.error(`     - ${err.Name}: ${err.Error}`);
      });
    }
    
    return false;
  }
}

async function testSavedPaymentMethods() {
  console.log('\n💾 Testing Saved Payment Methods...\n');
  
  const token = await login(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
  if (!token) return false;

  console.log('📥 Fetching saved payment methods...');
  
  const response = await fetch(`${BASE_URL}/api/payment/saved-methods`, {
    headers: {
      'Cookie': `auth_token=${token}`
    }
  });

  if (response.ok) {
    const data = await response.json();
    console.log(`✅ Found ${data.paymentMethods.length} saved payment methods`);
    
    data.paymentMethods.forEach((method: any, index: number) => {
      console.log(`   ${index + 1}. **** ${method.cardNumber}`);
      console.log(`      Brand: ${method.cardBrand || 'Unknown'}`);
      console.log(`      Holder: ${method.cardHolderName}`);
      console.log(`      Expires: ${method.expiryMonth}/${method.expiryYear}`);
      console.log(`      Default: ${method.isDefault ? 'Yes' : 'No'}`);
    });
    
    return data.paymentMethods.length > 0;
  } else {
    console.error('❌ Failed to fetch saved payment methods');
    return false;
  }
}

async function runTests() {
  console.log('🚀 MyFatoorah Payment Integration Test Suite\n');
  console.log('=' .repeat(60));
  
  // Test 1: Payment Settings
  const settingsConfigured = await testPaymentSettings();
  
  if (!settingsConfigured) {
    console.log('\n⚠️  Cannot proceed with payment tests without configuration');
    console.log('   Please configure payment settings first at:');
    console.log('   http://localhost:3000/dashboard/admin/payment-settings\n');
    console.log('   You will need:');
    console.log('   - MyFatoorah API Key (get from demo portal)');
    console.log('   - Enable Test Mode');
    console.log('   - Set Webhook Endpoint');
    console.log('   - Generate Webhook Secret\n');
    return;
  }
  
  // Test 2: Payment Initiation
  await testPaymentInitiation();
  
  // Test 3: Direct Payment
  const paymentSucceeded = await testDirectPayment();
  
  // Test 4: Saved Payment Methods (if payment succeeded)
  if (paymentSucceeded) {
    await testSavedPaymentMethods();
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Test suite completed');
  console.log('\nNext Steps:');
  console.log('1. Configure payment settings if not done');
  console.log('2. Test with MyFatoorah demo credentials');
  console.log('3. Verify webhook notifications');
  console.log('4. Test saved payment methods flow');
  console.log('5. Switch to production when ready\n');
}

// Run the tests
runTests().catch(console.error);

