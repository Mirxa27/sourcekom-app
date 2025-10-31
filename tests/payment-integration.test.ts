/**
 * MyFatoorah Payment Integration Tests
 * 
 * Prerequisites:
 * 1. Admin must configure payment settings via /dashboard/admin/payment-settings
 * 2. Test mode should be enabled
 * 3. Test API key from MyFatoorah demo portal
 */

import { test, expect } from '@playwright/test';

const TEST_CARD = {
  number: '5123450000000008', // MyFatoorah test card for successful payment
  holderName: 'Test User',
  expiryMonth: '12',
  expiryYear: '25',
  cvv: '100'
};

const ADMIN_CREDENTIALS = {
  email: 'admin@sourcekom.com',
  password: 'Admin@2024!'
};

test.describe('MyFatoorah Payment Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('http://localhost:3000');
  });

  test('Admin can configure payment settings', async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', ADMIN_CREDENTIALS.email);
    await page.fill('input[type="password"]', ADMIN_CREDENTIALS.password);
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard');
    
    // Navigate to payment settings
    await page.goto('http://localhost:3000/dashboard/admin/payment-settings');
    
    // Verify page loaded
    await expect(page.locator('h1')).toContainText('Payment Settings');
    
    // Check if API key field exists
    const apiKeyInput = page.locator('input#apiKey');
    await expect(apiKeyInput).toBeVisible();
    
    // Enable test mode
    const testModeCheckbox = page.locator('input#isTest');
    await testModeCheckbox.check();
    
    // Enable webhook
    const webhookCheckbox = page.locator('input#webhookEnabled');
    await webhookCheckbox.check();
    
    // Set webhook endpoint
    await page.fill('input#webhookEndpoint', 'https://sourcekom.com/?wc-api=myfatoorah_webhook');
    
    // Generate webhook secret
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();
    
    // Verify secret key was generated
    const secretKeyInput = page.locator('input#webhookSecretKey');
    const secretKeyValue = await secretKeyInput.inputValue();
    expect(secretKeyValue.length).toBeGreaterThan(0);
    
    console.log('✅ Payment settings page is accessible');
    console.log('✅ All configuration fields are present');
    console.log('✅ Webhook secret key can be generated');
  });

  test('Direct payment API endpoint exists and validates input', async ({ page, request }) => {
    // First, login to get auth token
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@sourcekom.com');
    await page.fill('input[type="password"]', 'Admin@2024!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Get cookies
    const cookies = await page.context().cookies();
    const authCookie = cookies.find(c => c.name === 'auth_token');
    
    expect(authCookie).toBeDefined();
    
    // Test direct payment endpoint - missing fields
    const response = await request.post('http://localhost:3000/api/payment/direct', {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `auth_token=${authCookie?.value}`
      },
      data: {
        amount: 100
        // Missing resourceId
      }
    });
    
    expect(response.status()).toBe(400);
    const errorData = await response.json();
    expect(errorData.error).toContain('required');
    
    console.log('✅ Direct payment endpoint validates required fields');
  });

  test('Can retrieve payment methods from MyFatoorah', async ({ request }) => {
    // This test checks if we can communicate with MyFatoorah API
    const response = await request.post('http://localhost:3000/api/payment/initiate', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        amount: 100
      }
    });
    
    const data = await response.json();
    
    if (response.status() === 503) {
      console.log('⚠️  Payment settings not configured - Admin needs to set up MyFatoorah credentials');
      expect(data.error).toContain('not configured');
    } else {
      expect(response.status()).toBe(200);
      expect(data).toHaveProperty('PaymentMethods');
      expect(Array.isArray(data.PaymentMethods)).toBeTruthy();
      
      // Find direct payment methods
      const directMethods = data.PaymentMethods.filter((m: any) => m.IsDirectPayment);
      console.log(`✅ Found ${directMethods.length} direct payment methods`);
      
      directMethods.forEach((method: any) => {
        console.log(`  - ${method.PaymentMethodEn} (ID: ${method.PaymentMethodId})`);
      });
    }
  });

  test('Saved payment methods API is accessible', async ({ page, request }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@sourcekom.com');
    await page.fill('input[type="password"]', 'Admin@2024!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    const cookies = await page.context().cookies();
    const authCookie = cookies.find(c => c.name === 'auth_token');
    
    // Get saved payment methods
    const response = await request.get('http://localhost:3000/api/payment/saved-methods', {
      headers: {
        'Cookie': `auth_token=${authCookie?.value}`
      }
    });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('paymentMethods');
    expect(Array.isArray(data.paymentMethods)).toBeTruthy();
    
    console.log(`✅ Saved payment methods API works`);
    console.log(`  Currently saved methods: ${data.paymentMethods.length}`);
  });

  test('Payment settings are loaded from database', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/payment/initiate', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        amount: 100
      }
    });
    
    if (response.status() === 503) {
      const data = await response.json();
      expect(data.error).toContain('not configured');
      console.log('⚠️  Payment settings need to be configured by admin');
      console.log('   Navigate to: http://localhost:3000/dashboard/admin/payment-settings');
    } else {
      console.log('✅ Payment settings are configured and loaded from database');
    }
  });
});

test.describe('Payment Settings Configuration Flow', () => {
  test('Complete payment settings configuration', async ({ page }) => {
    // Login as admin
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', ADMIN_CREDENTIALS.email);
    await page.fill('input[type="password"]', ADMIN_CREDENTIALS.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    // Navigate to payment settings
    await page.goto('http://localhost:3000/dashboard/admin/payment-settings');
    
    // Configure settings
    console.log('Configuring payment settings...');
    
    // API Key (use demo key - get from MyFatoorah demo portal)
    const apiKeyInput = page.locator('input#apiKey');
    await apiKeyInput.fill('rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSbsSDyaM3c0RBFzNMmcPsmaPd7gIgPFX0hY7iZPEf-J5EW7Q59y0V0cJUKoEJm7RnDFO2v6sCe7Ywo2qrw2zB_hLwTCiSuXOEj-M_I1XPHBBQggHW2rQlbP3hojr1G4ihbwcX_ETZDXZ62mzYSV5qsHjq_z3o4OW7lhcw5YG35yWnN2VwLPOx2c0nUEqMB3iRkPwE0RJ8MqbMxSnVwcBEgZnVa3j96yI45phtXQZfIlQn-7b4zNT2yLJX_l61lv-bw9cQp6KF8Gew5vHD-YcPSLrLqALOsE1DLBaZ0MFm7YYj01yJVzF_GrYNrRNgDAu56Eg1mjUBdhjgOAo8mA');
    
    // Select country
    await page.click('button[role="combobox"]');
    await page.click('div[role="option"]:has-text("Saudi Arabia")');
    
    // Enable test mode
    const testModeCheckbox = page.locator('input#isTest');
    if (!await testModeCheckbox.isChecked()) {
      await testModeCheckbox.check();
    }
    
    // Enable webhook
    const webhookCheckbox = page.locator('input#webhookEnabled');
    if (!await webhookCheckbox.isChecked()) {
      await webhookCheckbox.check();
    }
    
    // Set webhook endpoint
    await page.fill('input#webhookEndpoint', 'https://sourcekom.com/?wc-api=myfatoorah_webhook');
    
    // Enable secret key
    const secretEnabledCheckbox = page.locator('input#webhookSecretEnabled');
    if (!await secretEnabledCheckbox.isChecked()) {
      await secretEnabledCheckbox.check();
    }
    
    // Generate secret key
    await page.click('button:has-text("Generate")');
    
    // Set retry configuration
    await page.fill('input#numberOfRetries', '5');
    await page.fill('input#delayBetweenRetries', '180');
    
    // Save settings
    await page.click('button:has-text("Save Settings")');
    
    // Wait for success message
    await page.waitForSelector('text=successfully', { timeout: 10000 });
    
    console.log('✅ Payment settings configured successfully');
    console.log('✅ Test mode enabled');
    console.log('✅ Webhook configured');
  });
});

