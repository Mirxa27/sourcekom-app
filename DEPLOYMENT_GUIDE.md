# Production Deployment Guide
## Step-by-Step Instructions for Saudi Arabian Market Launch

**Version**: 1.0  
**Date**: October 31, 2025  
**Target Environment**: Production  
**Region**: Saudi Arabia  

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [MyFatoorah Payment Gateway Setup](#myfatoorah-payment-gateway-setup)
5. [Application Deployment](#application-deployment)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Monitoring and Verification](#monitoring-and-verification)
8. [Troubleshooting](#troubleshooting)
9. [Rollback Procedures](#rollback-procedures)

---

## Prerequisites

### Required Accounts and Services

1. **Vercel Account** (or chosen hosting platform)
   - Verified email address
   - Payment method configured
   - Project access permissions

2. **Neon Database** (PostgreSQL)
   - Production database created
   - Connection string available
   - SSL enabled

3. **MyFatoorah Account**
   - Production API credentials
   - Webhook URLs configured
   - Saudi payment methods enabled

4. **Domain Configuration**
   - Custom domain purchased
   - DNS access available
   - SSL certificate ready

### Technical Requirements

- **Node.js**: Version 18.x or higher
- **NPM**: Version 9.x or higher
- **Git**: Latest version
- **Terminal/Shell**: Access to command line

### Security Requirements

- **Environment Variables**: Secure storage for secrets
- **API Keys**: Production-ready credentials
- **SSL Certificate**: Valid HTTPS certificate
- **Database Backups**: Automated backup configuration

---

## Environment Setup

### 1. Clone the Repository

```bash
# Clone the production repository
git clone <repository-url> sourcekom-production
cd sourcekom-production

# Switch to production branch
git checkout production

# Install dependencies
npm install
```

### 2. Environment Variables Configuration

Create a `.env.production` file with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require"

# Authentication
JWT_SECRET="[generate-secure-256-bit-secret]"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="[generate-nextauth-secret]"

# MyFatoorah Payment Gateway
MYFATOORAH_API_KEY="[production-api-key]"
MYFATOORAH_API_BASE_URL="https://api.myfatoorah.com"
MYFATOORAH_TEST_MODE=false

# Application Configuration
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Saudi Market Configuration
DEFAULT_CURRENCY="SAR"
DEFAULT_TIMEZONE="Asia/Riyadh"

# Email Configuration (Optional)
SMTP_HOST="[smtp-provider]"
SMTP_PORT=587
SMTP_USER="[email-address]"
SMTP_PASS="[email-password]"
FROM_EMAIL="support@yourdomain.com"

# Analytics (Optional)
GOOGLE_ANALYTICS_ID="[ga-tracking-id]"
SENTRY_DSN="[sentry-dsn]"

# File Storage (Optional)
AWS_ACCESS_KEY_ID="[aws-access-key]"
AWS_SECRET_ACCESS_KEY="[aws-secret-key]"
AWS_REGION="me-south-1"
AWS_S3_BUCKET="[bucket-name]"
```

### 3. Generate Secure Secrets

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate NextAuth Secret
openssl rand -base64 32

# Generate Application Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Database Configuration

### 1. Database Setup

```bash
# Install Prisma CLI
npm install -g prisma

# Generate Prisma Client
npx prisma generate

# Run Database Migrations
npx prisma migrate deploy

# Seed Production Data
npx prisma db seed
```

### 2. Verify Database Connection

```bash
# Test database connectivity
npx prisma db pull

# Check migration status
npx prisma migrate status

# Validate schema
npx prisma validate
```

### 3. Production Seed Data

Run the production seed script:

```bash
# Execute production seeding
curl -X POST https://yourdomain.com/api/seed/production \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer [admin-token]"
```

Expected seed data:
- 6 Saudi market categories
- 3 sample resources
- 2 administrative users
- 7 system settings

---

## MyFatoorah Payment Gateway Setup

### 1. MyFatoorah Configuration

```bash
# Test MyFatoorah API Connection
curl -X POST https://api.myfatoorah.com/v2/SendPayment \
  -H "Authorization: Bearer [api-key]" \
  -H "Content-Type: application/json" \
  -d '{
    "CustomerName": "Test User",
    "NotificationOption": "ALL",
    "DisplayCurrencyIso": "SAR"
  }'
```

### 2. Webhook Configuration

Configure webhooks in MyFatoorah dashboard:

- **Payment Success**: `https://yourdomain.com/api/payments/callback`
- **Payment Failure**: `https://yourdomain.com/api/payments/error`
- **Payment Status**: `https://yourdomain.com/api/payments/status`

### 3. Test Payment Flow

```bash
# Initiate test payment
curl -X POST https://yourdomain.com/api/payments/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": "test-resource",
    "amount": 99.99,
    "customerInfo": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "966500000000",
      "countryCode": "+966"
    }
  }'
```

---

## Application Deployment

### 1. Build the Application

```bash
# Create production build
npm run build

# Test build locally
npm start

# Verify build success
curl http://localhost:3000/api/health
```

### 2. Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Configure domain
vercel domains add yourdomain.com

# Set environment variables
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add MYFATOORAH_API_KEY production
vercel env add MYFATOORAH_API_BASE_URL production
```

### 3. Alternative Deployment Options

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run Docker container
docker build -t sourcekom-production .
docker run -p 3000:3000 --env-file .env.production sourcekom-production
```

#### Traditional Server Deployment

```bash
# Using PM2 for process management
npm install -g pm2

# Start application with PM2
pm2 start npm --name "sourcekom" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

---

## Post-Deployment Configuration

### 1. SSL Certificate Setup

```bash
# Using Certbot for Let's Encrypt
sudo apt-get install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Setup auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. DNS Configuration

Configure the following DNS records:

```
Type    Name            Value
A       @               192.0.2.1
A       www             192.0.2.1
AAAA    @               2001:db8::1
AAAA    www             2001:db8::1
MX      @               10 mail.yourdomain.com
TXT     @               "v=spf1 include:_spf.google.com ~all"
```

### 3. CDN Configuration

```javascript
// next.config.ts CDN settings
module.exports = {
  images: {
    domains: ['yourdomain.com', 'cdn.yourdomain.com'],
  },
  assetPrefix: 'https://cdn.yourdomain.com',
};
```

### 4. Monitoring Setup

```bash
# Install monitoring agent
npm install @sentry/nextjs

# Configure Sentry
# sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
});
```

---

## Monitoring and Verification

### 1. Health Check Verification

```bash
# Verify application health
curl https://yourdomain.com/api/health

# Expected response:
{
  "status": "operational",
  "timestamp": "2025-10-31T04:00:00.000Z",
  "services": {
    "database": "operational",
    "payments": "operational",
    "authentication": "operational"
  }
}
```

### 2. Performance Monitoring

```bash
# Test page load times
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com

# Monitor API response times
curl -w "%{time_total}\n" -o /dev/null -s https://yourdomain.com/api/resources
```

### 3. Saudi Market Validation

```bash
# Test Arabic language support
curl -H "Accept-Language: ar-SA" https://yourdomain.com/api/resources

# Test SAR currency formatting
curl -X POST https://yourdomain.com/api/resources/price-format \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "currency": "SAR"}'

# Verify Riyadh timezone
curl https://yourdomain.com/api/timezone
```

### 4. Payment Gateway Testing

```bash
# Test Saudi payment methods
curl -X POST https://yourdomain.com/api/payments/methods \
  -H "Authorization: Bearer [token]"

# Expected response should include:
# - Mada
# - Visa
# - Mastercard
# - STC Pay
```

### 5. Mobile Optimization Testing

Use the following tools to verify mobile performance:

```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse https://yourdomain.com --output=json --output-path=./lighthouse-report.json

# WebPageTest
wget https://www.webpagetest.org/mobile
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Issues

```bash
# Check database connection
psql $DATABASE_URL -c "SELECT 1;"

# Common solutions:
# - Verify DATABASE_URL format
# - Check SSL configuration
# - Validate network connectivity
```

#### 2. Payment Gateway Errors

```bash
# Check MyFatoorah API status
curl -H "Authorization: Bearer [api-key]" \
     https://api.myfatoorah.com/v2/GetPaymentStatus

# Common solutions:
# - Verify API key validity
# - Check webhook URLs
# - Validate payment amounts
```

#### 3. Environment Variable Issues

```bash
# Debug environment variables
vercel env ls

# Common solutions:
# - Ensure all required variables are set
# - Check variable values in production
# - Verify variable naming conventions
```

#### 4. SSL Certificate Issues

```bash
# Check SSL certificate
openssl s_client -connect yourdomain.com:443

# Common solutions:
# - Verify certificate chain
# - Check certificate expiration
# - Validate domain matching
```

#### 5. Performance Issues

```bash
# Check response times
curl -w "%{time_total}\n" -o /dev/null -s https://yourdomain.com

# Common solutions:
# - Enable compression
# - Optimize images
# - Implement caching
```

### Error Codes and Solutions

| Error Code | Description | Solution |
|------------|-------------|----------|
| 500 | Internal Server Error | Check logs, verify environment variables |
| 503 | Service Unavailable | Restart services, check database |
| 401 | Unauthorized | Verify JWT configuration |
| 404 | Not Found | Check routing configuration |
| 429 | Too Many Requests | Adjust rate limiting |

---

## Rollback Procedures

### Immediate Rollback (< 5 minutes)

```bash
# Vercel rollback
vercel rollback [deployment-url]

# Git rollback
git revert HEAD
git push origin production
vercel --prod
```

### Database Rollback

```bash
# List migrations
npx prisma migrate list

# Rollback to previous migration
npx prisma migrate reset --force
npx prisma migrate deploy
npx prisma db seed
```

### Emergency Rollback Plan

1. **Identify Issue** (2 minutes)
   - Check monitoring dashboard
   - Review error logs
   - Identify affected systems

2. **Communicate** (1 minute)
   - Notify team
   - Update status page
   - Alert users if needed

3. **Execute Rollback** (5 minutes)
   - Revert to previous deployment
   - Restore database backup
   - Verify system health

4. **Post-Rollback** (10 minutes)
   - Document issue
   - Plan fix
   - Communicate resolution

---

## Deployment Checklist

### Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Production seed data loaded
- [ ] SSL certificate installed
- [ ] DNS records configured
- [ ] Payment gateway tested
- [ ] Monitoring tools configured
- [ ] Backup procedures verified
- [ ] Team notified of deployment
- [ ] Maintenance page ready

### Post-Deployment Checklist

- [ ] Application accessible at domain
- [ ] All API endpoints responding
- [ ] Database connectivity verified
- [ ] Payment gateway operational
- [ ] Mobile optimization tested
- [ ] Arabic language working
- [ ] SAR currency displaying correctly
- [ ] Monitoring dashboards active
- [ ] Error rates below 5%
- [ ] Performance benchmarks met

### Saudi Market Specific Checklist

- [ ] MyFatoorah payment methods active
- [ ] Arabic RTL layout functioning
- [ ] Riyadh timezone correct
- [ ] Saudi working hours configured
- [ ] Mobile networks optimized (STC, Mobily, Zain)
- [ ] Cultural features implemented
- [ ] Local compliance verified
- [ ] Saudi contact information displayed

---

## Contact Information

### Technical Support

- **Primary Technical Contact**: [Name] - [Email] - [Phone]
- **Database Administrator**: [Name] - [Email] - [Phone]
- **Payment Gateway Support**: MyFatoorah - support@myfatoorah.com
- **Infrastructure Support**: [Provider] - [Contact]

### Emergency Contacts

- **Critical Issues**: [24/7 Contact] - [Phone]
- **Security Issues**: [Security Team] - [Phone]
- **Payment Issues**: [Finance Team] - [Phone]

---

## Success Metrics

### Technical KPIs

- **Uptime**: >99.5%
- **Response Time**: <1,000ms average
- **Success Rate**: >95%
- **Error Rate**: <5%

### Business KPIs

- **Payment Success Rate**: >98%
- **Mobile Performance**: <3s load time
- **User Registration**: Track daily signups
- **Resource Downloads**: Track engagement

### Saudi Market KPIs

- **Local Payment Adoption**: Monitor MyFatoorah usage
- **Arabic Interface Usage**: Track language preferences
- **Peak Hour Performance**: Monitor Saudi business hours
- **Network Performance**: Track STC, Mobily, Zain metrics

---

## Final Notes

This deployment guide provides comprehensive instructions for successfully deploying the SourceKom platform to the Saudi Arabian market. Following these steps ensures:

1. **Smooth Deployment**: All prerequisites and configurations covered
2. **Saudi Compliance**: Local market requirements addressed
3. **Performance Optimization**: Mobile and speed optimizations included
4. **Security Best Practices**: Production security measures implemented
5. **Monitoring Ready**: Post-deployment monitoring established

The platform is now ready for successful production deployment and market entry in Saudi Arabia.

---

**Document Version**: 1.0  
**Last Updated**: October 31, 2025  
**Next Review**: Monthly or post-major updates  
**Approval**: ✅ Production Ready