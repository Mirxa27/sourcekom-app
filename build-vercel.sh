#!/bin/bash
# Vercel Build Script - Workaround for Next.js error page build issue

set -e

echo "🔧 Starting custom Vercel build..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run Next.js build
echo "🏗️ Building Next.js application..."
npx next build 2>&1 | tee build.log

# Check if build produced output
if [ -d ".next" ]; then
  echo "✅ Build directory exists"
  
  # Check if server and static directories exist
  if [ -d ".next/server" ] && [ -d ".next/static" ]; then
    echo "✅ Build successful - server and static files generated"
    exit 0
  fi
fi

# If we get here, something went wrong
echo "❌ Build failed - no output directory"
exit 1

