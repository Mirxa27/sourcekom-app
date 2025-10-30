# 🚀 Quick Deploy Commands

## Step 1: Login to Vercel
```bash
vercel login
```

## Step 2: Link Project
```bash
vercel link
```

## Step 3: Set Environment Variables

### Option A: Via Dashboard (Recommended)
1. Go to: https://vercel.com/dashboard
2. Select/Create your project
3. Settings → Environment Variables
4. Add:

```
DATABASE_URL=postgresql://neondb_owner:npg_kmI8Keq6Qsyb@ep-winter-dawn-agk6ulsi-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your-secret-key-here
MYFATOORAH_API_KEY=your-api-key-here
MYFATOORAH_TEST_MODE=false
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Option B: Via CLI
```bash
# Database URL
echo "postgresql://neondb_owner:npg_kmI8Keq6Qsyb@ep-winter-dawn-agk6ulsi-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" | vercel env add DATABASE_URL production

# Other variables (enter when prompted)
vercel env add JWT_SECRET production
vercel env add MYFATOORAH_API_KEY production
vercel env add MYFATOORAH_TEST_MODE production
vercel env add NODE_ENV production
```

## Step 4: Deploy
```bash
vercel --prod
```

---

**Database URL** (copy this):
```
postgresql://neondb_owner:npg_kmI8Keq6Qsyb@ep-winter-dawn-agk6ulsi-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```
