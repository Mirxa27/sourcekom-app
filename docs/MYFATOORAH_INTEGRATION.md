# MyFatoorah Payment Gateway Integration

This document outlines the MyFatoorah payment gateway integration implemented in the SourceKom platform.

## Overview

MyFatoorah is a leading payment gateway in the Middle East, supporting multiple payment methods including:
- Credit/Debit Cards (Visa, MasterCard, AMEX)
- Local payment methods (Mada, Knet, Sadad)
- Digital wallets (Apple Pay, STC Pay)
- Bank transfers

## Quick Start

1. **Get MyFatoorah API Keys**
   - Sign up at [MyFatoorah](https://myfatoorah.com)
   - Get test API keys for development
   - Configure webhook URLs

2. **Configure Environment**
   ```env
   MYFATOORAH_API_KEY="your-test-api-key"
   MYFATOORAH_TEST_MODE=true
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

3. **Test Integration**
   - Use the payment modal on any resource
   - Test with sandbox payment methods
   - Verify callback handling

## Architecture

### Backend Components

1. **MyFatoorah Service** (`/src/lib/myfatoorah.ts`)
   - Core service class for MyFatoorah API interactions
   - Handles payment initiation, status checking, and refunds
   - Supports both test and production environments

2. **Payment Initiation API** (`/src/app/api/payments/initiate/route.ts`)
   - Creates payment records in the database
   - Initiates payments with MyFatoorah
   - Returns payment URLs for redirect

3. **Payment Callback Handler** (`/src/app/api/payments/callback/route.ts`)
   - Handles MyFatoorah webhooks
   - Updates payment and purchase records
   - Verifies payment status

4. **Payment Status API** (`/src/app/api/payments/status/[paymentId]/route.ts`)
   - Checks payment status
   - Supports payment actions (cancel, retry)
   - Real-time status updates

### Frontend Components

1. **Payment Modal** (`/src/components/payment/payment-modal.tsx`)
   - User-friendly payment interface
   - Supports multiple payment methods
   - Form validation and error handling

2. **Resource Integration** (`/src/app/resources/[slug]/page.tsx`)
   - Integrated payment flow in resource details
   - Seamless user experience

## Payment Flow

### 1. User Initiates Payment
1. User clicks "Purchase" on a resource
2. Payment modal opens with customer information form
3. User selects payment method and submits
4. Frontend calls `/api/payments/initiate`
5. Backend creates payment record and calls MyFatoorah
6. MyFatoorah returns payment URL
7. User is redirected to MyFatoorah payment page

### 2. Payment Processing
1. User completes payment on MyFatoorah
2. MyFatoorah redirects to callback URL
3. Callback handler processes the payment
4. Payment status is updated in database
5. Purchase record is created if payment is successful
6. User is redirected to success/error page

### 3. Payment Verification
1. Frontend can poll `/api/payments/status/[paymentId]`
2. Backend verifies status with MyFatoorah
3. Real-time updates provided to user

## API Endpoints

### Initiate Payment
```
POST /api/payments/initiate
```

**Request:**
```json
{
  "resourceId": "resource_123",
  "amount": 99.99,
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "512345678",
    "countryCode": "+966"
  }
}
```

**Response:**
```json
{
  "success": true,
  "paymentId": "payment_123",
  "invoiceId": 12345,
  "paymentUrl": "https://apitest.myfatoorah.com/...",
  "customerReference": "RES_123_456_1234567890"
}
```

### Check Payment Status
```
GET /api/payments/status/[paymentId]
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "payment_123",
    "status": "completed",
    "amount": 99.99,
    "hasAccess": true
  }
}
```

## Security Features

- Webhook verification with MyFatoorah
- Amount validation against resource prices
- Duplicate payment prevention
- Rate limiting on all endpoints
- Secure data transmission

## Error Handling

- Automatic retry mechanisms
- Graceful fallback to demo mode
- User-friendly error messages
- Comprehensive logging

## Testing

### Test Mode
- Use MyFatoorah test environment
- Test API keys for development
- Sandbox payment methods

### Demo Mode
- Automatic fallback when MyFatoorah is unavailable
- Mock payment completion for testing
- Preserves user experience

### Test Cards
```json
{
  "visa": "4111111111111111",
  "mastercard": "5555555555554444",
  "amex": "378282246310005"
}
```

## Configuration

### Environment Variables
```env
# MyFatoorah Configuration
MYFATOORAH_API_KEY="your-api-key"
MYFATOORAH_TEST_MODE=true

# Application URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### Webhook URLs
- Callback URL: `{BASE_URL}/api/payments/callback`
- Error URL: `{BASE_URL}/api/payments/error`

## Database Schema

The integration uses Payment and Purchase models to track transactions and access rights.

## Support

- MyFatoorah Documentation: https://docs.myfatoorah.com
- Support: support@myfatoorah.com
- For integration issues: Check application logs and test with demo mode enabled