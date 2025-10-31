# MyFatoorah Payment Settings Configuration

## Overview
This document explains how to configure MyFatoorah payment integration in the SourceKom admin panel.

## Accessing Payment Settings

1. Log in to the admin panel at `/login` with admin credentials:
   - Email: `admin@sourcekom.com`
   - Password: `Admin@2024!`

2. Navigate to `/dashboard/admin/payment-settings`

## Configuration Options

### API Configuration

#### API Key (Required)
- Get your API key from the MyFatoorah merchant dashboard
- Production: https://myfatoorah.com
- Test: https://apitest.myfatoorah.com

#### Country Code
Select your operating country:
- SAU: Saudi Arabia
- KWT: Kuwait
- ARE: United Arab Emirates
- QAT: Qatar
- BHR: Bahrain
- OMN: Oman

#### Test Mode
- Enable for sandbox testing
- Disable for production payments

### Webhook Configuration

#### Enable Webhook
Toggle to enable/disable webhook notifications

#### Webhook Endpoint
URL where MyFatoorah will send payment event notifications.
Example: `https://sourcekom.com/?wc-api=myfatoorah_webhook`

#### Enable Secret Key
Recommended for security. Enables webhook signature verification.

#### Webhook Secret Key
- Click "Generate" to create a secure random key
- This key is used to verify webhook authenticity
- Keep it secure and don't share publicly

#### Webhook Events
Select which events should trigger webhook notifications:
- ✅ Transaction Status Changed
- ✅ Refund Status Changed
- ✅ Balance Transferred
- ✅ Supplier Update Request Changed
- ✅ Recurring Status Changed
- ✅ Dispute Status Changed
- ✅ Supplier Bank Details Changed

#### Signing Version
Currently supports: v2

#### Number of Retries
- Range: 0-5
- Default: 5
- How many times MyFatoorah will retry failed webhook deliveries

#### Delay Between Retries
- Range: 0-180 seconds
- Default: 180
- Time to wait between retry attempts

## Initial Setup

1. Navigate to payment settings page
2. Enter your MyFatoorah API key
3. Select your country code
4. Choose Test Mode for testing (disable for production)
5. Enable webhook and configure:
   - Set webhook endpoint URL
   - Generate or enter webhook secret key
   - Select desired webhook events
6. Click "Save Settings"

## Testing

To test the payment integration:
1. Enable "Test Mode" in settings
2. Use MyFatoorah test API key
3. Make a test payment through the platform
4. Verify webhook notifications are received

## Production Deployment

Before going live:
1. Obtain production API key from MyFatoorah
2. Disable "Test Mode"
3. Update API key with production credentials
4. Verify webhook endpoint is publicly accessible
5. Test a small transaction
6. Monitor webhook logs

## Security Notes

- Never commit API keys to version control
- Keep webhook secret key secure
- Use HTTPS for webhook endpoints
- Regularly rotate API keys
- Monitor webhook logs for suspicious activity

## Troubleshooting

### Payments Not Processing
- Verify API key is correct
- Check country code matches your MyFatoorah account
- Ensure test/production mode matches your API key

### Webhooks Not Received
- Verify endpoint URL is publicly accessible
- Check webhook is enabled
- Verify secret key if enabled
- Check MyFatoorah webhook logs
- Ensure selected events match expected triggers

### API Errors
- Check API key validity
- Verify base URL matches test/production mode
- Review MyFatoorah API documentation
- Check server logs for detailed error messages

## Support

For MyFatoorah API issues:
- Visit: https://myfatoorah.readme.io
- Contact: MyFatoorah support

For platform issues:
- Contact: admin@sourcekom.com

