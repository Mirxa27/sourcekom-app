#!/bin/bash
# E2E Deployment Test Script

set -e

echo "🚀 Starting E2E Deployment Tests..."

# Get deployment URL from environment or use default
DEPLOYMENT_URL="${PLAYWRIGHT_BASE_URL:-https://sk-9see9mb7o-mirxa27s-projects.vercel.app}"

echo "📍 Testing deployment at: $DEPLOYMENT_URL"

# Test homepage accessibility
echo "📄 Testing homepage..."
curl -f -s -o /dev/null "$DEPLOYMENT_URL" || {
  echo "❌ Homepage is not accessible"
  exit 1
}

# Test API endpoints
echo "🔌 Testing API endpoints..."
curl -f -s -o /dev/null "$DEPLOYMENT_URL/api/health" || echo "⚠️  Health endpoint not available"

# Run Playwright tests
echo "🧪 Running Playwright E2E tests..."
export PLAYWRIGHT_BASE_URL="$DEPLOYMENT_URL"
npm run test:e2e -- --project=chromium --reporter=list e2e/deployment.spec.ts

echo "✅ E2E tests completed!"

