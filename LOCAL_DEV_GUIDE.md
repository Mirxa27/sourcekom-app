# 🚀 Local Development Guide

## Starting the Server

The development server is starting. It will be available at:

**http://localhost:3000**

## Environment Variables Needed

Create a `.env.local` file in the root directory with:

```bash
# Database
DATABASE_URL="your-postgresql-connection-string"

# JWT Authentication
JWT_SECRET="your-secret-key-change-in-production"

# OpenAI API (for chatbot)
OPENAI_API_KEY="your-openai-api-key"

# MyFatoorah (optional for payment testing)
MYFATOORAH_API_KEY="your-api-key"
MYFATOORAH_TEST_MODE="true"

# Base URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## Quick Start

1. **Set up environment variables** (see above)

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

4. **Push database schema**:
   ```bash
   npx prisma db push
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Open in browser**:
   - http://localhost:3000

## Features to Test

### ✅ Double Header Fix
- Navigate to `/legal/consultation`
- Navigate to `/services/logistics`
- Verify single navigation bar appears

### ✅ AI Chatbot
- Click the chat button (bottom-right)
- Note: Requires `OPENAI_API_KEY` to be set
- If not set, you'll see an error in the console

### ✅ Navigation
- Check sticky header on scroll
- Test mobile footer navigation (on mobile view)
- Verify breadcrumbs appear on sub-pages

## Troubleshooting

### Port Already in Use
If port 3000 is busy:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check if Neon database is accessible
- Run `npx prisma db push` to sync schema

### Chatbot Not Working
- Ensure `OPENAI_API_KEY` is set in `.env.local`
- Check browser console for errors
- Verify API key is valid at https://platform.openai.com/api-keys

## Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run E2E tests
npm run test:e2e

# Database commands
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma Client
npm run db:migrate   # Run migrations
```

## Server Status

The server should be running at: **http://localhost:3000**

Check the terminal output for any errors or warnings.

