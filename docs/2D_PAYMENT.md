# 2D Payment Integration (Direct Payment)

## Overview
2D payments allow direct deduction from user's card without requiring OTP verification. This is implemented using MyFatoorah's Direct Payment API.

## Features
- Direct card payments without OTP
- Save card for future use (tokenization)
- Manage saved payment methods
- Support for multiple cards per user
- Set default payment method
- Secure card token storage

## API Endpoints

### 1. Execute Direct Payment
**POST** `/api/payment/direct`

Request body:
```json
{
  "amount": 100.00,
  "currency": "SAR",
  "resourceId": "resource_id_here",
  "paymentMethodId": "optional_saved_method_id",
  "cardNumber": "5123450000000008",
  "cardHolderName": "John Doe",
  "expiryMonth": "12",
  "expiryYear": "25",
  "cvv": "100",
  "saveCard": true
}
```

Response:
```json
{
  "success": true,
  "invoiceId": 12345,
  "invoiceStatus": "Paid",
  "paymentId": 67890,
  "cardToken": "token_abc123" // If saveCard was true
}
```

### 2. Get Saved Payment Methods
**GET** `/api/payment/saved-methods`

Response:
```json
{
  "paymentMethods": [
    {
      "id": "method_id",
      "cardNumber": "**** 0008",
      "cardBrand": "Visa",
      "cardHolderName": "John Doe",
      "expiryMonth": "12",
      "expiryYear": "25",
      "isDefault": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Delete Saved Payment Method
**DELETE** `/api/payment/saved-methods?id=method_id`

Response:
```json
{
  "message": "Payment method deleted successfully"
}
```

## Usage Flow

### First-Time Payment (Save Card)
1. User enters card details
2. Checks "Save card for future use"
3. Submits payment
4. MyFatoorah processes payment and returns card token
5. Card token is saved to database
6. User can use saved card for future payments

### Using Saved Card
1. User selects saved payment method
2. Submits payment with saved method ID
3. MyFatoorah processes payment using stored token
4. No OTP required - direct deduction

## Security Considerations

### Card Token Storage
- Never store actual card numbers (only last 4 digits)
- Card tokens are unique and encrypted by MyFatoorah
- Tokens are user-specific and cannot be reused across accounts

### PCI Compliance
- Card details are sent directly to MyFatoorah
- No sensitive card data is stored on our servers
- Only masked card numbers (last 4 digits) are stored

### Best Practices
1. Always use HTTPS
2. Validate input on both client and server
3. Log all payment attempts for auditing
4. Implement rate limiting for payment endpoints
5. Monitor for suspicious activity
6. Regularly audit saved payment methods

## Testing

### Test Card Numbers
MyFatoorah provides test cards for different scenarios:

**Successful Payment:**
- Card Number: `5123450000000008`
- CVV: Any 3 digits
- Expiry: Any future date

**Declined Payment:**
- Card Number: `4508750015741019`
- CVV: Any 3 digits
- Expiry: Any future date

### Testing Flow
1. Enable test mode in payment settings
2. Use test API key from MyFatoorah
3. Use test card numbers above
4. Verify payment processing
5. Check saved payment methods
6. Test payment with saved method

## Example Implementation

### Frontend Component
```tsx
import { useState } from 'react';

function DirectPayment({ amount, resourceId }) {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false
  });

  const handlePayment = async () => {
    const response = await fetch('/api/payment/direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        resourceId,
        ...cardDetails
      })
    });

    const result = await response.json();
    
    if (result.success) {
      // Payment successful
      console.log('Payment completed:', result);
    } else {
      // Payment failed
      console.error('Payment failed:', result.error);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
      {/* Card input fields */}
      <input
        type="text"
        placeholder="Card Number"
        value={cardDetails.cardNumber}
        onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
      />
      {/* Other fields... */}
      <button type="submit">Pay Now</button>
    </form>
  );
}
```

### Using Saved Payment Method
```tsx
const handlePaymentWithSaved = async (methodId: string) => {
  const response = await fetch('/api/payment/direct', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 100,
      resourceId: 'resource_123',
      paymentMethodId: methodId
    })
  });

  const result = await response.json();
  // Handle result...
};
```

## Database Schema

### PaymentSettings Table
Stores MyFatoorah configuration:
- API Key
- Country Code
- Test Mode flag
- Webhook settings

### SavedPaymentMethod Table
Stores tokenized payment methods:
- User ID
- Card Token (from MyFatoorah)
- Masked card number (last 4 digits)
- Card brand (Visa, Mastercard, etc.)
- Expiry date
- Card holder name
- Default flag

## Error Handling

### Common Error Codes

**400 - Bad Request**
- Missing required fields
- Invalid card details
- Invalid payment method ID

**401 - Unauthorized**
- Missing or invalid authentication token

**404 - Not Found**
- Payment method not found
- Resource not found

**503 - Service Unavailable**
- Payment settings not configured

### Error Response Format
```json
{
  "error": "Error message here",
  "validationErrors": [] // Optional, from MyFatoorah
}
```

## Limitations

1. **Merchant Setup Required**: MyFatoorah merchant account must have 2D payment enabled
2. **Country Restrictions**: Feature availability varies by country
3. **Card Types**: Not all card types support 2D payments
4. **Transaction Limits**: Subject to MyFatoorah merchant limits

## Support

For MyFatoorah API issues:
- Documentation: https://myfatoorah.readme.io/docs/direct-payment
- Support: contact@myfatoorah.com

For platform issues:
- Contact: admin@sourcekom.com

