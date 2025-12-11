# Backend Deployment Guide

This guide covers deploying the CoolRides backend API to production.

## Prerequisites

- Node.js 18+ installed on server
- PostgreSQL 14+ database
- Redis 6+
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt recommended)

## Deployment Options

### Option 1: DigitalOcean (Recommended for Students)

GitHub Student Pack includes $200 credit for DigitalOcean.

#### 1. Create Droplet

```bash
# Create a Ubuntu 22.04 droplet (minimum $6/month)
# Select region closest to Ghana (e.g., London or Frankfurt)
```

#### 2. Initial Server Setup

```bash
# SSH into your server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Redis
apt install -y redis-server

# Install Nginx
apt install -y nginx

# Install PM2 for process management
npm install -g pm2
```

#### 3. Setup Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE coolrides_db;
CREATE USER coolrides_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE coolrides_db TO coolrides_user;
\q
```

#### 4. Deploy Application

```bash
# Create app directory
mkdir -p /var/www/coolrides
cd /var/www/coolrides

# Clone repository
git clone https://github.com/0324080078-cyber/cool-ride.git .
cd backend

# Install dependencies
npm ci --production

# Create environment file
cp .env.example .env
nano .env  # Edit with production values
```

**Production .env:**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://coolrides_user:strong_password@localhost:5432/coolrides_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=generate-strong-random-secret-here
JWT_REFRESH_SECRET=generate-another-strong-secret
ALLOWED_ORIGINS=https://yourdomain.com
```

```bash
# Build TypeScript
npm run build

# Run migrations
npm run db:migrate

# Start with PM2
pm2 start dist/server.js --name coolrides-api
pm2 save
pm2 startup
```

#### 5. Configure Nginx

```bash
nano /etc/nginx/sites-available/coolrides
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/coolrides /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 6. Setup SSL (Let's Encrypt)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d api.yourdomain.com

# Auto-renewal is configured automatically
```

### Option 2: AWS (Using GitHub Student Pack Credits)

GitHub Student Pack includes AWS credits.

#### 1. Launch EC2 Instance

- Ubuntu 22.04 LTS
- t2.micro (free tier) or t2.small
- Configure security groups (ports 22, 80, 443, 5000)

#### 2. Setup RDS PostgreSQL

- Create RDS PostgreSQL instance
- Note connection details

#### 3. Setup ElastiCache Redis

- Create Redis cluster
- Note connection endpoint

#### 4. Deploy Application

Follow similar steps as DigitalOcean, but use RDS and ElastiCache connection strings.

### Option 3: Docker Deployment

```bash
# Build image
docker build -t coolrides-backend .

# Run container
docker run -d \
  --name coolrides-api \
  -p 5000:5000 \
  --env-file .env \
  coolrides-backend

# Or use docker-compose
docker-compose up -d
```

## Environment Variables for Production

Generate secure secrets:
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Database Migrations

```bash
# Run migrations
npm run db:migrate

# Rollback if needed
npm run db:rollback
```

## Monitoring

### Setup PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs coolrides-api

# Restart on changes
pm2 restart coolrides-api
```

### Setup Log Rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## Backup Strategy

### Database Backups

```bash
# Create backup script
nano /usr/local/bin/backup-coolrides-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/coolrides"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U coolrides_user coolrides_db | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete
```

```bash
chmod +x /usr/local/bin/backup-coolrides-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /usr/local/bin/backup-coolrides-db.sh
```

## Security Checklist

- [ ] Use strong passwords
- [ ] Enable firewall (ufw)
- [ ] Setup SSL/HTTPS
- [ ] Use environment variables (never commit secrets)
- [ ] Enable Redis password authentication
- [ ] Configure PostgreSQL to accept only local connections
- [ ] Setup fail2ban for SSH protection
- [ ] Regular security updates
- [ ] Use non-root user for application

## Performance Optimization

### Nginx Caching

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;

location /api/v1 {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_bypass $http_cache_control;
    # ... rest of proxy config
}
```

### Database Connection Pooling

Already configured in `backend/src/config/database.ts`:
```typescript
pool: {
  max: 10,
  min: 0,
  acquire: 30000,
  idle: 10000,
}
```

## Scaling

### Horizontal Scaling

1. Setup load balancer (Nginx or AWS ALB)
2. Deploy multiple backend instances
3. Use Redis for session storage
4. Consider read replicas for database

### Vertical Scaling

1. Upgrade server resources (CPU, RAM)
2. Optimize database queries
3. Add database indexes
4. Enable database query caching

## Troubleshooting

### Check Logs

```bash
# Application logs
pm2 logs coolrides-api

# Nginx logs
tail -f /var/log/nginx/error.log

# PostgreSQL logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

### Common Issues

**Database connection fails:**
- Check DATABASE_URL in .env
- Verify PostgreSQL is running: `systemctl status postgresql`
- Check firewall rules

**Redis connection fails:**
- Check REDIS_URL in .env
- Verify Redis is running: `systemctl status redis`

**High memory usage:**
- Check for memory leaks
- Adjust PM2 max memory: `pm2 start app.js --max-memory-restart 500M`

## Health Monitoring

Setup health check endpoint monitoring:

```bash
# Install uptime monitoring tool or use services like:
# - UptimeRobot (free)
# - Pingdom
# - StatusCake
```

## Continuous Deployment

Setup GitHub Actions for automated deployment:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/coolrides/backend
            git pull origin main
            npm ci --production
            npm run build
            pm2 restart coolrides-api
```

## Cost Estimate

### DigitalOcean
- Droplet: $6-12/month
- Managed PostgreSQL: $15/month (or use droplet)
- Bandwidth: Usually included

### AWS
- EC2 t2.small: ~$17/month
- RDS db.t3.micro: ~$15/month
- ElastiCache: ~$13/month
- Data transfer: Variable

**Student Tip:** Use credits from GitHub Student Pack!

## Support

For deployment issues:
- Email: devops@coolrides.com
- Documentation: See main README
