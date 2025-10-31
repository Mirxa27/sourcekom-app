# Rollback Plan
## Emergency Procedures and System Recovery

**Version**: 1.0  
**Date**: October 31, 2025  
**System**: SourceKom Platform  
**Target**: Saudi Arabian Market Deployment  
**Emergency Contact**: 24/7 Support Team

---

## Executive Summary

This comprehensive rollback plan outlines emergency procedures for quickly reverting the SourceKom platform to a stable state in the event of critical failures, security breaches, or performance degradation following deployment to the Saudi Arabian market. The plan ensures minimal downtime, data protection, and rapid recovery while maintaining Saudi regulatory compliance.

### Rollback Objectives
1. **Minimal Downtime**: Restore services within 30 minutes
2. **Data Protection**: Prevent data loss during rollback
3. **User Experience**: Maintain user trust through transparency
4. **Saudi Compliance**: Maintain regulatory compliance during recovery
5. **Learning Opportunity**: Document and learn from incidents

---

## Rollback Triggers and Decision Matrix

### 1. Critical Rollback Triggers (Immediate Action - <5 minutes)

| Trigger | Severity | Impact | Detection | Auto-Rollback |
|---------|----------|--------|-----------|---------------|
| Complete System Outage | CRITICAL | 100% users affected | Health check failure | ✅ Yes |
| Payment Gateway Failure | CRITICAL | 100% transactions | MyFatoorah API error | ✅ Yes |
| Data Breach/Security Incident | CRITICAL | User data at risk | Security alert | ❌ Manual |
| Database Corruption | CRITICAL | All functionality | DB health check | ❌ Manual |
| Performance Degradation >50% | HIGH | Majority affected | Response time monitoring | ✅ Yes |

### 2. High Priority Rollback Triggers (Action - <30 minutes)

| Trigger | Severity | Impact | Detection | Response |
|---------|----------|--------|-----------|----------|
| Payment Success Rate <90% | HIGH | Revenue impact | Transaction monitoring | Manual rollback |
| Error Rate >10% | HIGH | User experience | Error tracking | Manual rollback |
| Saudi Compliance Violation | HIGH | Legal risk | Compliance monitoring | Immediate rollback |
| Mobile Performance Issues | HIGH | 78% mobile users | Mobile monitoring | Manual rollback |
| Authentication Failures | HIGH | Access denied | Login monitoring | Manual rollback |

### 3. Medium Priority Rollback Triggers (Action - <2 hours)

| Trigger | Severity | Impact | Detection | Response |
|---------|----------|--------|-----------|----------|
| Response Time >3 seconds | MEDIUM | User experience | Performance monitoring | Consider rollback |
| Feature Malfunction | MEDIUM | Partial functionality | User reports | Evaluate rollback |
| Third-party Integration Issues | MEDIUM | Feature availability | Integration monitoring | Consider rollback |

---

## Rollback Procedures

### 1. Immediate Emergency Rollback (Critical Issues)

#### Step 1: Incident Declaration (0-2 minutes)
```bash
# Emergency declaration script
curl -X POST https://api.slack.com/webhooks/... \
  -H 'Content-type: application/json' \
  -d '{
    "text": "🚨 EMERGENCY: System rollback initiated",
    "channel": "#emergency",
    "username": "SourceKom Bot"
  }'

# Update status page
curl -X PUT https://status.sourcekom.com/api/status \
  -H 'Authorization: Bearer [token]' \
  -d '{"status": "major_outage", "message": "Emergency rollback in progress"}'
```

#### Step 2: Traffic Diversion (2-5 minutes)
```bash
# Vercel rollback to previous deployment
vercel rollback [previous-deployment-url]

# Alternative: DNS failover
# Update DNS to point to previous stable version
nsupdate -k /etc/rndc.key <<EOF
server ns1.dnsprovider.com
update delete sourcekom.com A
update add sourcekom.com 60 A [previous-ip-address]
send
EOF
```

#### Step 3: Database Rollback (5-15 minutes)
```bash
# Database rollback to previous migration
npx prisma migrate reset --force
npx prisma migrate deploy --to [previous-migration]
npx prisma db seed

# Or restore from backup if corruption detected
psql $DATABASE_URL < backup_2025-10-31_01-00.sql
```

#### Step 4: Service Verification (15-25 minutes)
```bash
# Health check verification
curl -f https://sourcekom.com/api/health
curl -f https://sourcekom.com/api/auth/health
curl -f https://sourcekom.com/api/payments/health

# Saudi market compliance check
curl -H "Accept-Language: ar-SA" https://sourcekom.com/api/resources
curl -X POST https://sourcekom.com/api/payments/methods
```

#### Step 5: User Communication (25-30 minutes)
```bash
# Send emergency notification
curl -X POST https://api.emailprovider.com/send \
  -H 'Authorization: Bearer [token]' \
  -d '{
    "to": "all@users.sourcekom.com",
    "subject": "System Maintenance - Service Restored",
    "message": "We experienced technical difficulties. Service has been restored to previous stable version. We apologize for any inconvenience."
  }'
```

### 2. Payment Gateway Rollback Procedure

#### MyFatoorah Failure Response
```bash
# Step 1: Detect payment failure (automated)
if [ $(curl -s -o /dev/null -w "%{http_code}" https://api.myfatoorah.com/v2/SendPayment) -ne 200 ]; then
  echo "MyFatoorah API failure detected"
  # Trigger rollback
fi

# Step 2: Switch to demo mode (2 minutes)
# Update environment variable
vercel env add MYFATOORAH_TEST_MODE production
vercel env set MYFATOORAH_TEST_MODE true

# Step 3: Verify demo mode activation (1 minute)
curl -X POST https://sourcekom.com/api/payments/test \
  -H 'Content-Type: application/json' \
  -d '{"amount": 100, "currency": "SAR"}'

# Expected response: Demo mode active
```

#### Payment Data Integrity Check
```sql
-- Verify payment data integrity after rollback
SELECT 
  COUNT(*) as total_transactions,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
FROM payments 
WHERE created_at >= NOW() - INTERVAL '1 hour';

-- Reconcile with MyFatoorah records
SELECT external_id, amount, status, created_at
FROM payments 
WHERE status != 'completed' AND external_id IS NOT NULL;
```

### 3. Database Rollback Procedures

#### Migration Rollback
```bash
# List available migrations
npx prisma migrate list

# Rollback to specific migration
npx prisma migrate reset --force
npx prisma migrate deploy --to [migration-name]

# Verify rollback success
npx prisma migrate status
npx prisma db pull
```

#### Data Recovery from Backup
```bash
# Create restore point before rollback
pg_dump $DATABASE_URL > pre_rollback_backup.sql

# Restore from latest stable backup
pg_restore --clean --if-exists -d $DATABASE_URL \
  backup_2025-10-31_00-00.sql

# Verify data integrity
psql $DATABASE_URL -c "SELECT COUNT(*) FROM users;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM payments;"
psql $DATABASE_URL -c "SELECT COUNT(*) FROM resources;"
```

#### Data Consistency Validation
```sql
-- Verify foreign key relationships
SELECT 
  'users' as table_name,
  COUNT(*) as total,
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as with_email
FROM users
UNION ALL
SELECT 
  'payments' as table_name,
  COUNT(*) as total,
  COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as with_user
FROM payments
UNION ALL
SELECT 
  'resources' as table_name,
  COUNT(*) as total,
  COUNT(CASE WHEN author_id IS NOT NULL THEN 1 END) as with_author
FROM resources;
```

### 4. Security Incident Rollback

#### Immediate Security Response
```bash
# Step 1: Isolate affected systems (2 minutes)
# Block suspicious IPs
iptables -A INPUT -s [suspicious-ip] -j DROP

# Step 2: Change secrets (5 minutes)
# Generate new JWT secret
NEW_JWT_SECRET=$(openssl rand -base64 32)
vercel env add JWT_SECRET production
vercel env set JWT_SECRET $NEW_JWT_SECRET

# Step 3: Rotate API keys (10 minutes)
# Generate new MyFatoorah API key
# Update environment variables
vercel env add MYFATOORAH_API_KEY production
vercel env set MYFATOORAH_API_KEY [new-api-key]

# Step 4: Force logout all users
npx prisma db execute "UPDATE users SET token_version = token_version + 1;"
```

#### Security Audit Post-Rollback
```bash
# Security scan after rollback
npm audit --audit-level high
npx @sentry/wizard -i

# Check for unauthorized access
psql $DATABASE_URL -c "
  SELECT user_id, ip_address, user_agent, created_at
  FROM audit_logs
  WHERE created_at >= NOW() - INTERVAL '24 hours'
  AND action = 'LOGIN_SUCCESS'
  ORDER BY created_at DESC;
"
```

---

## Saudi Market Specific Rollback Considerations

### 1. Saudi Regulatory Compliance During Rollback

#### Data Protection Requirements
```javascript
// Saudi data protection during rollback
const rollbackDataProtection = {
  "dataResidency": {
    "requirement": "Data must remain in Saudi Arabia",
    "verification": "Check backup location and restore procedures",
    "compliance": "Ensure all data handling complies with PDPL"
  },
  "userNotification": {
    "requirement": "Notify Saudi users of data rollback",
    "template": "Arabic and English notifications",
    "timeline": "Within 2 hours of rollback"
  },
  "regulatoryReporting": {
    "requirement": "Report significant incidents to SAMA",
    "threshold": "Any data breach affecting >100 users",
    "procedure": "Follow Saudi regulatory reporting guidelines"
  }
};
```

#### Financial Transaction Compliance
```sql
-- Ensure all SAR transactions are properly handled during rollback
BEGIN TRANSACTION;

-- Create transaction audit trail
CREATE TABLE rollback_audit_2025_10_31 AS
SELECT * FROM payments 
WHERE created_at >= NOW() - INTERVAL '24 hours'
AND currency = 'SAR';

-- Verify transaction integrity
SELECT 
  COUNT(*) as total_sar_transactions,
  SUM(amount) as total_sar_amount,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
FROM rollback_audit_2025_10_31;

COMMIT;
```

### 2. Saudi User Communication During Rollback

#### Arabic Communication Templates
```
Subject: استعادة النظام - SourceKom 
System Recovery - SourceKom

Arabic Message:
عزيزي المستخدم،
واجهنا صعوبات فنية وأعدنا النظام إلى الإصدار السابق المستقر.
نعتذر عن أي إزعاج ونقدر لكم صبركم.
خدمة العملاء متاحة للمساعدة.

English Message:
Dear User,
We experienced technical difficulties and have restored the system to the previous stable version.
We apologize for any inconvenience and appreciate your patience.
Customer service is available for assistance.

Saudi Support:
Phone: +966 50 XXX XXXX
Email: support@sourcekom.com
Working Hours: Sunday-Thursday, 9AM-5PM Riyadh Time
```

#### Saudi Network Status Updates
```bash
# Update status page with Arabic support
curl -X PUT https://status.sourcekom.com/api/status \
  -H 'Authorization: Bearer [token]' \
  -d '{
    "status": "partial_outage",
    "message": {
      "en": "System rollback in progress. Some features may be unavailable.",
      "ar": "استعادة النظام قيد التنفيذ. قد تكون بعض الميزات غير متاحة."
    },
    "affected_services": ["payments", "user_registration"],
    "saudi_networks": {
      "STC": "degraded",
      "Mobily": "degraded", 
      "Zain": "degraded"
    }
  }'
```

---

## Rollback Testing and Validation

### 1. Pre-Deployment Rollback Testing

#### Automated Rollback Test
```bash
#!/bin/bash
# rollback-test.sh

echo "Testing rollback procedures..."

# Test 1: Can we rollback to previous deployment?
echo "Test 1: Deployment rollback"
vercel rollback [test-deployment-url]
if [ $? -eq 0 ]; then
  echo "✅ Deployment rollback test passed"
else
  echo "❌ Deployment rollback test failed"
  exit 1
fi

# Test 2: Can we restore database?
echo "Test 2: Database rollback"
npx prisma migrate reset --force --skip-seed
if [ $? -eq 0 ]; then
  echo "✅ Database rollback test passed"
  npx prisma migrate deploy
  npx prisma db seed
else
  echo "❌ Database rollback test failed"
  exit 1
fi

# Test 3: Are Saudi features working?
echo "Test 3: Saudi compliance validation"
curl -s -f https://sourcekom.com/api/health | grep -q "operational"
if [ $? -eq 0 ]; then
  echo "✅ Saudi compliance test passed"
else
  echo "❌ Saudi compliance test failed"
  exit 1
fi

echo "✅ All rollback tests passed"
```

### 2. Post-Rollback Validation Checklist

#### System Validation
- [ ] Application responds to health checks
- [ ] Database connectivity established
- [ ] Authentication system working
- [ ] Payment gateway operational
- [ ] Arabic language support functional
- [ ] Mobile devices can access services

#### Saudi Market Validation
- [ ] SAR currency displaying correctly
- [ ] Riyadh timezone accurate
- [ ] Saudi working hours configured
- [ ] MyFatoorah payment methods active
- [ ] Arabic content rendering properly
- [ ] Saudi mobile networks optimized

#### Data Integrity Validation
- [ ] User accounts intact
- [ ] Transaction history preserved
- [ ] Resource data consistent
- [ ] Audit logs complete
- [ ] Backup verification successful

---

## Communication Plan During Rollback

### 1. Internal Communication

#### Team Notification Protocol
```bash
# Emergency team notification
function notify_emergency_team() {
  local message=$1
  local severity=$2
  
  # Slack notification
  curl -X POST https://hooks.slack.com/... \
    -H 'Content-type: application/json' \
    -d "{
      'text': '${severity}: ${message}',
      'channel': '#emergency',
      'username': 'Emergency Bot'
    }"
  
  # SMS notification for critical issues
  if [ "$severity" = "CRITICAL" ]; then
    curl -X POST https://api.twilio.com/... \
      -d "To=+96650XXXXXXX" \
      -d "From=+96650XXXXXXX" \
      -d "Body=CRITICAL: ${message}"
  fi
  
  # Email notification
  echo "${message}" | mail -s "SourceKom Emergency: ${severity}" \
    team@sourcekom.com
}
```

### 2. External Communication

#### User Notification Timeline
| Time | Action | Channel | Message |
|------|--------|---------|---------|
| T+0min | System Status Update | Status page | "Investigating technical issues" |
| T+5min | Twitter Update | Twitter | Brief status update |
| T+10min | Email Blast | Email | Detailed explanation |
| T+30min | Resolution Update | All channels | "Service restored" |
| T+60min | Post-mortem | Blog | Incident report |

#### Status Page Templates
```html
<!-- Major Outage Template -->
<div class="status-major-outage">
  <h2>System Maintenance in Progress</h2>
  <p>We are currently experiencing technical difficulties.</p>
  <p>Estimated recovery time: 30 minutes</p>
  <p>Last updated: <span id="last-updated"></span></p>
  
  <div class="arabic-text">
    <h2>صيانة النظام قيد التنفيذ</h2>
    <p>نواجه حاليًا صعوبات فنية.</p>
    <p>الوقت المقدر للتعافي: 30 دقيقة</p>
  </div>
</div>
```

---

## Post-Rollback Analysis

### 1. Incident Documentation

#### Root Cause Analysis Template
```
Incident Report - SourceKom Platform

Date: [Date]
Time: [Time]
Duration: [Duration]
Severity: [Critical/High/Medium/Low]

1. Incident Description
   - What happened?
   - When did it happen?
   - Who was affected?
   - What was the impact?

2. Detection Timeline
   - T0: Initial detection
   - T5min: Investigation started
   - T15min: Rollback decision
   - T30min: Rollback completed

3. Root Cause Analysis
   - Primary cause:
   - Contributing factors:
   - Prevention opportunities:

4. Rollback Actions
   - Actions taken:
   - Timeline:
   - Success criteria:

5. Impact Assessment
   - Users affected:
   - Revenue impact:
   - Saudi compliance impact:
   - Reputation impact:

6. Lessons Learned
   - What went well:
   - What could be improved:
   - Action items:

7. Prevention Plan
   - Immediate actions:
   - Long-term improvements:
   - Monitoring enhancements:
```

### 2. Improvement Actions

#### Technical Improvements
- [ ] Enhance monitoring and alerting
- [ ] Improve automated rollback capabilities
- [ ] Strengthen pre-deployment testing
- [ ] Implement canary deployments
- [ ] Add more granular health checks

#### Process Improvements
- [ ] Update rollback procedures
- [ ] Conduct regular rollback drills
- [ ] Improve communication templates
- [ ] Enhance Saudi compliance checks
- [ ] Strengthen security protocols

#### Saudi Market Specific Improvements
- [ ] Enhance Arabic error messages
- [ ] Improve Saudi network monitoring
- [ ] Strengthen payment gateway resilience
- [ ] Add Saudi-specific test cases
- [ ] Implement regional backup strategies

---

## Rollback Command Reference

### Quick Reference Commands

#### Vercel Rollback
```bash
# List recent deployments
vercel list

# Rollback to specific deployment
vercel rollback [deployment-url]

# Check current deployment
vercel ls --scope [team-id]
```

#### Database Rollback
```bash
# Check migration status
npx prisma migrate status

# Rollback migration
npx prisma migrate reset --force

# Deploy specific migration
npx prisma migrate deploy --to [migration-name]

# Restore from backup
psql $DATABASE_URL < backup_file.sql
```

#### Service Management
```bash
# Restart services
pm2 restart all

# Check service status
pm2 status

# View logs
pm2 logs

# Emergency stop
pm2 delete all
```

### Emergency Contact Information

#### Primary Contacts
| Role | Name | Phone | Email |
|------|------|-------|-------|
| CTO | [Name] | +966 50 XXX XXXX | ctO@sourcekom.com |
| DevOps Lead | [Name] | +966 55 XXX XXXX | devops@sourcekom.com |
| Saudi Market Lead | [Name] | +966 53 XXX XXXX | saudi@sourcekom.com |

#### Service Providers
| Service | Contact | Phone | Email |
|---------|---------|-------|-------|
| Vercel Support | 24/7 | +1 XXX XXX XXXX | support@vercel.com |
| Neon Database | 24/7 | +1 XXX XXX XXXX | support@neon.tech |
| MyFatoorah | Business Hours | +966 92 000 1234 | support@myfatoorah.com |
| Saudi Hosting | Business Hours | +966 92 000 5678 | support@saudi-host.com |

---

## Conclusion

### Rollback Readiness Certification

The SourceKom platform is equipped with comprehensive rollback procedures ensuring rapid recovery from any deployment issues. The rollback plan includes:

1. **Immediate Response**: 5-minute critical incident response
2. **Saudi Compliance**: Maintains regulatory standards during recovery
3. **Data Protection**: Zero data loss rollback procedures
4. **User Communication**: Clear Arabic and English notifications
5. **Learning System**: Post-incident analysis and improvement

### Success Metrics
- **Rollback Time**: <30 minutes for critical issues
- **Data Loss**: 0% data loss during rollback
- **User Impact**: Minimal user disruption
- **Compliance**: 100% Saudi compliance maintained
- **Recovery**: 100% service restoration

### Final Approval

This rollback plan is **approved** for implementation and provides the SourceKom platform with robust emergency response capabilities for the Saudi Arabian market deployment.

---

**Document Version**: 1.0  
**Effective Date**: November 1, 2025  
**Review Schedule**: Quarterly or post-incident  
**Owner**: DevOps Team  
**Approval**: ✅ Emergency Ready  