# Vercel Deployment Guide

## Deployment Steps

1. **Build the API server:**
   ```bash
   cd api-server
   npm run build
   ```

2. **Deploy to Vercel:**
   - Option 1: Deploy from root directory (includes Next.js + API server)
   - Option 2: Deploy API server separately by running `vercel` in `api-server/` directory

3. **Environment Variables:**
   Set these in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY` (optional)
   - `GOOGLE_AI_API_KEY` (optional)
   - `CORS_ORIGIN` (your production domain)

4. **Update Android App API URL:**
   After deployment, update `API_BASE_URL` in `android-native/app/build.gradle`:
   ```gradle
   buildConfigField "String", "API_BASE_URL", "\"https://your-vercel-url.vercel.app/api/\""
   ```

## API Endpoints

All endpoints are prefixed with `/api`:
- `/api/auth/*` - Authentication
- `/api/profile` - User profile
- `/api/meals` - Meals
- `/api/workouts` - Workouts
- `/api/water-intake` - Water intake
- `/api/health-metrics` - Health metrics
- `/api/feature-requests` - Feature requests

## Health Check

- `GET /health` - Server status


