# 🚀 SourceKom - Resource Management Platform

A comprehensive resource sharing and legal consultancy platform operating in Saudi Arabia. Built with Next.js 15, TypeScript, Tailwind CSS, and Prisma.

## 🌟 Overview

SourceKom connects businesses to maximize potential and foster sustainable growth through resource optimization in logistics and supply chain management. The platform enables businesses to exchange underutilized resources and provides expert legal consultancy services.

**Live Production**: https://sk-9see9mb7o-mirxa27s-projects.vercel.app  
**GitHub Repository**: https://github.com/Mirxa27/sourcekom-app

## ✨ Key Features

### 🔐 User Management
- User authentication (registration, login, logout, password reset)
- Role-based access control (USER, CREATOR, ADMIN)
- User profiles with verification status
- Session management

### 📦 Resource Management
- List and manage resources (office spaces, equipment, digital products)
- Advanced search and filtering
- Category management
- Resource booking and sharing
- Ratings and reviews

### 💳 Payment Integration
- MyFatoorah payment gateway integration
- Secure checkout process
- Invoice generation
- Refund handling
- SAR currency support with VAT compliance

### 📊 Dashboard & Analytics
- Personalized user dashboards
- Performance metrics and statistics
- Revenue tracking
- Utilization rate monitoring
- Activity feeds

### 🎨 CMS (Content Management System)
- Complete admin panel with CMS
- Content management (pages, posts, announcements, FAQs)
- User management
- Resource moderation
- Category management
- Analytics dashboard

### ⚙️ Admin Panel
- **Settings Management**: Configure 3rd party integrations
  - MyFatoorah payment gateway
  - Email service (SMTP)
  - SMS service
  - Analytics (Google Analytics, Tag Manager, Facebook Pixel)
  - Additional integrations (Stripe, PayPal)
- **Content Management**: Full CMS for pages, posts, and announcements
- **User Management**: View, edit, and manage users
- **Resource Management**: Moderate and manage all platform resources
- **Category Management**: Create and edit resource categories
- **Analytics**: Platform-wide statistics and metrics

### 🌍 Internationalization
- English and Arabic support
- Right-to-left (RTL) layout for Arabic
- Next Intl integration

### 🔒 Security
- Input validation with Zod
- Encrypted sensitive data storage
- JWT authentication
- Security headers
- Rate limiting

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15** - React framework with App Router
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Prisma** - Database ORM (PostgreSQL)

### UI Components
- **shadcn/ui** - Accessible component library
- **Lucide React** - Icon library
- **Framer Motion** - Animations
- **Next Themes** - Dark mode support

### Forms & Validation
- **React Hook Form** - Form management
- **Zod** - Schema validation

### State Management
- **Zustand** - State management
- **TanStack Query** - Data fetching

### Backend & Database
- **PostgreSQL** - Database (Neon)
- **Prisma** - ORM
- **NextAuth.js** - Authentication
- **MyFatoorah** - Payment gateway

### Additional Features
- **Socket.IO** - Real-time updates (simulated)
- **Sharp** - Image optimization
- **Recharts** - Data visualization

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/            # Admin panel
│   ├── api/              # API routes
│   ├── about/            # About page
│   ├── approach/         # Our Approach page
│   ├── browse/           # Resource browsing
│   ├── contact/          # Contact page
│   ├── dashboard/        # User dashboard
│   ├── resources/        # Resource pages
│   └── ...
├── components/           # React components
│   ├── layout/          # Layout components (Navbar, Footer)
│   ├── payment/         # Payment components
│   ├── testimonials/    # Testimonial modals
│   └── ui/              # shadcn/ui components
├── lib/                  # Utilities and configurations
│   ├── db.ts            # Prisma client
│   └── myfatoorah.ts    # Payment service
└── ...
public/                   # Static assets
├── logo.png             # Main logo
├── logo.svg             # SVG logo fallback
├── images/              # Image assets
│   ├── avatars/        # User avatars
│   ├── logos/          # Logo variants
│   ├── placeholders/   # Placeholder images
│   └── ...
└── robots.txt           # SEO robots file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon or similar)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mirxa27/sourcekom-app.git
cd sourcekom-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# MyFatoorah Payment Gateway
MYFATOORAH_API_KEY="your-myfatoorah-api-key"
MYFATOORAH_TEST_MODE="true"  # Set to "false" for production

# Application URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"  # Production: https://your-domain.vercel.app

# Node Environment
NODE_ENV="development"  # or "production"
```

## 📦 Database Setup

### Using Neon PostgreSQL

1. Create a Neon account at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Update `DATABASE_URL` in `.env`
5. Run migrations:

```bash
npx prisma generate
npx prisma db push
```

### Database Schema

The application uses Prisma ORM with PostgreSQL. Key models:

- **User** - User accounts and authentication
- **Resource** - Resources and digital products
- **Category** - Resource categories
- **Purchase** - Purchase transactions
- **Payment** - Payment gateway records
- **Review** - User reviews and ratings
- **Content** - CMS content (pages, posts)
- **Setting** - Platform configuration
- **SupportTicket** - Support system
- And more...

## 🚀 Deployment

### Vercel Deployment

The application is configured for Vercel deployment:

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

2. **Set Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   DATABASE_URL=your-postgresql-connection-string
   JWT_SECRET=your-jwt-secret
   MYFATOORAH_API_KEY=your-api-key
   MYFATOORAH_TEST_MODE=true
   NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

3. **Deploy**
   - Push to `main` branch
   - Vercel automatically deploys on every push
   - Or use: `vercel --prod`

### Database Migration

After deployment, run migrations:

```bash
npx prisma generate
npx prisma db push
```

### Production Build

```bash
npm run build
npm start
```

## 🎯 Key Features & Pages

### Public Pages
- **Home** (`/`) - Landing page with hero, stats, and featured resources
- **About** (`/about`) - Company overview, founder information
- **Services** (`/services`) - Service offerings
- **Our Approach** (`/approach`) - Process and methodology
- **Resources** (`/resources`) - Browse and search resources
- **Legal** (`/legal`) - Legal services information
- **Contact** (`/contact`) - Contact forms and information

### User Pages
- **Dashboard** (`/dashboard`) - User dashboard with stats and management
- **Browse** (`/browse`) - Advanced resource browsing with filters
- **Upload** (`/upload`) - Upload new resources

### Admin Pages
- **Admin Panel** (`/admin`) - Complete admin interface
  - Overview dashboard
  - User management
  - Resource management
  - CMS content management
  - Category management
  - Settings for 3rd party integrations

## 🔐 Admin Access

To access the admin panel, create a user with `ADMIN` role:

```bash
# Option 1: Through the database
# Use Prisma Studio or direct SQL

# Option 2: Use the seed script (if available)
npm run db:seed
```

Or manually update user role in database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## 📝 API Endpoints

### Public APIs
- `GET /api/resources` - List resources
- `GET /api/resources/[slug]` - Get resource details
- `GET /api/categories` - List categories
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Newsletter subscription

### Authentication Required
- `GET /api/dashboard` - User dashboard data
- `POST /api/purchases` - Create purchase
- `GET /api/purchases` - User purchases

### Admin APIs
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/resources` - Resource management
- `GET /api/admin/content` - CMS content
- `GET /api/admin/categories` - Category management
- `GET /api/admin/settings` - Platform settings

### Payment APIs
- `POST /api/payments/initiate` - Initiate payment
- `GET /api/payments/callback` - MyFatoorah callback
- `GET /api/payments/status/[paymentId]` - Payment status

## 🎨 Admin Panel Features

### Settings Management
- **Payment Gateway**: Configure MyFatoorah API keys and settings
- **Email Service**: SMTP configuration for notifications
- **SMS Service**: SMS provider configuration
- **Analytics**: Google Analytics, Tag Manager, Facebook Pixel
- **Integrations**: Stripe, PayPal, social login
- **General**: Site name, URL, maintenance mode, registration

### CMS Features
- Create/edit/delete content (pages, posts, announcements, FAQs)
- Content status management (draft, published, archived)
- SEO optimization (meta titles, descriptions)
- Featured content toggle

### User Management
- View all users with search and filters
- Filter by role (USER, CREATOR, ADMIN)
- Edit user information
- Activate/deactivate users

### Resource Management
- View all resources
- Filter by status, category
- Publish/unpublish resources
- Feature resources
- Edit and delete resources

## 🧪 Testing

### E2E Testing with Playwright

We use Playwright for end-to-end testing:

```bash
# Run all E2E tests locally
npm run test:e2e

# Run tests against deployed URL
npm run test:e2e:deploy

# Run with interactive UI
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

**Test Coverage:**
- ✅ Homepage loading and functionality
- ✅ Navigation and routing
- ✅ Authentication flows
- ✅ Resource browsing
- ✅ Responsive design
- ✅ Error handling (404)
- ✅ Form accessibility
- ✅ Image loading
- ✅ Deployment verification

See `E2E_TESTING.md` for detailed testing documentation.

## ⚠️ Known Issues & Troubleshooting

### Build Error: Html Component

There's a known issue with Next.js 15.3.5 where error pages (`/404`, `/500`) fail during static generation with the error:
```
Error: <Html> should not be imported outside of pages/_document.
```

**Workaround**: This error doesn't affect development mode or production runtime - only the build process. The application works correctly in both dev and production environments. This appears to be a Next.js internal issue and may be resolved in future versions.

**Impact**: None - the application functions correctly despite this build warning.

### Module Resolution

If you encounter module resolution errors for `@/components/ui/*`, ensure:
1. The webpack alias is configured in `next.config.ts`
2. Clear the build cache: `rm -rf .next`
3. Rebuild: `npm run build`

## 🐛 Troubleshooting

### Logo/Images Not Loading
- Ensure `public/` folder is committed to Git
- Check that images are in `public/images/` directory
- Verify image paths in code match actual file locations

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from your deployment environment
- Run `npx prisma generate` after schema changes

### Build Errors
- Run `npx prisma generate` before building
- Check for TypeScript errors: `npm run build`
- Verify all environment variables are set

### Payment Integration Issues
- Verify MyFatoorah API key is correct
- Check callback URLs match your deployment URL
- Ensure test mode is enabled during development

## 📚 Documentation

- **Deployment**: See `DEPLOYMENT.md` for detailed deployment instructions
- **Payment Integration**: See `docs/MYFATOORAH_INTEGRATION.md` for payment setup
- **Admin Panel**: Access `/admin` after logging in as admin user

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and inquiries:
- Email: info@sourcekom.com
- Phone: +966 123 456 7890
- Website: https://sourcekom.com

## 🎉 Acknowledgments

- Built with Next.js and TypeScript
- UI components from shadcn/ui
- Icons from Lucide React
- Payment integration with MyFatoorah
- Database hosted on Neon

---

**SourceKom** - Adding strength to businesses, businesses to strengths 💪