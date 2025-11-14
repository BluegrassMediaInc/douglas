# Deployment Guide for Legal Flow

## Environment Variables for Production

### Backend API (`apps/api`)

Set these environment variables in your Vercel project settings:

```bash
# Database (Required)
DATABASE_URL=postgresql://username:password@host:5432/database_name

# JWT Authentication (Required)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# CORS Configuration (Optional - for custom domains)
FRONTEND_URL=https://your-custom-domain.com
PRODUCTION_URL=https://your-production-domain.com

# Environment
NODE_ENV=production
```

### Frontend (`apps/web`)

```bash
# API URL (Optional - defaults to same-origin /api routes)
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

## Vercel Deployment

### Current Architecture

Based on `vercel.json`, the project uses a **single-project deployment**:

```json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "apps/api/dist/index.js" },
    { "src": "/worker",   "dest": "apps/worker/index.py" }
  ]
}
```

This means:
- **Frontend**: Served from the root domain (e.g., `https://yourapp.vercel.app`)
- **API**: Served from `/api/*` routes (e.g., `https://yourapp.vercel.app/api/auth/login`)
- **Worker**: Served from `/worker` (e.g., `https://yourapp.vercel.app/worker`)

### CORS Considerations

✅ **Will work on Vercel** because:

1. **Same-Origin Requests**: Frontend and API are served from the same domain, so no CORS issues for production
2. **Development**: CORS configured for `localhost:3000` ↔ `localhost:8080`
3. **Preview Deployments**: CORS allows all `*.vercel.app` domains
4. **Custom Domains**: Can be configured via environment variables

### Build Configuration

The Express app is configured to work as both:
- **Development server**: `app.listen()` for local development
- **Serverless function**: `export default app` for Vercel

## Testing CORS in Production

Once deployed, test with:

```bash
# Test from your deployed frontend
curl -X POST https://yourapp.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Origin: https://yourapp.vercel.app" \
  -d '{"email":"test@example.com","username":"test","password":"password123"}'
```

## Database Setup

Make sure your production database:
1. Has the `app` schema created
2. Has all tables migrated
3. Connection string is in `DATABASE_URL` environment variable

Run migrations after deployment:
```bash
cd apps/api
pnpm run db:migrate
```

## Security Notes

1. **JWT_SECRET**: Use a strong, random secret in production
2. **Database**: Use connection pooling and SSL
3. **CORS**: The current setup is secure for the intended architecture
4. **Environment Variables**: Never commit secrets to version control
