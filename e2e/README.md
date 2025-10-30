# E2E Testing Guide

## Quick Start

### Run All Tests Locally
```bash
npm run test:e2e
```

### Run Tests Against Deployment
```bash
npm run test:e2e:deploy
```

### Run Tests with UI (Interactive)
```bash
npm run test:e2e:ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npm run test:e2e:headed
```

## Test Suites

### 1. Homepage Tests (`e2e/homepage.spec.ts`)
- Homepage loading
- Search functionality
- Featured resources display
- Navigation links

### 2. Authentication Tests (`e2e/auth.spec.ts`)
- Register page navigation
- Login page navigation
- Form validation

### 3. Browse Tests (`e2e/browse.spec.ts`)
- Resource browsing
- Filter functionality
- Resource detail pages

### 4. Navigation Tests (`e2e/navigation.spec.ts`)
- Page navigation
- Mobile menu
- Responsive layout

### 5. Deployment Tests (`e2e/deployment.spec.ts`)
- Homepage accessibility
- API endpoints
- Error handling (404)
- Security headers
- Responsive design

### 6. Admin Tests (`e2e/admin.spec.ts`)
- Admin panel access
- Authentication redirects

## Configuration

Tests are configured in `playwright.config.ts`:
- Base URL: `http://localhost:3000` (local) or set via `PLAYWRIGHT_BASE_URL`
- Browsers: Chromium, Firefox, WebKit
- Mobile: Mobile Chrome, Mobile Safari
- Screenshots: On failure
- Traces: On retry

## CI/CD Integration

For CI/CD pipelines, set:
```bash
export PLAYWRIGHT_BASE_URL=https://your-deployment-url.vercel.app
npm run test:e2e
```

## Viewing Test Results

After running tests, view HTML report:
```bash
npx playwright show-report
```

