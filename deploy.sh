#!/bin/bash
# Vercel Deployment Script for SourceKom

echo "🚀 SourceKom Vercel Deployment"
echo "================================"
echo ""

# Check if logged in
if ! vercel whoami &>/dev/null; then
    echo "❌ Not logged in to Vercel. Please run: vercel login"
    exit 1
fi

echo "✅ Logged in to Vercel"
echo ""

# Link project if not already linked
if [ ! -f ".vercel/project.json" ]; then
    echo "📦 Linking project to Vercel..."
    vercel link
fi

echo ""
echo "🔧 Setting environment variables..."
echo ""

# Database URL
echo "Setting DATABASE_URL..."
vercel env add DATABASE_URL production <<EOF
postgresql://neondb_owner:npg_kmI8Keq6Qsyb@ep-winter-dawn-agk6ulsi-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
EOF

# Set other required environment variables
echo "Setting JWT_SECRET..."
vercel env add JWT_SECRET production

echo "Setting MYFATOORAH_API_KEY..."
vercel env add MYFATOORAH_API_KEY production

echo "Setting MYFATOORAH_TEST_MODE..."
vercel env add MYFATOORAH_TEST_MODE production <<EOF
false
EOF

echo "Setting NODE_ENV..."
vercel env add NODE_ENV production <<EOF
production
EOF

echo ""
echo "📤 Deploying to Vercel..."
echo ""

# Deploy
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update NEXT_PUBLIC_BASE_URL in Vercel dashboard with your domain"
echo "2. Update MyFatoorah callback URLs to your Vercel domain"
echo "3. Test the application"
