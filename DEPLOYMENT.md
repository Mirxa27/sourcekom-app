# Vercel Deployment Guide

## Environment Variables

Configure these environment variables in your Vercel project settings:

### Required Environment Variables

```bash
# Database
DATABASE_URL="file:./prisma/sakila.db"  # For production, use a hosted database like PlanetScale, Supabase, or Neon

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# MyFatoorah Payment Gateway
MYFATOORAH_API_KEY="your-myfatoorah-api-key"
MYFATOORAH_TEST_MODE="false"  # Set to "true" for testing

# Application URLs
NEXT_PUBLIC_BASE_URL="https://your-domain.vercel.app"

# Node Environment
NODE_ENV="production"
```

### Optional Environment Variables

```bash
# Socket.IO (not supported on Vercel - leave empty)
SOCKET_ENABLED="false"

# Email Service (for production)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-password"

# Analytics
ANALYTICS_ID="your-analytics-id"
```

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link your project
```bash
vercel link
```

### 4. Set environment variables
```bash
# Set each variable
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add MYFATOORAH_API_KEY
vercel env add NEXT_PUBLIC_BASE_URL
# ... etc

# Or use the Vercel dashboard: https://vercel.com/dashboard/[your-project]/settings/environment-variables
```

### 5. Deploy
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## Database Setup

**Important**: SQLite (`file:./`) won't work on Vercel's serverless functions. You need a hosted database:

### Option 1: PlanetScale (Recommended)
```bash
DATABASE_URL="mysql://user:password@host/database?sslaccept=strict"
```

### Option 2: Supabase
```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### Option 3: Neon
```bash
DATABASE_URL="postgresql://user:password@host/database"
```

### Option 4: Vercel Postgres
```bash
# Use Vercel's built-in Postgres
DATABASE_URL="postgres://..."
```

## Migration Steps

1. **Update Prisma Schema** for your chosen database:
   - For PostgreSQL: Change `provider = "sqlite"` to `provider = "postgresql"`
   - For MySQL: Change `provider = "sqlite"` to `provider = "mysql"`

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Push Schema**:
   ```bash
   npx prisma db push
   ```

4. **Run Migrations**:
   ```bash
   npx prisma migrate deploy
   ```

## Build Configuration

- **Build Command**: `npm run build` (automatically detected)
- **Output Directory**: `.next` (automatically detected)
- **Install Command**: `npm install` (automatically detected)

## Post-Deployment

1. **Set Production URLs**:
   - Update `NEXT_PUBLIC_BASE_URL` with your Vercel domain
   - Update MyFatoorah callback URLs to use your production domain

2. **Configure Custom Domain** (optional):
   - Add your domain in Vercel dashboard
   - Update DNS records as instructed

3. **Monitor Deployment**:
   - Check Vercel dashboard for build logs
   - Monitor function logs for any errors

## Limitations

- **Socket.IO**: Not supported on Vercel. Real-time features will need to use alternative solutions like:
  - Server-Sent Events (SSE)
  - WebSockets via external service (Ably, Pusher)
  - Polling

- **File Uploads**: Use Vercel Blob Storage or external services like:
  - AWS S3
  - Cloudinary
  - Uploadcare

## Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify Prisma schema matches your database

### Runtime Errors
- Check function logs in Vercel dashboard
- Verify database connection string
- Check API route handlers for errors

### Database Connection Issues
- Ensure database URL is correct
- Check database firewall settings
- Verify SSL settings for production databases
