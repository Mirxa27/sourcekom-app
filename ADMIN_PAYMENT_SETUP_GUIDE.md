# Admin Payment Settings - Setup Guide

## ✅ Implementation Complete

The MyFatoorah payment settings feature is now fully integrated into the admin panel.

## 🎯 Accessing Payment Settings

### Step 1: Login as Admin
Navigate to: `http://localhost:3000/login`

**Credentials**:
- Email: `admin@sourcekom.com`
- Password: `Admin@2024!`

### Step 2: Access Admin Dashboard
After login, you'll be redirected to: `http://localhost:3000/admin`

### Step 3: Click Payment Settings Card
On the admin dashboard, you'll see a new "Administration" section with a **Payment Settings** card:

```
┌─────────────────────────────────┐
│  💳 Payment Settings            │
│  Configure MyFatoorah           │
│                                 │
│  Manage payment gateway,        │
│  webhooks, and transaction      │
│  settings for MyFatoorah        │
│                                 │
│  [Configure Now]                │
└─────────────────────────────────┘
```

Click this card to navigate to payment settings.

### Direct Access
You can also navigate directly to:
```
http://localhost:3000/dashboard/admin/payment-settings
```

## 📋 What You'll See

The payment settings page includes:

### 1. API Configuration
- **API Key** (required) - Your MyFatoorah API key
- **Country Code** - Select your operating country (SAU, KWT, ARE, QAT, BHR, OMN)
- **Test Mode** - Toggle for sandbox/production

### 2. Webhook Settings
- **Enable Webhook** - Toggle webhook notifications
- **Endpoint** - URL for webhook notifications
- **Enable Secret Key** - Toggle signature verification
- **Webhook Secret Key** - Security key with "Generate" button
- **Webhook Events** - Select which events to monitor:
  - Transaction Status Changed
  - Refund Status Changed
  - Balance Transferred
  - Supplier Update Request Changed
  - Recurring Status Changed
  - Dispute Status Changed
  - Supplier Bank Details Changed
- **Signing Version** - v2 (current version)
- **Number of Retries** - 0-5 attempts
- **Delay Between Retries** - 0-180 seconds

### 3. Save Button
Large blue "Save Settings" button at the bottom

## 🔧 Current Configuration (Pre-Configured for Testing)

The system has been pre-configured with:

✅ **MyFatoorah Demo API Key** (for testing)
✅ **Country**: Saudi Arabia (SAU)
✅ **Test Mode**: Enabled
✅ **Webhook Endpoint**: `https://sourcekom.com/?wc-api=myfatoorah_webhook`
✅ **Webhook Secret**: Auto-generated secure key
✅ **All Events**: Enabled
✅ **Retries**: 5 attempts with 180s delay

## 🧪 Testing the Configuration

### View Settings
1. Navigate to payment settings page
2. All fields should be pre-filled
3. API key will show as masked (********)

### Modify Settings
1. Change any setting (e.g., number of retries)
2. Click "Save Settings"
3. You should see a success toast notification

### Generate New Webhook Key
1. Click the "Generate" button next to webhook secret
2. A new 128-character key will be generated
3. Click "Save Settings" to persist

## 🔒 Security Features

- ✅ API keys are masked in the UI
- ✅ API keys are NOT returned in GET requests
- ✅ Only admins can access this page
- ✅ Changes are audited (updatedBy field)
- ✅ Secure webhook key generation using crypto

## 💳 Testing Payments

Once settings are configured, you can test:

### 1. Payment Initiation
```bash
curl http://localhost:3000/api/payment/initiate \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'
```

Should return available payment methods.

### 2. Direct Payment (2D - No OTP)
Use the test card:
- **Card**: `5123450000000008`
- **CVV**: `100`
- **Expiry**: `12/25`
- **Holder**: `Test User`

### 3. Saved Payment Methods
After a successful payment with "Save Card" option:
```bash
curl http://localhost:3000/api/payment/saved-methods \
  -H "Cookie: auth_token=YOUR_TOKEN"
```

## 🎨 UI Features

The admin panel card includes:
- 💳 Credit card icon
- Clear title and description
- Hover effects (shadow and border)
- "Configure Now" button
- Responsive grid layout

## 🚀 Quick Start Checklist

- [x] Database schema updated
- [x] Payment settings table created
- [x] Demo configuration seeded
- [x] Admin UI page created
- [x] Link added to admin dashboard
- [x] API routes implemented
- [ ] Admin reviews settings via UI ← **You are here**
- [ ] Admin modifies settings if needed
- [ ] Test actual payment transaction
- [ ] Verify webhook notifications

## 📸 What You Should See

When you access `/admin`, you'll see:

1. **Dashboard Stats** (top section):
   - Total Users
   - Total Resources
   - Total Purchases
   - Total Revenue

2. **Administration Section** (new section below):
   - Payment Settings card with:
     - Credit card icon
     - Title: "Payment Settings"
     - Description: "Configure MyFatoorah integration"
     - Details about webhook and transaction settings
     - "Configure Now" button

Click the card or button to access the payment settings page!

## 🔗 Navigation Path

```
Login → Admin Dashboard → Payment Settings Card → Payment Configuration Page
  ↓           ↓                     ↓                        ↓
/login    /admin        Click Card/Button    /dashboard/admin/payment-settings
```

## ⚡ Quick Access URLs

- Admin Dashboard: `http://localhost:3000/admin`
- Payment Settings: `http://localhost:3000/dashboard/admin/payment-settings`
- Login: `http://localhost:3000/login`

## 📝 Notes

1. The payment settings page is at `/dashboard/admin/payment-settings` (note the `/dashboard` prefix)
2. The admin page is at `/admin` (no `/dashboard` prefix)
3. Both are protected and require admin authentication
4. All settings are pre-configured for immediate testing
5. You can modify any setting and save via the UI

**Ready to go! Just navigate to the admin dashboard to see the new Payment Settings card.**

