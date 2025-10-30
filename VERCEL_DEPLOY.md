# Vercel Deployment

## Quick Deploy

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Environment Variables

Set these in Vercel dashboard (Settings → Environment Variables):

- `DATABASE_URL` - Your database connection string (use PostgreSQL/MySQL, not SQLite)
- `JWT_SECRET` - Secret key for JWT tokens
- `MYFATOORAH_API_KEY` - MyFatoorah API key
- `MYFATOORAH_TEST_MODE` - Set to `true` for testing, `false` for production
- `NEXT_PUBLIC_BASE_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
- `NODE_ENV` - Set to `production`

## Database Migration

**Important**: SQLite won't work on Vercel. Use a hosted database:

1. **Create a database** (PlanetScale, Supabase, Neon, or Vercel Postgres)
2. **Update Prisma schema**:
   ```prisma
   datasource db {
     provider = "postgresql"  // or "mysql"
     url      = env("DATABASE_URL")
   }
   ```
3. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```

## Build Configuration

- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)
- Install Command: `npm install` (auto-detected)

## Post-Deployment

1. Update MyFatoorah callback URLs to use your Vercel domain
2. Test payment flow
3. Monitor function logs in Vercel dashboard

## Notes

- Socket.IO won't work on Vercel (serverless functions don't support persistent connections)
- File uploads should use external storage (Vercel Blob, AWS S3, Cloudinary)
- Database must be hosted externally (not SQLite)
