# Product Discovery Hub Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/brandonlacoste9-tech/Product-hunt.git
   cd Product-hunt
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec app npx prisma migrate deploy
   docker-compose exec app npx prisma db seed
   ```

5. **Access the application**
   Open http://localhost:3000

## Manual Deployment

See [docs/LAUNCH_CHECKLIST.md](./docs/LAUNCH_CHECKLIST.md) for detailed deployment instructions.

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth

Optional:
- `GOOGLE_CLIENT_ID` - For Google OAuth
- `GITHUB_CLIENT_ID` - For GitHub OAuth
- `OPENAI_API_KEY` - For AI features
- `STRIPE_SECRET_KEY` - For payments

## Health Checks

- App: http://localhost:3000
- API: http://localhost:3000/api/products
- Database: Port 5432

## Troubleshooting

### Database connection issues
```bash
docker-compose logs db
```

### Application errors
```bash
docker-compose logs app
```

### Reset database
```bash
docker-compose down -v
docker-compose up -d
```

## Production Deployment

For production, update:
1. Change database password in docker-compose.yml
2. Set secure `NEXTAUTH_SECRET`
3. Configure proper domain in `NEXTAUTH_URL`
4. Use managed database service (recommended)
5. Set up SSL/TLS certificates
6. Configure CDN for static assets

See full deployment guide: [docs/LAUNCH_CHECKLIST.md](./docs/LAUNCH_CHECKLIST.md)
