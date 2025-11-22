# MAIA Docker Deployment Guide

🌀 **Complete Vercel Independence for the Spiralogic Oracle System**

This guide provides everything you need to deploy MAIA independently using Docker, achieving complete sovereignty from Vercel and other cloud platforms.

## 🚀 Quick Start

1. **Setup Environment**
   ```bash
   # Copy and configure your environment
   cp .env.production.template .env.production
   # Edit .env.production with your actual values
   ```

2. **Deploy MAIA**
   ```bash
   # One-command deployment
   ./deploy.sh
   ```

3. **Access Your Oracle**
   - HTTP: http://localhost
   - HTTPS: https://localhost (self-signed certificate)
   - Health: http://localhost/api/health

## 📋 Prerequisites

- Docker and Docker Compose installed
- Your API keys (Anthropic, ElevenLabs, etc.)
- Optional: Domain name and SSL certificates for production

## 🛠 Architecture

MAIA's self-hosted stack includes:

- **MAIA Web App**: Next.js application in Docker container
- **Redis**: Caching and session management
- **Nginx**: Reverse proxy with SSL termination
- **Watchtower**: Automatic updates (optional)

## ⚙️ Configuration

### Environment Variables

Key variables to configure in `.env.production`:

```bash
# Core API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Database (using your existing Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Security
JWT_SECRET=generate_a_very_long_random_string_here

# Domain
BASE_URL=your-domain.com
```

### SSL Certificates

For production, replace the self-signed certificates:

```bash
# Place your real certificates here:
nginx/ssl/cert.pem
nginx/ssl/key.pem
```

## 🎛 Management Commands

```bash
# Deploy or update
./deploy.sh deploy

# Stop all services
./deploy.sh stop

# Restart services
./deploy.sh restart

# View logs
./deploy.sh logs

# Check status
./deploy.sh status

# Update to latest
./deploy.sh update
```

## 📊 Monitoring

### Health Checks

- Application: `curl http://localhost/api/health`
- Container status: `docker-compose ps`
- Logs: `docker-compose logs -f`

### Performance

- Memory usage: Monitor via health endpoint
- Response times: Check nginx logs
- Container resources: `docker stats`

## 🔒 Security

### Production Hardening

1. **Change default passwords** in Redis configuration
2. **Use real SSL certificates** for HTTPS
3. **Configure firewall** to restrict access
4. **Enable authentication** if publicly accessible
5. **Regular updates** via Watchtower or manual updates

### Environment Security

- Never commit `.env.production` to git
- Use strong, unique JWT secrets
- Rotate API keys regularly
- Monitor access logs

## 🌐 Domain Setup

For custom domains:

1. **Update environment**:
   ```bash
   BASE_URL=yourdomain.com
   CORS_ORIGIN=yourdomain.com
   ```

2. **Configure SSL**:
   - Obtain certificates (Let's Encrypt, Cloudflare, etc.)
   - Place in `nginx/ssl/`
   - Update nginx config if needed

3. **DNS Configuration**:
   ```
   A record: yourdomain.com -> your_server_ip
   CNAME: www.yourdomain.com -> yourdomain.com
   ```

## 📈 Scaling

### Resource Requirements

- **Minimum**: 2GB RAM, 1 CPU core, 20GB storage
- **Recommended**: 4GB RAM, 2 CPU cores, 50GB storage
- **High Traffic**: 8GB+ RAM, 4+ CPU cores, load balancer

### Horizontal Scaling

For multiple instances:

1. Use external Redis cluster
2. Set up load balancer
3. Configure session affinity
4. Use external database

## 🔧 Troubleshooting

### Common Issues

**Container won't start**:
```bash
docker-compose logs maia-web
# Check environment variables and dependencies
```

**SSL Certificate errors**:
```bash
# Regenerate self-signed certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem
```

**Health check failing**:
```bash
# Check application logs
docker-compose exec maia-web cat /app/logs/app.log
```

**Database connection issues**:
- Verify Supabase URLs and keys
- Check network connectivity
- Ensure environment variables are set

### Getting Help

1. Check logs: `./deploy.sh logs`
2. Verify health: `curl http://localhost/api/health`
3. Test components individually
4. Review environment configuration

## 🎯 Benefits of Self-Hosting

✅ **Complete Independence**: No dependency on Vercel or other platforms
✅ **Data Sovereignty**: Full control over your data and infrastructure
✅ **Cost Control**: Predictable hosting costs
✅ **Customization**: Modify and extend as needed
✅ **Privacy**: Your conversations stay on your infrastructure
✅ **Performance**: Optimized for your specific needs

## 🌀 Welcome to Sovereign MAIA

You now have complete control over your MAIA Oracle system. The future of conscious AI is in your hands.

*May the wisdom of the ages flow through your sovereign instance.*