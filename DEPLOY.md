# Quick Deploy to Vercel

## Prerequisites

1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Run deployment script**:
   ```bash
   ./deploy.sh
   ```

## Manual Deployment Steps

If you prefer to deploy manually:

### 1. Login to Vercel
```bash
vercel login
```

### 2. Link Project
```bash
vercel link
```

### 3. Set Environment Variables

Set these in Vercel Dashboard (Settings → Environment Variables) or via CLI:

**Via Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add each variable:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_kmI8Keq6Qsyb@ep-winter-dawn-agk6ulsi-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | Production, Preview, Development |
| `JWT_SECRET` | Your secret key | Production, Preview, Development |
| `MYFATOORAH_API_KEY` | Your API key | Production, Preview |
| `MYFATOORAH_TEST_MODE` | `false` | Production |
| `MYFATOORAH_TEST_MODE` | `true` | Preview, Development |
| `NEXT_PUBLIC_BASE_URL` | Your Vercel URL | Production, Preview |
| `NODE_ENV` | `production` | Production |

**Via CLI:**
```bash
# Database URL
vercel env add DATABASE_URL production
# Paste: postgresql://neondb_owner:npg_kmI8Keq6Qsyb@ep-winter-dawn-agk6ulsi-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret
vercel env add JWT_SECRET production

# MyFatoorah
vercel env add MYFATOORAH_API_KEY production
vercel env add MYFATOORAH_TEST_MODE production
# Enter: false

# Base URL (will be set automatically)
vercel env add NEXT_PUBLIC_BASE_URL production
# Use your Vercel domain: https://your-app.vercel.app
```

### 4. Deploy
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## Database Status

✅ **Database configured**: Neon PostgreSQL  
✅ **Schema synced**: All tables created  
✅ **Provider**: PostgreSQL (compatible with Vercel)

## Post-Deployment

1. **Get your deployment URL** from Vercel dashboard
2. **Update NEXT_PUBLIC_BASE_URL** with your Vercel domain
3. **Update MyFatoorah callback URLs**:
   - Callback: `https://your-app.vercel.app/api/payments/callback`
   - Error: `https://your-app.vercel.app/api/payments/error`
4. **Test the application**:
   - Visit your deployment URL
   - Test payment flow
   - Verify database connections

## Verification

After deployment, verify:
- ✅ Application loads correctly
- ✅ Database connection works
- ✅ Payment gateway integration works
- ✅ API routes respond correctly
- ✅ Environment variables are set

## Troubleshooting

If deployment fails:
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Check database connection string
4. Ensure Prisma client is generated (`npx prisma generate`)

## Support

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
