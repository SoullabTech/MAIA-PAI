# Intelligence Engine: Production Deployment Guide

*Complete guide for deploying the Intelligence Engine to production*

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Configuration](#configuration)
4. [Database Setup](#database-setup)
5. [Deployment Steps](#deployment-steps)
6. [Monitoring Setup](#monitoring-setup)
7. [Performance Optimization](#performance-optimization)
8. [Security Hardening](#security-hardening)
9. [Scaling Strategy](#scaling-strategy)
10. [Troubleshooting](#troubleshooting)
11. [Rollback Procedures](#rollback-procedures)
12. [Post-Deployment Verification](#post-deployment-verification)

---

## Pre-Deployment Checklist

### Code Readiness

- [ ] All Phase 1 integration code merged to main branch
- [ ] All Phase 2 awareness-level adaptation code merged
- [ ] Intelligence dashboard components tested
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code review completed and approved
- [ ] TypeScript compilation successful with no errors
- [ ] Linting passes with no warnings
- [ ] Build process successful

### Testing Complete

- [ ] Unit tests passing (>90% coverage)
- [ ] Integration tests passing
- [ ] Performance benchmarks meet targets
- [ ] Load testing completed
- [ ] Security scanning completed
- [ ] Awareness-level adaptation tested at all 5 levels
- [ ] Dashboard rendering verified across browsers
- [ ] Mobile responsiveness verified

### Documentation

- [ ] API documentation complete
- [ ] Integration examples documented
- [ ] Testing utilities documented
- [ ] Deployment guide reviewed (this document)
- [ ] Rollback procedures documented
- [ ] Monitoring playbook created
- [ ] Incident response plan updated

### Infrastructure

- [ ] Production environment provisioned
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] SSL certificates valid
- [ ] DNS records configured
- [ ] CDN configured (if applicable)
- [ ] Rate limiting configured
- [ ] DDoS protection enabled

---

## Environment Setup

### Required Services

1. **Application Server**
   - Node.js 18+ (LTS recommended)
   - 4GB RAM minimum, 8GB+ recommended
   - 2 CPU cores minimum, 4+ recommended
   - 20GB storage minimum

2. **Database**
   - PostgreSQL 14+ (for user data, conversation history)
   - Vector database for embeddings (if using semantic analysis)
   - Redis for caching (recommended for production)

3. **Monitoring**
   - Application Performance Monitoring (APM) service
   - Log aggregation service
   - Error tracking service (e.g., Sentry)
   - Uptime monitoring

4. **Infrastructure**
   - Load balancer (for multi-instance deployments)
   - CDN for static assets
   - Firewall / WAF

### Environment Variables

Create `.env.production` with the following:

```bash
# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis Cache
REDIS_URL=redis://user:password@host:6379
REDIS_TTL=30 # seconds

# Intelligence Engine
INTELLIGENCE_CACHE_TTL=30 # seconds
INTELLIGENCE_MAX_RETRIES=3
INTELLIGENCE_TIMEOUT=10000 # milliseconds
INTELLIGENCE_ENABLE_MONITORING=true

# Authentication
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key-here # Generate: openssl rand -base64 32

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info # debug|info|warn|error
APM_SERVICE_NAME=maia-intelligence

# Performance
ENABLE_CACHE=true
CACHE_STRATEGY=redis # memory|redis
MAX_CONCURRENT_ANALYSES=50
RATE_LIMIT_PER_MINUTE=100

# Security
API_KEY_SALT=your-api-key-salt # Generate: openssl rand -base64 32
WEBHOOK_SECRET=your-webhook-secret # Generate: openssl rand -base64 32
ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com

# Features
ENABLE_WEBHOOKS=true
ENABLE_REAL_TIME_STREAMING=true
ENABLE_COMPARATIVE_ANALYTICS=false # Enable when ready
```

### Security Notes

**CRITICAL: Never commit `.env.production` to version control!**

- Store secrets in a secure secrets manager (AWS Secrets Manager, Azure Key Vault, etc.)
- Use environment-specific secrets
- Rotate secrets regularly
- Use strong random values for all secrets
- Limit access to production secrets

---

## Configuration

### Intelligence Engine Configuration

```typescript
// lib/intelligence/config.ts
export const intelligenceConfig = {
  // Performance
  cache: {
    enabled: process.env.ENABLE_CACHE === 'true',
    ttl: parseInt(process.env.INTELLIGENCE_CACHE_TTL || '30', 10),
    strategy: process.env.CACHE_STRATEGY || 'redis'
  },

  // Resilience
  retry: {
    maxRetries: parseInt(process.env.INTELLIGENCE_MAX_RETRIES || '3', 10),
    retryDelay: 1000,
    backoff: 'exponential' as const
  },

  // Timeouts
  timeout: parseInt(process.env.INTELLIGENCE_TIMEOUT || '10000', 10),

  // Concurrency
  maxConcurrent: parseInt(process.env.MAX_CONCURRENT_ANALYSES || '50', 10),

  // Monitoring
  monitoring: {
    enabled: process.env.INTELLIGENCE_ENABLE_MONITORING === 'true',
    sampleRate: 1.0 // 100% in production
  },

  // Features
  features: {
    webhooks: process.env.ENABLE_WEBHOOKS === 'true',
    realTimeStreaming: process.env.ENABLE_REAL_TIME_STREAMING === 'true',
    comparativeAnalytics: process.env.ENABLE_COMPARATIVE_ANALYTICS === 'true'
  }
};
```

### Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
  compress: true,

  // Performance
  images: {
    domains: ['yourdomain.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7 // 7 days
  },

  // Headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      }
    ];
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'production'
    }
  }
};

module.exports = nextConfig;
```

---

## Database Setup

### PostgreSQL Schema

```sql
-- Create intelligence cache table
CREATE TABLE IF NOT EXISTS intelligence_cache (
  user_id VARCHAR(255) PRIMARY KEY,
  intelligence_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Index for expiration cleanup
CREATE INDEX idx_intelligence_cache_expires ON intelligence_cache(expires_at);

-- Create intelligence history table (for tracking over time)
CREATE TABLE IF NOT EXISTS intelligence_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  coherence DECIMAL(4,3) NOT NULL,
  transformation_stage VARCHAR(50) NOT NULL,
  awareness_level VARCHAR(50) NOT NULL,
  active_signatures JSONB,
  framework_effectiveness JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX idx_intelligence_history_user ON intelligence_history(user_id);
CREATE INDEX idx_intelligence_history_created ON intelligence_history(created_at);
CREATE INDEX idx_intelligence_history_coherence ON intelligence_history(coherence);

-- Create webhook events table
CREATE TABLE IF NOT EXISTS webhook_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  payload JSONB NOT NULL,
  delivered BOOLEAN DEFAULT false,
  delivery_attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for pending webhooks
CREATE INDEX idx_webhook_events_pending ON webhook_events(delivered, created_at)
  WHERE delivered = false;
```

### Prisma Migration

```bash
# Generate migration
npx prisma migrate dev --name add_intelligence_tables

# Apply to production
npx prisma migrate deploy
```

### Redis Setup

```bash
# Test Redis connection
redis-cli -u $REDIS_URL ping
# Expected: PONG

# Set memory policy (LRU eviction)
redis-cli -u $REDIS_URL CONFIG SET maxmemory-policy allkeys-lru

# Set max memory (2GB example)
redis-cli -u $REDIS_URL CONFIG SET maxmemory 2gb
```

---

## Deployment Steps

### Step 1: Prepare Code

```bash
# 1. Clone repository
git clone https://github.com/yourusername/maia-pai.git
cd maia-pai

# 2. Checkout production branch
git checkout main
git pull origin main

# 3. Install dependencies
npm ci --production=false

# 4. Run tests
npm test

# 5. Build application
npm run build

# 6. Verify build
npm run start # Test locally first
```

### Step 2: Database Migration

```bash
# 1. Backup existing database
pg_dump -U username -h hostname dbname > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Run migrations
npx prisma migrate deploy

# 3. Verify schema
npx prisma db pull
npx prisma generate

# 4. Seed initial data (if needed)
npx prisma db seed
```

### Step 3: Deploy Application

#### Option A: Manual Deployment (VPS/EC2)

```bash
# 1. SSH into server
ssh user@yourserver.com

# 2. Navigate to app directory
cd /var/www/maia-pai

# 3. Pull latest code
git pull origin main

# 4. Install dependencies
npm ci --production

# 5. Build
npm run build

# 6. Restart application (using PM2)
pm2 restart maia-pai

# 7. Verify
pm2 status
pm2 logs maia-pai --lines 100
```

#### Option B: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

```bash
# Build Docker image
docker build -t maia-pai:latest .

# Run container
docker run -d \
  --name maia-pai \
  -p 3000:3000 \
  --env-file .env.production \
  maia-pai:latest

# Verify
docker logs maia-pai
docker exec maia-pai curl http://localhost:3000/api/health
```

#### Option C: Vercel Deployment

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy to production
vercel --prod

# 4. Set environment variables
vercel env add DATABASE_URL production
vercel env add REDIS_URL production
# ... add all production env vars
```

#### Option D: AWS/Azure/GCP

Follow platform-specific guides:
- **AWS**: Deploy to Elastic Beanstalk or ECS
- **Azure**: Deploy to App Service
- **GCP**: Deploy to Cloud Run or App Engine

### Step 4: Post-Deployment Verification

```bash
# 1. Health check
curl https://yourdomain.com/api/health

# 2. Test intelligence API
curl -X POST https://yourdomain.com/api/intelligence/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"userId": "test-user-id"}'

# 3. Check logs
# (Platform specific - PM2, Docker, Vercel, etc.)

# 4. Monitor error rates
# Check your error tracking service (Sentry, etc.)

# 5. Verify database connections
# Check connection pool metrics

# 6. Test dashboard
# Visit https://yourdomain.com/intelligence
```

---

## Monitoring Setup

### Application Performance Monitoring

#### Using Sentry

```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,

  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request?.data) {
      delete event.request.data.password;
      delete event.request.data.apiKey;
    }
    return event;
  }
});
```

#### Custom Metrics

```typescript
// lib/monitoring/metrics.ts
import { logMetric } from '@/lib/observability';

export async function trackIntelligenceAnalysis(
  userId: string,
  intelligence: any,
  duration: number
) {
  await logMetric('intelligence_analysis', {
    userId,
    coherence: intelligence.coherence,
    stage: intelligence.transformationStage,
    duration,
    timestamp: Date.now()
  });

  // Alert on critical coherence
  if (intelligence.coherence < 0.30) {
    await logMetric('critical_coherence_alert', {
      userId,
      coherence: intelligence.coherence,
      urgency: 'high'
    });
  }
}
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { redis } from '@/lib/cache/redis';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown',
      intelligence: 'unknown'
    }
  };

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'ok';
  } catch (error) {
    health.services.database = 'error';
    health.status = 'degraded';
  }

  try {
    // Check Redis
    await redis.ping();
    health.services.redis = 'ok';
  } catch (error) {
    health.services.redis = 'error';
    health.status = 'degraded';
  }

  try {
    // Check intelligence engine
    const testIntelligence = await unifiedIntelligence.analyze('health-check');
    health.services.intelligence = 'ok';
  } catch (error) {
    health.services.intelligence = 'error';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
```

### Alerting Rules

Configure alerts for:

1. **Critical Coherence Spike**
   - Condition: >5 users with coherence < 0.30 in 5 minutes
   - Action: Page on-call practitioner team

2. **API Error Rate**
   - Condition: Error rate > 5% over 5 minutes
   - Action: Alert engineering team

3. **Response Time Degradation**
   - Condition: P95 response time > 2 seconds
   - Action: Alert engineering team

4. **Database Connection Pool**
   - Condition: >80% pool utilization
   - Action: Alert engineering team

5. **Memory Usage**
   - Condition: >85% memory usage
   - Action: Auto-scale or alert

---

## Performance Optimization

### 1. Enable Caching

```typescript
// lib/intelligence/cached-intelligence.ts
import { CachedIntelligence } from './cached-intelligence';

// Use 30-second cache in production
export const cachedIntelligence = new CachedIntelligence(30);
```

### 2. Connection Pooling

```typescript
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 3. Rate Limiting

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RateLimiter } from '@/lib/rate-limit';

const limiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // 100 requests per minute
});

export async function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const isAllowed = await limiter.check(ip);

  if (!isAllowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*'
};
```

### 4. Query Optimization

```typescript
// Optimize intelligence history queries
const recentHistory = await prisma.intelligence_history.findMany({
  where: { user_id: userId },
  orderBy: { created_at: 'desc' },
  take: 100,
  select: {
    coherence: true,
    transformation_stage: true,
    created_at: true
  }
});
```

### 5. CDN Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },

  // Static asset caching
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

---

## Security Hardening

### 1. API Key Management

```typescript
// lib/auth/api-keys.ts
import { createHash } from 'crypto';

export function hashApiKey(apiKey: string): string {
  const salt = process.env.API_KEY_SALT!;
  return createHash('sha256')
    .update(apiKey + salt)
    .digest('hex');
}

export async function verifyApiKey(providedKey: string): Promise<boolean> {
  const hashedKey = hashApiKey(providedKey);

  const key = await prisma.api_key.findUnique({
    where: { hashed_key: hashedKey, revoked: false }
  });

  return key !== null;
}
```

### 2. Webhook Signature Verification

```typescript
// lib/webhooks/verify.ts
import { createHmac } from 'crypto';

export function verifyWebhookSignature(
  payload: string,
  signature: string | null
): boolean {
  if (!signature) return false;

  const secret = process.env.WEBHOOK_SECRET!;
  const expectedSignature = createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return signature === expectedSignature;
}
```

### 3. Input Validation

```typescript
// lib/validation/intelligence.ts
import { z } from 'zod';

export const analyzeRequestSchema = z.object({
  userId: z.string().min(1).max(255),
  options: z.object({
    includeHistory: z.boolean().optional(),
    forceRefresh: z.boolean().optional()
  }).optional()
});

// Use in API route
const validated = analyzeRequestSchema.parse(requestBody);
```

### 4. CORS Configuration

```typescript
// lib/middleware/cors.ts
export const corsConfig = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
```

### 5. Security Headers

```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
      ]
    }
  ];
}
```

---

## Scaling Strategy

### Horizontal Scaling

```yaml
# docker-compose.yml (multi-instance)
version: '3.8'

services:
  app:
    image: maia-pai:latest
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '2'
          memory: 4G
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    ports:
      - "3000-3002:3000"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
```

### Load Balancer Configuration

```nginx
# nginx.conf
upstream maia_backend {
    least_conn;
    server app_1:3000;
    server app_2:3000;
    server app_3:3000;
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://maia_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://maia_backend;
        access_log off;
    }
}
```

### Auto-Scaling (AWS Example)

```yaml
# aws-autoscaling.yml
Resources:
  AutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      MinSize: 2
      MaxSize: 10
      DesiredCapacity: 3
      TargetGroupARNs:
        - !Ref TargetGroup
      MetricsCollection:
        - Granularity: 1Minute

  ScaleUpPolicy:
    Type: AWS::AutoScaling::ScalingPolicy
    Properties:
      AdjustmentType: ChangeInCapacity
      AutoScalingGroupName: !Ref AutoScalingGroup
      Cooldown: 60
      ScalingAdjustment: 1

  CPUAlarmHigh:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmDescription: Scale up if CPU > 70%
      MetricName: CPUUtilization
      Namespace: AWS/EC2
      Statistic: Average
      Period: 300
      EvaluationPeriods: 2
      Threshold: 70
      AlarmActions:
        - !Ref ScaleUpPolicy
```

---

## Troubleshooting

### Common Issues

#### 1. High Memory Usage

**Symptom**: Application crashes with out-of-memory errors

**Diagnosis**:
```bash
# Check memory usage
docker stats maia-pai
# or
pm2 monit
```

**Solutions**:
- Reduce cache TTL
- Increase server memory
- Enable garbage collection tuning:
  ```bash
  NODE_OPTIONS="--max-old-space-size=4096" npm start
  ```

#### 2. Slow Intelligence Analysis

**Symptom**: Response times > 2 seconds

**Diagnosis**:
```typescript
// Add timing logs
console.time('intelligence-analysis');
const intelligence = await unifiedIntelligence.analyze(userId);
console.timeEnd('intelligence-analysis');
```

**Solutions**:
- Enable Redis caching
- Optimize database queries
- Increase database connection pool
- Add read replicas

#### 3. Database Connection Pool Exhausted

**Symptom**: "Error: Connection pool exhausted"

**Diagnosis**:
```bash
# Check active connections
psql -U username -d dbname -c "SELECT count(*) FROM pg_stat_activity;"
```

**Solutions**:
```typescript
// Increase pool size
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?connection_limit=20"
    }
  }
});
```

#### 4. Redis Connection Failures

**Symptom**: "Error: Redis connection timeout"

**Diagnosis**:
```bash
redis-cli -u $REDIS_URL ping
```

**Solutions**:
- Check Redis server status
- Verify firewall rules
- Increase connection timeout:
  ```typescript
  const redis = new Redis(process.env.REDIS_URL, {
    connectTimeout: 10000,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });
  ```

#### 5. Webhook Delivery Failures

**Symptom**: Webhooks not being received

**Diagnosis**:
```sql
SELECT * FROM webhook_events
WHERE delivered = false
ORDER BY created_at DESC
LIMIT 100;
```

**Solutions**:
- Check webhook endpoint availability
- Verify signature verification
- Retry failed webhooks:
  ```typescript
  async function retryFailedWebhooks() {
    const failed = await prisma.webhook_events.findMany({
      where: { delivered: false, delivery_attempts: { lt: 3 } }
    });

    for (const event of failed) {
      await deliverWebhook(event);
    }
  }
  ```

### Debugging Tools

```bash
# View application logs
pm2 logs maia-pai --lines 1000

# Follow logs in real-time
pm2 logs maia-pai --raw

# View error logs only
pm2 logs maia-pai --err

# Docker logs
docker logs -f maia-pai --tail 100

# Database query log
tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## Rollback Procedures

### Quick Rollback

```bash
# 1. Stop current version
pm2 stop maia-pai

# 2. Restore previous version
git checkout [previous-commit-hash]
npm ci --production
npm run build

# 3. Restart
pm2 start maia-pai

# 4. Verify
curl https://yourdomain.com/api/health
```

### Database Rollback

```bash
# 1. Stop application
pm2 stop maia-pai

# 2. Restore database from backup
psql -U username -d dbname < backup_20251026_120000.sql

# 3. Verify restore
psql -U username -d dbname -c "\dt"

# 4. Restart application
pm2 start maia-pai
```

### Docker Rollback

```bash
# 1. Stop current container
docker stop maia-pai
docker rm maia-pai

# 2. Run previous image
docker run -d \
  --name maia-pai \
  -p 3000:3000 \
  --env-file .env.production \
  maia-pai:[previous-tag]

# 3. Verify
docker logs maia-pai
```

### Vercel Rollback

```bash
# List deployments
vercel ls

# Promote previous deployment to production
vercel promote [deployment-url]
```

---

## Post-Deployment Verification

### Automated Tests

```bash
# Run smoke tests
npm run test:smoke

# Run E2E tests against production
NEXT_PUBLIC_APP_URL=https://yourdomain.com npm run test:e2e
```

### Manual Verification Checklist

- [ ] Homepage loads correctly
- [ ] User authentication works
- [ ] Intelligence dashboard displays data
- [ ] Intelligence analysis API responds correctly
- [ ] Awareness-level adaptation working
- [ ] Dashboard auto-refresh functioning
- [ ] Webhooks being delivered
- [ ] Monitoring and alerts active
- [ ] Health check endpoint responding
- [ ] Error tracking receiving errors
- [ ] Database queries optimized
- [ ] Cache hit rate acceptable (>70%)
- [ ] Response times under target (P95 < 2s)
- [ ] No memory leaks detected
- [ ] SSL certificate valid
- [ ] DNS resolving correctly

### Performance Benchmarks

```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 https://yourdomain.com/api/intelligence/analyze

# Expected results:
# - Requests per second: >50
# - Mean response time: <500ms
# - P95 response time: <2000ms
# - 0% error rate
```

### Monitoring Dashboard Review

Check your monitoring dashboard for:

1. **Request Volume**: Expected traffic patterns
2. **Error Rate**: <1% error rate
3. **Response Time**: P95 <2s, P99 <5s
4. **CPU Usage**: <70% average
5. **Memory Usage**: <80% average
6. **Database Connections**: <80% pool utilization
7. **Cache Hit Rate**: >70%
8. **Disk Usage**: <80%

---

## Production Checklist

### Week 1 Post-Deployment

- [ ] Monitor error rates daily
- [ ] Review performance metrics daily
- [ ] Check user feedback channels
- [ ] Validate webhook deliveries
- [ ] Review critical coherence alerts
- [ ] Analyze cache hit rates
- [ ] Check database growth rate
- [ ] Review security logs

### Month 1 Post-Deployment

- [ ] Conduct performance review
- [ ] Optimize slow queries
- [ ] Review and adjust auto-scaling rules
- [ ] Analyze user behavior patterns
- [ ] Review and update documentation
- [ ] Plan capacity expansion if needed
- [ ] Conduct security audit
- [ ] Review and rotate secrets

---

## Emergency Contacts

Create an on-call rotation with:

- **Engineering Lead**: hello@soullab.org
- **DevOps Lead**: hello@soullab.org
- **Clinical Lead**: hello@soullab.org (for critical coherence alerts)
- **Database Admin**: hello@soullab.org
- **Security Lead**: hello@soullab.org

---

## Conclusion

This deployment guide covers the complete production deployment process for the Intelligence Engine. Follow these steps carefully and verify each stage before proceeding.

**Key Success Metrics**:
- ✅ 99.9% uptime
- ✅ <2s P95 response time
- ✅ <1% error rate
- ✅ >70% cache hit rate
- ✅ Zero security incidents

**Remember**:
- Always test in staging first
- Have a rollback plan ready
- Monitor actively for the first week
- Keep documentation updated
- Communicate with stakeholders

---

*Deployment guide complete. Ready for production launch.* 🚀
