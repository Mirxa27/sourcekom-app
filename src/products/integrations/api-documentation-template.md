# SourceKom API Documentation Template

**Premium Digital Product - Developer Integration Kit**  
*Price: SAR 499 (Basic) | SAR 899 (Professional with Code Samples)*

## 🚀 Professional API Documentation Framework

This comprehensive template helps you create professional API documentation that follows Saudi Arabian business standards and international best practices.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Base URLs](#base-urls)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [SDKs & Libraries](#sdks--libraries)
- [Testing](#testing)
- [Support](#support)

---

## 🎯 Overview

### API Introduction
[Your API Name] provides comprehensive [business functionality] for Saudi Arabian companies, enabling seamless integration with [your platform/service].

### Key Features
- ✅ **Saudi Business Compliance**: Built for Saudi market requirements
- ✅ **Real-time Data**: Live synchronization with Saudi business systems
- ✅ **Secure Authentication**: Enterprise-grade security standards
- ✅ **Scalable Architecture**: Designed for high-volume transactions
- ✅ **Multi-language Support**: Arabic and English interfaces
- ✅ **Saudi Working Hours**: Optimized for Saudi business calendar

### Target Audience
- 🏢 **Enterprise Developers**: Large-scale business integration
- 🚀 **Startups**: Fast implementation with minimal resources
- 🏪 **SMEs**: Affordable integration solutions
- 🌍 **International Companies**: Saudi market entry support

---

## 🔐 Authentication

### API Key Authentication
All API requests must include your API key in the header:

```http
Authorization: Bearer YOUR_API_KEY
X-API-Key: YOUR_API_KEY
Content-Type: application/json
```

### Getting Your API Key
1. Register at [Developer Portal](https://developers.sourcekom.com)
2. Create a new application
3. Copy your API key from the dashboard
4. Keep your key secure and never expose it in client-side code

### OAuth 2.0 (Enterprise)
For enterprise applications, we support OAuth 2.0:

```http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET
```

---

## 🌐 Base URLs

### Production Environment
```
https://api.sourcekom.com/v1
```

### Sandbox Environment
```
https://sandbox-api.sourcekom.com/v1
```

### Saudi Data Centers
```
https://api-sa.sourcekom.com/v1    # Riyadh Region
https://api-jeddah.sourcekom.com/v1  # Jeddah Region
```

---

## 📊 Endpoints

### 🏢 Business Registration

#### Create Company Registration
```http
POST /business/registration
```

**Request Body:**
```json
{
  "companyName": "Example Saudi Company",
  "businessType": "LLC",
  "industry": "Technology",
  "shareholders": [
    {
      "name": "John Doe",
      "nationality": "American",
      "percentage": 60
    }
  ],
  "capital": {
    "amount": 500000,
    "currency": "SAR"
  },
  "address": {
    "city": "Riyadh",
    "district": "Olaya",
    "street": "King Abdullah Road"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrationId": "REG-2024-12345",
    "status": "pending",
    "estimatedCompletion": "2024-11-15",
    "requiredDocuments": [
      "passport copies",
      "proof of address",
      "business plan"
    ]
  },
  "message": "Registration submitted successfully"
}
```

#### Check Registration Status
```http
GET /business/registration/{registrationId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "registrationId": "REG-2024-12345",
    "status": "approved",
    "crNumber": "1012345678",
    "completedAt": "2024-11-10T10:30:00Z",
    "nextSteps": [
      "Open bank account",
      "Register for GOSI",
      "Apply for municipal license"
    ]
  }
}
```

### 👥 HR & Saudization

#### Calculate Saudization Requirements
```http
POST /hr/saudization/calculate
```

**Request Body:**
```json
{
  "companySize": "medium",
  "industry": "technology",
  "currentEmployees": 50,
  "saudiEmployees": 8,
  "locations": ["Riyadh", "Jeddah"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "currentPercentage": 16,
    "targetPercentage": 30,
    "requiredSaudiEmployees": 7,
    "nitaqatCategory": "green",
    "recommendations": [
      "Hire 7 Saudi nationals within 6 months",
      "Focus on technology and marketing roles",
      "Utilize Saudi government training programs"
    ],
    "potentialPenalties": {
      "monthly": 15000,
      "annual": 180000
    }
  }
}
```

### 💰 Financial Services

#### VAT Registration Check
```http
POST /finance/vat/check
```

**Request Body:**
```json
{
  "crNumber": "1012345678",
  "estimatedAnnualRevenue": 5000000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vatRequired": true,
    "registrationDeadline": "2024-12-31",
    "vatRate": 0.15,
    "filingFrequency": "quarterly",
    "estimatedAnnualVAT": 750000,
    "nextSteps": [
      "Register with ZATCA",
      "Setup VAT accounting system",
      "Appoint tax representative"
    ]
  }
}
```

---

## 📝 Data Models

### Company Profile
```json
{
  "id": "company_123",
  "crNumber": "1012345678",
  "name": "Example Saudi Company",
  "legalType": "LLC",
  "status": "active",
  "registrationDate": "2024-01-15",
  "capital": {
    "amount": 500000,
    "currency": "SAR"
  },
  "address": {
    "city": "Riyadh",
    "postalCode": "11564",
    "coordinates": {
      "latitude": 24.7136,
      "longitude": 46.6753
    }
  },
  "contact": {
    "phone": "+966501234567",
    "email": "info@example.com",
    "website": "https://example.com"
  },
  "industry": {
    "code": "62010",
    "name": "Custom Software Development"
  }
}
```

### Employee Record
```json
{
  "id": "emp_456",
  "companyId": "company_123",
  "nationalId": "1234567890",
  "name": {
    "en": "Ahmed Mohammed",
    "ar": "أحمد محمد"
  },
  "nationality": "Saudi",
  "position": "Senior Developer",
  "department": "Technology",
  "startDate": "2024-02-01",
  "employmentType": "full-time",
  "salary": {
    "amount": 15000,
    "currency": "SAR",
    "housingAllowance": 3750,
    "transportationAllowance": 1500
  },
  "qualifications": [
    {
      "degree": "Bachelor",
      "field": "Computer Science",
      "institution": "King Saud University"
    }
  ]
}
```

---

## ⚠️ Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "crNumber",
      "issue": "CR number must be 10 digits"
    },
    "requestId": "req_abc123",
    "timestamp": "2024-10-30T14:15:54Z"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### Saudi-Specific Errors

| Code | Description |
|------|-------------|
| `SAUDI_WORKING_HOURS` | Request outside Saudi business hours |
| `WEEKEND_RESTRICTION` | Operations not available on Friday |
| `HOLIDAY_PERIOD` | Service unavailable during Saudi holidays |
| `SAUDIZATION_COMPLIANCE` | Saudization requirements not met |
| `ZATCA_COMPLIANCE` | Tax compliance issues detected |

---

## 🚦 Rate Limiting

### Rate Limits by Plan

| Plan | Requests/Minute | Requests/Hour | Requests/Day |
|------|-----------------|---------------|--------------|
| Starter | 60 | 1,000 | 10,000 |
| Professional | 300 | 5,000 | 50,000 |
| Enterprise | 1,000 | 20,000 | 500,000 |

### Rate Limit Headers
```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1698694554
```

### Saudi Business Hours Optimization
- **Peak Hours (8 AM - 5 PM)**: Full rate limits available
- **Extended Hours (5 PM - 8 PM)**: 80% of rate limits
- **Weekend (Friday)**: 50% of rate limits
- **Holidays**: Limited operations, reduced rate limits

---

## 🛠️ SDKs & Libraries

### Official SDKs

#### JavaScript/Node.js
```bash
npm install sourcekom-sdk
```

```javascript
const SourceKom = require('sourcekom-sdk');
const client = new SourceKom('YOUR_API_KEY');

// Register a company
const result = await client.business.register({
  companyName: 'Example Company',
  businessType: 'LLC'
});
```

#### Python
```bash
pip install sourcekom-python
```

```python
from sourcekom import SourceKomClient

client = SourceKomClient(api_key='YOUR_API_KEY')

# Check Saudization status
status = client.hr.saudization.calculate(company_id='company_123')
```

#### PHP
```bash
composer require sourcekom/php-sdk
```

```php
use SourceKom\SourceKomClient;

$client = new SourceKomClient('YOUR_API_KEY');

// VAT registration check
$vatCheck = $client->finance->vat->check([
    'crNumber' => '1012345678',
    'estimatedAnnualRevenue' => 5000000
]);
```

---

## 🧪 Testing

### Sandbox Environment
Use our sandbox environment for testing without affecting real data:

```http
POST https://sandbox-api.sourcekom.com/v1/business/registration
```

### Test Data
Pre-configured test scenarios available:

- `CR_TEST_001`: Successful LLC registration
- `CR_TEST_002`: Missing documents scenario
- `SAUDI_TEST_001`: Saudization compliance check
- `VAT_TEST_001`: VAT registration requirement

### Webhook Testing
Test webhooks using our ngrok-compatible testing endpoint:

```bash
ngrok http 3000
# Configure webhook URL: https://your-ngrok-url.ngrok.io/webhooks
```

---

## 📈 Monitoring & Analytics

### Dashboard Features
- 📊 **API Usage Analytics**: Real-time usage metrics
- 🔍 **Error Monitoring**: Detailed error tracking
- 📱 **Performance Metrics**: Response time monitoring
- 🌍 **Geographic Analytics**: Saudi region breakdown
- 💰 **Cost Tracking**: API consumption costs

### Alerting
- 🚨 **Rate Limit Alerts**: Notify when approaching limits
- ⚠️ **Error Rate Alerts**: Unusual error pattern detection
- 📈 **Usage Anomalies**: Unexpected usage patterns
- 🔧 **Service Health**: API availability monitoring

---

## 📞 Support

### Support Channels
- 📧 **Email**: api-support@sourcekom.com
- 💬 **Live Chat**: Available during Saudi business hours
- 📞 **Phone**: +966 11 234 5678 (Saudi business hours only)
- 🎫 **Support Portal**: [support.sourcekom.com](https://support.sourcekom.com)

### Response Times
- 🚀 **Critical Issues**: 1 hour (during business hours)
- ⚡ **High Priority**: 4 hours (during business hours)
- 📋 **Normal Priority**: 24 hours
- 🔍 **General Inquiries**: 48 hours

### Saudi Business Hours
- **Saturday - Thursday**: 8:00 AM - 6:00 PM AST
- **Friday**: Closed
- **Holidays**: Limited support available

---

## 🔧 Development Tools

### API Explorer
Interactive API documentation with live testing:
[https://api-docs.sourcekom.com](https://api-docs.sourcekom.com)

### Postman Collection
Download our pre-configured Postman collection:
[SourceKom API Collection](https://api.sourcekom.com/postman-collection)

### OpenAPI Specification
Download the complete OpenAPI 3.0 specification:
[openapi.json](https://api.sourcekom.com/openapi.json)

---

## 📚 Best Practices

### Security
- 🔐 **Never expose API keys** in client-side code
- 🛡️ **Use HTTPS** for all API requests
- 🔑 **Rotate API keys** regularly
- 📝 **Implement proper logging** for security auditing

### Performance
- ⚡ **Use appropriate pagination** for large datasets
- 🗄️ **Implement caching** for frequently accessed data
- 📊 **Batch requests** where possible
- 🔄 **Handle rate limits** gracefully

### Saudi Business Context
- 🇸🇦 **Respect working hours** for time-sensitive operations
- 📅 **Account for holidays** in your planning
- 🗣️ **Support Arabic language** where applicable
- 🏛️ **Follow Saudi regulations** for data handling

---

## 🚀 Getting Started

### Quick Start Guide
1. **Sign Up**: Create account at [developers.sourcekom.com](https://developers.sourcekom.com)
2. **Get API Key**: Generate your API key from the dashboard
3. **Test Integration**: Use sandbox environment for testing
4. **Go Live**: Switch to production when ready
5. **Monitor**: Set up monitoring and alerts

### Sample Application
Complete sample application demonstrating:
- Company registration workflow
- Saudization compliance checking
- VAT registration process
- Employee management integration

[GitHub Repository](https://github.com/sourcekom/sample-applications)

---

## 📄 Licensing & Terms

### API License Agreement
By using this API, you agree to our [API Terms of Service](https://sourcekom.com/api-terms) and [Privacy Policy](https://sourcekom.com/privacy).

### Usage Limits
- Commercial use permitted with valid subscription
- Redistribution of data requires explicit permission
- Compliance with Saudi Arabian laws required

### Intellectual Property
All API documentation and code samples are property of SourceKom and protected by international copyright laws.

---

**Need Help Getting Started?**  
Contact our developer support team: developers@sourcekom.com  
Visit our developer portal: [developers.sourcekom.com](https://developers.sourcekom.com)

*Last updated: October 2024 | Version: 1.2.0*