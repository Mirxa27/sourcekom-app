# File Upload & License Management System

## Overview
This document covers the complete file upload and license management system for digital products on SourceKom.

## ✅ Features Implemented

### 1. File Upload System
- Multi-file upload support (product, preview, thumbnail)
- File type validation
- File size limits (100MB max)
- Secure file storage
- Automatic file organization

### 2. License Generation
- Automatic license key generation upon purchase
- Secure license key format (XXXX-XXXX-XXXX-XXXX-XXXX)
- Activation limits
- License status tracking (ACTIVE, REVOKED, EXPIRED)
- Email delivery of license keys

### 3. Secure Downloads
- Token-based download authentication
- Time-limited download links (7 days)
- License verification
- Usage tracking

## 📂 File Structure

### Uploaded Files Organization
```
public/
├── uploads/
│   ├── products/     # Main product files
│   ├── previews/     # Preview/demo files
│   └── thumbnails/   # Product thumbnails
```

### Supported File Types
**Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
**Archives**: ZIP, RAR, 7Z
**Images**: JPG, JPEG, PNG, GIF, SVG
**Videos**: MP4, MOV, AVI
**Audio**: MP3, WAV
**Software**: EXE, DMG, APK

### File Size Limits
- Maximum: 100MB per file
- Configurable in `/src/app/api/resources/upload/route.ts`

## 🔐 License System

### Database Schema

#### Purchase Table (Updated)
```prisma
model Purchase {
  id              String   @id @default(cuid())
  licenseKey      String?  // Generated license key
  licenseStatus   String?  @default("ACTIVE")
  activationLimit Int?     @default(1)
  activationCount Int?     @default(0)
  downloadUrl     String?
  downloadExpires DateTime?
  // ... other fields
}
```

### License Key Format
```
XXXX-XXXX-XXXX-XXXX-XXXX
```

Example: `A1B2-C3D4-E5F6-G7H8-I9J0`

Components:
1. Random bytes (4 chars)
2. User/Product hash (4 chars)
3. Timestamp (4 chars)
4. Product ID prefix (4 chars)
5. License type prefix (4 chars)

### License Types
- **STANDARD**: Basic single-user license
- **COMMERCIAL**: Commercial use license
- **ENTERPRISE**: Enterprise license (unlimited users)
- **WHITE_LABEL**: White label/resale license

## 📝 Usage Flow

### Creating a Resource (Seller)

1. **Navigate to**: `/dashboard/resources/new`

2. **Fill in Basic Information**:
   - Title (required)
   - Description (required)
   - Price in SAR (required)
   - Product Type (dropdown)

3. **Upload Files**:
   - **Main Product** (required): The actual digital product file
   - **Preview** (optional): Demo or sample file
   - **Thumbnail** (optional): Product image

4. **Configure License**:
   - **License Type**: Select from 4 types
   - **Activation Limit**: Number of allowed device activations (1-100)

5. **Submit**: Creates resource and stores file references

### Purchasing Flow (Buyer)

1. **User purchases resource** via payment gateway

2. **Upon successful payment**:
   - Purchase record created
   - License key auto-generated
   - Download link created (7-day expiry)
   - Email sent with:
     - License key
     - Download link
     - Activation instructions

3. **User receives email** containing:
   ```
   License Key: XXXX-XXXX-XXXX-XXXX-XXXX
   Activation Limit: N devices
   Download Link: [Secure URL]
   Expiry: 7 days from purchase
   ```

4. **User downloads product**:
   - Clicks download link
   - Token validated
   - License checked
   - File served for download

## 🔧 API Endpoints

### 1. Upload Files
**POST** `/api/resources/upload`

Request (FormData):
```
file: File
type: 'product' | 'preview' | 'thumbnail'
```

Response:
```json
{
  "success": true,
  "fileUrl": "/uploads/products/uuid.zip",
  "fileName": "my-product.zip",
  "uniqueFileName": "uuid.zip",
  "fileSize": 1024000,
  "fileType": "zip"
}
```

### 2. Generate License
**POST** `/api/purchases/generate-license`

Request:
```json
{
  "purchaseId": "purchase_id"
}
```

Response:
```json
{
  "success": true,
  "licenseKey": "A1B2-C3D4-E5F6-G7H8-I9J0",
  "downloadUrl": "https://sourcekom.com/api/resources/slug/download?token=...",
  "downloadExpires": "2024-11-07T00:00:00.000Z",
  "message": "License generated and sent via email"
}
```

### 3. Download Product
**GET** `/api/resources/[slug]/download?token=encoded_token`

Returns: Binary file download

## 🔒 Security Features

### File Upload Security
- ✅ Authentication required
- ✅ File type validation
- ✅ File size limits
- ✅ Unique filename generation (prevents overwrites)
- ✅ Organized storage structure

### License Security
- ✅ Cryptographically secure key generation
- ✅ User-specific licenses
- ✅ Activation limits
- ✅ License status tracking
- ✅ Revocation capability

### Download Security
- ✅ Token-based authentication
- ✅ Time-limited download links (7 days)
- ✅ Ownership verification
- ✅ License status check
- ✅ Single-use or limited-use tokens

## 💻 Frontend Implementation

### File Upload Component Example
```tsx
// Multiple file upload
<input
  type="file"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'product');
    }
  }}
/>

// Upload handler
async function handleFileUpload(file: File, type: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await fetch('/api/resources/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  console.log('Uploaded:', data.fileUrl);
}
```

### Display License to User
```tsx
import { useState, useEffect } from 'react';

function PurchaseDetails({ purchaseId }) {
  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    fetch(`/api/purchases/${purchaseId}`)
      .then(r => r.json())
      .then(data => setPurchase(data));
  }, [purchaseId]);

  return (
    <div>
      <h2>Your License</h2>
      <div className="license-key">
        {purchase?.licenseKey}
      </div>
      <p>Activations: {purchase?.activationCount} / {purchase?.activationLimit}</p>
      <a href={purchase?.downloadUrl}>Download Product</a>
    </div>
  );
}
```

## 📧 Email Integration

License emails are automatically sent containing:
- Product name
- License key (formatted for easy copying)
- License type
- Activation limit
- Expiry date (if applicable)
- Download link
- Important usage notes

### Email Template Features
- HTML formatted
- Copy-friendly license key display
- Clear call-to-action download button
- Security reminders
- Support contact information

## 🧪 Testing

### Upload a Test File

1. **Navigate to**: `http://localhost:3000/dashboard/resources/new`

2. **Fill form**:
   - Title: "Test Product"
   - Description: "Testing file upload"
   - Price: 10

3. **Upload files**:
   - Click "Upload" for main product
   - Select a ZIP file (or any supported type)
   - Wait for upload confirmation
   - Optionally upload preview/thumbnail

4. **Configure license**:
   - Select license type
   - Set activation limit

5. **Submit**: Resource created with uploaded files

### Test License Generation

1. **Complete a purchase** (simulate or use test payment)

2. **Check purchase record**:
```bash
# Using Prisma Studio or direct query
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.purchase.findFirst({
  include: { resource: true, user: true }
}).then(p => console.log(p));
"
```

3. **Verify**:
   - License key generated
   - Download URL created
   - Email sent (check email logs)

### Test Secure Download

1. **Get download URL** from purchase record
2. **Open URL in browser**
3. **File should download** automatically
4. **Verify**:
   - Correct file received
   - Token validation worked
   - License check passed

## 🛡️ Security Best Practices

### File Storage
1. Files stored outside web root initially
2. Accessed only via authenticated API
3. No direct public access to files
4. Unique filenames prevent guessing

### License Keys
1. Cryptographically secure generation
2. Unique per purchase
3. Irreversible (can't derive user data)
4. Revocable if needed

### Download Links
1. Time-limited (7 days default)
2. Token-based authentication
3. One-time use recommended
4. IP tracking (optional enhancement)

## 🔄 Workflow Diagram

```
User Uploads Resource
    ↓
Files stored in /public/uploads/
    ↓
Resource created in database
    ↓
User purchases resource
    ↓
Payment successful
    ↓
License key generated
    ↓
Download link created (7-day expiry)
    ↓
Email sent to buyer
    ↓
Buyer downloads using secure link
    ↓
License activated on device
```

## 📊 Database Tables

### Purchase (Enhanced)
- `licenseKey`: Generated license key
- `licenseStatus`: ACTIVE | REVOKED | EXPIRED
- `activationLimit`: Max activations allowed
- `activationCount`: Current activation count
- `downloadUrl`: Secure download link
- `downloadExpires`: Link expiry date

### Resource (Uses)
- `fileUrl`: Path to main product file
- `previewUrl`: Path to preview file
- `thumbnail`: Path to thumbnail image
- `fileSize`: File size in bytes
- `fileFormat`: File extension
- `licenseType`: Default license type

## 🚨 Error Handling

### Upload Errors
- **File too large**: Max 100MB exceeded
- **Invalid type**: File extension not allowed
- **Upload failed**: Server storage error

### License Errors
- **Already exists**: License already generated
- **Purchase not found**: Invalid purchase ID
- **Unauthorized**: User doesn't own purchase

### Download Errors
- **Token expired**: Download link expired (>7 days)
- **Invalid token**: Malformed token
- **License inactive**: License revoked/expired
- **File not found**: Product file missing

## 🔧 Configuration

### Adjust File Size Limit
Edit `/src/app/api/resources/upload/route.ts`:
```typescript
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
```

### Adjust Download Expiry
Edit `/src/app/api/purchases/generate-license/route.ts`:
```typescript
downloadExpires.setDate(downloadExpires.getDate() + 7); // 7 days
```

### Add More File Types
Edit `/src/app/api/resources/upload/route.ts`:
```typescript
const ALLOWED_TYPES = [
  'pdf', 'doc', 'docx', // ... add more
];
```

## 📝 Example: Complete Resource Creation

```typescript
// 1. Upload main product file
const productFile = new File(['...'], 'my-product.zip');
const productUpload = await uploadFile(productFile, 'product');

// 2. Upload thumbnail
const thumbnail = new File(['...'], 'thumbnail.jpg');
const thumbUpload = await uploadFile(thumbnail, 'thumbnail');

// 3. Create resource
const resource = await fetch('/api/resources', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Product',
    description: 'Product description',
    price: 99.99,
    fileUrl: productUpload.fileUrl,
    thumbnail: thumbUpload.fileUrl,
    productType: 'SOFTWARE',
    licenseType: 'STANDARD',
    activationLimit: 3,
    fileSize: productUpload.fileSize,
    fileFormat: productUpload.fileType
  })
});
```

## 🎯 Next Steps

1. **Upload your first product**:
   - Go to `/dashboard/resources/new`
   - Fill in details
   - Upload files
   - Submit

2. **Test purchase flow**:
   - Make a test purchase
   - Verify license generation
   - Check email delivery
   - Test download

3. **Monitor activations**:
   - Track activation count
   - Manage license status
   - Revoke if needed

## 🆘 Troubleshooting

### Upload Issues
**File won't upload**:
- Check file size (<100MB)
- Verify file type is allowed
- Ensure user is authenticated

**Upload directory errors**:
- Verify `public/uploads/` directories exist
- Check file system permissions

### License Issues
**License not generated**:
- Verify payment completed successfully
- Check purchase record exists
- Ensure email service configured

**Email not received**:
- Check spam folder
- Verify email service configuration
- Check server logs

### Download Issues
**Link expired**:
- Links expire after 7 days
- User needs to request new link

**Download fails**:
- Verify file exists on server
- Check token validity
- Ensure license is active

## 📚 Related Documentation

- [Payment Settings](./PAYMENT_SETTINGS.md)
- [2D Payment](./2D_PAYMENT.md)
- [Payment Implementation](../PAYMENT_IMPLEMENTATION.md)

## 🔄 Future Enhancements

Potential improvements:
- [ ] Chunked upload for large files
- [ ] Upload progress tracking
- [ ] Multi-file batch upload
- [ ] Drag-and-drop interface
- [ ] File preview generation
- [ ] Automatic thumbnail creation
- [ ] License usage analytics
- [ ] Activation management UI
- [ ] Download history tracking
- [ ] License renewal system

