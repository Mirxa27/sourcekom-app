# Quick Deployment to Vercel

## ✅ Code Pushed to GitHub!

**Repository**: https://github.com/Mirxa27/sourcekom-app
**Branch**: main
**Status**: All changes committed and pushed

## 🚀 Deploy Now in 3 Steps

### Step 1: Deploy via Vercel Dashboard

1. **Visit**: https://vercel.com/new

2. **Import Project**:
   - Click "Import Git Repository"
   - Select your GitHub account (Mirxa27)
   - Find: `sourcekom-app`
   - Click "Import"

3. **Configure Project**:
   ```
   Project Name: sourcekom-app
   Framework: Next.js (auto-detected)
   Root Directory: ./
   Build Command: prisma generate && next build (from vercel.json)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

### Step 2: Set Environment Variables

Click "Environment Variables" and add:

**Required**:
```
DATABASE_URL = postgresql://neondb_owner:npg_k...@ep-winter-dawn-agk6ulsi-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
```
(Get from your Neon dashboard)

```
JWT_SECRET = your-production-secret-key-here
```
(Generate: `openssl rand -base64 32`)

```
NEXT_PUBLIC_APP_URL = https://your-project.vercel.app
```
(Will be shown after deployment - update later)

**Optional** (for email features):
```
EMAIL_FROM = noreply@sourcekom.com
SMTP_HOST = smtp.example.com
SMTP_PORT = 587
SMTP_USER = your-smtp-user
SMTP_PASSWORD = your-smtp-password
```

### Step 3: Deploy!

Click **"Deploy"** button

Wait 2-3 minutes for:
- ✅ Build process
- ✅ Prisma generation
- ✅ Next.js optimization
- ✅ Deployment

## 🎯 After Deployment

### 1. Get Your URL
You'll receive a URL like:
```
https://sourcekom-app-mirxa27.vercel.app
```

### 2. Update Environment Variable
Go back to project settings → Environment Variables:
```
NEXT_PUBLIC_APP_URL = https://sourcekom-app-mirxa27.vercel.app
```

Then redeploy (Deployments → click "..." → Redeploy)

### 3. Configure Payment Settings

Visit your deployed site:
```
https://your-url.vercel.app/admin
```

Login:
```
Email: admin@sourcekom.com
Password: Admin@2024!
```

Navigate to Payment Settings:
```
https://your-url.vercel.app/dashboard/admin/payment-settings
```

Configure:
- ✅ Enter production MyFatoorah API key
- ✅ Disable "Test Mode"
- ✅ Set webhook endpoint: `https://your-url.vercel.app/?wc-api=myfatoorah_webhook`
- ✅ Generate new webhook secret
- ✅ Save settings

### 4. Test Everything

**Test Flow**:
1. Visit homepage
2. Browse resources
3. Create a test resource (as admin)
4. Make a test purchase
5. Verify license email
6. Test download

## 📋 Deployment Checklist

Pre-Deployment:
- [x] Code pushed to GitHub
- [x] vercel.json configured
- [x] .env.example created
- [x] Database schema ready

During Deployment:
- [ ] Import GitHub repo in Vercel
- [ ] Set environment variables
- [ ] Click Deploy
- [ ] Wait for build completion

Post-Deployment:
- [ ] Update NEXT_PUBLIC_APP_URL
- [ ] Redeploy
- [ ] Configure payment settings
- [ ] Change admin password
- [ ] Test complete flow

## 🔧 Advanced Configuration

### Custom Domain

1. **In Vercel Dashboard**:
   - Go to Project Settings
   - Click "Domains"
   - Add: `sourcekom.com`
   - Follow DNS instructions

2. **Update Environment**:
   ```
   NEXT_PUBLIC_APP_URL = https://sourcekom.com
   ```

3. **Update MyFatoorah**:
   - Webhook endpoint: `https://sourcekom.com/?wc-api=myfatoorah_webhook`

### Database Migration

If you need to run migrations on deployment:
```bash
# Add to vercel.json build command:
"buildCommand": "npx prisma migrate deploy && prisma generate && next build"
```

## 🐛 Common Issues

### Build Fails
**Prisma Error**:
- Ensure DATABASE_URL is set
- Check database is accessible
- Verify connection string format

**Next.js Error**:
- Check all dependencies are in package.json
- Verify no TypeScript errors locally
- Review build logs in Vercel

### Runtime Issues

**500 Errors**:
- Check function logs in Vercel
- Verify DATABASE_URL works
- Test database queries work

**Payment Settings Not Found**:
- Run setup script via Vercel terminal
- Or configure via admin panel UI

### File Upload Issues

**Vercel Limitations**:
- 4.5MB request body limit
- Files stored in `/tmp` (ephemeral)
- Use cloud storage for production:
  - AWS S3
  - Cloudinary
  - Vercel Blob Storage

## 📊 Monitor Deployment

### Vercel Dashboard

**View**:
- Deployment status
- Build logs
- Function logs
- Analytics
- Error tracking

**Access**:
```
https://vercel.com/mirxa27/sourcekom-app
```

### Database

**Neon Dashboard**:
```
https://console.neon.tech
```

Monitor:
- Connection count
- Query performance
- Database size

## ⚡ Quick Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Open in browser
vercel open

# Environment variables
vercel env ls
vercel env add KEY
vercel env rm KEY
```

## 🎉 You're Live!

After successful deployment:

**Frontend**: https://sourcekom-app-mirxa27.vercel.app
**Admin Panel**: https://sourcekom-app-mirxa27.vercel.app/admin
**Payment Settings**: https://sourcekom-app-mirxa27.vercel.app/dashboard/admin/payment-settings

## 📞 Support

**Vercel Support**: https://vercel.com/help
**GitHub Issues**: https://github.com/Mirxa27/sourcekom-app/issues

---

**Next Step**: Visit https://vercel.com/new and import your GitHub repository!
