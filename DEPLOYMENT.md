# Deployment Guide - AI Health Coaching Platform

Complete guide for deploying the platform to production.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Backend Deployment](#backend-deployment)
- [AI Service Deployment](#ai-service-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Mobile App Deployment](#mobile-app-deployment)
- [Production Checklist](#production-checklist)

## Prerequisites

### Required Services
- PostgreSQL 15+ database (AWS RDS, Supabase, or self-hosted)
- Redis instance (AWS ElastiCache, Redis Cloud, or self-hosted)
- S3-compatible storage (AWS S3, DigitalOcean Spaces, etc.)
- OpenAI API key
- Domain name and SSL certificate
- Stripe account (for payments)

### Required Tools
- Docker and Docker Compose
- Node.js 18+
- Python 3.11+
- Git
- Expo CLI (for mobile)

## Environment Setup

### 1. Backend Environment Variables

Create `backend/.env`:

```bash
# Server
NODE_ENV=production
PORT=3001
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@host:5432/health_coaching

# Redis
REDIS_URL=redis://host:6379

# JWT
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# OpenAI
OPENAI_API_KEY=sk-...

# AI Service
AI_SERVICE_URL=https://ai.yourdomain.com

# AWS S3
AWS_ACCESS_KEY_ID=<your-key>
AWS_SECRET_ACCESS_KEY=<your-secret>
AWS_REGION=us-east-1
AWS_S3_BUCKET=health-coaching-uploads

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASSWORD=<app-password>

# Frontend URLs
WEB_URL=https://yourdomain.com
MOBILE_DEEP_LINK=healthcoach://

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,csv,txt,png,jpg,jpeg

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

### 2. AI Service Environment Variables

Create `ai-service/.env`:

```bash
ENVIRONMENT=production
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://user:password@host:5432/health_coaching
REDIS_URL=redis://host:6379
```

### 3. Web Frontend Environment Variables

Create `web/.env.production`:

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_AI_SERVICE_URL=https://ai.yourdomain.com
```

## Database Setup

### 1. Create Production Database

```bash
# Using PostgreSQL
createdb health_coaching
```

### 2. Run Migrations

```bash
cd backend
npx prisma migrate deploy
```

### 3. Seed Database

```bash
npm run prisma:seed
```

## Backend Deployment

### Option 1: Docker Deployment

#### 1. Build Docker Image

```bash
cd backend
docker build -t health-coaching-backend .
```

#### 2. Run Container

```bash
docker run -d \
  --name health-coaching-backend \
  -p 3001:3001 \
  --env-file .env \
  health-coaching-backend
```

### Option 2: Platform Deployment (AWS/Heroku/DigitalOcean)

#### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 health-coaching-backend

# Create environment
eb create production

# Deploy
eb deploy
```

#### Heroku

```bash
# Login
heroku login

# Create app
heroku create health-coaching-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Add Redis
heroku addons:create heroku-redis:premium-0

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your-secret>
# ... set all other env vars

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
heroku run npm run prisma:seed
```

## AI Service Deployment

### Docker Deployment

#### 1. Build Image

```bash
cd ai-service
docker build -t health-coaching-ai .
```

#### 2. Run Container

```bash
docker run -d \
  --name health-coaching-ai \
  -p 8000:8000 \
  --env-file .env \
  health-coaching-ai
```

### Python Hosting (AWS Lambda, Google Cloud Functions)

For serverless deployment, convert FastAPI to serverless-compatible format using Mangum.

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Deploy

```bash
cd web
vercel --prod
```

#### 3. Set Environment Variables

In Vercel dashboard:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_AI_SERVICE_URL`

### Option 2: Netlify

```bash
cd web
npm run build
netlify deploy --prod --dir=.next
```

### Option 3: Docker/Self-Hosted

```bash
cd web
docker build -t health-coaching-web .
docker run -d -p 3000:3000 health-coaching-web
```

## Mobile App Deployment

### iOS App Store

#### 1. Configure EAS Build

```bash
cd mobile
npm install -g eas-cli
eas login
eas build:configure
```

#### 2. Build for iOS

```bash
eas build --platform ios
```

#### 3. Submit to App Store

```bash
eas submit --platform ios
```

### Google Play Store

#### 1. Build for Android

```bash
eas build --platform android
```

#### 2. Submit to Play Store

```bash
eas submit --platform android
```

## Production Checklist

### Security

- [ ] Change all default passwords and secrets
- [ ] Enable HTTPS/SSL on all services
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable request validation
- [ ] Configure CSP headers
- [ ] Set up authentication tokens rotation
- [ ] Enable database encryption at rest
- [ ] Set up VPC/private networking
- [ ] Configure firewall rules

### Performance

- [ ] Enable Redis caching
- [ ] Set up CDN for static assets
- [ ] Configure database connection pooling
- [ ] Enable gzip compression
- [ ] Set up database indexes
- [ ] Configure auto-scaling
- [ ] Set up load balancer
- [ ] Enable database read replicas

### Monitoring

- [ ] Set up application monitoring (Sentry, DataDog)
- [ ] Configure log aggregation (CloudWatch, LogDNA)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking
- [ ] Set up performance monitoring
- [ ] Enable database query monitoring
- [ ] Configure alerts and notifications

### Backup & Recovery

- [ ] Enable automated database backups
- [ ] Set up disaster recovery plan
- [ ] Configure S3 versioning
- [ ] Test backup restoration
- [ ] Set up database point-in-time recovery
- [ ] Document recovery procedures

### Compliance

- [ ] HIPAA compliance (if handling health data in US)
- [ ] GDPR compliance (if EU users)
- [ ] Privacy policy and terms of service
- [ ] Data retention policies
- [ ] User consent management
- [ ] Data encryption policies

## Scaling Considerations

### Database Scaling

- Use read replicas for read-heavy workloads
- Implement database sharding for large datasets
- Use connection pooling (PgBouncer)
- Set up automated backups

### Application Scaling

- Horizontal scaling with load balancer
- Container orchestration (Kubernetes)
- Auto-scaling based on metrics
- Stateless application design

### Caching Strategy

- Redis for session storage
- CDN for static assets
- API response caching
- Database query caching

## Monitoring & Maintenance

### Daily Checks

- Monitor error rates
- Check API response times
- Review database performance
- Check storage usage

### Weekly Tasks

- Review logs for anomalies
- Check backup integrity
- Update dependencies
- Review security alerts

### Monthly Tasks

- Performance optimization
- Cost analysis
- Security audit
- Disaster recovery drill

## Support & Troubleshooting

### Common Issues

**Database connection errors:**
- Check DATABASE_URL format
- Verify network connectivity
- Check database credentials
- Review connection pool settings

**High API latency:**
- Check database query performance
- Review Redis cache hit rates
- Analyze slow endpoints
- Check external service latency

**File upload failures:**
- Verify S3 credentials
- Check file size limits
- Review CORS configuration
- Check network connectivity

## Rollback Procedures

### Backend Rollback

```bash
# Docker
docker stop health-coaching-backend
docker start health-coaching-backend-previous

# Heroku
heroku rollback
```

### Database Rollback

```bash
# Restore from backup
pg_restore -d health_coaching backup.dump

# Or use point-in-time recovery (AWS RDS)
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier mydb \
  --target-db-instance-identifier mydb-restored \
  --restore-time 2024-01-01T00:00:00Z
```

## Production URLs

After deployment, your services will be available at:

- **Web App:** https://yourdomain.com
- **Backend API:** https://api.yourdomain.com
- **AI Service:** https://ai.yourdomain.com
- **iOS App:** App Store link
- **Android App:** Google Play link

## Post-Deployment

1. Test all critical user flows
2. Monitor error rates for 24-48 hours
3. Verify email notifications
4. Test payment processing
5. Check mobile app functionality
6. Verify data backups
7. Test AI report generation
8. Confirm websocket connections

## Need Help?

For deployment issues, contact the development team or refer to:
- Backend documentation: `/backend/README.md`
- Frontend documentation: `/web/README.md`
- Mobile documentation: `/mobile/README.md`
