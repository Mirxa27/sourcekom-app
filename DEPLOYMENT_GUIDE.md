# Vercel Deployment Guide

## ✅ Code Pushed to GitHub

**Repository**: https://github.com/Mirxa27/sourcekom-app.git

**Latest Commit**: `feat: Add MyFatoorah payment integration, file upload, and license management`

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
cd "/Users/abdullahmirxa/Downloads/sk app"
vercel
```

4. **Follow prompts**:
   - Set up and deploy? **Y**
   - Which scope? **Your account**
   - Link to existing project? **N** (or Y if you have one)
   - What's your project's name? **sourcekom-app**
   - In which directory is your code located? **./**
   - Want to override settings? **N**

5. **Set Environment Variables**:
```bash
# Database URL (from Neon)
vercel env add DATABASE_URL

# JWT Secret
vercel env add JWT_SECRET

# App URL
vercel env add NEXT_PUBLIC_APP_URL
```

6. **Deploy to Production**:
```bash
vercel --prod
```

### Option 2: Vercel Dashboard

1. **Go to**: https://vercel.com/new

2. **Import Git Repository**:
   - Click "Import Project"
   - Select GitHub
   - Choose: `Mirxa27/sourcekom-app`

3. **Configure Project**:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `prisma generate && next build`
   - **Output Directory**: .next
   - **Install Command**: `npm install`

4. **Environment Variables**:
   Add these in Vercel dashboard:
   
   ```
   DATABASE_URL = postgresql://...your-neon-url...
   JWT_SECRET = your-secret-key
   NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
   ```

5. **Deploy**:
   Click "Deploy"

## 🔧 Environment Variables Setup

### Required Variables:

1. **DATABASE_URL**:
   ```
   Get from Neon dashboard:
   https://console.neon.tech/app/projects
   
   Format:
   postgresql://username:password@host/database?sslmode=require
   ```

2. **JWT_SECRET**:
   ```
   Generate a secure random string:
   openssl rand -base64 32
   
   Or use:
   your-very-secure-secret-key-here
   ```

3. **NEXT_PUBLIC_APP_URL**:
   ```
   Your Vercel deployment URL:
   https://sourcekom-app.vercel.app
   
   Or custom domain:
   https://sourcekom.com
   ```

### Optional Variables (for email):

4. **EMAIL_FROM**: `noreply@sourcekom.com`
5. **SMTP_HOST**: Your SMTP server
6. **SMTP_PORT**: `587`
7. **SMTP_USER**: Your SMTP username  
8. **SMTP_PASSWORD**: Your SMTP password

## 📋 Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Visit your Vercel URL
- [ ] Check homepage loads
- [ ] Test navigation
- [ ] Verify styles are working

### 2. Configure Payment Settings
- [ ] Login as admin: `admin@sourcekom.com` / `Admin@2024!`
- [ ] Go to `/admin`
- [ ] Click "Payment Settings" card
- [ ] Enter production MyFatoorah API key
- [ ] Disable "Test Mode"
- [ ] Set webhook endpoint to your domain
- [ ] Click "Save Settings"

### 3. Test Key Features
- [ ] User registration/login
- [ ] Browse resources
- [ ] Upload a resource
- [ ] Test payment flow
- [ ] Verify license generation
- [ ] Check email delivery

### 4. Security Checklist
- [ ] Change default admin password
- [ ] Update JWT_SECRET to production value
- [ ] Configure production MyFatoorah API key
- [ ] Set up proper SMTP for emails
- [ ] Configure custom domain (if applicable)
- [ ] Enable HTTPS (automatic on Vercel)

## 🔐 Production Configuration

### MyFatoorah Production Setup

1. **Get Production API Key**:
   - Login to MyFatoorah dashboard
   - Navigate to Settings → API Keys
   - Copy production API key

2. **Configure in Admin Panel**:
   - Go to `/admin` on your deployed site
   - Click "Payment Settings"
   - Enter production API key
   - **Disable "Test Mode"**
   - Update webhook endpoint to production URL
   - Save settings

3. **Test Payment**:
   - Use real credit card (small amount)
   - Verify payment processing
   - Check license email delivery
   - Test download functionality

## 🌐 Custom Domain (Optional)

### Add Custom Domain in Vercel:

1. Go to project settings
2. Click "Domains"
3. Add your domain: `sourcekom.com`
4. Configure DNS records as shown
5. Update `NEXT_PUBLIC_APP_URL` environment variable

## 📊 Monitoring

### Vercel Analytics
- View deployment logs
- Monitor function invocations
- Check error rates
- Review performance metrics

### MyFatoorah Dashboard
- Monitor transactions
- View webhook logs
- Check payment success rates
- Review refunds and disputes

## 🐛 Troubleshooting

### Build Fails
**Error**: `Prisma generate failed`
```bash
# Ensure DATABASE_URL is set in Vercel environment variables
# Check connection string is valid
```

**Error**: `Module not found`
```bash
# Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "chore: Update dependencies"
git push
```

### Runtime Errors

**500 Internal Server Error**:
- Check Vercel function logs
- Verify DATABASE_URL is set
- Ensure database schema is up to date

**Payment Settings Not Configured**:
- Access `/admin` on deployed site
- Configure MyFatoorah settings
- Ensure API key is correct for environment

**File Upload Fails**:
- Vercel has 4.5MB body limit
- Files are stored in `/tmp` on serverless
- Consider using cloud storage (S3, Cloudinary) for production

## 📝 Deployment Commands Summary

```bash
# One-time setup
npm i -g vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Add environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_APP_URL

# View logs
vercel logs

# Open dashboard
vercel open
```

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Site loads at Vercel URL
- ✅ Homepage displays correctly
- ✅ Navigation works
- ✅ Admin login successful
- ✅ Payment settings accessible
- ✅ Can create resources
- ✅ Test payment works
- ✅ License generation works

## 🔗 Important URLs

**GitHub Repo**: https://github.com/Mirxa27/sourcekom-app

**Vercel Dashboard**: https://vercel.com/dashboard

**Project**: Will be at https://sourcekom-app.vercel.app (or your chosen name)

## 🆘 Support

If issues arise:
1. Check Vercel function logs
2. Review build logs
3. Verify environment variables
4. Test database connection
5. Check MyFatoorah API key

Need help? Contact: mirxa27@github.com
