# SourceKom Marketplace Image Library

This directory contains a comprehensive collection of high-quality images for the SourceKom marketplace, organized into three main categories plus existing visual assets.

## Quick Links

- **[Complete Visual Assets Guide](../../docs/VISUAL_ASSETS_GUIDE.md)** - Comprehensive documentation
- **[Generation Scripts](../../scripts/)** - Scripts to generate additional assets
- **[Image Utilities](../../src/lib/images.ts)** - TypeScript utility functions for image management

## 📁 Directory Structure

```
/images/
├── digital-products/          # 50 digital product images (NEW)
│   ├── website-templates/     # Modern website templates
│   ├── mobile-apps/          # Mobile app interfaces
│   ├── logos/                # Business logos and branding
│   ├── e-books/              # Digital books and guides
│   ├── software/             # Software interfaces
│   ├── video-templates/      # Video production templates
│   ├── audio-software/       # Audio production interfaces
│   ├── development-tools/    # Code editors and dev tools
│   ├── presentations/        # Business presentation templates
│   └── marketing/            # Marketing materials
├── avatars/                  # 35 professional avatars (NEW)
│   ├── consultants/          # Business consultants
│   ├── legal-professionals/  # Lawyers and legal advisors
│   ├── it-specialists/       # Technology professionals
│   ├── marketing-experts/    # Marketing specialists
│   ├── financial-advisors/   # Finance professionals
│   ├── trainers/             # Professional trainers
│   └── companies/            # Company representatives
├── services/                 # 30 service facility images (NEW)
│   ├── offices/              # Office spaces and consulting rooms
│   ├── training-facilities/  # Training and development centers
│   ├── meeting-rooms/        # Conference and meeting facilities
│   ├── legal-offices/        # Legal profession offices
│   ├── studios/              # Photography and media studios
│   ├── conference-rooms/     # Large conference facilities
│   ├── equipment/            # Professional equipment
│   └── workspaces/           # Modern workspace environments
├── [EXISTING ASSETS...]      # Original SourceKom visual assets
├── image-metadata.json       # Complete metadata for all images (NEW)
└── README.md                 # This file
```

## 🆕 New Marketplace Image Library

### 📊 Image Statistics
- **Total New Images**: 115
- **Digital Products**: 50 images (10 categories)
- **Professional Avatars**: 35 images (7 categories)
- **Service Facilities**: 30 images (8 categories)
- **Total Storage**: ~15MB
- **Formats**: JPEG (optimized for web)
- **Dimensions**: Various (400x300 for products/services, 200x200 for avatars)

### 🎯 Usage Examples

```typescript
import {
  getDigitalProductUrl,
  getAvatarUrl,
  getServiceUrl,
  getRandomDigitalProducts,
  getRandomAvatars,
  getRandomServices
} from '@/lib/images';

// Get specific images
const productImage = getDigitalProductUrl('website-templates/modern-ecommerce-template.jpg');
const avatarImage = getAvatarUrl('consultants/ahmed-al-rashid.jpg');
const serviceImage = getServiceUrl('offices/modern-consulting-office.jpg');

// Get random images for dynamic content
const randomProducts = getRandomDigitalProducts(8);
const randomAvatars = getRandomAvatars(6);
const randomServices = getRandomServices(4);
```

### 📝 Categories and Tags

#### Digital Product Categories
1. **Website Templates** - Modern, responsive designs
2. **Mobile Apps** - iOS and Android interfaces
3. **Logo Design** - Professional branding packages
4. **E-books** - Digital guides and educational content
5. **Software** - Business and productivity applications
6. **Video Templates** - Corporate and promotional templates
7. **Audio Software** - Music and audio production tools
8. **Development Tools** - Code editors and IDE themes
9. **Presentations** - Business and educational templates
10. **Marketing Materials** - Social media and promotional assets

#### Avatar Categories
1. **Consultants** - Business and management experts
2. **Legal Professionals** - Lawyers and legal advisors
3. **IT Specialists** - Technology and development professionals
4. **Marketing Experts** - Digital and traditional marketing
5. **Financial Advisors** - Finance and accounting experts
6. **Trainers** - Professional development and education
7. **Companies** - Business organizations and companies

#### Service Categories
1. **Office Spaces** - Professional consulting rooms
2. **Training Facilities** - Educational centers
3. **Meeting Rooms** - Conference facilities
4. **Legal Offices** - Professional legal environments
5. **Studios** - Creative production spaces
6. **Conference Rooms** - Large event spaces
7. **Equipment** - Professional tools and gear
8. **Workspaces** - Modern working environments

---

## Original Asset Inventory

### ✅ Logos (3 files)
- `logos/logo-light.svg` - Main logo for light backgrounds
- `logos/logo-dark.svg` - Logo for dark backgrounds  
- `logos/logo-icon.svg` - Icon-only version (60x60)

### ✅ Feature Icons (10 files - 64x64px)
Located in `icons/features/`:
- marketplace.svg
- booking.svg
- legal.svg
- consultation.svg
- payment.svg
- analytics.svg
- security.svg
- support.svg
- notification.svg
- profile.svg

### ✅ Status Icons (5 files - 32x32px)
Located in `icons/status/`:
- success.svg (green checkmark)
- pending.svg (orange clock)
- error.svg (red X)
- warning.svg (yellow triangle)
- info.svg (blue i)

### ✅ UI Action Icons (8 files - 24x24px)
Located in `icons/actions/`:
- upload.svg, download.svg
- edit.svg, delete.svg
- search.svg, filter.svg
- save.svg, share.svg

### ✅ Category Icons (3 files - 64x64px)
Located in `icons/categories/`:
- technology.svg
- professional-services.svg
- real-estate.svg

### ✅ Legal Service Icons (3 files - 64x64px)
Located in `icons/legal/`:
- contract-review.svg
- document-prep.svg
- dispute-resolution.svg

### ✅ Empty State Illustrations (3 files - 400x300px)
Located in `empty-states/`:
- no-products.svg
- no-bookings.svg
- cart-empty.svg

### ✅ Product Placeholders (2 files - 800x600px)
Located in `placeholders/`:
- digital-product.svg
- service-placeholder.svg

### ✅ Social Proof Badges (3 files - 120x60px)
Located in `social/`:
- secure-payment.svg
- verified-seller.svg
- money-back.svg

### ⚠️ Hero Images (Specifications provided)
Located in `hero/` - **TO BE SOURCED**:
- homepage.jpg (1920x1080) - Saudi business skyline
- marketplace.jpg (1920x1080) - Commercial environment
- legal.jpg (1920x1080) - Professional legal setting
- about.jpg (1920x1080) - Team/community
- contact.jpg (1920x1080) - Communication theme

**See [Visual Assets Guide](../../docs/VISUAL_ASSETS_GUIDE.md#hero-images) for detailed specifications**

### ⚠️ Manifest Icons (To be generated)
Located in `../manifest/` - **NEED PNG CONVERSION**:
- icon-192.png
- icon-512.png
- apple-touch-icon.png (180x180)

**Run**: `node scripts/generate-icon-pngs.js` to generate these

## Total Asset Count

- **Generated SVG Assets**: 37 files
- **Documented Specifications**: 5 hero images
- **Pending Generation**: 3 PNG icons

## Brand Colors

- **Saudi Green**: `#006B3F` (Primary)
- **Gold Accent**: `#D4AF37` (Secondary)
- **Light Green**: `#00D77F` (Dark mode)

## Usage Examples

### In React/Next.js

```tsx
import Image from 'next/image';

// Logo
<Image src="/images/logos/logo-light.svg" alt="SourceKom" width={200} height={60} />

// Feature Icon
<Image src="/images/icons/features/marketplace.svg" alt="Marketplace" width={64} height={64} />

// Status Icon
<Image src="/images/icons/status/success.svg" alt="Success" width={32} height={32} />
```

### In CSS

```css
.hero {
  background-image: url('/images/hero/homepage.jpg');
  background-size: cover;
  background-position: center;
}
```

## Next Steps

### For New Marketplace Images
1. **Replace Placeholder Images**: Current images are from Lorem Picsum service
2. **Source Licensed Images**: Replace with high-quality, properly licensed images
3. **Cultural Appropriateness**: Ensure images reflect Saudi Arabian business context
4. **Web Optimization**: Convert to WebP format for production
5. **Alt Text Updates**: Update alt text with actual image descriptions

### For Original Assets
1. **Generate PNG icons**: Run `node scripts/generate-icon-pngs.js`
2. **Source hero images**: See [specifications](../../docs/VISUAL_ASSETS_GUIDE.md#hero-images)
3. **Optimize images**: Follow [optimization guide](../../docs/VISUAL_ASSETS_GUIDE.md#image-optimization)

## 🚨 Important Notes

- All new images are placeholder images using Lorem Picsum service
- For production, replace with actual high-quality, licensed images
- Ensure all images have proper alt text for accessibility
- Consider cultural appropriateness for Saudi Arabian market
- Use the utility functions in `/src/lib/images.ts` for easy integration

## Support

For detailed information, see:
- [Complete Visual Assets Guide](../../docs/VISUAL_ASSETS_GUIDE.md)
- [Image Utilities](../../src/lib/images.ts) - TypeScript helper functions
- [Image Metadata](./image-metadata.json) - Complete image information
- [Icon Generation Script](../../scripts/generate-all-icons.ts)
- [PNG Conversion Script](../../scripts/generate-icon-pngs.js)

---

**Version**: 2.0.0 (Added Marketplace Image Library)
**Last Updated**: October 29, 2025
**Total Images**: 115 (new) + 37 (original) = 152 images